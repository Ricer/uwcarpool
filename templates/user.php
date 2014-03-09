<?php
include_once 'functions.php';
sec_session_start();

$logged=login_check($mysqli);
include_once 'DB.php';


// SQL
?>
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, target-densityDpi=device-dpi" />
    <title>UWCarpool★</title>
    <link rel="shortcut icon" href="images/favicon.ico">

    <!-- Loading CSS -->
    <link href="/css/bootstrap.css" rel="stylesheet">
    <link rel="stylesheet" href="/css/picker/default.css" id="theme_base">
    <link rel="stylesheet" href="/css/picker/default.date.css" id="theme_date">
    <link rel="stylesheet" href="/css/picker/default.time.css" id="theme_time">

    <link rel="stylesheet" href="/css/font-awesome.min.css">
    <link rel="stylesheet" href="/css/detail.css">
    
    <link rel="stylesheet" href="/css/user.css">
  </head>

<body>
    <!-- menu bar -->
    
    <div id="headerImage">
        <img src="http://evergreenpictureframers.info/wp-content/uploads/2012/09/Classified-Header.jpg">
    </div>
    
    <div id="mainContent">
        <div id="userinfo" class="media">
            <img src="http://www.hootpile.com/img/facebook-default-no-profile-pic.jpg" class="pull-left img-thumbnail">
            <div class="media-body">
                <div class="media-body">
                    <h2 class="media-heading">user['name']</h2>
                    <p>Description</p>
                </div>
            </div>
        </div>

        <div class="column-left">
            <div class="panel panel-default">
                <div class="panel-heading">
                    <h2>Current Offers</h2>
                </div>
                
                <ul class="list-group" "info-left">
                    <!-- for offer in user[currentOffer] -->
                    <li class="list-group-item">
                        offer['date_date'] offer['departure'] offer['arrival'] offer['price']
                    </li>                
                    <!-- endfor -->
                    <li class="list-group-item">
                        2014/3/8 waterloo toronto $20 (test)
                    </li>
                </ul>
            </div>
            <div class="panel panel-default">
                <div class="panel-heading">
                    <h2>Previous Offers</h2>
                </div>
                
                <ul class="list-group" "info-left">
                    <!-- for offer in user[previousOffer] -->
                    <li class="list-group-item">
                        offer['date_date'] offer['departure'] offer['arrival'] offer['price']
                    </li>
                    <!-- endfor -->
                    <li class="list-group-item">
                        2014/2/1 waterloo toronto $15 (test)
                    </li>
                </ul>
            </div>
        </div>

        <div class="column-right">
            <div id="comment" class="panel panel-default">
                <div class="panel-heading">
                    <h2>Comments</h2>
                </div>
                
                <!-- for comment in user[comments] -->
                <ul class="list-group" "info-left">
                    <!-- for comment in user[comments] -->
                    <li class="list-group-item">                        
                        <img src="http://www.hootpile.com/img/facebook-default-no-profile-pic.jpg" class="pull-left img-circle">
                        <h4>comment['user']['username']</h4>
                        <p>comment['content']</p>
                    </li>
                    <!-- endfor -->
                    <li class="list-group-item">
                        <img src="http://www.hootpile.com/img/facebook-default-no-profile-pic.jpg" class="pull-left img-circle">
                        <h4>testuser</h4>
                        <p>test</p>
                    </li>
                    
                    <!-- add new comment -->
                    <li class="list-group-item">
                        <input type=text" class="form-control" placeholder="Add new comment">
                    </li>
                </ul>
            </div>
        </div>
    </div>
</body>