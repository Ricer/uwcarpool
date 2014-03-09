<?php

class UserController extends CarpoolController {
  /**
   * @var string
   * main template file name, without .html
   */
  protected $layout = 'user';
  
  private $todo = array();

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
    $selector = array(
      'id' => $this->todo['id']
    );
    $view['user'] = User::find($selector);
    return $view;
  }
  
  private function process_url(){
    $url = explode('/', preg_replace(array('/\/+/', '/^\/|\s+|\/$/'), array('/', ''), strtolower(urldecode($_SERVER['REQUEST_URI']))));
    if (!empty($url[1])) {
      $this->todo['id'] = $url[1];
      if($this->todo['id']==$this->user->id){
        $this->redirect('dashboard',true);
      }
    }
  }
}

?>
