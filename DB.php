<?php
require_once 'vendor/facebook/php-sdk/src/facebook.php';

define('hostname', "localhost");
define('username', "uwcarpool");
define('password', "Thisispassword");
define('database', "carpoolfinder");

$con = mysqli_connect(hostname, username, password, database);
mysqli_set_charset($con, "utf8");
$GLOBALS['default'] = $con;

define('GOOGLE_API_KEY', "AIzaSyDg86pw-zJk0BMtetO5U5-OkETrl9Tfx6A");

$facebook = new Facebook(array(
  'appId'  => '414737555322863',
  'secret' => '54275a5a600f76b04fa957d9c1d72d37',
  'allowSignedRequest' => false
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
