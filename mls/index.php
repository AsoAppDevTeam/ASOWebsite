<?php
//leave this alone, it makes detection of proper methods quick and painless
function pr($obj) {
	echo "<pre>\n";
	print_r($obj);
	echo "</pre>\n";
}

function respond ($errorMessage, $object=false) {
	global $dbconnection;
	
	$response=array (
		'error' => (($errorMessage === false) ? '' : $errorMessage),
	);
	@mysql_close($dbconnection);
	exit(json_encode($response));
}

$method=false;
if (isset($_SERVER['REQUEST_METHOD'])) {
	if (($_SERVER['REQUEST_METHOD'] == 'GET') || ($_SERVER['REQUEST_METHOD'] == 'POST'))
		$method=$_SERVER['REQUEST_METHOD'];
}

//we only want this to operate on a post request
if ($method === 'POST') {
	$dbhost='localhost';
	$dbuser='asoplc_mls';
	$dbpassword='@gr3C6rCZo7KJ#t';
	$dbname='asoplc_asoplc';

	$dbconnection=@mysql_connect($dbhost,$dbuser,$dbpassword);
	if ($dbconnection === false)
		respond("Database not available");
	
	if (@mysql_select_db($dbname) === false)
		respond("Database not available(2)");

	$inputs=array (
		'name' => 'a Name',
		'email' => 'an E-Mail Address',
		'phone' => false,
		'survey' => false,
	);
	
	$values='';
	foreach ($inputs as $key => $required) {
		if ($required !== false) {
			if (!isset($_REQUEST[$key]))
				respond("Please specify $required");
			
			if (@empty($_REQUEST[$key]))
				respond("Please specify $required");
				
			if (@strlen($_REQUEST[$key]) < 1)
				respond("Please specify $required");
		}
		
		$order .= (!empty($order) ? ',' : '') . "`$key`";
		$values .= (!empty($values) ? ',' : '') . ("'" . mysql_real_escape_string($_REQUEST[$key]) . "'");
	}
	$order .= (!empty($order) ? ',' : '') . "`date`";
	$values .= (!empty($values) ? ',' : '') . "NOW()";
	
	$query = "insert into mls_pub ($order) values ($values)";
	$result=@mysql_query($query);
	if ($result === false) 
		response("Could not process your request at this time, please try again later");
		
	@mysql_close($dbconnection);
	respond(false);
}

//any other request to this page outside of a POST will receive the normal page;

$title = "ASO MLS Publication - ASO Savings &amp; Loans, PLC";

include('../resources/templates/header.html');
include('../resources/templates/aso-mls-home.html');
include('../resources/templates/footer.html');

?>