/**
 * For license conditions, see the LICENSE file in the same repository.
 * Li Wang <li@liwang.info>, July 2014-2016
 */

console.log = function () {};
myVar.setVar("flag_auto", false);
var eng2eng;
$.getJSON(chrome.extension.getURL('/dicts/eng-000-eng-000.dic'), function(dict) {
  eng2eng = dict;
});

function compare(a, b) {
  if (a['trq'] > b['trq'])
    return -1;
  if (a['trq'] < b['trq'])
    return 1;
  return 0;
}

// http://stackoverflow.com/a/9229821
function uniq(ary) {
  var prim = {"boolean": {}, "number": {}, "string": {}}, obj = [];

  return ary.filter(function (x) {
    var t = typeof x;
    return (t in prim) ?
    !prim[t][x] && (prim[t][x] = 1) :
    obj.indexOf(x) < 0 && obj.push(x);
  });
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
  var maxNum = rstShow.length > 7 ? 7 : rstShow.length;
  for (var i = 0; i < maxNum; i++) {
    translates = translates + rstShow[i]["tt"];
    translates = translates + ", ";
  }
  translates = translates.substring(0, translates.length - 2);
  div.appendChild(document.createTextNode(translates));

}

function setPopupStyle(div, x, y) {
  div.id = "panlex_result_div";
  var sy = div.style;
  sy.position = "absolute";
  sy.left = x + "px";
  sy.top = (y + 20) + "px";
  sy.width = "250px";
  sy.zIndex = 0xffffffff;
  sy.background = "#CCE8CF";
  sy.textAlign = "left";
  sy.borderColor = "#AEBFB0";
  sy.borderStyle = "solid";
  sy.borderWidth = "2px";
  sy.borderRadius = "4px";
  sy.padding = "4px";
}

function showResultsLocal(wordsWithVar, x, y, slang) {
  // wordsWithVar = wordsWithVar[0];
  closePopup("panlex_result_div");
  var div = document.createElement("div");
  setPopupStyle(div, x, y);

  var translations = {};
  var i;
  var word;
  var trans;
  for (i = 0; i < wordsWithVar.length; i++) {
    word = wordsWithVar[i];
    trans = eng2eng[word];
    if (trans != undefined && trans.length != undefined && trans.length != 0) {
      translations[word] = trans;
    }
  }

  var br;
  if (Object.keys(translations).length == 0) {
    var textRequest = document.createElement("b");
    textRequest.innerHTML = wordsWithVar[0];
    div.appendChild(textRequest);
    br = document.createElement("br");
    div.appendChild(br);

    var text = document.createTextNode("Translation not available.");
    div.appendChild(text);

  } else {
    console.log(JSON.stringify(wordsWithVar.length));
    for (i = 0; i < wordsWithVar.length; i++) {
      console.log(JSON.stringify(wordsWithVar));
      word = wordsWithVar[i];
      console.log(word);
      trans = translations[word];
      if (trans == undefined || trans.length == undefined || trans.length == 0) {
        continue;
      }

      textRequest = document.createElement("b");
      textRequest.innerHTML = word;
      div.appendChild(textRequest);
      br = document.createElement("br");
      div.appendChild(br);
      var transStr = "";
      var maxNum = trans.length > 7 ? 7 : trans.length;
      var j;
      for (j = 0; j < maxNum; j++) {
        transStr = transStr + trans[j];
        transStr = transStr + ", ";
      }
      transStr = transStr.substring(0, transStr.length - 2);
      div.appendChild(document.createTextNode(transStr));

      br = document.createElement("br");
      div.appendChild(br);
      br = document.createElement("br");
      div.appendChild(br);
    }
    appendFooter(div, slang);
  }
  document.body.appendChild(div);
  adjustPopupPos(y);
}

