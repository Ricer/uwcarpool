<?php

class DetailController extends CarpoolController {
  /**
   * @var string
   * main template file name, without .html
   */
  protected $layout = 'detail';
  
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

  public function acceptPendingRequest(){
    $passenger=Passenger::find(Array('id'=>$_REQUEST['passenger_id']));
    if($passenger){
      $carpool=Carpool::find(Array('id'=>$passenger->carpool_id));
      if($carpool->user_id==$this->user->id){
        $passenger->pending=0;
        $passenger->save();
        $this->redirect('detail/'.$passenger->carpool_id,true);
        return;
      }
    }
    $this->redirectWithError('Cannot find pending request');
  }
  public function applyForOffer(){
    if($this->user&&isset($_REQUEST['carpool_id'])&&isset($_REQUEST['passenger'])){
      $carpool=Carpool::find(Array('id'=>$_REQUEST['carpool_id']));
      if($carpool&&$carpool->user_id!=$this->user->id&&!Passenger::find(Array('id'=>$this->user->id,'carpool_id'=>$carpool->id))){
        $data_array = array(
          'user_id' => $this->user->id,
          'carpool_id' => $carpool->id,
          'passenger' => $_REQUEST['passenger']
        );
        $passenger = new Passenger();
        $passenger->populate($data_array);
        $result=$passenger->save();
        $this->redirect('detail/'.$passenger->carpool_id,true);
        return;
      }
    }
    $this->redirectWithError('Failed to apply.');
  }
  public function payByCard(){
    if($this->user&&isset($_REQUEST['stripeToken'])&&isset($_REQUEST['carpool_id'])){
      $carpool=Carpool::find(Array('id'=>$_REQUEST['carpool_id']));
      $passenger=Passenger::find(Array('user_id'=>$this->user->id,'carpool_id'=>$carpool->id));
      if($carpool&&$carpool->user_id!=$this->user->id&&!$passenger->pending&&!$passenger->paid){
        try {
          $charge = Stripe_Charge::create(array(
            "amount" => $carpool->price*100, // amount in cents, again
            "currency" => "cad",
            "card" => $_REQUEST['stripeToken'],
            "description" => "uwcarpool: carpool form ".$carpool->departure." to ".$carpool->arrival)
          );
        } catch(Stripe_CardError $e) {
          $this->redirectWithError('Your payment is declined.');
        }
        $passenger->paid=1;
        $passenger->save();
        $this->redirect('detail/'.$passenger->carpool_id,true);
        return;
      }
    }
    $this->redirectWithError('Failed to pay.');
  }
  
  public function __call($name, $arguments) {
    $view = array();
    $carpool_id=$this->todo['id'];
    $selector = array(
      'id' => $carpool_id
    );
    $view['current']=Carpool::find($selector);
    if(!$view['current']){
      $this->redirect('index',true);
    }
    $selector = array(
      'id' => $view['current']->user_id
    );
    $driver=User::find($selector);
    $view['current']->firstname=$driver->firstname;
    $view['current']->lastname=$driver->lastname;
    $view['current']->profilePicture=$driver->profilePicture;

    $view['user'] = $this->user;

    $query = "
      SELECT 
        `p`.*,
        `u`.profilePicture,`u`.firstname,`u`.lastname
      FROM 
          `passengers` AS  `p`
        LEFT JOIN
          `users` AS `u`
        ON
          `p`.`user_id` = `u`.`id`
      WHERE
        `p`.`carpool_id` = $carpool_id
      ";
    $view['passengers'] = DB::run_query($query);
    return $view;
  }
  
  private function process_url(){
    $url = explode('/', preg_replace(array('/\/+/', '/^\/|\s+|\/$/'), array('/', ''), strtolower(urldecode($_SERVER['REQUEST_URI']))));
    if (!empty($url[1])) {
      $this->todo['id'] = $url[1];
    }
  }
}

?>
