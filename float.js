
$(window).scroll(function(){
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
	
    if ($(window).scrollTop() >= 200)
    {
        $("#floatbar").css({position:'fixed',left:x+35,top:0});
    }
    else
    {
        $("#floatbar").css({position:'absolute',left:x+15,top:0});
    }
});
