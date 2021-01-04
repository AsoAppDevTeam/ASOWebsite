<?php 
session_start();

ob_start();

error_reporting  (E_ERROR | E_WARNING | E_PARSE);
$_SESSION['admin_id']="";
$_SESSION['admin_name']="";
session_destroy();
header("Location:index.php");
?>