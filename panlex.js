/**
 * For license conditions, see the LICENSE file in the same repository.
 * Li Wang <li@liwang.info>, July 2014
 */

myVar.setVar("flag_auto", false);

function compare(a,b) {
    if (a.trq > b.trq)
        return -1;
    if (a.trq < b.trq)
        return 1;
    return 0;
}

function appendContent(div, words, wordsID, rstDict, index) {

    var textRequest = document.createElement("b");
    textRequest.innerHTML = words[index];
    div.appendChild(textRequest);
    var br = document.createElement("br");
    div.appendChild(br);

    var rstShow = rstDict[wordsID[words[index]]];
    rstShow.sort(compare);

    var translates = "";
    for (var i = 0; i < rstShow.length; i++)
    {
        translates = translates + rstShow[i]["tt"];
        translates = translates + ", ";
    }
    translates = translates.substring(0, translates.length-2);
    div.appendChild(document.createTextNode(translates));

}

function showResultsUnified(wordsWithVar, wordsID, result_json, x, y, slang) {
    //console.log(JSON.stringify(wordsWithVar));
    //console.log(JSON.stringify(wordsID));
    var div = document.createElement("div");
    div.id = "panlex_result_div";
    with (div.style) {
        position = "absolute";
        left = x + "px";
        top  = (y + 20) + "px";
        width = "250px";
        zIndex = 0xffffffff;
        background = "#CCE8CF";
        textAlign = "left";
        //background-repeat: no-repeat;
        //border = "1px solid #666";
        borderColor = "#AEBFB0";
        borderStyle = "solid";
        borderWidth = "2px";
        borderRadius= "4px"
        padding = "4px";
    }

    var results = result_json["result"];
    var rstDict = {};
    for (var i = 0; i < results.length; i++) {
        var rst = results[i];
        if (rst["trex"] in rstDict) {
            rstDict[rst["trex"]].push(rst);
        }
        else {
            rstDict[rst["trex"]] = [rst];
        }
    }

    if (results.length == 0) {
        var textRequest = document.createElement("b");
        textRequest.innerHTML = wordsWithVar[0][0];
        div.appendChild(textRequest);
        var br = document.createElement("br");
        div.appendChild(br);
        var text = document.createTextNode("Translation not available.")
        div.appendChild(text);
    }

    else {
        var flag = 0;
        for (var i = 0; i < wordsWithVar[0].length; i++) {
            if (wordsID[wordsWithVar[0][i]] in rstDict) {
                appendContent(div, wordsWithVar[0], wordsID, rstDict, i);
                var br = document.createElement("br");
                div.appendChild(br);
                var br = document.createElement("br");
                div.appendChild(br);

                flag = 1;
            }
        }

        if (flag == 0 && wordsWithVar.length > 1) {
            for (var i = 1; i < wordsWithVar.length; i++) {
                for (var j = 0; j < wordsWithVar[i].length; j++) {
                    if (wordsID[wordsWithVar[i][j]] in rstDict) {
                        appendContent(div, wordsWithVar[i], wordsID, rstDict, j);

                        var br = document.createElement("br");
                        div.appendChild(br);
                        var br = document.createElement("br");
                        div.appendChild(br);

                        if ((i == 1) && (j == 0) && (wordsWithVar[1][0] != wordsWithVar[1][0].toLowerCase()) && (wordsID[wordsWithVar[1][1]] in rstDict)) {
                            appendContent(div, wordsWithVar[1], wordsID, rstDict, 1);
                            var br = document.createElement("br");
                            div.appendChild(br);
                            var br = document.createElement("br");
                            div.appendChild(br);
                        }

                        break;
                    }
                }
            }
        }
    }

//    div.addEventListener("mouseup", function(e) {e.stopPropagation();}, false);

    if (results.length > 0) {
        var span = document.createElement('span');
        span.style.fontSize = '80%';
        span.style.color = 'grey';
        span.appendChild(document.createTextNode('Translated from ' + langMap[slang]));
        div.appendChild(span);
    }
    document.body.appendChild(div);
    // adjust the popup's position to make it always inside the viewport
    var wW = $(window).width();
    var wH = $(window).height();
    var divJQ = $('#panlex_result_div')
    var divH = divJQ.height();
    var divW = divJQ.width();
    var divL = divJQ.position().left - $(window).scrollLeft();
    var divT = divJQ.position().top - $(window).scrollTop();

    if (divL + divW > wW - 20) {
        divJQ.css('left', wW - divW - 20);
    }

    if (divT + divH > wH) {
        divJQ.css('top', y - 25 - divH);
    }

    $('a').click(function(){
        closePopup("panlex_result_div");
    });
}


