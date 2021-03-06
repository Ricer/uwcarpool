<?php
include_once 'functions.php';
sec_session_start();

$logged=login_check($mysqli);
include_once 'DB.php';

$id = $this->data['id'];
$query = "
			SELECT
				`c`.`id` , `c`.`departure`, `c`.`arrival` , `u`.`name` , 
				`c`.`date` , `c`.`price` , `c`.`type`, `c`.`description`,
				DATE(`c`.`date_created`) AS `date_date`, TIME(`c`.`date_created`) AS `date_time`,
				`c`.`last_edited` , `c`.`passenger` , `c`.`luggage`, 
				`c`.`passenger` - SUM( `p`.`passenger` ) AS `passenger_remaining`, 
				`c`.`luggage` - SUM( `p`.`luggage` ) AS `luggage_remaining` 
			FROM
				`carpool` AS  `c`
			INNER JOIN
				`users` AS `u`
			ON
				`c`.`user_id` = `u`.`id`
			LEFT JOIN
				`passengers` AS  `p`
			ON
				`p`.`carpool_id` = `c`.`id` 
			WHERE
				`c`.`id` = {$id}
			GROUP BY
				`p`.`carpool_id`
		";
$carpool = run_query($query)[0];
?>
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, target-densityDpi=device-dpi" />
    <title>UWCarpool♥</title>
    <link rel="shortcut icon" href="images/favicon.ico">

    <!-- Loading CSS -->
    <link href="/css/bootstrap.css" rel="stylesheet">
    <link rel="stylesheet" href="/css/picker/default.css" id="theme_base">
    <link rel="stylesheet" href="/css/picker/default.date.css" id="theme_date">
    <link rel="stylesheet" href="/css/picker/default.time.css" id="theme_time">

    <link rel="stylesheet" href="/css/font-awesome.min.css">
    <link rel="stylesheet" href="/css/detail.css">


    <!-- HTML5 shim, for IE6-8 support of HTML5 elements. All other JS at the end of file. -->
    <!--[if lt IE 9]>
      <script src="js/html5shiv.js"></script>
      <script src="js/respond.min.js"></script>
    <![endif]-->
    <script src="/js/lib/jquery-1.8.3.min.js"></script>
    <script src="/js/lib/bootstrap.min.js"></script>
    <script src="/js/lib/moment.min.js"></script>
    <script src="/js/lib/legacy.js"></script>
    <script src="/js/lib/picker.js"></script>
    <script src="/js/lib/picker.date.js"></script>
    <script src="/js/lib/picker.time.js"></script>
    
<script type="text/javascript"
      src="https://maps.googleapis.com/maps/api/js?key=<?=GOOGLE_API_KEY;?>&sensor=true"></script>
    <script src="/js/lib/react/react-with-addons.min.js"></script>
    <script src="/js/lib/react/JSXTransformer.js"></script>
    

			<script>
				item=<?= json_encode($carpool); ?>
			</script>
  </head>
  <body>
      <div class='main'>
        <nav class="navbar topbar navbar-default navbar-fixed-top affix" role="navigation" >
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
                <li><a href="/"><span>Take this offer for $<?= $carpool['price']?></span></a></li>
                
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
    </script>

		<script type='text/jsx' src='/js/detail.js'></script>
		<div id="map-wrapper">
		</div>
		<div class="infobar">
			<div class="container">
			<div id="carpoolRow-wrapper">
			</div>
		</div>
		</div>
	</div><!-- content wrapper -->

	<!-- 
    <script type="text/javascript">
	var directionsDisplay;
	var directionsService = new google.maps.DirectionsService();
	var map;
	var from = new google.maps.LatLng(43.472368, -80.544855);
	var to = new google.maps.LatLng(43.663339, -79.395622)
	function initialize() {
		directionsDisplay = new google.maps.DirectionsRenderer();
        var mapOptions = {
			zoom: 14,
			center: from
        };
		map = new google.maps.Map(document.getElementById("map"), mapOptions);
		directionsDisplay.setMap(map);
	}
	function calcRoute() {
		var request = {
			origin: from,
			destination: to,
			provideRouteAlternatives: false,
			travelMode: google.maps.TravelMode.DRIVING,
			unitSystem: google.maps.UnitSystem.IMPERIAL
		};
		directionsService.route(request, function(response, status) {
			if (status == google.maps.DirectionsStatus.OK) {
				directionsDisplay.setDirections(response);
			}
		});
      }
     $(function(){
		 initialize();
		 calcRoute();
	 });
	</script> -->
	</body>
</html>