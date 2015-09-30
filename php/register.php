<?php

// get user information from the form
// TODO expand values
$username = $_POST["username"];

// array used to check all the values
// TODO expand values
// TODO add checks for the information
$userinfo = array();
$userinfo[0] = $username;


// register into the database
registerDB($userinfo);

//function to register the user
function registerDB($username){
	// connect to DB
	$con = mysqli_connect("mysql.cs.iastate.edu","u30918","NZXN5aAvuB","db30918");
	//check connection
	if(mysqli_connect_errno()){
		echo "Failed to connect to database";
	}
	//if connection worked insert values into DB
	else{
		//TODO 
		//expand the query to include all the needed values
		mysqli_query($con, "INSERT INTO Users (Username) 
			VALUES ($username)");
	}
}

?>