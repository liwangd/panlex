/* inspired by the Google Dictionary (by Google) extension from 
 * https://chrome.google.com/webstore/detail/google-dictionary-by-goog/mgijmajocgfcbeboacabfgobmjgjcoja?hl=en*/
(function() {
	var save, reset, lsrc, ldst, vsrc, vdst, trigger,
	
	getValue = function(lobject) {
        for (var i = 0, length = lobject.length; i < length; i++) {
            if (lobject[i].checked) {
                return lobject[i].value;
                }
            }	    
	},
    dsbN = function() {
        dsb(0);
    }, 
	
	dsb = function(a) {
        save.disabled = a;
        reset.disabled = a;
    }, 

     getOptionSrc = function() {
    chrome.storage.sync.get("language", function (data) {
       
       if (data.language) {
           return data.language.languageSrc;
       }
       else {
           return "eng-000";
       }
    });    
},
	
     getOptionDst = function() {
    chrome.storage.sync.get("language", function (data) {
       
       if (data.language) {
           return data.language.languageDst;
       }
       else {
           return "cmn-000";
       }
    });    
},

    getOptionTrigger = function() {
  chrome.storage.sync.get("language", function (data) {
      if (data.language) {
        return data.language;
      } else {
        return "none";
      }
      });
    },
    
    
	saveOptions = function() {
        vsrc = getValue(lsrc);
        vdst = getValue(ldst);

    chrome.storage.sync.get("language", function (data) {
      var optionSrc;
      var optionDst;
      var optionTrigger;
      if (data.language) {
        optionSrc = data.language.languageSrc;
        optionDst = data.language.languageDst;
        optionTrigger = data.language.triggerKey;
      } else {
        optionSrc = "auto-000";
        optionDst = "eng-000";
        optionTrigger = "none";
      }
             var a = {};
        a.languageSrc = vsrc ? vsrc : optionSrc;
        a.languageDst = vdst ? vdst : optionDst;
        a.triggerKey = optionTrigger;
        a.enableHttps = "true";
        a.timestamp = Date.now();
        chrome.storage.sync.set({language: a});

    });

   
	    
	    var b = document.getElementById("save_status_a");
        b.style.setProperty("-webkit-transition", "opacity 0s ease-in");
        b.style.opacity = 1;
        window.setTimeout(function() {
            b.style.setProperty("-webkit-transition", "opacity 0.5s ease-in");
            b.style.opacity = 0;
        }, 1E3);
	    
	    dsb(1);
	    
	},

    r = function(a, b) {
        //alert(a.length)
       for (var c = 0, w = a.length; c < w; c++) {
         if (a[c].value == b) {
           a[c].checked = !0;
           break
         }
       }
    }, 
	
	resetOptions = function() {
	   dsb(1);
       chrome.storage.sync.get("language", function (data) {
       if (data.language) {
           var langSrc = data.language.languageSrc;
           var langDst = data.language.languageDst;
           r(lsrc, langSrc);
           r(ldst, langDst);       
       }
    });
	    
	};
	
	(function() {
		save = document.getElementById("save_button_a");
		reset = document.getElementById("reset_button_a");
        lsrc = document.getElementsByName('language_src_a');
        ldst = document.getElementsByName('language_dst_a');
		
		save.addEventListener("click", saveOptions, !1);
		reset.addEventListener("click", resetOptions, !1);
		
        for (var a = document.getElementsByName("language_src_a"), b = 0, c; c = a[b]; b++)
            c.addEventListener("change", dsbN, !1);
        for (var a = document.getElementsByName("language_dst_a"), b = 0, c; c = a[b]; b++)
            c.addEventListener("change", dsbN, !1);		

       chrome.storage.sync.get("language", function (data) {
       if (data.language) {
           var langSrc = data.language.languageSrc;
           var langDst = data.language.languageDst;
           r(lsrc, langSrc);
           r(ldst, langDst);  
           dsb(1);     
       }
    });               

	})();
})();
