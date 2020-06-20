<?php
require "../../helpers/dbh.php";
require "../../helpers/is_active.php";

if(isset($_COOKIE['mbuid']) && isset($_COOKIE['mbpwd'])){
	$cuid =  $_COOKIE['mbuid'];
	$cpwd =  $_COOKIE['mbpwd'];
	if(is_active($conn)){
		echo "authed";
		exit();
	}
	echo "Login";
}
echo "Login";