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
					`u`.`firstname`, `u`.`lastname`,`u`.`profilePicture`, `u`.`type` AS `user_type`, 
					`c`.`user_id`,
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
			Location::entry($data['from'], $data['to']);
			return json_encode(array('success' => $result ? 1:0,'data'=>$result));
		}
		
		if ($data['func'] == 'apply'){
			if(!isset($data['user_id'])||!isset($data['carpool_id'])||!isset($data['passenger'])){
				return mkError('no user id or carpool id or passenger count');
			}
			$result=Passenger::find(Array('user_id'=>$data['user_id'],'carpool_id'=>$data['user_id']));
			if($result){
				return mkError("already a passenger");
			}else{
				$data_array = array(
					'user_id' => $data['user_id'],
					'carpool_id' => $data['carpool_id'],
					'passenger' => $data['passenger']
				);
				$pass = new Passenger();
				$pass->populate($data_array);
				$result = $pass->save();
				return json_encode(array('success' => $result ? 1:0,'data'=>$result));
			}
		}

		if ($data['func'] == 'payByCard'){

			// Get the credit card details submitted by the form
			$token = $data['stripeToken'];

			// Create the charge on Stripe's servers - this will charge the user's card
			try {
				$charge = Stripe_Charge::create(array(
				  "amount" => 1000, // amount in cents, again
				  "currency" => "cad",
				  "card" => $token,
				  "description" => "payinguser@example.com")
				);
			} catch(Stripe_CardError $e) {
				return json_encode(array('success' => 0,'data'=>NULL,'error'=>'card rejected!'));
			}

			//charge successful.


		}
	}
}	
?>