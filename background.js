/**
 * For license conditions, see the LICENSE file in the same repository.
 * Li Wang <li@liwang.info>, July 2015
 */

console.log = function () {};
chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    console.log(sender.tab ?
    "from a content script:" + sender.tab.url :
      "from the extension");

    console.log(request);
    if (request.messageType === "loadDict") {
      var filePath = '/dicts/' + request.langSrc + '_' + request.langDst + '.dic';
      console.log(filePath);
      jQuery.ajax({
        dataType: 'json',
        url: chrome.extension.getURL(filePath),
        async: true,
        success: function (data) {
          sendResponse({"offlineDict": data});
        },
        error: function () {
          sendResponse({"offlineDict": "nofile"});
        }
      });


      // $.getJSON(chrome.extension.getURL('/dicts/eng-000-eng-000.dic'), function (dict, status, xhr) {
      //   console.log(status);
      //   console.log(xhr);
      //   sendResponse({"eng2eng": dict});
      // });
    }
    else
      {
      jQuery.ajax({
          type: "POST",
          url: "http://api.panlex.org/ex",
          data: JSON.stringify({"uid": request.langSrc, "tt": request.wordsToTranslate}),
          success: function (responseText, status, xhr) {
            if (xhr["status"] != 200 || status != "success") {
              console.log("API query failed with status: " + JSON.stringify(xhr["status"]) + " and status: " + status);
            }

            console.log(JSON.stringify(responseText));

            var results = responseText["result"];
            var rwordsID = {};
            var allIDs = [];
            for (var i = 0; i < results.length; i++) {
              rwordsID[results[i]["tt"]] = results[i]["ex"];
              allIDs.push(results[i]["ex"]);
            }
            console.log(JSON.stringify({"uid": request.langDst, "trex": allIDs, "include": "trq"}));
            if (JSON.stringify(results) != "[]") {
              jQuery.ajax({
                type: "POST",
                url: "http://api.panlex.org/ex",
                data: JSON.stringify({"uid": request.langDst, "trex": allIDs, "include": "trq", "sort": "trq desc"}),
                success: function (responseText2, status2, xhr2) {
                  if (xhr2["status"] != 200 || status2 != "success") {
                    console.log("API query failed with status: " + JSON.stringify(xhr2["status"]) + " and status: " + status2);
                  }
                  console.log(responseText2);
                  sendResponse({"rwordsID": rwordsID, "responseText": responseText2});
                },
                async: true
              });
            }
            else {
              //console.log("request.length < 30");
              //if (request.length < 30) {
              sendResponse({"rwordsID": rwordsID, "responseText": {"result": {}}});
              //}
            }
          },
          error: function (exhr, estatus, ethrown) {
            sendResponse({"error": estatus});
            //event.counter -= 1;
            //setTimeout(function () {
            //    listener(event);
            //  },
            //  1000
            //);
          },
          async: true
        }
      );
    }
    return true;
  });