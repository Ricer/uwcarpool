
function updateShadow(){
    var mainElem=$(".main");
    var windowBottom=$(window).outerHeight()+20;
    var mkP=function(fn,point){
        return fn+" "+point.x+" "+point.y+" ";
    }
    var tr={y:mainElem.offset().top+2,x:mainElem.offset().left+mainElem.outerWidth()-2}
    var tl={y:mainElem.offset().top+mainElem.outerHeight()-2,x:mainElem.offset().left+2}
    var bl={y:windowBottom,x:tl.x+150}
    var br={y:windowBottom,x:$(window).outerWidth()+200}
    $("#shadow").attr('d',mkP("M",tl)+mkP("L",bl)+mkP("L",br)+mkP("L",tr)+mkP("L",tl))
}
$(function(){
    $('body').append($('<svg width="100%" height="100%"><path id="shadow" /></svg>'));
    updateShadow();
    $(window).resize(updateShadow);
})