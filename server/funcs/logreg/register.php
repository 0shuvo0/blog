<?php
require "../../helpers/dbh.php";
require "../../helpers/is_active.php";

$data = Array(
	"message" => "",
	"hasErr" => false,
	"errors" => Array(
		"uid" => "",
		"email" => "",
		"pwd" => "",
		"cpwd" => ""
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

if(!isset($_POST['uid']) || !isset($_POST['email']) || !isset($_POST['pwd']) || !isset($_POST['cpwd'])){
	$data['message'] = "Access Denied";
	$data['hasErr'] = true;
	kill($data);
}

$uid = trim($_POST['uid']);
$email = trim($_POST['email']);
$pwd = $_POST['pwd'];
$cpwd= $_POST['cpwd'];

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

if(empty($email)){
	$data['errors']['email'] = "Email is required!";
	$data['hasErr'] = true;
}else if(!filter_var($email, FILTER_VALIDATE_EMAIL)){
	$data['errors']['email'] = "Invalid email address!";
	$data['hasErr'] = true;
}

if(empty($pwd)){
	$data['errors']['pwd'] = "Password is required!";
	$data['hasErr'] = true;
}else if(strlen(trim($pwd)) < 8 || strlen(trim($uid)) > 20){
	$data['errors']['pwd'] = "Password should contain 8 - 20 characters";
	$data['hasErr'] = true;
}

if(empty($cpwd)){
	$data['errors']['cpwd'] = "Confirm your password!";
	$data['hasErr'] = true;
}else if($pwd != $cpwd){
	$data['errors']['cpwd'] = "Passwords do not match!";
	$data['hasErr'] = true;
}

if($data['hasErr']){
	kill($data);
}




$sql = "SELECT * FROM users WHERE BINARY uid='$uid'";
$q = $conn->query($sql);
if($q->rowCount() > 0){
	$data['errors']['uid'] = "This username is already taken";
	$data['hasErr'] = true;
	kill($data);
}




$newpwd = password_hash($pwd, PASSWORD_BCRYPT);
	$sql = "INSERT INTO `users` VALUES (NULL, ?, ?, ?, NULL)";
	$stmt = $conn->prepare($sql);
if($stmt->execute([$uid, $email,  $newpwd])){
	setcookie('mbuid', $uid, strtotime('+30 day'), '/', '', '', true);
	setcookie('mbpwd', $pwd, strtotime('+30 day'), '/', '', '', true);
	$data['message'] = "authed";
}else{
	$data['message'] = "Unexpected error occured";
	$data['hasErr'] = true;
}

kill($data);