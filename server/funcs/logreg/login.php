<?php
require "../../helpers/dbh.php";
require "../../helpers/is_active.php";

$data = Array(
	"message" => "",
	"hasErr" => false,
	"errors" => Array(
		"uid" => "",
		"pwd" => ""
	)
);

function kill($d){
	echo json_encode($d);
	exit();
	die();
}

if(isset($_COOKIE['mbuid']) && isset($_COOKIE['mbpwd'])){
	$cuid =  $_COOKIE['mbuid'];
	$cpwd =  $_COOKIE['mbpwd'];
	if(is_active($conn)){
		$data['message'] = "authed";
		kill($data);
	}
}

if(!isset($_POST['uid']) || !isset($_POST['pwd'])){
	$data['message'] = "Access Denied";
	$data['hasErr'] = true;
	kill($data);
}

$uid = $_POST['uid'];
$pwd = $_POST['pwd'];


if(empty($uid)){
	$data["errors"]["uid"]= "Username is required!";
	$data['hasErr'] = true;
}else if(strlen(trim($uid)) < 3 || strlen(trim($uid)) > 30){
	$data['errors']['uid'] = "Username should contain 3 - 30 characters";
	$data['hasErr'] = true;
}else if(preg_match("/[^A-Za-z0-9 _]/", $uid)){
	$data['errors']['uid'] = "You can only use numbers and letters and _";
	$data['hasErr'] = true;
}

if(empty($pwd)){
	$data['errors']['pwd'] = "Password is required!";
	$data['hasErr'] = true;
}else if(strlen(trim($pwd)) < 8 || strlen(trim($uid)) > 20){
	$data['errors']['pwd'] = "Password should contain 8 - 20 characters";
	$data['hasErr'] = true;
}

if($data['hasErr']){
	kill($data);
}




$sql = "SELECT * FROM users WHERE BINARY uid='$uid'";
$q = $conn->query($sql);
if($q->rowCount() < 1){
	$data['message'] = "Username does not exists!";
	$data['hasErr'] = true;
	kill($data);
}

$usr = $q->fetch();
if(!password_verify($pwd, $usr['pwd'])){
	$data['message'] = "Incorrect password!";
	$data['hasErr'] = true;
	kill($data);
}else{
	setcookie('mbuid', $uid, strtotime('+30 day'), '/', '', '', true);
	setcookie('mbpwd', $pwd, strtotime('+30 day'), '/', '', '', true);
	$data['message'] = "authed";
	kill($data);
}

kill($data);