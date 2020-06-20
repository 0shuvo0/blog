<?php
if(!isset($_COOKIE['mbuid']) && !isset($_COOKIE['mbpwd'])){
	echo "authed";
}else{
	$uid = $_COOKIE['mbuid'];
	setcookie('mbuid', $uid, strtotime('-30 day'), '/', '', '', true);
	setcookie('mbpwd', $uid, strtotime('-30 day'), '/', '', '', true);
	unset($_COOKIE['mbuid']);
	unset($_COOKIE['mbpwd']);
	echo "authed";
}