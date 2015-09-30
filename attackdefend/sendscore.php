<?php 
		$username = $_POST["uname"];
		$cscore = $_POST["cscore"];
		$newscore = floatval($cscore);
		$con = new mysqli('mysql.cs.iastate.edu','u30918','NZXN5aAvuB','db30918');
		 $score = $con->query("SELECT username, wins FROM Users");

		 if ($score->num_rows > 0) {
  //   // output data of each row
   			 while($row = $score->fetch_assoc()) {
      			  if($row["username"] == $username)
      			  {
      			  	$actual = $row["wins"];
       			  }
   			  }
		 }
		 if(floatval($actual) < $newscore)
		 {
		 	$con->query("UPDATE Users SET wins='$newscore' WHERE username='$username'");
		 	$con->query("INSERT INTO Leaderboard (username,score) VALUES ('$username','$newscore')");
		 }

			

		
		$conn->close();

?>