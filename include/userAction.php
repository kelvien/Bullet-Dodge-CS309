<?php
	include("config.php");

	$receiver= $_POST['receiver'];
	$type = $_POST['type'];
	
	if($type == "" || $receiver == ""){
		echo "error";
		exit;
	}

	if($type != "accept" && $type != "request"){
		echo "error";
		exit;
	}

	$userid = $_SESSION['uid'];

	switch($type){
		case "accept": 
			$con->query("DELETE FROM friendRequest WHERE receiverId = '$userid' AND senderId = '$receiver'");
			$con->query("INSERT INTO userFriends (ownerId, friendId) VALUES('$userid', '$receiver')");
			$con->query("INSERT INTO userFriends (ownerId, friendId) VALUES('$receiver', '$userid')");
			echo "success";
			break;
		case "request": 
			$con->query("INSERT INTO friendRequest (senderId, receiverId) VALUES('$userid', '$receiver')");
			echo "success";
			break;
		default:
			echo "error";
			break;
	}

?>