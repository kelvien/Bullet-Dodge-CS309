<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
// get user information from the form
// TODO expand values
$testRes = "true";
$username = trim($_POST['username']);
$password = trim($_POST['password']);
$matchpassword = $_POST["matchpassword"];
$firstnm = trim($_POST['firstnm']);
$lastnm = trim($_POST['lastnm']);

// array used to check all the values
// TODO expand values
// TODO add checks for the information
$userinfo = array();
$userinfo[0] = checkUN($username);
$userinfo[1] = isPassOk($password);
$userinfo[2] = checkPass($password,$matchpassword);

for($i=0; $i <count($userinfo); $i++){
	if($userinfo[$i] == false){
		$testRes = "false";
	}
}

if($testRes == "true"){
	// register into the database
	registerDB($username,$password, $firstnm, $lastnm);

	header('Location: /index.php');
}
else{
	echo '<script type="text/javascript">alert("Invalid information")</script>';
	sleep(3);
	header('Location: /register.php');
}

//function to register the user
//function registerDB($username){
function registerDB($username, $password, $firstnm, $lastnm){
	// connect to DB
	//$con = mysqli_connect('mysql.cs.iastate.edu', 'u30918', 'NZXN5aAvuB', 'db30918');
	//check connection
	/*if(!$con){
		//echo "Failed to connect to database";
		echo '<script type="text/javascript">alert("Failed")</script>';
	}*/
	//if connection worked insert values into DB
	//else{
		//TODO 
		//expand the query to include all the needed values
		//echo $username;
	$con = new mysqli('mysql.cs.iastate.edu','u30918','NZXN5aAvuB','db30918');
		$con->query("INSERT INTO Users (username, password, wins) VALUES ('$username', '$password', 0)");
		//mysqli_query($con, "INSERT INTO Users (username, password) 
		//	VALUES ('$username', '$password')");
		$con->query("INSERT INTO Profile (username,first,last) VALUES ('$username', '$firstnm', '$lastnm')");
		//mysqli_query($con, "INSERT INTO Profile (username) VALUES ('$username')");
		//echo "User added to database";
		//echo '<script type="text/javascript">alert("User added")</script>';
		//sleep(5);
		
	//}
}

function checkPass($pass1, $pass2){
	if ($pass1 == $pass2) return true;
	else return false;
}

function isPassOk($pass){
	//used for if password restrictions are added
	return true;
}

// Checks if username is already in the Database
function checkUN($name){
	$con = new mysqli('mysql.cs.iastate.edu','u30918','NZXN5aAvuB','db30918');
	//$tempcon = mysqli_connect('mysql.cs.iastate.edu', 'u30918', 'NZXN5aAvuB', 'db30918');
	$checkun = $con->query("SELECT username FROM Users where username = '$name'");
	//$users = mysqli_query($con,"SELECT username FROM Users where username = '$name'");
	//$user = mysqli_fetch_array($users);
	if($checkun->num_rows > 0) return false;
	else return true;
	//if($username == $user[0]) return false;
}

?>