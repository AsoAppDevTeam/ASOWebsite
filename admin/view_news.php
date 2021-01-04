<?php 
include("../include/session.php");
include("../include/dbconnect.php");
include("../include/constants.php");
include("../include/paging.php");

if($_SESSION['admin_id']=="")
header("Location:index.php");


if($_REQUEST['fun']=="del"){
$id=$_REQUEST['id'];

$SelQuery_Zone="DELETE FROM ".CMS." where id='$id'" ;
$q2=mysql_query($SelQuery_Zone);
header("Location:view_news.php?flag=delsuc");
}
	$Q_Check	= "SELECT * FROM ".CMS." ORDER BY id  desc";
	$R_Check	= mysql_query($Q_Check) or die(mysql_error());
	$C_Check	= mysql_num_rows($R_Check);
	$total		= mysql_num_rows($R_Check);	
	
	$page = $_GET['page']; 
	$limit = $admin_paging_value; 

	$pager  = getPagerData($total, $limit, $page); 
	$offset = $pager->offset; 
	$limit  = $pager->limit; 
	$page   = $pager->page; 
	
$SelQuery_Zone="SELECT * FROM ".CMS." ORDER BY id  desc limit $offset, $limit";
$q1=mysql_query($SelQuery_Zone);
//echo mysql_error();
?>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<title><?php echo $admintitle;?></title>
<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1">
<link href="adminstyle/style.css" rel="stylesheet" type="text/css" media="all">
<link rel="stylesheet" type="text/css" href="chrometheme/chromestyle.css" />
<script type="text/javascript" src="adminscripts/chrome.js"></script>
<script type="text/javascript" src="../fckeditor/fckeditor.js"></script> 
<script type="text/javascript" src="chromejs/chrome.js">

/***********************************************
* Chrome CSS Drop Down Menu- (c) Dynamic Drive DHTML code library (www.dynamicdrive.com)
* This notice MUST stay intact for legal use
* Visit Dynamic Drive at http://www.dynamicdrive.com/ for full source code
***********************************************/

</script>
<style type="text/css">
<!--
.error_photo {
	color: #FF0000;
	font-weight: bold;
	font-size:10px;
}
-->
</style>
<script type="text/javascript">
function calldel(m)
{
  if(!confirm(m))
  {
    return false;
  }
  else
  return true;
}

</script>
</head>

<body  onLoad="set_interval()" onmousemove="reset_interval()" onclick="reset_interval()" onkeypress="reset_interval()" onscroll="reset_interval()">
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
       
       
      <table width="60%"  border="0" align="center" cellpadding="4" cellspacing="0"  class="adminhead">
        <tr bgcolor="#D8251D"> 
          <td height="26" colspan="4" class="adminheadtext">View News Details</td>
        </tr>
        <?php if($_REQUEST['flag']=="delsuc"){?>
        <tr> 
          <td colspan="5" class="error"><div align="center">Deleted Successfully!.. 
            </div></td>
        </tr>
        <?php }?>
        <?php if($_REQUEST['flag']=="addsuc"){?>
        <tr> 
          <td colspan="5" class="error"><div align="center">News Added Successfully!.. 
            </div></td>
        </tr>
        <?php }?>
        <?php if($_REQUEST['flag']=="editsuc"){?>
        <tr> 
          <td colspan="5" class="error"><div align="center" >News Details Edited 
              Successfully!.. </div></td>
        </tr>
        <?php }?>
        <?php if($total==0){?>
        <tr> 
          <td colspan="5" class="error"><div align="center">News Details is empty!.. 
            </div></td>
        </tr>
        <?php }else{?>
        <tr> 
          <td align="left" class="content"> <div align="left"><strong>News Title 
              </strong></div>
            <strong> </strong></td>
          <td width="10%" class="content"><strong>Edit</strong></td>
          <td width="10%"><div align="center" class="content"><strong>Delete </strong></div></td>
        </tr>
        <?php $i=$offset;$temp="";while($nt1=mysql_fetch_array($q1)){$i++;

?>
        <tr> 
          <td align="left" valign="top" class="content"><?php echo stripslashes($nt1['news_title']); ?></td>
          <td valign="top"><a href="edit_news.php?id=<?php echo $nt1['id'];?>&do=gallery"><img src="edit.gif" width="20" height="20" border="0"></a></td>
          <td valign="top"><div align="center"><a href="view_events.php?id=<?php echo $nt1['id'];?>&fun=del" onclick="return calldel('Do you want to delete this Picture')"><img src="delete1.gif" border="0" /></a></div></td>
        </tr>
        <?php }}?>
        <tr> 
          <td colspan="3" align="right" class="content"> 
            <?php 					
					if($limit < $total)
					{
							if ($page == 1)
							{
								echo ""; 
							}
							else 
							{       ?>
            <a href="view_news.php?page=<?php echo ($page - 1);?>">pre</a> 
            <?php					}
							for ($i = 1; $i <= $pager->numPages; $i++) 
							{ 
								echo " | "; 
								if ($i == $pager->page)
								{ 
									echo "<span class='Hint1'>"."$i"."</span>"; 
								}
								else
								{	 ?>
            <a href="view_news.php?page=<?php echo $i;?>"><?php echo $i;?></a> 
            <?php					}
							} 
					 
							if ($i > 1)
							{
								echo " | "; 
							}
					  
							if ($page == $pager->numPages) 
							{
								echo "";
							} 
							else   
							{     
							?>
            <a href="view_news.php?page=<?php echo ($page + 1);?>">next</a> 
            <?php }
					}		
					?>
          </td>
        </tr>
      </table>
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