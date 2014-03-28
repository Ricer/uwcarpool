<?php

class SettingsController extends CarpoolController {
  /**
   * @var string
   * main template file name, without .html
   */
  protected $layout = 'settings';
  
  /**
   * @var null
   * sub-template file path/name, without .html
   */
  public $view_override = null;

  
  
  public function __construct() {
    parent::__construct();
    session_start();
    $this->process_url();
  }

  public function __call($name, $arguments) {
    return $this->general();
  }
  public function general() {
    $view = array();
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
      if(!$_REQUEST['email']||!$_REQUEST['firstname']||!$_REQUEST['lastname']){
        $view['error']="email,firstname,lastname cannot be empty";
      }else if($_REQUEST['cellphone']&&$_REQUEST['cellphone']!=""&&!is_numeric($_REQUEST['cellphone'])){
        $view['error']="cellphone must be numeric";
      }else{
        try {
          $user=$this->user;

          $verified=$_REQUEST['email']==$user->email?$user->emailverified:0;
          $user->populate(Array(
            'email'=>$_REQUEST['email'],
            'emailverified'=>$verified,
            'firstname'=>$_REQUEST['firstname'],
            'lastname'=>$_REQUEST['lastname'],
            'cellphone'=>$_REQUEST['cellphone']
          ));
          $result=User::update($user);
		  $user->set_login_cookie();
          if($verified==0){
            //send email verify new email
            //send email to old email to notify
          }
          $view['saved']=1;
        } catch (Exception $e) {
          $view['error']=$e->getMessage();
        }
      }
    }    
    $view['user'] = $this->user;
    if(!isset($this->todo)){
      $view['page']="general";
    }else{
      $view['page']=$this->todo;
    }
    return $view;
  }
  public function password() {
    $view = array();
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
      if(!$_REQUEST['op']||!$_REQUEST['np']){
        $view['error']="fields cannot be empty";
      }else{
        $password = hash('sha512', $_REQUEST['op'] . $this->user->salt);
        if($this->user->password != $password){
          $view['error']="Your old password does not match.";
        }else{
          try {
            $user=$this->user;
            // Create a random salt
            $random_salt = hash('sha512', uniqid(openssl_random_pseudo_bytes(16), TRUE));
   
            // Create salted password 
            $password = hash('sha512', $_POST['np'] . $random_salt);
            $user->populate(array(
              "password" => $password,
              "salt" => $random_salt
            ));
            $result=User::update($user);
            $user->set_login_cookie();
            //send email notify user
            $view['saved']=1;
          } catch (Exception $e) {
            $view['error']=$e->getMessage();
          }
        }
      }
    }
    $view['user'] = $this->user;
    $view['page']="password";
    return $view;
  }
  
  private function process_url(){
    $url = explode('/', preg_replace(array('/\/+/', '/^\/|\s+|\/$/'), array('/', ''), strtolower(urldecode($_SERVER['REQUEST_URI']))));
    if (!empty($url[1])) {
      $this->todo = $url[1];
    }
  }
}

?>
