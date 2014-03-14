<?php

class Passenger extends Model{

  public static $_table_name = 'passengers';
  public static $_primary_key = 'id';
  
  public static function ajax($data){
    if ($data['func'] == 'search') {
    }
  }
} 
?>