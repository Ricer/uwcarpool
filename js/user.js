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

$('#star1').hover(function(){
    $('#star1');
});

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
        $('#error').html("Comment must not be empty.");
        error = true;
    }
    re = /^[1-5]$/
    if (!error && !re.test($('#commentRating').val())) {
        $('#error').html("Rating must be 1-5.");
        error = true;
    }
    /*
    if (!error) {
        submit();
    }
    */
});