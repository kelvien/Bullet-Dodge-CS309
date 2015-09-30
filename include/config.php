<?php
ob_start();
session_start();

try {
   $con = new mysqli('blurred','blurred','blurred','blurred');
} catch (mysqli_sql_exception $e) {
   header('Location: ./500.php');
   exit;
}

?>