/**
 * Adapted from the morphy implementation of NLTK <http://nltk.org/> at
 * https://github.com/nltk/nltk/blob/develop/nltk/corpus/reader/wordnet.py
 *
 * For license conditions, see the LICENSE file in the same repository.
 * Li Wang <li@liwang.info>, July 2014
 */
var lemmatizerEnglish = (function() {

    var NOUN = 'n',
        VERB = 'v',
        ADJ = 'a',
        ADV = 'r';

    var POS_LIST = [NOUN, VERB, ADJ, ADV];

    var FILEMAP = {a : 'adj', r : 'adv', n : 'noun', v : 'verb'};

    var MORPHOLOGICAL_SUBSTITUTIONS = {
        n: [['s', ''], ['ses', 's'], ['ves', 'f'], ['xes', 'x'],
            ['zes', 'z'], ['ches', 'ch'], ['shes', 'sh'],
            ['men', 'man'], ['ies', 'y']],
        v: [['s', ''], ['ies', 'y'], ['es', 'e'], ['es', ''],
            ['ed', 'e'], ['ed', ''], ['ing', 'e'], ['ing', '']],
        a: [['er', ''], ['est', ''], ['er', 'e'], ['est', 'e']],
        r: []};
    var exceptionMap = {};

    function endsWith(str, suffix) {
        return str.indexOf(suffix, str.length - suffix.length) !== -1;
    }

    function eliminateDuplicates(arr) {
        var i,
            len=arr.length,
            out=[],
            obj={};

        for (i=0;i<len;i++) {
            obj[arr[i]]=0;
        }
        for (i in obj) {
            out.push(i);
        }
        return out;
    }


    function loadExceptionMap() {
        for (var pos in FILEMAP) {
            if (FILEMAP.hasOwnProperty(pos)) {
                exceptionMap[pos] = {};
                var filePath = chrome.extension.getURL("static/wordnet/" + FILEMAP[pos]+ ".exc");
                jQuery.ajax({
                    url: filePath,
                    success: function (data) {
                        var lines = data.split('\n');
                        for (var i = 0; i < lines.length; i++) {
                            var line = lines[i].trim().split(" ");
                            exceptionMap[pos][line[0]] = line.slice(1);
                            }
                        },
                    async: false
                });

            }
        }
    }


    function _morphy(form, pos) {
        var exceptions = exceptionMap[pos];
        var substitutions = MORPHOLOGICAL_SUBSTITUTIONS[pos];
        var analyses = [];

        if (form in exceptions) {
            analyses = exceptions[form];
            return analyses;
        }

        for (var i = 0; i < substitutions.length; i++) {
            var old_ = substitutions[i][0];
            var new_ = substitutions[i][1];
            if (endsWith(form, old_)) {
                var lemma = form.substring(0, form.length - old_.length) + new_;
                if (lemma != "") {
                    analyses.push(lemma);
                }
            }
        }
        return analyses;
    }

    function morphy(form, pos) {
        var analyses;
        if (pos == null) {
            analyses = [];
            for (var i = 0; i < POS_LIST.length; i++) {
                var oneA = _morphy(form, POS_LIST[i]);
                analyses.push.apply(analyses, oneA);
            }
        }
        else {
            analyses = _morphy(form, pos);
        }

        return eliminateDuplicates(analyses);
//    return analyses;
    }

    return {lemmatize: function (form, pos) {
        loadExceptionMap();
        return morphy(form, pos);
    }
    };
})();
