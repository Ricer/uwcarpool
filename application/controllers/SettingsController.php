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
    $view = array();
    $view['user'] = $this->user;
    if(!isset($this->todo)){
      $view['page']="general";
    }else{
      $view['page']=$this->todo;
    }
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
