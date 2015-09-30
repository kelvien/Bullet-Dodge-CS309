<?php
$username = $_SESSION['uname'];
?>

<form id="changeinfo" action="updateProf.php" method="post">
	<b>Username: </b> <?php echo $username ?>
	<br>
	<b>First: </b> <input type="text" id="firstnm" name="firstnm"></input>
	<br>
	<b>Last: </b> <input type="text" id="lastnm" name="lastnm"></input>
	<br>
	<input type="submit">
</form>