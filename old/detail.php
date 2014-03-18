<?php

include_once 'DB.php';
include_once 'header.html';

if(isset($_GET['id'])){
	$id = $_GET['id'];
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
}
?>
		<div class="panel panel-default info-main">
			<div class="panel-heading">
				<h2>Carpool Detail</h2>
			</div>

					<ul class="list-group">
						<li class="list-group-item">
							<span class="badge"><?= $carpool['departure']; ?></span>
							<i class="fa fa-thumb-tack"></i> From
						</li>
						<li class="list-group-item">
							<span class="badge"><?= $carpool['arrival']; ?></span>
							<i class="fa fa-thumb-tack"></i> To
						</li>
						<li class="list-group-item">
							<span class="badge"><?= $carpool['name']; ?></span>
							<i class="fa fa-user"></i> Offered by
						</li>
						<li class="list-group-item">
							<span class="badge"><?= $carpool['date_date']; ?></span>
							<i class="fa fa-calendar"></i> Date
						</li>
						<li class="list-group-item">
							<span class="badge"><?= $carpool['date_time']; ?></span>
							<i class="fa fa-clock-o"></i> Time
						</li>
						<li class="list-group-item">
							<span class="badge"><?= $carpool['price']; ?></span>
							<i class="fa fa-money"></i> Price
						</li>
					</ul>
		</div>
			<div class='info-desc panel panel-default'>
			<div class="panel-body">
				<h4>Description</h4>
				<div>
					<?=$carpool['description'];?>
				</div>
			</div>
			</div>
		<div id="map-wrapper">
			<div id="map">				
			
			</div>
		</div>
	</div><!-- content wrapper -->

	<script type="text/javascript"
      src="https://maps.googleapis.com/maps/api/js?key=<?=GOOGLE_API_KEY;?>&sensor=true">
    </script>
    <script type="text/javascript">
      function initialize() {
        var mapOptions = {
			zoom: 14,
			center: <?=$carpool['from']?>
        };
        var map = new google.maps.Map(document.getElementById("map"), mapOptions);
		var directionsDisplay = new google.maps.DirectionsService();
		directionsDisplay.setMap(map);
		var directionsOptions = {
			origin: <?=$carpool['from']?>,
			destination: <?=$carpool['to']?>,
			provideRouteAlternatives: false,
			travelMode: TravelMode.DRIVING,
			unitSystem: UnitSystem.IMPERIAL
		};
		directionsService.route(directionsOptions, function(response, status) {
			if (status == google.maps.DirectionsStatus.OK) {
				directionsDisplay.setDirections(response);
			}
		});
      }
      google.maps.event.addDomListener(window, 'load', initialize);
	</script>
	</body>
</html>