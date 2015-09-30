<?php
	include("config.php");

	$keyword = $_POST['search'];
	
	if($keyword == ""){
		echo "nothing";
		exit;
	}

	$userid = $_SESSION['uid'];

	$data = array();

	$pendingRequest = $con->query("SELECT Users.username FROM Users, friendRequest where friendRequest.senderId = '$userid' and friendRequest.receiverId = Users.userid and Users.username LIKE '%{$keyword}%'");

	//$users = $con->query("SELECT username FROM Users WHERE username LIKE '%{$keyword}%'");

	while($row = $pendingRequest->fetch_array(MYSQLI_NUM)){
		//array_push($data, $row[0]);
		$data[$row[0]] = array("status" => "pending", "userid" => 0);
	}

	$others = $con->query("SELECT Users.username, Users.userid FROM Users where Users.username LIKE '%{$keyword}%' and Users.userid NOT IN (SELECT receiverId from friendRequest where senderId = '$userid') and Users.userid NOT IN (SELECT Users.userid from Users, userFriends where userFriends.ownerId = '$userid' and userFriends.friendId = Users.userid) AND Users.userid NOT IN (SELECT Users.userid FROM Users, friendRequest WHERE friendRequest.receiverId = '$userid' AND friendRequest.senderId = Users.userid) AND Users.userid != '$userid'");	

	while($row = $others->fetch_array(MYSQLI_NUM)){
		//array_push($data, $row[0]);
		$data[$row[0]] = array("status" => "free", "userid" => $row[1]);
	}

	/*$friends = $con->query("SELECT Users.username from Users, userFriends where userFriends.ownerId = '$userid' and userFriends.friendId = Users.userid");

	while($row = $friends->fetch_array(MYSQLI_NUM)){
		$data[$row[0]] = "friend";
	}*/

	echo json_encode($data);
	exit;    

?>