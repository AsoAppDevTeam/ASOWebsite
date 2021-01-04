<?php 

include("../include/session.php");

include("../include/dbconnect.php");

include("../include/constants.php");



if($_SESSION['admin_id']!="")

header("Location:admin.php");



if(isset($_POST['login'])){



$selquery="SELECT * FROM ".LOGIN." where `username`='".$_POST['username']."' and `password`='".$_POST['password']."'";

$runquery=mysql_query($selquery);

echo mysql_error();



	if(mysql_num_rows($runquery)>0)

	{

	$fetch_row=mysql_fetch_array($runquery);

	session_start();

	$_SESSION['admin_id']=$fetch_row['intid'];

	$_SESSION['admin_name']=$fetch_row['name'];

	header("Location:admin.php");

	}

	else

	header("Location:index.php?flag=invalid");

}

?>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">

<html>

<head>

<title><?php echo $admintitle;?></title>

<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1">

<link href="adminstyle/style.css" rel="stylesheet" type="text/css" media="all">

</head>

<script type="text/javascript">

function login_validation(){

if(document.frm_login.username.value=="")

{

alert("Please Enter the Username");

document.frm_login.username.focus();

return false;

}

if(document.frm_login.password.value=="")

{

alert("Please Enter the Password");

document.frm_login.password.focus();

return false;

}

}

</script>

<body>

<table width="100%"  border="0" align="center" cellpadding="0" cellspacing="0">

  <tr>

    <td><?php include("../include/admintop.php");?></td>

  </tr>

  <tr>

    <td><p>&nbsp;</p>

      <p>&nbsp;</p>

      <p>&nbsp;</p>

      <p>&nbsp;</p>      

      <form action="index.php" method="post" name="frm_login" id="frm_login" onSubmit="return login_validation();">

        <table width="20%"  border="0" align="center" cellpadding="0" cellspacing="0"  class="adminhead">

          <tr >

            <td height="26" colspan="2" align="center" class="adminheadtext">Admin Login </td>

          </tr>

          <tr >

            <td height="26" colspan="2" ><table width="100%" border="0" cellpadding="3" cellspacing="3" >

 <?php if($_REQUEST['flag']=="invalid"){?>

          <tr>

            <td colspan="2" class="error"><div align="center">Invalid Login</div></td>

          </tr>

		  <?php }?>

          <tr>

            <td width="41%" class="content"><div align="right">Username</div></td>

            <td width="58%"><input name="username" type="text" class="textbox" id="username"></td>

          </tr>

          <tr>

            <td class="content"><div align="right">Password</div></td>

            <td><input name="password" type="password" class="textbox" id="password"></td>

          </tr>

          <tr>

            <td class="content">&nbsp;</td>

            <td><input name="login" type="submit" class="submitbutton" id="login" value="Login"></td>

          </tr>

</table>

</td>

          </tr>

        </table>

      </form>

      <p>&nbsp;</p>

    <p>&nbsp;</p>

    <p>&nbsp;</p>    <p>&nbsp;</p>

    <p>&nbsp;</p></td>

  </tr>

  <tr>

    <td><?php include("../include/adminbottom.php");?></td>

  </tr>

</table>

</body>

</html>