function showResult(request, result_json, x, y) {

    var div = document.createElement("div");
    div.id = "panlex_result_div";
    with (div.style) {
        position = "absolute";
        left = x + "px";
        top  = (y + 20) + "px";
        width = "250px";
        zIndex = 0xffffffff;
        background = "#CCE8CF";
        textAlign = "left";
        //background-repeat: no-repeat;
        //border = "1px solid #666";
        borderColor = "#AEBFB0";
        borderStyle = "solid";
        borderWidth = "2px";
        borderRadius= "4px"
        padding = "4px";

    }
    /*
     var oValue = chrome.storage.sync.get('value', function (data) {if (data.value) {window.alert(data.value);}});
     var optionText = document.createTextNode(oValue);
     div.appendChild(optionText);
     */

    var textRequest = document.createElement("b");
    textRequest.innerHTML = request;
    div.appendChild(textRequest);
    var br = document.createElement("br");
    div.appendChild(br);

    if (JSON.stringify(result_json) != "{}" && result_json["result"].length > 0) {
        var results = result_json["result"];
        function compare(a,b) {
            if (a.trq > b.trq)
                return -1;
            if (a.trq < b.trq)
                return 1;
            return 0;
        }
        results.sort(compare);
        var translates = "";
        for (var oneRst in results)
        {
            translates = translates + results[oneRst]["tt"];
            translates = translates + ", ";
        }
        translates = translates.substring(0, translates.length-2);
        div.appendChild(document.createTextNode(translates));

    }
    else {
        var text = document.createTextNode("Translation not available.")
        div.appendChild(text);
    }

//	div.addEventListener("click", function(e) {e.stopPropagation();}, false);
//	div.addEventListener("mouseup", function(e) {e.stopPropagation();}, false);

    document.body.appendChild(div);

    // adjust the popup's position to make it always inside the viewport
    var wW = $(window).width();
    var wH = $(window).height();
    var divJQ = $('#panlex_result_div')
    var divH = divJQ.height();
    var divW = divJQ.width();
    var divL = divJQ.position().left - $(window).scrollLeft();
    var divT = divJQ.position().top - $(window).scrollTop();

    if (divL + divW > wW - 20) {
        divJQ.css('left', wW - divW - 20);
    }

    if (divT + divH > wH) {
        divJQ.css('top', y - 25 - divH);
    }
}


var getOptions = function() {
    chrome.storage.sync.get("language", function (data) {

        if (data.language) {
            myVar.setVar("langSrc", data.language.languageSrc);
            myVar.setVar("langDst", data.language.languageDst);
        }
        else {
            myVar.setVar("langSrc", "eng-000");
            myVar.setVar("langDst", "cmn-000");
        }
    });
};


