<?php 

include("../include/session.php");

include("../include/dbconnect.php");

include("../include/constants.php");

include("fckeditor/fckeditor.php");



if($_SESSION['admin_id']=="")

header("Location:index.php");



if(isset($_POST['addnews'])){

$pagecontent=addslashes($_POST['pagecontent']);
$news_title=addslashes($_POST['news_title']);

$InsQuery="INSERT INTO ".CMS." (`news_title`, `pagecontent`, `date`) VALUES ('$news_title', '$pagecontent', NOW())";

$ExQuery=mysql_query($InsQuery);

header("Location:view_news.php?flag=addsuc");

}

?>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">

<html>

<head>

<title><?php echo $admintitle;?></title>

<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1">

<link href="adminstyle/style.css" rel="stylesheet" type="text/css" media="all">

<link rel="stylesheet" type="text/css" href="chrometheme/chromestyle.css" />



<script type="text/javascript" src="fckeditor/fckeditor.js"></script> 



	

<script type="text/javascript" src="adminscripts/chrome.js">



/***********************************************

* Chrome CSS Drop Down Menu- (c) Dynamic Drive DHTML code library (www.dynamicdrive.com)

* This notice MUST stay intact for legal use

* Visit Dynamic Drive at http://www.dynamicdrive.com/ for full source code

***********************************************/



</script>

<script type="text/javascript">

function subscriber_validation(){
	var news = document.news.news_title.value;

   if(news == '') {
    alert('Please Enter the News Title');
    return false;
	}
   
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

       

      <form action="" method="post" name="news" id="news" onSubmit="return subscriber_validation();">

        <table width="70%"  border="0" align="center" cellpadding="4" cellspacing="0"  class="adminhead">
          <tr bgcolor="#D8251D"> 
            <td height="26" colspan="2" class="adminheadtext">Add News</td>
          </tr>
          <tr> 
            <td colspan="2" align="center"   class="error" >&nbsp; </td>
          </tr>
          <tr> 
            <td width="30%" align="right" valign="middle" class="content">News 
              Title </td>
            <td width="70%" align="left" valign="top" class="content"><textarea name="news_title" cols="50" rows="5" id="news_title"></textarea></td>
          </tr>
          <tr> 
            <td colspan="2" class="content" align="center"> 
              <?php
		$oFCKeditor = new FCKeditor('pagecontent') ;
		$oFCKeditor->BasePath = "fckeditor/" ;
		$oFCKeditor->Config['SkinPath'] = '../editor/skins/office2003/' ;
		$oFCKeditor ->Height = '500';
		$oFCKeditor ->Width = '850';
		$oFCKeditor->Value = stripslashes($nt1['pagecontent']);
		$oFCKeditor->Create() ;
		?>
            </td>
          </tr>
          <tr> 
            <td colspan="2" align="center" class="content"><input name="addnews" type="submit" class="submitbutton" id="addnews" value="Submit">
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

