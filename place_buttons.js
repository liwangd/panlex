
(function() {
function getOffset( el ) {
    var _x = 0;
    var _y = 0;
    while( el && !isNaN( el.offsetLeft ) && !isNaN( el.offsetTop ) ) {
        _x += el.offsetLeft - el.scrollLeft;
        _y += el.offsetTop - el.scrollTop;
        el = el.offsetParent;
    }
    return { top: _y, left: _x };
}
var x = getOffset( document.getElementById('content') ).left;
var d = document.getElementById('floatbar');
d.style.position = "absolute";
d.style.left = x;
d.style.top = 0;
})();