var newComment = document.getElementById("newComment");
var ratingArea  = document.getElementById("ratingArea");
var commentContent = document.getElementById("commentContent");
newComment.onclick = function(event) {
    commentContent.rows = "3";
    ratingArea.style.display = "block";
    event.stopPropagation();
};
document.onclick=function(event) {
    commentContent.rows="1";
    ratingArea.style.display="none";
    $('#error').html("");
};

// rating system
var rate=0;
var hoverStar = function(id) {
    $('.star').removeClass('error');
    $('#error').html("");
    for (var i=1; i<=5; i++) {
        i<=id ? $('#star'+i).addClass('fill') : $('#star'+i).removeClass('fill');
    }
    $('#rateMessage').html(""+id+"/5");
}
var leaveStar = function(id) {
    for (var i=1; i<=5; i++) {
        i<=rate ? $('#star'+i).addClass('fill') : $('#star'+i).removeClass('fill');
    }
    rate==0 ? $('#rateMessage').html("") : $('#rateMessage').html(""+rate+"/5");
}
$('.star').each(function(index){
    var id=$(this).attr('id');
    $("#"+id).hover(function(){hoverStar(5-index)},function(){leaveStar(5-index)});
});
$('.star').each(function(index){
    var id=$(this).attr('id');
    $("#"+id).click(function(){
        rate = 5-index;
        hoverStar(5-index);
        $(this).off('mouseleave');
    });
});

$('#commentContent').keypress(function(){
    $('#commentContent').removeClass('error');
    $('#error').html("");
});

// submit comment
var commentSubmit = document.getElementById("commentSubmit");
var submit = function() {
    // TODO
    // submit to the server
    // update
};
$('#commentSubmit').click(function(){
    // clear previous error
    $('#error').html("");
    // check -- commentContent commentRating
    var error = false;
    var re=/[^\s]+/
    if (!re.test($('#commentContent').val())) {
        $('#commentContent').addClass('error');
        $('#error').html("Please add some comment.");
        error = true;
    }
    if (!error && rate == 0) {
        $('.star').addClass('error');
        $('#error').html("Please select a rating.");
        error = true;
    }
    /*
    if (!error) {
        submit();
    }
    */
});