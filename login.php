<?php
session_start();
$username = trim($_POST['username']);
$password = trim($_POST['password']);

login($username, $password);

function login($username, $password){
	$con = mysqli_connect('mysql.cs.iastate.edu','u30918','NZXN5aAvuB','db30918');

	if(!$con){
		//echo "Failed to connect to database" . mysqli_connect_errno();
		echo '<script type="text/javascript">alert("Failed")</script>';
	}
	else{
		$users = mysqli_query($con, "SELECT userid, password FROM Users WHERE username = '$username'");
		$user = mysqli_fetch_array($users);
		//session_start();

		if(!user){
			//header('Location: /index.html');
			echo '<script type="text/javascript">alert("Empty user set")</script>';
		}
		if($user[1] == $password){
			$_SESSION['uname'] = $username;
			$_SESSION['uid'] = $user[0];
			header('Location: /Main_Menu.php');
			//echo "passed";
		}
		else{
			header('Location: /index.html');
			//echo '<script type="text/javascript">alert("bad pass")</script>';
		}
	}
}

?>