var myVar = (function() {
    var my = {};

    return {
        setVar: function (k, v) {
            my[k] = v;
        },

        getVar: function (k) {
            return my[k];
        },

        getMy: function () {
            return my;
        }
    };

})();