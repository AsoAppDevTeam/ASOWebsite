<?php 
header("Content-Type: application/xml; charset=ISO-8859-1");
include('include/sql_select.php');

$row_1 = array();

while($row_2 = mysql_fetch_array($sql_query))

{

$row_1[] = $row_2;

}

$rss = '<?xml version="1.0" encoding="UTF-8"?> 
        <rss version="2.0">
        <channel>
        <ttl>60</ttl> 
        <title>ASO News</title>
		<link>http://www.asoplc.com/pages/media/news.php</link>';

foreach($row_2 as $row_1)
{

$details = '<item>
			<title>'. $row_1["news_title"] .'</title>
			<link>http://www.asoplc.com/pages/media/news.php#news'.$row_1["id"].'</link>
			<pubDate>'.$row_1["date"].'</pubDate>
            <description>'.stripslashes($row_1["pagecontent"]).'</description>
			</item>';

}

$finish = '</channel>
           </rss>';
		   
echo $rss.$details.$finish;

?>