<?php

// $_POST = array_map('stripslashes', $_POST);
// extract($_POST);

$img = trim($_POST['img']); //isnt getting anything

$dir = "/var/www/html/img/profimgs/";
$file = $dir . basename($_FILES["img"]["name"]);
$passed = 1;
$filetype = pathinfo($file,PATHINFO_EXTENSION);

if(isset($_POST["submit"])){

	if(file_exists($file)){
		$passed = 0;
	} 

	if($filetype != "jpg" && $filetype != "png" && $filetype != "jpeg" && $filetype != "gif"){
		$passed = 0;
	}

	if($passed == 0){
		echo "Upload failed or was regected";
	}
	else{
		move_uploaded_file($_FILES['img']['tmp_name'], $file);
	}
}
	move_uploaded_file($_FILES["img"]["tmp_name"], $file);
  
	header('Location: /Profile.php');
?>

<!-- $stmt = $con->query("UPDATE Profile SET first = '$firstnm', last = '$lastnm', image = '$pic' where username = '$usernm'"); -->
