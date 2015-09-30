<?php

// $testRes = "true";
$username = $_SESSION['uname'];
// $usernm = trim($_POST['usernm']);
$firstname = trim($_POST['firstnm']);
$lastname = trim($_POST['lastnm']);

//$con = mysqli_connect('mysql.cs.iastate.edu','u30918','NZXN5aAvuB','db30918');

// Call all the update functions
updateFirst($firstname,$username);
updateLast($lastname,$username);
//mysqli_query($con,"UPDATE Profile SET first='$firstname' WHERE username = '$username'");

header('Location: /Profile.php');

// Functions for updating the information

function updateFirst($first,$name){
	$tempcon = mysqli_connect('mysql.cs.iastate.edu', 'u30918', 'NZXN5aAvuB', 'db30918');
	mysqli_query($tempcon,"UPDATE Profile SET first='$first' WHERE username ='$name'");
	//$sql = "UPDATE Profile SET first='$first' WHERE username='$name'";
	//$tempcon->query($sql);
}

function updateLast($last,$name){
	$tempcon = mysqli_connect('mysql.cs.iastate.edu', 'u30918', 'NZXN5aAvuB', 'db30918');
	mysqli_query($tempcon,"UPDATE Profile SET last='$last' WHERE username='$name'");
}

?>