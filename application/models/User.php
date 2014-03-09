<?php

class User extends Model{
	public static $types = array(
		1 => 'Passenger',
		3 => 'Driver',
		5 => 'Administrator'
	);
	
	public static $_table_name = 'users';
	public static $_primary_key = 'id';
	
	public static function login($email, $password)
	{
		if ($user = User::find_by_email($email))
		{
			$password = hash('sha512', $password . $user->salt);
			if($user->password == $password)
			{
				return $user;
			}
		}
		return false;
	}
	
	public static function find_by_email($email){
		$selector = array(
			'email' => $email
		);
		return self::find($selector);
	}
	
	public static function find_from_auth($auth)
	{
		$results = self::find_by_sql("SELECT * FROM users WHERE md5(concat(id, firstname, lastname, email)) = '" . self::me($auth) . "'");
		
		return array_shift($results);
	}
	
	public function set_login_cookie()
	{
		setcookie('carpoolauth', md5($this->id . $this->firstname . $this->lastname . $this->email), time() + 60 * 60 * 24 * 31, '/');
	}
}
?>
