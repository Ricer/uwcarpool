<?php

class Mail{
	private static $from = 'uwcarpool@lukery.com';
	private static $default_subject = 'UW Carpool';
	
	public function send($to, $message, $subject = ""){
		if ($subject == "") $subject = self::$default_subject;
		$headers = 'From: ' . self::$from . "\r\n" .
				'Reply-To: ' . self::$from . "\r\n";
		
		$message = wordwrap($message, 70, "\r\n");
		
		mail($to, $subject, $message, $headers);
	}
}
?>
