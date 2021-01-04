<?php
define ('MAX_INSIDEPAGE', 100);

function alphaID($in, $to_num = false, $pad_up = false, $passKey = null) {
  $index = "bcdfghjklmnpqrstvwxyz0123456789BCDFGHJKLMNPQRSTVWXYZ";
  if ($passKey !== null) { 
    for ($n = 0; $n<strlen($index); $n++) {
      $i[] = substr( $index,$n ,1);
    }
 
    $passhash = hash('sha256',$passKey);
    $passhash = (strlen($passhash) < strlen($index)) ? hash('sha512',$passKey) : $passhash;
 
    for ($n=0; $n < strlen($index); $n++) {
      $p[] =  substr($passhash, $n ,1);
    }
 
    array_multisort($p,  SORT_DESC, $i);
    $index = implode($i);
  }
 
  $base  = strlen($index);
 
  if ($to_num) {
    // Digital number  <<--  alphabet letter code
    $in  = strrev($in);
    $out = 0;
    $len = strlen($in) - 1;
    for ($t = 0; $t <= $len; $t++) {
      //$bcpow = bcpow($base, $len - $t);
	  $bcpow = pow($base, $len - $t);
      $out   = $out + strpos($index, substr($in, $t, 1)) * $bcpow;
    }
 
    if (is_numeric($pad_up)) {
      $pad_up--;
      if ($pad_up > 0) {
        $out -= pow($base, $pad_up);
      }
    }
    $out = sprintf('%F', $out);
    $out = substr($out, 0, strpos($out, '.'));
  } else {
    // Digital number  -->>  alphabet letter code
    if (is_numeric($pad_up)) {
      $pad_up--;
      if ($pad_up > 0) {
        $in += pow($base, $pad_up);
      }
    }
 
    $out = "";
    for ($t = floor(log((float)$in, (float)$base)); $t >= 0; $t--) {
      //$bcp = bcpow($base, $t);
	  $bcp = pow($base, $t);
      $a   = floor($in / $bcp) % $base;
      $out = $out . substr($index, $a, 1);
      $in  = $in - ($a * $bcp);
    }
    $out = strrev($out); // reverse
  }
 
  return $out;
}

function genRandomString() {
    $length = 4;
    $characters = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    $string = '';

    for ($p = 0; $p < $length; $p++) {
        $string .= $characters[mt_rand(0, strlen($characters))];
    }

    return $string;
}

function pr($obj) {
	echo "<pre>";
	print_r($obj);
	echo "</pre>";
}

function calcTotal() {
	global $total;
	
	$str='';
	$costs=array('pksilver' => 300000, 'pkgold' => 750000, 'pkdia' => 1500000);		
	$advcosts=array ('InsideFrontCover' => 150000,'InsideBackCover' => 150000,'OutsideBackCover' => 180000,'CenterSpread' => 200000,'InsidePage' => 100000,'none' => 0);
	$total=0;
	$rate=120000;
	
	$waived=false;

	$boothFields=array('dia2ndbooth','gld2ndbooth','slr2ndbooth','free2ndbooth');
	
	foreach ($_POST as $name => $val) {
		if ($name == 'tab') {
			if (isset($costs[$val])) {
				$waived=true;
				$total += $costs[$val];
			}
		}
		
		if (in_array($name, $boothFields) !== false) {
			if ($val != '0')
				$total += $rate;
		}
		
		if ($name == 'advert') {
			if (is_array($val)) {
				foreach ($val as $i => $str) {
					$v=urldecode($str);
					if (isset($advcosts[$v]))
						$total += $advcosts[$v];				
				}
			}
		}		
	}
		
	if ($waived === false)
		$total += $rate;
	
	return ('N' . number_format($total));
}

