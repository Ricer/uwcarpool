<?php
include_once 'functions.php';
 
sec_session_start();
 
if (login_check($mysqli) == true) {
    $logged = 'in';
} else { 
    $logged = 'out';
}

?>
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, target-densityDpi=device-dpi" />
        <title>UWCarpool♥: Log In</title>
        <link rel="shortcut icon" href="images/favicon.ico">

        <!-- Loading CSS -->
        <link href="css/bootstrap.css" rel="stylesheet">

        <link rel="stylesheet" href="css/font-awesome.min.css">
        <link rel="stylesheet" href="css/login.css">


        <!-- HTML5 shim, for IE6-8 support of HTML5 elements. All other JS at the end of file. -->
        <!--[if lt IE 9]>
          <script src="js/html5shiv.js"></script>
          <script src="js/respond.min.js"></script>
        <![endif]-->
        <script src="js/lib/jquery-1.8.3.min.js"></script>
        <script src="js/lib/bootstrap.min.js"></script>
        <script type="text/JavaScript" src="js/sha512.js"></script> 
        <script type="text/JavaScript" src="js/forms.js"></script>
        <script>
        function updateShadow(){
            var mainElem=$(".main");
            var windowBottom=$(window).outerHeight()+20;
            var mkP=function(fn,point){
                return fn+" "+point.x+" "+point.y+" ";
            }
            var tr={y:mainElem.offset().top,x:mainElem.offset().left+mainElem.outerWidth()}
            var tl={y:mainElem.offset().top+mainElem.outerHeight(),x:mainElem.offset().left}
            var bl={y:windowBottom,x:tl.x+150}
            var br={y:windowBottom,x:$(window).outerWidth()+200}
            $("#shadow").attr('d',mkP("M",tl)+mkP("L",bl)+mkP("L",br)+mkP("L",tr)+mkP("L",tl))
        }
        $(function(){
            updateShadow();
            $(window).resize(updateShadow);
        })
        </script>
    </head>
    <body>
        <div class="main login">
                <a class="brand" href="http://www.uwcarpool.com/"><span>UWCarpool </span><i class="fa fa-heart"></i></a>
            
            <form action="/processLogin.php" method="post" name="login_form" id="login">
                
                <div class='fbBtnWrapper'>
                    <a id="fbLoginBtn" href="" class='btn btn-fb'>Login with <span class="fb">facebook</span></a>
                    <span id='or'>or</span>
                </div>

                <div class="inputGroup vertical">
                    <input type="text" name="email" id="email" placeholder="Email" class='input input-default'/>
                    <input type="password" name="password" id="password" placeholder="Password" class='input input-default'/>
                </div>
                <input class="btn btn-primary" id="loginBtn" type="roundBtn" value="Login" onclick="formhash(this.form, this.form.password);" /> 
            </form>
            <a href="forgot" id="forgot" class='link'>Forgot password</a><a href="register" id="register" class='link right'>sign up</a>

            <?php if($this->data['id']==1):?>
                <p>Login failed</p>
            <?php endif;?>
        </div>
        <svg width="100%" height="100%">
          <path id="shadow" />
        </svg>
    </body>
</html>