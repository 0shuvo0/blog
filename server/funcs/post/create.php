<?php
require "../../helpers/dbh.php";
require "../../helpers/is_active.php";

function kill(){
	exit();
	die();
}

if(isset($_COOKIE['mbuid']) && isset($_COOKIE['mbpwd'])){
	$cuid =  $_COOKIE['mbuid'];
	$cpwd =  $_COOKIE['mbpwd'];
	if(!is_active($conn)){
		echo "Login required";
		kill();
	}
}else{
	echo "Login required";
	kill();
}


if(!isset($_POST['title']) || !isset($_POST['text']) || !isset($_POST['post_img'])){
	echo "Direct access is not allowed";
	kill();
}
if(empty($_POST['title']) && empty($_POST['text']) && empty($_POST['post_img'])){
	echo "Empty post";
	kill();
}


$title = trim($_POST['title']);
$text = trim($_POST['text']);
$smallimg = trim($_POST['post_img']);
$uid = $_COOKIE['mbuid'];

if(!empty($title)){
	if(strlen($title) > 50){
		echo "Title should not exceed 50 characters";
		kill();
	}else if(preg_match("/[^A-Za-z0-9 ]/", $title)){
		echo "You can only use numbers and letters for title";
		kill();
	}
}

$imgName = "";
if($smallimg != ""){
	$dir = '../../../public/img/posts/';
	$hp = str_replace(' ', '_', $uid).'_'.time().'.';
	$smallimg = str_replace('data:image/jpeg;base64,', '', $smallimg);
	$smallimg = str_replace(' ', '+', $smallimg);
	$data = base64_decode($smallimg);
	$imgName = $hp.'jpeg';
	if(!file_put_contents($dir.$imgName, $data)){
		echo "Something went wrong.";
		kill();
	}
}

if(!empty($text)){
	$text = str_replace(";thetbsym;", "&nbsp; &nbsp; ", str_replace(";thedssym;", "&nbsp ", str_replace(";thebrsym;", "<br>", htmlspecialchars(preg_replace("#\[tb\]#", ";thetbsym;", preg_replace("#\[nl\]#", ";thebrsym;", preg_replace("#\[sp\]#", ";thedssym;", $text)))))));
}

$sql = "INSERT INTO `posts` (`uid`, `title`, `text`, `img`) VALUES ('$uid', '$title', '$text', '$imgName')";
$q = $conn->query($sql);

if($q){
	echo "authed";
}else{
	echo "Error occurred.";
}