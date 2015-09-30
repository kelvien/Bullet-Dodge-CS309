 <?php
ini_set('display_errors', 1);
error_reporting(~0);
$username = $_SESSION['uname'];
$userProfileQ = $con->query("SELECT Profile.first, Profile.last, Profile.image from Profile where Profile.username = '$username'");
$userProfile = $userProfileQ->fetch_array(MYSQLI_NUM);

$imgid = $con->query("SELECT image FROM Profile WHERE username='$username'");
$img = mysqli_fetch_array($imgid,MYSQLI_NUM)[0];

if(isset($_POST['submit'])){

		$_POST = array_map( 'stripslashes', $_POST);
		
		//collect form data
		extract($_POST);
		//very basic validation
		if($firstnm ==''){
			$error[] = 'First name cannot be blank';
		}

		if($lastnm ==''){
			$error[] = 'Last name cannot be blank';
		}

		if(!isset($error)){

			try {
				//insert into database
				$stmt = $con->query("UPDATE Profile SET first = '$firstnm', last = '$lastnm', image = '$pic' where username = '$usernm'");
				//redirect to index page
				//header('Location: Main_Menu.php');
				header('Location: Profile.php');
				exit;

			} catch(PDOException $e) {
			    echo $e->getMessage();
			}

		}

	}
 ?>

<div class="thumbnail" >
        <img src="<?php echo "/img/profimgs/$img"; ?>"  height="75" width="75">
</div>

<!-- Form for all the profile information -->
<form id="profile" action ='' method='post'>
	<p id="errorMsg">
		<?php
		if(isset($error)){
			foreach($error as $e){
				echo $e.'; ';
			}
		}
		?>
	</p>
	<b>Username: </b> <?php echo $username; ?>
	<br>
	<input type="hidden" id="usernm" name="usernm" value="<?php echo $username; ?>"></input>
	<b>First: </b> <input type="text" id="firstnm" name="firstnm" value="<?php echo $userProfile[0]; ?>"></input>
	<br>
	<b>Last: </b> <input type="text" id="lastnm" name="lastnm" value="<?php echo $userProfile[1]; ?>"></input>
	<br>
	<b>Picture filename: </b> <input type="text" id="pic" name="pic" value="<?php echo $userProfile[2]; ?>"></input>
	<br>
	<!-- button to submit a change in profile information from the form -->
	<!-- <input type="submit" class="btn btn-default" value="Change info"> -->
	<!-- <input type="submit"> -->
	<input type='submit' name='submit' value='Update'></p>
</form>
<!-- button to return to main menu -->
<!-- <button class="btn btn-default" onclick="window.open('/ProfileChange.php','_self')">Change Info</button> -->
<button class="btn btn-default" onclick="window.open('/Main_Menu.php','_self')">Main Menu</button>
<button class="btn btn-default" onclick="window.open('/imgUpload.php','_self')">Upload Image</button>

<?php
	// $tempcon = mysqli_connect('mysql.cs.iastate.edu', 'u30918', 'NZXN5aAvuB', 'db30918');	//get user id for this user
	$userids = $con->query("SELECT userid FROM Users WHERE username = '$username'");
	$userid = mysqli_fetch_array($userids, MYSQLI_NUM)[0];
	//echo "<tr>$userid</tr>";

	//get friends
	$friendsids = $con->query("SELECT userFriends.friendId, Users.username FROM Users Inner Join userFriends ON Users.userid = userFriends.friendId WHERE userFriends.ownerId = '$userid'");

	echo "<h1>Friends: </h1>";
	echo "<table style = 'margin_left:5px' border = '1'>";
	echo "<tr>";
	echo "<th>FriendId</th>";
	echo "<th>FriendName</th>";
	echo "</tr>";
	while($row = mysqli_fetch_row($friendsids)){
		echo"<tr>";
		foreach($row as $cell){
			echo "<td> $cell </td>";
		}
		echo "</tr>";
	}	
?>