$dbhost='localhost';
$dbuser='asoplc_exhibit';
$dbpassword='WFKU;z8wwft)';
$dbname='asoplc_exhibition';
$insidePageTotal=0;

	if (isset($_REQUEST['reserved'])) {
		if ($_REQUEST['reserved'] == 1) {
			$dbconnection=@mysql_connect($dbhost,$dbuser,$dbpassword) or die('no db');
			@mysql_select_db($dbname) or die('no schema');

			$res=@mysql_query("select count(*) as insideTotal from reserved where name='InsidePage'");
			if ($res !== false) {
				$info=@mysql_fetch_assoc($res);
				$insidePageTotal=$info['insideTotal'];
			}
			
			$res=@mysql_query("select * from reserved order by name asc");
			$error='';
			$r=array();
			while ($info=@mysql_fetch_assoc($res)) {
				if ($info['name'] == 'InsidePage') {
					if ($insidePageTotal >= MAX_INSIDEPAGE) {
						$r[]=$info['name'];
					}
				} else {
					$r[]=$info['name'];
				}
			}			
			@mysql_close($dbconnection);
			
			header("Cache-Control: no-cache, must-revalidate"); // HTTP/1.1
			Header('Pragma: no-cache');
			header("Expires: Sat, 26 Jul 1997 05:00:00 GMT"); // Date in the past			
			exit (json_encode(array('error' => $error, 'r' => $r)));
		}
	}
  
  
  if ($_SERVER['REQUEST_METHOD'] == 'POST') {
	$dbconnection=@mysql_connect($dbhost,$dbuser,$dbpassword) or die('no db');
	@mysql_select_db($dbname) or die('no schema');
  
	 //start total at 0 for registeration total
	 $total=0;	 
	 $fields=array();
	 
	 //caculate the final total and assign it to the field name for it.
	 $fields['total']=calcTotal();
	 	 
	 //check if we are the exhibition form
	 //leave the order of these in 
	 $possibleVars=array ('username','email','phone','fulladdress','advert','industry','registra','tab','diamondbooths','dia2ndbooth','goldbooths','gld2ndbooth','slrbooths','slr2ndbooth','freebooths','free2ndbooth','vendorcode');
	 $translateFields=array (
		'registra' => 'registration',
		'tab' => 'sponsor'
	 );
	 $booths=array('diamondbooths','dia2ndbooth','goldbooths','gld2ndbooth','slrbooths','slr2ndbooth','freebooths','free2ndbooth');
	 $lookup=array (
		'pkdia' => array ('diamondbooths','dia2ndbooth'),
		'pkgold' => array('goldbooths','gld2ndbooth'),
		'pkno' => array('freebooths','free2ndbooth'),
	 );
	 $reserved='';
	 $insideReserved='';
	 	 
	 //setup response
	 $response=array('error' => true, 'message' => 'Invalid Request');
	 
	 //check the advert posting, since there are multiple possible
	 $advert='';
	 
	 //only get the vars we want
	 $emptyFields=array();
	 $data='';
	 
	 foreach ($possibleVars as $index => $name) {
		$data .= !empty($data) ? "','" : '';
		if ($name == 'advert') {
			if (isset($_POST[$name])) {
				if (is_array($_POST[$name])) {
					$a='';
					foreach ($_POST[$name] as $i => $val) {
						$a .= (!empty($a) ? ',' : '')  . mysql_real_escape_string($val);
					}
					$data .= $a;					
					$fields[$name]=$a;
				} else {
					$fields[$name]=$_POST[$name];
				}
			} else {
				$emptyFields[]=$name;
			}
		} else {
			if (!isset($_POST[$name])) {
				$emptyFields[]=$name;
			} else {
				//do not remove escaping from this!!!
				$data .= mysql_real_escape_string($_POST[$name]);
				$fields[$name]=$_POST[$name];
			}
		}
	 }	
	
	if (!isset($lookup[$_POST['tab']])) {
		$error=true;
		$errorMessage="Could not make a reservation for booth '$val'. Request is missing vital information for valid reservation. Please try again.";
		//echo $errorMessage;
		//this will be checked in the template so it can be presented how and where you want to see it.
		$title = "ASO Exhibition - ASO Savings &amp; Loans, PLC";

		include('../../resources/templates/header3.html');
		include('../../resources/templates/exco-register.html');
		echo "<script type=\"text/javascript\">var registerOk=false;</script>";
		include('../../resources/templates/footer3.html');				
		exit();				
	}
	
	//remove all booth fields that don't pertain to the selection
	$remove=$lookup;
	unset($remove[$fields['tab']]);
	foreach ($remove as $type => $info) {
		foreach ($info as $index => $f) {
			$fields[$f]=0;
		}
	}

	$insidePage=false;
	
	$set=$lookup[$_POST['tab']];
	foreach ($set as $index => $b) {		
		if ($fields[$b] != '0') {
			$reserved .= (!empty($reserved) ? ',' : '') . "'" . mysql_real_escape_string($fields[$b]) . "'";
			$insideReserved .= (!empty($reserved) ? ',' : '') . "'" . mysql_real_escape_string($fields[$b]) . "'";
		}
	}
	
	if (isset($_POST['advert'])) {
		if (!is_array($_POST['advert'])) {
			if ($_POST['advert'] != 'none') {
				if (!empty($_POST['advert'])) {
					if ($_POST['advert'] == 'InsidePage') {
						$insidePage=true;
						$insideReserved .= (!empty($reserved) ? ',' : '') . "'" . mysql_real_escape_string($name) . "'";			
					} else {
						$reserved .= (!empty($reserved) ? ',' : '') . "'" . mysql_real_escape_string($_POST['advert']) . "'";
						$insideReserved .= (!empty($reserved) ? ',' : '') . "'" . mysql_real_escape_string($name) . "'";			
					}
				}
			}
		} else {
			foreach ($_POST['advert'] as $index => $name) {
				if (!empty($name)) {
					if ($name == 'none') continue;
					if ($name == 'InsidePage') {
						$insidePage=true;
						$insideReserved .= (!empty($reserved) ? ',' : '') . "'" . mysql_real_escape_string($name) . "'";			
					} else {
						$reserved .= (!empty($reserved) ? ',' : '') . "'" . mysql_real_escape_string($name) . "'";			
						$insideReserved .= (!empty($reserved) ? ',' : '') . "'" . mysql_real_escape_string($name) . "'";
					}
				}
			}
		}
	}
	
	$ok=false; //assume there will be an error or reservation
	
	//check if insidePage is true, then check reservation count on this
	if ($insidePage === true) {
		$res=@mysql_query("select count(*) as insideTotal from reserved where name='InsidePage'");
		if ($res !== false) {
			$info=@mysql_fetch_assoc($res);
			@mysql_free_result($res);
			if (@$info['insideTotal'] >= MAX_INSIDEPAGE) {
				$error=true;
				$errorMessage="There are no more available Inside Pages for Advertisements available.<br/>Please update your choices below and resubmit the form.";
			}
		}
	}
	
	//check reservations, this is cached by the realtime server
	
	if ($error !== true) {
		$res=@mysql_query("select * from reserved where name in (" . $reserved . ") order by name asc");
		$error='';
		$r=array();
		$count=0;
		while ($info=@mysql_fetch_assoc($res)) {
			$r[]=$info['name'];
			$count++;		
		}
		@mysql_free_result($res);
		
		if ($count > 0) {
			$error=true;
			$errorMessage="The following booth or advertisement location(s) '" . implode(', ', $r) . "' have already been reserved.<br/>Please update your choices below and resubmit the form.";
		} else {
			while (!$ok) {
				$str=genRandomString();
				$id='ASO' . sprintf("%09d", alphaid($str, true));		
				//$s=alphaid($id);
				
				$res=mysql_query("select `id` from `exhibitionForm2013` where id='$id'", $dbconnection);
				if ($res === false) {			
					$errorMessage="The form can't be accepted at this time, please try again";
					break;
				}
					
				if (mysql_num_rows($res) < 1)
					$ok=true;
				
				@mysql_free_result($res);
			}
			$fields['registrationid']=$id;
		}
	}
	
	if ($ok === true) {
		 $make=explode("','", $reserved);
		 foreach ($make as $index => $val) {
			$val=trim(str_replace("'", '', $val));
			if (!empty($val)) {
				$res=mysql_query("INSERT INTO `reserved` (`name`) values('" . mysql_real_escape_string($val) . "')");			
				if ($res === false) {
					$error=true;
					$errorMessage="Could not make a reservation for booth '$val'. Please try again.";
					//echo $errorMessage;
					//this will be checked in the template so it can be presented how and where you want to see it.
					$title = "ASO Exhibition - ASO Savings &amp; Loans, PLC";

					include('../../resources/templates/header3.html');
					include('../../resources/templates/exco-register.html');
					echo "<script type=\"text/javascript\">var registerOk=false;</script>";
					include('../../resources/templates/footer3.html');				
					exit();			
				}
			} else {
				$error=true;
				$errorMessage="Could not create a reservation, booth information seems to be invalid or missing. Please try again.";
				//echo $errorMessage;
				//this will be checked in the template so it can be presented how and where you want to see it.
				$title = "ASO Exhibition - ASO Savings &amp; Loans, PLC";

				include('../../resources/templates/header3.html');
				include('../../resources/templates/exco-register.html');
				echo "<script type=\"text/javascript\">var registerOk=false;</script>";
				include('../../resources/templates/footer3.html');				
				exit();						
			}
		 }
		 
		 if (@mysql_query("INSERT INTO `exhibitionForm2013` (`id`,`username`,`email`,`phone`,`fulladdress`,`advert`,`industry`,`registration`,`sponsor`,`diamondbooths`,`dia2ndbooth`,`goldbooths`,`gld2ndbooth`,`slrbooths`,`slr2ndbooth`,`freebooths`,`free2ndbooth`,`vendorcode`,`total`,`posted`) values('$id','$data','$total',NOW())") === false) {
			$errorMessage="The form can't be accepted at this time, please try again.";
		 } else {
			$error=false;
		 }
		 
		 @mysql_close($dbconnection);		 
		 $error=false;
	 }
	 
		$title = "ASO Exhibition - ASO Savings &amp; Loans, PLC";
		
		if ($error === true) {
			//echo $errorMessage;
			//this will be checked in the template so it can be presented how and where you want to see it.
			  $title = "ASO EXCO Registration - ASO Savings &amp; Loans, PLC";
			  
			  include('../../resources/templates/header3.html');
			  include('../../resources/templates/exco-register.html');
			  echo "<script type=\"text/javascript\">var registerOk=false;</script>";
			  include('../../resources/templates/footer3.html');
			  exit();
		} else {
		include('../../resources/templates/header3.html');		
?>
        <section id="maincontent">
          <menu>
            <div id="menu_holder">
              <ul class="hMenu">
                <li><a href="../">Home</a></li>
                <li><a href="#">Exhibition</a>
                  <ul>
                    <li><a href="../exhibit/">What to Expect</a></li>
                    <li><a href="#">Fees &amp; Rates</a>
                      <ul>
                        <li><a href="../exhibit/booth/">Booth Fees</a></li>
                        <li><a href="../exhibit/advert/">Advertisement Rates</a></li>
                        <li><a href="../exhibit/payment/">Payment Details</a></li>
                      </ul>
                    </li>
                    <li><a href="#">Sponsorship</a>
                      <ul>
                        <li><a href="../exhibit/benefits/">Sponsorship Benefits</a></li>
                        <li><a href="../sponsors/">2013 Sponsors</a></li>
                        <li><a href="../sponsors/2012/">Past Sponsors</a></li>
                      </ul>
                    </li>
                    <li class="first activeTrail"><a href="#">Register Now</a></li>
                    <li><a href="../exhibit/faqs/">F.A.Q's</a></li>
                    <li><a href="#">Exhibition 2012</a>
                      <ul>
                        <li><a href="../exhibit/2012/exhibitors/">Past Exhibitors</a></li>
                        <li><a href="../exhibit/2012/">Event Pictures/Videos</a></li>
                      </ul>
                    </li>
                  </ul>
                </li>
                <li><a href="#">Conference</a>
                  <ul>
                    <li><a href="../conf/">About the Conference</a></li>
                    <li><a href="../sponsors/">2013 Sponsors</a></li>
                    <li><a href="#">Conference Speakers</a>
                      <ul>
                        <li><a href="../conf/speakers/">2013 Conference Speakers</a></li>
                        <li><a href="../conf/speakers/2012/">Past Conference Speakers</a></li>
                      </ul>
                    </li>
                    <li><a href="../conf/faqs/">F.A.Q's</a></li>
                  </ul>
                </li>
                <li><a href="../travel/">Hotel &amp; Travel</a></li>
                <li><a href="../../mail/contactform.php" target="_blank">Contact Us</a></li>
              </ul>
            </div>
            <div class="clearfix"></div>
          </menu>
          <article class="asocontent">
            <div class="exhibitcontent">
			<div class="confirmwrap">
			  <div class="confirmsec">
                <div style="font-size:15px; text-align:center;">
                  <p>Thank you for registering.<br>
                  <span class="smlblk">Please review the information you submitted below.  Also, please take time to review the next steps at the bottom of the page.</span></p>
                </div>
              <div>				
<?php
				$translate=array (
					'registrationid' => 'Registration Number',				
					'total' => 'Registration Total',
					'registra' => 'Registrant',
					'username' => 'Full Name',
					'email' => 'Email',
					'phone' => 'Phone',
					'fulladdress' => 'Full Address',
					'advert' => 'Advert Placement In Event Brochure',
					'industry' => 'Industry',    				
				);

				foreach ($translate as $key => $display){
				  echo "<label class=\"fontgrey bold\" for=\"$key\">$display:</label>\n" .
						 "<span id=\"$key\">{$fields[$key]}</span><br><br>\n";
				}
							
				if (!empty($fields['diamondbooths'])) {
					echo "<label for=\"sponsorship\" class=\"fontgrey bold\">Sponsorship:</label>\n";
					echo "<span id=\"sponsorship\">Diamond Sponsorship</span><br><br>\n";
					echo "<label class=\"fontgrey bold\" for=\"booth\">Booth:</label>\n";
					echo "<span id=\"booth\">" . $fields['diamondbooths'] . (($fields['dia2ndbooth'] != '0') ? (", " . $fields['dia2ndbooth']) : '') . "</span><br/><br/>";				
				}
				if (!empty($fields['goldbooths'])) {
					echo "<label for=\"sponsorship\" class=\"fontgrey bold\">Sponsorship:</label>\n";
					echo "<span id=\"sponsorship\">Gold Sponsorship</span><br><br>\n";
					echo "<label class=\"fontgrey bold\" for=\"booth\">Booth:</label>\n";
					echo "<span id=\"booth\">" . $fields['goldbooths'] . (($fields['gld2ndbooth'] != '0') ? (", " . $fields['gld2ndbooth']) : '') . "</span><br><br>";				
				}
				if (!empty($fields['slrbooths'])) {
					echo "<label for=\"sponsorship\" class=\"fontgrey bold\">Sponsorship:</label>\n";
					echo "<span id=\"sponsorship\">Silver Sponsorship</span><br><br>\n";
					echo "<label class=\"fontgrey bold\" for=\"booth\">Booth:</label>\n";
					echo "<span id=\"booth\">" . $fields['slrbooths'] . (($fields['slr2ndbooth'] != '0') ? (", " . $fields['slr2ndbooth']) : '') . "</span><br><br>";				
				}
				if (!empty($fields['freebooths'])) {
					echo "<label for=\"sponsorship\" class=\"fontgrey bold\">Sponsorship:</label>\n";
					echo "<span id=\"sponsorship\">No Sponsorship</span><br><br>\n";
					echo "<label class=\"fontgrey bold\" for=\"booth\">Booth:</label>\n";
					echo "<span id=\"booth\">" . $fields['freebooths'] . (($fields['free2ndboot'] != '0') ? (", " . $fields['free2ndboot']) : '') . "</span>";				
				}			
	?>
				  <div style="margin-top:-10px;">
                    <br><br>
					<p class="fontred"><b><u>NEXT STEPS:</u></b>
					  <ol class="fontred">
						<li>We will CONTACT YOU to confirm your selections within 24 HOURS.</li>
						<li>Once confirmed, please go to a nearby ASO branch and make payments within <b><u>24 hours</u></b> of our contact (using the registration number provided).<br><br><b><u>Please note</u></b>: We will no longer reserve your booth selection after 24 hours if payments have not been made, and you will be required to register again.</li>
					  </ol>
					</p>
					<p class="fontred" style="text-align:center;">Please make payments to:<br>
					  <b>3rd ASO National Housing Exhibition &amp; Conference<br>ACCOUNT NO: 999011097717037</b><br>
					  or<br>
					  Are you an ASO Customer? <span class="redlink"><a href="https://asotib.asoplc.com/scripts/aso.dll" target="_blank">Pay online with ASO Internet Banking</a></span>
					</p>
				  </div>
				</div>
			  </div>
			<div class="clearfix"></div>
          </div>
		  
          <script type="text/javascript" src="../../scripts/includes/jquery-1.7.1.min.js"></script>
		  <script type="text/javascript" charset="utf-8">
              (function(){
                var tabs =document.getElementById('tabs');
				if (!tabs) return;
                var nav = tabs.getElementsByTagName('input');
                /** Hide all tabs **/
                function hideTabs(){
                  var tab = tabs.getElementsByTagName('div');
                  for(var i=0;i<=nav.length;i++){
                    if(tab[i].className == 'tab'){
                      tab[i].className = tab[i].className + ' hide';
                    }
                  }
                }
          
                /** Show the clicked tab **/
                function showTab(tab){
                  document.getElementById(tab).className = 'tab'
                }
                hideTabs(); /* hide tabs on load */
                /** Add click events **/
                for(var i=0;i<nav.length;i++){
                  nav[i].onclick = function(){
                  hideTabs();
                  showTab(this.className);
                }
              }
            })();
          </script>
          <script type="text/javascript" src="../../../scripts/includes/sliding.form.js"></script>
          <script type="text/javascript">
            function toggleVisibility(controlId){            var control = document.getElementById(controlId);            
                if(control.style.visibility == "visible" || control.style.visibility == "")                 
                  control.style.visibility = "hidden";            else                 
                  control.style.visibility = "visible";
                }
          </script>
          <script type="text/javascript">
              function hideme(controlId){            
                var control = document.getElementById(controlId);            
                if(control.style.visibility == "visible" || control.style.visibility == "")                 
                  control.style.visibility = "hidden";            else                 
                  control.style.visibility = "hidden";
                }
          </script>
          <script type="text/javascript">
              function showme(controlId){            
                var control = document.getElementById(controlId);            
                if(control.style.visibility == "visible" || control.style.visibility == "")                 
                  control.style.visibility = "visible";            else                 
                  control.style.visibility = "visible";
                }
          </script>
          <script type="text/javascript">
            var _gaq = _gaq || [];
            _gaq.push(['_setAccount', 'UA-28605460-1']);
            _gaq.push(['_trackPageview']);
        
            (function() {
              var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
              ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
              var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
             })();
          </script>
        </section>
		<div class="clear"></div>
		<script type="text/javascript">var registerOk=true;</script>
<?php
		
			include('../../resources/templates/footer3.html');
			exit();
		} 
	}
  
  $title = "ASO Exhibition - ASO Savings &amp; Loans, PLC";
  
  include('../../resources/templates/header3.html');
  include('../../resources/templates/exco-register.html');
  echo "<script type=\"text/javascript\">var registerOk=false;</script>";
  include('../../resources/templates/footer3.html');
?>