function showResultsUnified(wordsWithVar, wordsID, result_json, x, y, slang) {
  var i;
  closePopup("panlex_result_div");
  console.log(JSON.stringify(wordsWithVar));
  console.log(JSON.stringify(wordsID));
  console.log(JSON.stringify(result_json));
  console.log('x:', x, 'y:', y);
  var div = document.createElement("div");
  setPopupStyle(div, x, y);

  console.log('div.style.left: ' + JSON.stringify(div.style.left));
  console.log('div.style.top: ' + JSON.stringify(div.style.top));

  var results = result_json["result"];
  var rstDict = {};
  for (i = 0; i < results.length; i++) {
    var rst = results[i];
    if (rst["trex"] in rstDict) {
      rstDict[rst["trex"]].push(rst);
    }
    else {
      rstDict[rst["trex"]] = [rst];
    }
  }

  var br;
  var flag;
  var span;
  if (results.length == 0 || results.length == undefined) {
    var textRequest = document.createElement("b");
    textRequest.innerHTML = wordsWithVar[0][0];
    div.appendChild(textRequest);
    br = document.createElement("br");
    div.appendChild(br);

    var text = document.createTextNode("Translation not available.");
    div.appendChild(text);
  }
  else {
    flag = 0;
    for (i = 0; i < wordsWithVar[0].length; i++) {
      if (wordsID[wordsWithVar[0][i]] in rstDict) {
        appendContent(div, wordsWithVar[0], wordsID, rstDict, i);
        br = document.createElement("br");
        div.appendChild(br);
        br = document.createElement("br");
        div.appendChild(br);

        flag = 1;
      }
    }

    if (flag == 0 && wordsWithVar.length > 1) {
      for (i = 1; i < wordsWithVar.length; i++) {
        for (var j = 0; j < wordsWithVar[i].length; j++) {
          if (wordsID[wordsWithVar[i][j]] in rstDict) {
            appendContent(div, wordsWithVar[i], wordsID, rstDict, j);

            br = document.createElement("br");
            div.appendChild(br);
            br = document.createElement("br");
            div.appendChild(br);

            if ((i == 1) && (j == 0) && (wordsWithVar[1][0] != wordsWithVar[1][0].toLowerCase()) && (wordsID[wordsWithVar[1][1]] in rstDict)) {
              appendContent(div, wordsWithVar[1], wordsID, rstDict, 1);
              br = document.createElement("br");
              div.appendChild(br);
              br = document.createElement("br");
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
    appendFooter(div, slang);
  }
  document.body.appendChild(div);
  adjustPopupPos();
}

var appendFooter = function (div, slang) {
  var span;
  span = document.createElement('span');
  span.style.fontSize = '80%';
  span.style.color = 'grey';
  span.style.float = 'left';
  span.appendChild(document.createTextNode('Translated from ' + langMap[slang]));
  div.appendChild(span);

  span = document.createElement('span');
  span.style.fontSize = '80%';
  span.style.float = 'right';
  var a = document.createElement('a');
  a.title = 'feedback';
  a.href = 'mailto:liwangd+panlex@gmail.com';
  a.appendChild(document.createTextNode('feedback'));
  span.appendChild(a);
  div.appendChild(span);
};

var adjustPopupPos = function (y) {
  // adjust the popup's position to make it always inside the viewport
  var wW = $(window).width();
  var wH = $(window).height();
  var divJQ = $('#panlex_result_div');
  var divH = divJQ.height();
  var divW = divJQ.width();
  var divL = divJQ.position().left - $(window).scrollLeft();
  var divT = divJQ.position().top - $(window).scrollTop();

  if (divL + divW > wW - 20) {
    divJQ.css('left', wW - divW - 20);
  }

  if (divT + divH > wH) {
    if (divT > wH / 2) {
      divJQ.css('top', y - 25 - divH);
    }
  }

  var flag;
  if (divT > wH / 2) {
    flag = 1;
    while ((y - $(window).scrollTop() - 25 - divJQ.height()) < 10 && divJQ.width() < wW / 2 && flag === 1) {
      if (divJQ.position().left - $(window).scrollLeft() + divJQ.width() < wW - 65) {
        divJQ.css('width', divJQ.width() + 40);
      }
      else if (divJQ.position().left - $(window).scrollLeft() > 45) {
        divJQ.css('left', divJQ.position().left - 40);
        divJQ.css('width', divJQ.width() + 40);
      }
      else {
        flag = 0;
      }
      if (divH === divJQ.height()) {
        flag = 0;
      }
      divH = divJQ.height();
    }

    divJQ.css('top', y - 25 - divJQ.height());
  }

  else {
    flag = 1;
    while ((divJQ.position().top - $(window).scrollTop() + divJQ.height()) + 10 > wH && divJQ.width() < wW / 2 && flag === 1) {
      if (divJQ.position().left - $(window).scrollLeft() + divJQ.width() < wW - 65) {
        divJQ.css('width', divJQ.width() + 40);
      }
      else if (divJQ.position().left - $(window).scrollLeft() > 45) {
        divJQ.css('left', divJQ.position().left - 40);
        divJQ.css('width', divJQ.width() + 40);
      }
      else {
        flag = 0;
      }
      if (divH === divJQ.height()) {
        flag = 0;
      }
      divH = divJQ.height();
    }
  }

  $('a').click(function () {
    closePopup("panlex_result_div");
  });
};

var getOptions = function () {
  chrome.storage.sync.get("language", function (data) {

    if (data.language) {
      myVar.setVar("langSrc", data.language.languageSrc);
      myVar.setVar("langDst", data.language.languageDst);
      myVar.setVar("triggerKey", data.language.triggerKey);
    }
    else {
      myVar.setVar("langSrc", "auto-000");
      myVar.setVar("langDst", "eng-000");
      myVar.setVar("triggerKey", "none");
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
};

var closePopupParent = function (popupId) {
  var lk_div;
  try {
    lk_div = window.parent.document.getElementById(popupId);
  } catch (err) {
    console.log(err.message);
  }
  if (lk_div) {
    window.parent.document.body.removeChild(lk_div);
  }
};

var localQuery = function (event, langSrc, langDst, wordsToTranslate, wordsWithVar, request, requestOrig) {
  if (event.counter === 0) return;
  chrome.storage.local.get('dict', function (data) {
    // todo: need to call showResultsLocal in a async manner, this is a hack used to make that happen.
    showResultsLocal(wordsToTranslate, event.pageX, event.pageY, langSrc);
    // ajaxPostQuery(event, langSrc, langDst, wordsToTranslate, wordsWithVar, request, requestOrig);
  });
};

var ajaxPostQuery = function (event, langSrc, langDst, wordsToTranslate, wordsWithVar, request, requestOrig) {
  console.log(JSON.stringify({"uid": [langSrc], "tt": wordsToTranslate}));
  if (event.counter === 0) return;

  var key = langSrc + langDst + wordsWithVar.toString();
  chrome.storage.local.get('dict', function (data) {
    if (data.dict === undefined) {
      chrome.storage.local.set({'dict':{}});
    }
    console.log(JSON.stringify(data));
    if (key in data.dict) {
      showResultsUnified(wordsWithVar, data.dict[key].rwordsID, data.dict[key].responseText, event.pageX, event.pageY, langSrc);
    } else {
      chrome.runtime.sendMessage({
        "langSrc": langSrc,
        "wordsToTranslate": wordsToTranslate,
        "langDst": langDst
      }, function (response) {
        console.log(response);
        if (response.error != undefined) {
          event.counter -= 1;
          setTimeout(function () {
              listener(event);
            },
            1000
          );
        }
        else {
          chrome.storage.local.get('dict', function (data) {
            var dict = data.dict;
            dict[key] = response;
            chrome.storage.local.set({'dict': dict});
          });
          showResultsUnified(wordsWithVar, response.rwordsID, response.responseText, event.pageX, event.pageY, langSrc);
        }
      });
    }
  });
};

var listener = function (event) {
  //console.log(event.counter);
  event.counter = typeof event.counter == 'undefined' ? 3 : event.counter;
  getOptions();

  if (event.button == 0) {
    //console.log(event.target.toString());
    //console.log(event.currentTarget.toString());

    //var lk_div = document.getElementById("panlex_result_div");
    //if (lk_div) {
    //  document.body.removeChild(lk_div);
    //}
    //
    //var parent_popup = window.parent.document.getElementById("panlex_result_div");
    //if (parent_popup) {
    //  window.parent.document.body.removeChild(parent_popup);
    //}

    if (myVar.getVar("triggerKey") === "none" || (myVar.getVar("triggerKey") === "alt" && event.altKey)) {

      var sel = window.getSelection();
      var selRange = sel.rangeCount ? sel.getRangeAt(0) : null;

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
            if (oneWord !== oneWord.toLowerCase()) {
              variation.push(oneWord.toLowerCase());
            }

            variation.push.apply(variation, lemmatizerEnglish.lemmatize(oneWord.toLowerCase(), null));

            variation = uniq(variation);
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
          // console.log(wordsToTranslate);
          // console.log(wordsWithVar);

          wordsToTranslate = cleanWordsToTranslate(wordsToTranslate);
          if (wordsToTranslate.length == 0) {
            // if no meaningful words in the list, just return.
            return;
          }

          if (langSrc=='eng-000' && langDst=='eng-000') {
            localQuery(event, langSrc, langDst, wordsToTranslate, wordsWithVar, request, requestOrig);
          } else {
            ajaxPostQuery(event, langSrc, langDst, wordsToTranslate, wordsWithVar, request, requestOrig);
          }
        }
      }
    }
  }
};

function cleanWordsToTranslate(wordsToTranslate) {
  var filteredWords = [];
  for (var i = 0; i < wordsToTranslate.length; i++) {
    var word = wordsToTranslate[i]
    var s = word.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()\\\[\]\"\']/g,"");
    // s = s.replace(/\s{2,}/g," ");
    s = s.trim();
    if (s=== "") {
      continue;
    }
    filteredWords.push(word);
  }
  return filteredWords;
}

//document.addEventListener("dblclick", listener, false);
//document.addEventListener("mouseup", listener, false);

closePopup("panlex_result_div");
closePopupParent("panlex_result_div");
document.addEventListener("mouseup", listener, false);

// http://stackoverflow.com/a/7385673/468841
$(document).mouseup(function (e)
{
  var container = $("#panlex_result_div");

  if (!container.is(e.target) // if the target of the click isn't the container...
    && container.has(e.target).length === 0) // ... nor a descendant of the container
  {
    container.hide();
  }
});



// console.log(document.body.textContent);

//document.addEventListener("click", function(){closePopup("panlex_result_div")}, false);
/*
 $('a').click(function(){
 closePopup("panlex_result_div");
 });
 */

//document.removeEventListener("click", listener, false);
