<?php
header('Content-Type: application/json');
define('hostname', "carpoolfinder.db.11551271.hostedresource.com");
define('username', "carpoolfinder");
define('password', "Sky19940321!");
define('database', "carpoolfinder");

$con = mysqli_connect(hostname, username, password, database);
$GLOBALS['default'] = $con;

require 'facebook-php-sdk-master/src/facebook.php';
$facebook = new Facebook(array(
  'appId'  => '414737555322863',
  'secret' => '54275a5a600f76b04fa957d9c1d72d37',
));

function run_query($query, $con=""){
	if($con == "") $con = $GLOBALS['default'];
	$result = mysqli_query($con, $query);
	$rows = array();
	while($r = mysqli_fetch_assoc($result)){
		$rows[] = $r;
	}
	return $rows;
}

function get_error($con=""){
	if($con == "") $con = $GLOBALS['default'];
	$error = mysqli_error($con);
	return $error;
}
?>
