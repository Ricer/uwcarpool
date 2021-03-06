<?php
include_once 'functions.php';
sec_session_start();

$logged=login_check($mysqli);
$driver=false;
if($logged){
  $driver=true;
}
?>
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, target-densityDpi=device-dpi" />
    <title>UWCarpool♥</title>
    <link rel="shortcut icon" href="images/favicon.ico">

    <!-- Loading CSS -->
    <link href="css/bootstrap.css" rel="stylesheet">
    <link rel="stylesheet" href="css/picker/default.css" id="theme_base">
    <link rel="stylesheet" href="css/picker/default.date.css" id="theme_date">
    <link rel="stylesheet" href="css/picker/default.time.css" id="theme_time">

    <link rel="stylesheet" href="css/font-awesome.min.css">
    <link rel="stylesheet" href="css/index.css">


    <!-- HTML5 shim, for IE6-8 support of HTML5 elements. All other JS at the end of file. -->
    <!--[if lt IE 9]>
      <script src="js/html5shiv.js"></script>
      <script src="js/respond.min.js"></script>
    <![endif]-->
    <script src="js/lib/jquery-1.8.3.min.js"></script>
    <script src="js/lib/bootstrap.min.js"></script>
    <script src="js/lib/moment.min.js"></script>
    <script src="js/lib/legacy.js"></script>
    <script src="js/lib/picker.js"></script>
    <script src="js/lib/picker.date.js"></script>
    <script src="js/lib/picker.time.js"></script>
    
    <!-- <script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDg86pw-zJk0BMtetO5U5-OkETrl9Tfx6A&sensor=true"></script> -->
    <script src="js/lib/react/react-with-addons.min.js"></script>
    <script src="js/lib/react/JSXTransformer.js"></script>
    <script>
      type="offer"
      function switchTo(str){
        $('#requestLi,#offerLi').removeClass('active')
        $('#'+str+"Li").addClass('active');
        type=str;
        $(window).trigger('typeChange');
      }
    </script>
    <script type='text/jsx' src="js/home.js"></script>
    
  </head>
  <body>

      <div class='main'>
        <nav class="navbar topbar navbar-default navbar-fixed-top" role="navigation"  data-spy="affix" data-offset-top="150">
          <div class="container">
            <div class="navbar-header">
              <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
                <span class="sr-only">Toggle navigation</span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
              </button>
              <a class="navbar-brand" href="http://www.uwcarpool.com/"><span>UWCarpool </span><i class="fa fa-heart"></i></a>
            </div>

            <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
              <ul class="nav navbar-nav navbar-right">

                <?php if ($driver == true) : ?>
                  <script>type="request"</script>
                  <li class="active" id='requestLi'><a onclick="switchTo('request')"><span>Requests</span></a></li>
                  <li id='offerLi'><a onclick="switchTo('offer')"><span>Offers</span></a></li>
                <?php else:?>
                  <li class="active"><a><span>Offers</span></a></li>
                  <?php if ($logged == true) : ?>
                    <li><a href='become_a_driver'><span>Become a driver</span></a></li>
                  <?php endif; ?>
                <?php endif; ?>
                
                <?php if ($logged == true) : ?>
                  <li><a onclick="$('.profile').toggleClass('show')"><?php echo $_SESSION['firstname']?></a>
                    <div class="profile">
                      <div class='info'>
                      <p class="name"><?php echo $_SESSION['firstname']?> <?php echo $_SESSION['lastname']?></p>
                      <span class="makeoffer">Make a request <i class="fa fa-angle-right"></i></span>
                      </div>
                      <div class='buttons'>
                        <a href="/dashboard"><i class="fa fa-tachometer"></i>Dashboard</a>
                        <a href="/settings"><i class="fa fa-cog"></i>Settings</a>
                        <a href="/logout.php"><i class="fa fa-power-off"></i>Logout</a>
                      </div>
                    </div>
                  </li>
                <?php else:?>
                  <li><a href="login">Login</a></li>
                <?php endif; ?>
              </ul>
            </div>
          </div>
        </nav>
        <div id='filterWrapper'></div>
      </div>
  </body>
</html>
