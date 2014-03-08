<?php
require_once 'vendor/autoload.php';
$app_id   = "414737555322863";
$app_secret = "54275a5a600f76b04fa957d9c1d72d37";
$site_url = "www.uwcarpool.com";

 
$facebook = new Facebook(array(
  'appId'   => $app_id,
  'secret'  => $app_secret,
  ));
 
$user = $facebook->getUser();
if($user){
//==================== Single query method ======================================
  try{
    // Proceed knowing you have a logged in user who's authenticated.
    $user_profile = $facebook->api('/me');
  }catch(FacebookApiException $e){
    error_log($e);
    $user = NULL;
  }
//==================== Single query method ends =================================
}
$loginUrl = $facebook->getLoginUrl(array(
  'scope'   => 'Your list of Permissions', // Permissions to request from the user
  'redirect_uri'  => 'www.uwcarpool.com', // URL to redirect the user to once the login/authorization process is complete.
));
$logoutUrl = $facebook->getLogoutUrl(array(
  'next'  => 'www.uwcarpool.com/', // URL to which to redirect the user after logging out
));

if($user){
  // Get logout URL
  $logoutUrl = $facebook->getLogoutUrl();
  $user_profile = $facebook->api('/me');
  echo "Welcome ".$user." ".$user_profile->name." <a href='".$logoutUrl."'>Logout</a>";
}else{
  // Get login URL
  $loginUrl = $facebook->getLoginUrl(array(
    'scope' => 'read_stream, publish_stream, user_birthday, user_location, user_work_history, user_hometown, user_photos',
    ));
  echo "<a href='".$loginUrl."'>Login</a>";
}



// try{
//   $user_info  = $facebook->api('/' . $user);
//   $feed   = $facebook->api('/' . $user . '/home?limit=50');
//   $friends_list = $facebook->api('/' . $user . '/friends');
//   $photos   = $facebook->api('/' . $user . '/photos?limit=6');
// }catch(FacebookApiException $e){
//   error_log($e);
// }
