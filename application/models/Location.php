<?php

class Location extends Model{

  public static $_table_name = 'carpoolLocation';
  public static $_primary_key = 'id';
  
  public static function entry($from, $to)
  {
    try{
      Location::entry_by_name($from,true);
      Location::entry_by_name($to,false);
      return true;
    } catch (Exception $e) {
      return false;
    }
  }
  
  public static function find_by_name($name){
    $selector = array(
      'name' => $name
    );
    return self::find($selector);
  }

  public static function entry_by_name($name,$isDeparture){
    if ($location = Location::find_by_name($name)){
      if($isDeparture){
        $location->departureCount=$location->departureCount+1;
        return $location->save()->departureCount;
      }else{
        $location->arrivalCount=$location->arrivalCount+1;
        return $location->save()->arrivalCount;
      }
    }else{
      $location = new Location();
      if($isDeparture){
        $location->populate(Array('departureCount'=>1,'name'=>$name));
        return $location->save()->departureCount;
      }else{
        $location->populate(Array('arrivalCount'=>1,'name'=>$name));
        return $location->save()->arrivalCount;
      }
    }
    return false;
  }

  public static function all($name=""){
    $query = "SELECT name,(arrivalCount+departureCount) AS count FROM `carpoolLocation` WHERE name LIKE '%{$name}%' ORDER BY count LIMIT 10";
    $result = DB::run_query($query);
    $func = function($value) {
      return $value['name'];
    };
    $result = array_map($func, $result);
    return $result;
  }
  public static function ajax($data){
    if ($data['func'] == 'search') {

    }
  }
} 
?>