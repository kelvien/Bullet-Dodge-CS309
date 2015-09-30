<?php
	include("config.php");

	$userid = $_SESSION['uid'];

	$request = $con->query("SELECT username, userid FROM Users, friendRequest WHERE friendRequest.receiverId = '$userid' AND friendRequest.senderId = Users.userid");

	while($row = $request->fetch_array())
	{
	$rows1[] = $row;
	}
	if(count($rows1) > 0){
		echo "<p class='text-center'>Friend request</p>";
		foreach($rows1 as $row){
			echo "<p class='friend_request_button'><a class='label_button' data-receiver='".$row[1]."' data-type='accept'><span class='label label-success'><span class='fa fa-plus'></span> Accept</span></a></p><p class='friend_request'>".$row[0]."</p>";
		}
	}
?>