function preprocessText(text) {
    text = text.replace(/'s/g, " ");
    text = text.replace(/\u2019s/g, " ");
    text = text.replace("won't", "will not");
    text = text.replace("won\u2019t", "will not");
    text = text.replace("n't", " not");
    text = text.replace("n\u2019t", " not");
    text = text.replace(/'/g, " ");
    text = text.replace(/\u2019/g, " ");
    return text;
}


var closePopup = function (popupId) {
    var lk_div = document.getElementById(popupId);
    if (lk_div) {
        document.body.removeChild(lk_div);
    }
}

var closePopupParent = function (popupId) {
    var lk_div = window.parent.document.getElementById(popupId);
    if (lk_div) {
        window.parent.document.body.removeChild(lk_div);
    }
}

var ajaxPostQuery = function (event, langSrc, langDst, wordsToTranslate, wordsWithVar, request, requestOrig) {

    if (event.counter === 0) return;
    jQuery.ajax({
            type: "POST",
            url: "http://api.panlex.org/ex",
            data: JSON.stringify({ "uid": [langSrc], "tt": wordsToTranslate}),
            success:  function (responseText, status, xhr) {
                if (xhr["status"] != 200 || status != "success") {
                    window.alert("API query failed with status: " + JSON.stringify(xhr["status"]) + " and status: " + status);
                }

                //console.log(JSON.stringify(responseText));

                var results = responseText["result"]
                var rwordsID = {};
                var allIDs = [];
                for (var i = 0; i < results.length; i++) {
                    rwordsID[results[i]["tt"]] = results[i]["ex"];
                    allIDs.push(results[i]["ex"]);
                }
                if (JSON.stringify(results) != "[]") {
                    jQuery.ajax({
                        type: "POST",
                        url: "http://api.panlex.org/ex",
                        data: JSON.stringify({"uid": [langDst], "tr": allIDs, "include": ["trq"]}),
                        success: function (responseText2, status2, xhr2) {
                            if (xhr2["status"] != 200 || status2 != "success") {
                                window.alert("API query failed with status: " + JSON.stringify(xhr2["status"]) + " and status: " + status2);
                            }
                            showResultsUnified(wordsWithVar, rwordsID, responseText2, event.pageX, event.pageY, langSrc);
                        },
                        async: true
                    });
                }
                else {
                    //console.log("request.length < 30");
                    if (request.length < 30) {
                        showResult(requestOrig, {}, event.pageX, event.pageY);
                    }
                }
            },
            error: function(exhr, estatus, ethrown){
                event.counter -= 1;
                setTimeout(function() {
                    //ajaxPostQuery(event, langSrc, langDst, wordsToTranslate, wordsWithVar, request, requestOrig, count)
                        listener(event);
                    },
                   1000
                );
            },
            async: true}
    );

}


var listener = function (event) {
    //console.log(event.counter);

    event.counter = typeof event.counter == 'undefined' ? 3 : event.counter;

//    console.log(">>>>listener is triggered<<<<<")
    getOptions();

    if (event.button == 0) {
        //console.log(event.target.toString());
        //console.log(event.currentTarget.toString());

        var lk_div = document.getElementById("panlex_result_div");
        if (lk_div) {
            document.body.removeChild(lk_div);
        }

        var parent_popup = window.parent.document.getElementById("panlex_result_div");
        if (parent_popup) {
            window.parent.document.body.removeChild(parent_popup);
        }

        var sel = window.getSelection();
        var selRange = sel.rangeCount ? sel.getRangeAt(0): null;


        if (selRange && !selRange.collapsed) {
            var contextRange = document.createRange();
            var node = selRange.startContainer;
            while (node.nodeType != 1) node = node.parentNode;
            contextRange.setStartBefore(node);

            node = selRange.endContainer;
            while (node.nodeType != 1) node = node.parentNode;
            contextRange.setEndAfter(node);

            var requestt = selRange.toString();

            var request = preprocessText(requestt);

            if (request.length < 30) {
                if (myVar.getVar("langSrc") === "auto-000") {
                    myVar.setVar("flag_auto", true);
                    var langPred = langid.identify($(event.target).text());
                    myVar.setVar("langSrc", langCodeMap[langPred]);
                }
                else {
                    myVar.setVar("flag_auto", false);
                }

                request = request.trim();
                request = request.replace(/\s+/g, " ");
                var requestOrig = request;
                var rwordsOrig = request.split(" ");
                request = request.toLowerCase();
                var rwords = request.split(" ");

                var wordsToTranslate = [];
                var wordsWithVar = [];
                for (var i = 0; i < rwordsOrig.length; i++) {
                    var oneWord = rwordsOrig[i];
                    var variation = [oneWord];
                    if (oneWord != oneWord.toLowerCase()) {
                        variation.push(oneWord.toLowerCase());
                    }

                    variation.push.apply(variation, lemmatizerEnglish.lemmatize(oneWord.toLowerCase(), null));
                    wordsToTranslate.push.apply(wordsToTranslate, variation);
                    wordsWithVar.push(variation);
                }

                if (wordsWithVar.length != 1) {
                    wordsToTranslate.push(requestOrig);
                    if (requestOrig == requestOrig.toLowerCase()) {
                        wordsWithVar.unshift([requestOrig]);
                    }
                    else {
                        wordsWithVar.unshift([requestOrig, requestOrig.toLowerCase()]);
                        wordsToTranslate.push(requestOrig.toLocaleLowerCase());
                    }

                }


                if (rwords.length > 1) {
                    rwords.unshift(request);
                    rwords.unshift(requestOrig);
                }
                if (rwords.length == 1) {
                    if (rwordsOrig[0] != rwords[0]) {
                        rwords.unshift(requestOrig);
                        rwords.unshift("liwang"); // dummy value
                    }
                }

                var langSrc = myVar.getVar("langSrc");
                var langDst = myVar.getVar("langDst");
                ajaxPostQuery(event, langSrc, langDst, wordsToTranslate, wordsWithVar, request, requestOrig);


            }
        }
    }
};

//document.addEventListener("dblclick", listener, false);
//document.addEventListener("mouseup", listener, false);

closePopup("panlex_result_div");
closePopupParent("panlex_result_div");
document.addEventListener("mouseup", listener, false);

//document.addEventListener("click", function(){closePopup("panlex_result_div")}, false);
/*
 $('a').click(function(){
 closePopup("panlex_result_div");
 });
 */

//document.removeEventListener("click", listener, false);


