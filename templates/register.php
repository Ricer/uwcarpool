<?php
include_once 'functions.php';
?>
<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
        <title>UWCarpool♥: Sign up</title>
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
        <link rel="stylesheet" href="css/login.css" />
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

        <div class="main register">
            <a class="brand" href="http://www.uwcarpool.com/"><span>UWCarpool </span><i class="fa fa-heart"></i></a>
            
            <form action="/processRegister.php" method="post" name="registration_form" id="login">
                
                <div class='fbBtnWrapper'>
                    <a id="fbLoginBtn" href="" class='btn-fb btn'>Sign up with <span class="fb">facebook</span></a>
                    <span id='or'>or</span>
                </div>
                <div class="inputGroup horizontal">
                    <input type="text" name="firstname" id="firstname" placeholder="First Name"  class='input input-default'/>
                    <input type="text" name="lastname" id="lastname" placeholder="Last Name"  class='input input-default'/>
                </div>
                <div class="inputGroup vertical">
                    <input type="text" name="email" id="email" placeholder="Email" class='input input-default'/>
                    <input type="password" name="password" id="password" placeholder="Password" class='input input-default'/>
                    <input type="password" name="confirmpwd" id="confirmpwd" placeholder="Confirm Password" class='input input-default'/>
                </div>
                <input id="loginBtn" type="roundBtn" class="btn btn-primary"
                   value="Sign up" 
                   onclick="return regformhash(this.form,
                                   this.form.firstname,
                                   this.form.lastname,
                                   this.form.email,
                                   this.form.password,
                                   this.form.confirmpwd);" />
            </form>
            <a href="/login" id="login" class="link right">login</a>

            <?php if($this->data['id']==1):?>
                <p>Login failed</p>
            <?php endif;?>
        </div>
        <svg width="100%" height="100%">
          <path id="shadow" />
        </svg>
        <!-- <ul>
            <li>Usernames may contain only digits, upper and lower case letters and underscores</li>
            <li>Emails must have a valid email format</li>
            <li>Passwords must be at least 6 characters long</li>
            <li>Passwords must contain
                <ul>
                    <li>At least one upper case letter (A..Z)</li>
                    <li>At least one lower case letter (a..z)</li>
                    <li>At least one number (0..9)</li>
                </ul>
            </li>
            <li>Your password and confirmation must match exactly</li>
        </ul> -->
    </body>
</html>