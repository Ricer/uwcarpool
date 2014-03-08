<?php
header('Content-Type: application/json');
define('hostname', "BudgetTrackerDB.db.11551271.hostedresource.com");
define('username', "BudgetTrackerDB");
define('password', "Sky19940321!");
define('database', "BudgetTrackerDB");

$con = mysqli_connect(hostname, username, password, database);


require 'facebook-php-sdk-master/src/facebook.php';
$facebook = new Facebook(array(
  'appId'  => '414737555322863',
  'secret' => '54275a5a600f76b04fa957d9c1d72d37',
));




$return_arr = Array();
$errorList=Array(
  1=>"No User",
  2=>"Request error",
  3=>"Facebook login failed"
);

function error($code=2) 
{ 
  // No user
  $return_data = Array(
    "userid" => 0,
    "status" => "error",
    "errorCode" => $code,
    "errorMsg" => $errorList[$code],
    "data" => $return_arr
  );

  echo json_encode($return_data);
  die();
} 

function returnData($return_arr,$msg=""){
  $return_data=Array(
    "userid" => $user,
    "status" => "success",
    "errorCode" => 0,
    "errorMsg" => "",
    "Msg" => $msg,
    "data" => $return_arr
  );

  echo json_encode($return_data);
  die();
}
// Get User ID
$user = $facebook->getUser();
if($user) {
  // We have a user ID, so probably a logged in user.
  // If not, we'll get an exception, which we handle below.
  try {

    // $user_profile = $facebook->api('/me','GET');
    // echo "Name: " . $user_profile['name'];

  } catch(FacebookApiException $e) {
    // If the user is logged out, you can have a 
    // user ID even though the access token is invalid.
    // In this case, we'll get an exception, so we'll
    // just ask the user to login again here.
    // $login_url = $facebook->getLoginUrl(); 
    // echo 'Please <a href="' . $login_url . '">login.</a>';
    // error_log($e->getType());
    // error_log($e->getMessage());
    error(3);
  }

  try{
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
      $id = mysqli_real_escape_string($con,$_POST['id']);
      $desc = mysqli_real_escape_string($con,$_POST['desc']);
      $title = mysqli_real_escape_string($con,$_POST['title']);
      $category = mysqli_real_escape_string($con,$_POST['category']);
      $date = mysqli_real_escape_string($con,$_POST['date']);
      $amount = mysqli_real_escape_string($con,$_POST['amount']);
      if($id=="-1"){
        mysqli_query($con,"INSERT INTO Transaction (`userid`,`desc`,`title`,`category`,`date`,`amount`) VALUES (".$user.",'".$desc."', '".$title."',".$category.",'".$date."',".$amount.")");
        $id=mysqli_insert_id($con);
      }else{
        mysqli_query($con,"UPDATE Transaction SET `desc`='".$desc."',`title`='".$title."',`category`=".$category.",`date`='".$date."',`amount`=".$amount." WHERE id=".$id);
      }
      $sql = "SELECT * FROM Transaction WHERE id=".$id;
      $result = mysqli_query($con, $sql);

      while ($row = mysqli_fetch_array($result, MYSQLI_ASSOC)) {
        $row["amount"]=floatval($row["amount"]);
        $row["category"]=intval($row["category"]);
        array_push($return_arr,$row);
      }

      returnData($return_arr);
    }else if($_SERVER['REQUEST_METHOD'] === 'DELETE'){
      parse_str(file_get_contents('php://input'), $_DELETE);
      $id = mysqli_real_escape_string($con,$_DELETE['id']);

      if(mysqli_query($con,"DELETE FROM Transaction WHERE id=".$id)){
        returnData($return_arr,"deleted transaction: ".$id);
      }else{
        error(2);
      }
    }else{

      $sql = "SELECT * FROM Transaction WHERE userid=".$user;
      $result = mysqli_query($con, $sql); 

      while ($row = mysqli_fetch_array($result, MYSQLI_ASSOC)) {
        $row["amount"]=floatval($row["amount"]);
        $row["category"]=intval($row["category"]);
        array_push($return_arr,$row);
      }

      returnData($return_arr);
    }
  }catch(Exception $e) {
    error(2);
  }

} else {
  error(1,"No User");
}


?>