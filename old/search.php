<?php

include_once 'DB.php';
$number_per_page = 5;

if(isset($_GET['type']) && isset($_GET['date']) && isset($_GET['passenger']) && isset($_GET['luggage'])){
	$date = $_GET['date'];
	$passenger = $_GET['passenger'];
	$luggage = $_GET['luggage'];
	$from = "";
	$to = "";
	$type = "";
	$page = 0;
	if(isset($_GET['from'])) $from = $_GET['from'];
	if(isset($_GET['from'])) $to = $_GET['to'];
	if(isset($_GET['page'])) $page = $_GET['page']-1;
	$start_number=$page*$number_per_page;
	
	switch (strtoupper($_GET['type'])){
		case "BOTH":
			break;
		case "OFFER":
			$type = "offer";
			break;
		case "REQUEST":
			$type = "request";
			break;
	}
	$query = "
			SELECT * 
			FROM (
				SELECT
					`c`.`id` , `c`.`departure`, `c`.`arrival` , 
					CONCAT( `m`.`firstname`, ' ' , `m`.`lastname`)  AS `name`,
					`c`.`date` , `c`.`price` , `c`.`type`, `c`.`description`, 
					`c`.`date_created` , `c`.`last_edited` , `c`.`passenger` , `c`.`luggage`, 
					`c`.`passenger` - SUM( `p`.`passenger` ) AS `passenger_remaining`, 
					`c`.`luggage` - SUM( `p`.`luggage` ) AS `luggage_remaining` 
				FROM
					`carpool` AS  `c`
				INNER JOIN
					`members` AS `m`
				ON
					`c`.`user_id` = `m`.`id`
				LEFT JOIN
					`passengers` AS  `p`
				ON
					`p`.`carpool_id` =  `c`.`id` 
				WHERE
    				`c`.`departure` LIKE '%{$from}%'
				AND
					`c`.`arrival` LIKE  '%{$to}%'
				AND
					DATE(  `c`.`date` ) LIKE  '%{$date}%'
				AND
					`c`.`type` LIKE '%{$type}%'
				GROUP BY
					`p`.`carpool_id`
				) AS  `a` 
			WHERE
				`a`.`passenger_remaining` >= {$passenger}
			AND
				`a`.`luggage_remaining` >= {$luggage}
			LIMIT
				{$start_number} , {$number_per_page}
			";
	$result = run_query($query);
	echo json_encode($result);
	
}

?>
