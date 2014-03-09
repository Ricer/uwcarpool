<?php
define("APP_ROOT", dirname(__FILE__));

define('hostname', "localhost");
define('username', "root");
define('password', "");
define('database', "carpoolfinder");

define('DEFAULT_CONTROLLER', "index");
define('DEFAULT_ACTION', "index");

define('GOOGLE_API_KEY', "AIzaSyDg86pw-zJk0BMtetO5U5-OkETrl9Tfx6A");
define('FB_APP_ID', '414737555322863');
define('FB_APP_SECRET', '54275a5a600f76b04fa957d9c1d72d37');


$con = mysqli_connect(hostname, username, password, database);
mysqli_set_charset($con, "utf8");
$GLOBALS['default'] = $con;

$paths = array();
$paths[] = APP_ROOT . '/application';
$paths[] = APP_ROOT . '/application/controllers';
$paths[] = APP_ROOT . '/application/models';
$paths[] = APP_ROOT . '/lib';


set_include_path(implode(PATH_SEPARATOR, $paths));

function ___autoloader($class_name) {
    @include $class_name . '.php';
}

spl_autoload_register('___autoloader');

?>
