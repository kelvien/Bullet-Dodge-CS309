<?php

$result = $con->query("SELECT * FROM Users ORDER BY wins DESC");

echo "<h1> Leaderboard </h1>";
echo "<table border = '1'><tr>";
$index = 0;
while($row = mysql_fetch_array($result) && index == 9)
{
	echo "1. <td>".$row['username']."</td> <td>".$row['wins']."</td><br>";
	$index++;
}

echo "</tr>";

while($row = mysqli_fetch_row($result)){
	echo "<tr>";
	foreach($row as $cell){
		echo "<td>$cell</td>";
	}
	echo "</tr>";
}

?>