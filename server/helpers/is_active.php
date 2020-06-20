<?php
function is_active($conn, $f = false){
	$data;
	$res = false;
	if(!isset($_COOKIE['mbuid']) || !isset($_COOKIE['mbpwd'])){
		$res = false;
	}else if(preg_match("/[^A-Za-z0-9 ]/", $_COOKIE['mbuid'])){
		$res = false;
	}else{
		$uid = $_COOKIE['mbuid'];
		$pwd = $_COOKIE['mbpwd'];
		$sql = "SELECT * FROM users WHERE uid = '$uid'";
		$q = $conn->query($sql);
		if($q->rowCount() < 1){
			$res = false;
		}else{
			$data = $q->fetch();
			if(password_verify($pwd, $data['pwd'])){
				$res = true;
			}else{
				$res = false;
			}
		}
	}
	if($f){
		$data['active'] = $res;
		return $data;
	}
	return $res;
}