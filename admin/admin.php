<?php 

include("../include/session.php");

include("../include/dbconnect.php");

include("../include/constants.php");





if($_SESSION['admin_id']=="")

header("Location:index.php");



if(isset($_POST['adduser1'])){



	

$web=$_POST['web'];

$admin=$_POST['admin'];

$email=$_POST['email'];

$username=$_POST['username'];

$password=$_POST['password'];

$bottom=$_POST['bottom'];

$google=addslashes($_POST['google']);



  $InsQuery="UPDATE ".LOGIN." SET `web` = '$web',`admin` = '$admin',`email` = '$email',`username` = '$username',`password` = '$password',`bottom` = '$bottom',`google` = '$google' where intid='1'";

 $ExQuery=mysql_query($InsQuery);



	

	header("Location:admin.php?pagename=$pagename&flag=suc");

	

}

 $SelQuery_Zone="SELECT * FROM ".LOGIN." where intid='1'";

$q1=mysql_query($SelQuery_Zone);

echo mysql_error();

$nt1=mysql_fetch_array($q1);

?>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">

<html>

<head>

<title><?php echo $admintitle;?></title>

<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1">

<link href="adminstyle/style.css" rel="stylesheet" type="text/css" media="all">

<link rel="stylesheet" type="text/css" href="chrometheme/chromestyle.css" />



<script type="text/javascript" src="adminscripts/chrome.js">



/***********************************************

* Chrome CSS Drop Down Menu- (c) Dynamic Drive DHTML code library (www.dynamicdrive.com)

* This notice MUST stay intact for legal use

* Visit Dynamic Drive at http://www.dynamicdrive.com/ for full source code

***********************************************/



</script>

<script type="text/javascript">

function user_validation(){

//if(document.frm_user.pagename.value=="")

//{

//alert("Please Enter the Page name");

//document.frm_user.pagename.focus();

//return false;

//}

//if(document.frm_user.pagecontent.value=="")

//{

//alert("Please Enter the Page content");

//document.frm_user.pagecontent.focus();

//return false;

//}

}

</script>

<style type="text/css">

<!--

.style1 {

	color: #FF0000;

	font-weight: bold;

	font-size:10px;

}

-->

</style>

</head>



<body>

<table width="100%"  border="0" align="center" cellpadding="0" cellspacing="0">

  <tr>

    <td><?php include("../include/admintop.php");?></td>

  </tr>

    <tr>

    <td><?php include("../include/adminmenu.php");?></td>

  </tr>

  <tr>

    <td><p>&nbsp;</p>

      <p>&nbsp;</p>

       

      <form action="admin.php" method="post" name="frm_user" id="frm_user" onSubmit="return user_validation();">

        <table width="40%"  border="0" align="center" cellpadding="4" cellspacing="0"  class="adminhead">

          <tr bgcolor="#D8251D">

            <td height="26" class="adminheadtext">Site Control Details </td>

          </tr>

          

          

          <?php /*?><tr>

            <td colspan="2" class="content">Menu name 

              <input name="pagename" type="text" id="pagename" value="<?php echo $nt1['pagename'];?>"></td>

          </tr><?php */?>

		  <?php if($_REQUEST['flag']=="suc"){?>

          <tr>

            <td align="center"   class="error" >updated successfully!..</td>

          </tr>

		  <?php }?>

          <tr>

            <td class="content"><table width="100%" border="0" cellpadding="4" cellspacing="5">

              <tr>

                <td align="right">Website Name </td>

                <td><input name="web" type="text" id="web" value="<?php echo $nt1['web'];?>"></td>

              </tr>

              <tr>

                <td align="right">Admin Panel Name </td>

                <td><input name="admin" type="text" id="admin" value="<?php echo $nt1['admin'];?>"></td>

              </tr>

              <tr>

                <td align="right">E-mail address </td>

                <td><input name="email" type="text" id="email" value="<?php echo $nt1['email'];?>"></td>

              </tr>

             <?php /*?> <tr>

                <td align="right">Bottom Content </td>

                <td>&nbsp;</td>

              </tr>

              <tr>

                <td colspan="2" align="left"><textarea name="bottom" cols="70" rows="10" id="bottom"><?php echo $nt1['bottom'];?></textarea></td>

                </tr><?php */?>

              <tr>

                <td align="right">Username</td>

                <td><input name="username" type="text" id="username" value="<?php echo $nt1['username'];?>"></td>

              </tr>

              <tr>

                <td align="right">Password</td>

                <td><input name="password" type="text" id="password" value="<?php echo $nt1['password'];?>"></td>

              </tr>

       

      

            </table></td>

          </tr>

          <tr>

            <td align="center" class="content"><input name="adduser1" type="submit" class="submitbutton" id="adduser1" value="Submit"></td>

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

