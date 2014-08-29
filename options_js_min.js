/* inspired by the Google Dictionary (by Google) extension from 
 * https://chrome.google.com/webstore/detail/google-dictionary-by-goog/mgijmajocgfcbeboacabfgobmjgjcoja?hl=en*/
(function() {
	var d, e, f, g, trigger,
	
	q = function() {
		var a = {};
		a.languageSrc = f.options[f.selectedIndex].value;
		a.languageDst = g.options[g.selectedIndex].value;
    a.triggerKey = trigger.options[trigger.selectedIndex].value;
		a.enableHttps = "true";
    console.log(a);
//		window.localStorage.options = JSON.stringify(a);
        chrome.storage.sync.set({language: a});
		var b = document.getElementById("save_status");
		b.style.setProperty("-webkit-transition", "opacity 0s ease-in");
		b.style.opacity = 1;
		window.setTimeout(function() {
			b.style.setProperty("-webkit-transition", "opacity 0.5s ease-in");
			b.style.opacity = 0;
		}, 1E3);
		p(!1);
//		chrome.storage.sync.set({'language': a}, function() { message('Settings saved'); } );
//		chrome.extension.getBackgroundPage()["gdx.updateOptions"]()
	}, 
	
    u = function() {
       p(!1);
       chrome.storage.sync.get("language", function (data) {
       if (data.language) {
           var langSrc = data.language.languageSrc;
           var langDst = data.language.languageDst;
           var triggerKey = data.language.triggerKey;
           r(f, langSrc);
           r(g, langDst);
           r(trigger, triggerKey);
       }
    });
        s();
    },
    
    addOpt = function(ddList, value) {
        var opt = document.createElement("option");
        ddList.options.add(opt);
        //opt.text = langMap[value];
        opt.value = value;
    },
    
	r = function(a, b) {
	    var flag = 0;
		for (var c = 0, w = a.options.length; c < w; c++)
			if (a.options[c].value == b) {
				a.options[c].selected = !0;
				flag = 1;
				break
			}
			if (!flag) {
			    addOpt(a, b);
			    r(a,b);
			}
	}, 
	
	//disable or enable save/reset button
	p = function(a) {
		d.disabled = !a;
		e.disabled = !a;
	}, 
	v = function() {
		p(!0);
	}, 
	s = function() {
		var a = g.checked;
	};

  // this is the function which is actually called when loaded
	(function() {
		d = document.getElementById("save_button");
		e = document.getElementById("reset_button");
		f = document.getElementById("language_src");
		g = document.getElementById("language_dst");
    trigger = document.getElementById("trigger_key");
		d.addEventListener("click", q, !1);
		e.addEventListener("click", u, !1);
		
		for (var a = document.getElementsByTagName("input"), b = 0, c; c = a[b]; b++)
			c.addEventListener("change", v, !1);
		a = document.getElementsByTagName("select");
		for ( b = 0; c = a[b]; b++)
			c.addEventListener("change", v, !1);
		
	   chrome.storage.sync.get("language", function (data) {
       if (data.language) {
           var langSrc = data.language.languageSrc;
           var langDst = data.language.languageDst;
           var triggerKey = data.language.triggerKey;
           r(f, langSrc);
           r(g, langDst);
           r(trigger, triggerKey);
           p(!1);     
       }
    });
//		-1 != window.navigator.platform.toLowerCase().indexOf("mac");
	})();
})();
