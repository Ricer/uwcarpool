<?php

class Carpool extends Model{

	public static $_table_name = 'carpools';
	public static $_primary_key = 'id';
	
	public static function ajax($data){
		if ($data['func'] == 'search') {
			$number_per_page = 5;
			$date = $data['date'];
			$passenger = $data['passenger'];
			$from = $data['from'];
			$to = $data['to'];
			$type = $data['type'];
			$page = $data['page'];
			$start_number = $page * $number_per_page;

			$query = "
			SELECT * 
			FROM (
				SELECT
					`c`.`id` , `c`.`departure`, `c`.`arrival` , 
					`u`.`firstname`, `u`.`lastname`, `c`.`user_id`,
					`c`.`date` , `c`.`price` , `c`.`type`, `c`.`description`, 
					`c`.`date_created` , `c`.`last_edited` , `c`.`passenger` , 
					`c`.`passenger` - SUM(case when `p`.`passenger` IS NULL then 0 else `p`.`passenger` end) AS `passenger_remaining`
				FROM
					`carpools` AS  `c`
				INNER JOIN
					`users` AS `u`
				ON
					`c`.`user_id` = `u`.`id`
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
					`c`.`id`
				) AS  `a` 
			WHERE
				`a`.`passenger_remaining` >= {$passenger}
			LIMIT
				{$start_number} , {$number_per_page}
			";
			$result = DB::run_query($query);
			return json_encode($result);
		}
		
		if ($data['func'] == 'make') {
			$data_array = array(
				'user_id' => $data['user_id'],
				'date' => $data['date'],
				'departure' => $data['from'],
				'arrival' => $data['to'],
				'type' => $data['type'],
				'description' => $data['description'],
				'price' => $data['price'],
				'passenger' => $data['people']
			);
			$carpool = new Carpool();
			$carpool->populate($data_array);
			$result = $carpool->save();
			return json_encode(array('success' => $result ? 1:0));
		}
		
	}
}	
?>