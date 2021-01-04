<?php

include('dbconnect.php');

include('constants.php');

$sql_select = "SELECT * FROM ".CMS." ORDER BY id DESC";

$sql_query = mysql_query($sql_select);

?>