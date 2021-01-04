<?php 
ob_start();
error_reporting(E_ERROR | E_WARNING | E_PARSE);
//session_start();

$localhost_name="localhost";
$user_name="asoplc_news";
$password="admin123";
$database_name="asoplc_news";

//$localhost_name="localhost";
//$user_name="root";
//$password="";
//$database_name="nda";

$con = mysql_connect($localhost_name,$user_name,$password);
if (!$con)
  {
  die('Could not connect: ' . mysql_error());
  }
mysql_select_db($database_name, $con);
$SelQuery_Zone="SELECT * FROM login where intid='1'";
$q1=mysql_query($SelQuery_Zone);
echo mysql_error();
$nt1=mysql_fetch_array($q1);
$admintitle=$nt1['admin'];
$sitename=$nt1['web'];
$siteemail=$nt1['email'];






?>
 