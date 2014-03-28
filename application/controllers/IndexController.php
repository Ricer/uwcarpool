<?php

class IndexController extends CarpoolController {
	/**
	 * @var string
	 * main template file name, without .html
	 */
	protected $layout = 'index';
	
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
	
	public function logout()
	{
		$this->render = false;
		setcookie('carpoolauth', 0, -1, '/');

		$this->redirect('index', true);
	}
	
	public function index(){
		$view = array();
		$view['user'] = $this->user;
		return $view;
	}

	public function getLocations(){
		$this->render='json';
		return Array('suggestions'=>Location::all($_REQUEST['query']));
	}
	
	public function __call($name, $arguments) {
		if($this->todo){
			$this->redirect('index', true);
		}
	}
	
	private function process_url(){
		$url = explode('/', preg_replace(array('/\/+/', '/^\/|\s+|\/$/'), array('/', ''), strtolower(urldecode($_SERVER['REQUEST_URI']))));
		if (!empty($url[1])) {
			$this->todo = $url[1];
		}
	}
}

?>
