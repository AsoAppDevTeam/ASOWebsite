  xc <?php

$con = mysqli_connect("localhost", "asoplc_prop", "ScubaGooMusterFalls20"); //db host, user and password

if(!isset($_POST['submit']))
exit();

if(!$con)
{
	die('Could not connect: ' .mysqli_error());
}

mysqli_select_db($con,"asoplc_karsana"); //database


//== basic defence start

if(stripos($_POST['property'], 'php') !== FALSE)
exit();
if(stripos($_POST['name'], 'php') !== FALSE)
exit();
if(stripos($_POST['email'], 'php') !== FALSE)
exit();
if(stripos($_POST['phone'], 'php') !== FALSE)
exit();
if(stripos($_POST['twitter'], 'php') !== FALSE)
exit();
if(stripos($_POST['state'], 'php') !== FALSE)
exit();
if(stripos($_POST['housetype'], 'php') !== FALSE)
exit();
if(stripos($_POST['learnt_about_aso'], 'php') !== FALSE)
exit();
if(stripos($_POST['other'], 'php') !== FALSE)
exit();


if(stripos($_POST['property'], '%') !== FALSE)
exit();
if(stripos($_POST['name'], '%') !== FALSE)
exit();
if(stripos($_POST['email'], '%') !== FALSE)
exit();
if(stripos($_POST['phone'], '%') !== FALSE)
exit();
if(stripos($_POST['twitter'], '%') !== FALSE)
exit();
if(stripos($_POST['state'], '%') !== FALSE)
exit();
if(stripos($_POST['housetype'], '%') !== FALSE)
exit();
if(stripos($_POST['learnt_about_aso'], '%') !== FALSE)
exit();
if(stripos($_POST['other'], '%') !== FALSE)
exit();
//=== basic defence end


//post data
$v_property = trim($_POST['property']);
$v_name = trim($_POST['name']);
$v_email = trim($_POST['email']);
$v_phone = trim($_POST['phone']);
$v_twitter = trim($_POST['twitter']);
$v_state = trim($_POST['state']);
$v_housetype = trim($_POST['housetype']);
$v_learntaboutaso = trim($_POST['learnt_about_aso']);

if($v_learntaboutaso == 'Others (Please specify)')
$v_learntaboutaso = trim($_POST['other']);


	$data_insert = mysqli_query ($con,"INSERT INTO tblkarsanaproject (property,name,email,phone,twitter,state,house_type,learnt_about_aso) 
	VALUES ('$v_property','$v_name','$v_email','$v_phone','$v_twitter','$v_state','$v_housetype','$v_learntaboutaso')")
or die(mysqli_error());


//change it to your "Thank You" page URL
header('Location: http://www.asoplc.com/karsanaproject/thankyou.php');


?>