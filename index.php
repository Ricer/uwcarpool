<?php
include 'config.php';

//require 'vendor/autoload.php';
header('Content-type: text/html; charset=utf-8');
header('Access-Control-Allow-Origin: *');

echo Dispatcher::dispatch($_SERVER['REQUEST_URI']);
/*
$app = new \Slim\Slim(array(
    'debug' => true,
    'templates.path' => './templates'
));


$app->request->isJson=function() use ($app) {return $app->request->getMediaType()=="application/json";};
$app->get('/user/:id', function ($id) use ($app) {
  $app->render('user.php',Array('id'=>$id));
});
$app->get('/detail/:id', function ($id) use ($app) {
  $app->render('detail.php',Array('id'=>$id));
});
$app->get('/error/:id', function ($id) use ($app) {
  $app->render('error.php',Array('id'=>$id));
});
$app->get('/', function () use ($app) {
  $app->render('home.php');
});
$app->get('/login',function() use ($app){
  $app->render('login.php');
});
$app->get('/login:id',function ($id) use ($app) {
  $app->render('login.php',Array('id'=>$id));
});
$app->map('/register',function() use ($app){
  $app->render('register.php');
})->via('GET');
$app->get('/register_success',function() use ($app){
  $app->render('register_success.php');
});
$app->get('/protected_page',function() use ($app){
  $app->render('protected_page.php');
});


$app->run();*/
?>