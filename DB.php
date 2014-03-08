<?php
define('hostname', "localhost");
define('username', "uwcarpool");
define('password', "Thisispassword");
define('database', "carpoolfinder");

$con = mysqli_connect(hostname, username, password, database);
mysqli_set_charset($con, "utf8");
$GLOBALS['default'] = $con;

define('GOOGLE_API_KEY', "AIzaSyDg86pw-zJk0BMtetO5U5-OkETrl9Tfx6A");

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
