<?php
/**
 * These are the database login details
 */  
define("HOST", "localhost");     // The host you want to connect to.
define("USER", "secUser");    // The database username. 
define("PASSWORD", ")WXvz!RC)B?$");    // The database password. 
define("DATABASE", "carpoolfinder");    // The database name.
 
define("CAN_REGISTER", "any");
define("DEFAULT_ROLE", "member");
 
define("SECURE", FALSE);    // FOR DEVELOPMENT ONLY!!!!<?php

$mysqli = new mysqli(HOST, USER, PASSWORD, DATABASE);
?>