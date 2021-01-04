<?php
if (session_id() == '') session_start();

require "formfiles/contact-config.php";

$error_message = '';

if (!isset($_POST['submit'])) {

  showForm();

} else { //form submitted

  $error = 0;
  
  if(!empty($_POST['name'])) {
  	$name[2] = clean_var($_POST['name']);
  }
  else {
    $error = 1;
    $name[3] = 'color:#FF0000;';
  }
  
  if(!empty($_POST['email'])) {
  	$email[2] = clean_var($_POST['email']);
  	if (!validEmail($email[2])) {
  	  $error = 1;
  	  $email[3] = 'color:#FF0000;';
  	  $email[4] = '<strong><span style="color:#FF0000;">Invalid email</span></strong>';
	  }
  }
  else {
    $error = 1;
    $email[3] = 'color:#FF0000;';
  }
	
  if(!empty($_POST['phone'])) {
  	$phone[2] = clean_var($_POST['phone']);
  }
	
	if(!empty($_POST['property'])) {
  	$property[2] = clean_var($_POST['property']);
  }
	
	if(!empty($_POST['payment'])) {
  	$payment[2] = clean_var($_POST['payment']);
  }
	
	if(!empty($_POST['location'])) {
  	$location[2] = clean_var($_POST['location']);
  }
	
	if(!empty($_POST['type'])) {
  	$type[2] = clean_var($_POST['type']);
  }
	
	if(!empty($_POST['interest'])) {
  	$interest[2] = clean_var($_POST['interest']);
  }
	
  /*if(!empty($_POST['subject'])) {
  	$subject[2] = clean_var($_POST['subject']);
  	if (function_exists('htmlspecialchars')) $subject[2] = htmlspecialchars($subject[2], ENT_QUOTES);  	
  }
  else {
  	$error = 1;
    $subject[3] = 'color:#FF0000;';
  }  

  if(!empty($_POST['message'])) {
  	$message[2] = clean_var($_POST['message']);
  	if (function_exists('htmlspecialchars')) $message[2] = htmlspecialchars($message[2], ENT_QUOTES);
  }
  else {
    $error = 1;
    $message[3] = 'color:#FF0000;';
  }  */  

  if(empty($_POST['captcha_code'])) {
    $error = 1;
    $code[3] = 'color:#FF0000;';
  } else {
  	include_once "formfiles/contact-securimage.php";
		$securimage = new Securimage();
    $valid = $securimage->check($_POST['captcha_code']);

    if(!$valid) {
      $error = 1;
      $code[3] = 'color:#FF0000;';   
      $code[4] = '<strong><span style="color:#FF0000;">Incorrect code</span></strong>';
    }
  }

  if ($error == 1) {
    $error_message = '<div style="font-weight:bold;font-size:90%;margin-bottom:5px;}">Please correct/enter field(s) in red.</div>';

    showForm();

  } else {
  	
  	if (function_exists('htmlspecialchars_decode')) $phone[2] = htmlspecialchars_decode($phone[2], ENT_QUOTES);
  	if (function_exists('htmlspecialchars_decode')) $message[2] = htmlspecialchars_decode($message[2], ENT_QUOTES);  	
  	
    $body = "$name[0]: $name[2]\r\n\r\n";
    $body .= "$email[0]: $email[2]\r\n\r\n";
		$body .= "$phone[0]: $phone[2]\r\n\r\n";
		$body .= "$property[0]: $property[2]\r\n\r\n";
		$body .= "$payment[0]: $payment[2]\r\n\r\n";
		$body .= "$location[0]: $location[2]\r\n\r\n";
		$body .= "$type[0]: $type[2]\r\n\r\n";
		$body .= "$interest[0]: $interest[2]\r\n\r\n";
    
    if (!$from) $from_value = $email[2];
    else $from_value = $from;
    
    require_once('formfiles/class.phpmailer.php');
    
    $mail = new PHPMailer();
    
    $mail->SetFrom($from_value);  
    $mail->AddReplyTo($email[2]);
    $mail->Subject = "$subject_prefix - $subject[2]";
    $mail->Body = $body;
    $mail->AddAddress($to);
    
    if(!$mail->Send()) {
      echo "Mailer Error: " . $mail->ErrorInfo;
    }
    
    if (!$thank_you_url) {    
      if ($use_header_footer) {
				include $header_file;
				$form_width = '100%';
			}
      echo '<a name="cform"><!--Form--></a>'."\n";
      echo '<div id="formContainer" style="width: '.$form_width.';height: '.$form_height.';text-align: left; vertical-align: top;">'."\n";
      echo $GLOBALS['thank_you_message']."\n";
      echo '</div>'."\n";
      if ($use_header_footer) include $footer_file;
	  }
	  else {
	  	header("Location: $thank_you_url");
	  }
	  
	  session_unset();
    session_destroy();	  
       	
  }

} //else submitted



function showForm()

{
global $name, $email, $phone, $property, $payment, $location, $type, $interest, $code;
global $where_included, $use_header_footer, $header_file, $footer_file;
global $form_width, $form_height, $form_background, $form_border_color, $form_border_width, $form_border_style, $cell_padding, $left_col_width; 	

if ($use_header_footer) {
	include $header_file;
	$form_width = '100%';
}

echo <<<EOD
<a name="cform"><!--Form--></a>
<div id="formContainer" style="width: {$form_width};">
{$GLOBALS['error_message']}
<form method="post" id="cForm" action="{$where_included}#cform">
<table style="width:100%; height:{$form_height}; padding:10px;" id="contactForm">
<tr>
<td colspan="2" style="width:{$full_col_width}; text-align:left; vertical-align:top; padding:{$cell_padding}; font-weight:bold; {$name[3]}"><input class="form-control" type="text" name="{$name[1]}" value="{$name[2]}" id="{$name[1]}" placeholder="Name" required /></td>
</tr>
<tr>
<td colspan="2" style="width:{$full_col_width}; text-align:left; vertical-align:top; padding:{$cell_padding}; font-weight:bold; {$email[3]}"><input class="form-control" type="text" name="{$email[1]}" value="{$email[2]}" id="{$email[1]}" placeholder="Email" required /> {$email[4]}</td>
</tr>
<tr>
<td colspan="2" style="width:{$full_col_width}; text-align:left; vertical-align:top; padding:{$cell_padding}; font-weight:bold; {$phone[3]}"><input class="form-control" type="text" name="{$phone[1]}" value="{$phone[2]}" id="{$phone[1]}" placeholder="Phone Number" /></td>
</tr>
<tr>
<td colspan="2" style="width:{$full_col_width}; text-align:left; vertical-align:top; padding:{$cell_padding}; font-weight:bold; {$property[3]}"><input class="form-control" type="text" name="{$property[1]}" value="{$property[2]}" id="{$property[1]}" placeholder="Property You Are Interested In" /></td>
</tr>
<tr>
<td colspan="2" style="width:{$full_col_width}; text-align:left; vertical-align:top; padding:{$cell_padding}; font-weight:bold; {$payment[3]}"><input class="form-control" type="text" name="{$payment[1]}" value="{$payment[2]}" id="{$payment[1]}" placeholder="Payment Plan" /></td>
</tr>
<tr>
<td colspan="2" style="width:{$full_col_width}; text-align:left; vertical-align:top; padding:{$cell_padding}; font-weight:bold; {$location[3]}"><input class="form-control" type="text" name="{$location[1]}" value="{$location[2]}" id="{$location[1]}" placeholder="Location" /></td>
</tr>
<tr>
<td colspan="2" style="width:{$full_col_width}; text-align:left; vertical-align:top; padding:{$cell_padding}; font-weight:bold; {$type[3]}"><input class="form-control" type="text" name="{$type[1]}" value="{$type[2]}" id="{$type[1]}" placeholder="Property Type" /></td>
</tr>
<tr>
<td colspan="2" style="width:{$full_col_width}; text-align:center; vertical-align:middle; padding:{$cell_padding}; font-weight:bold;">
<div class="contact-title"><p>Please Tick</p></div>
</td>
</tr>
<tr>
<td colspan="2" style="width:{$full_col_width}; text-align:left; vertical-align:top; padding:{$cell_padding}; font-weight:bold;">
<table>
<tr>
<td style="width:60%;">
<label><input type="checkbox" name="interest" value="Studio Apartment" id="interest_0">Studio Apartment</label>
<br>
<label><input type="checkbox" name="interest" value="2 Bedroom Terrace Bungalow" id="interest_1">2 Bedroom Terrace Bungalow</label>
<br>
<label><input type="checkbox" name="interest" value="3 Bedroom Semi Detached Bungalow" id="interest_2">3 Bedroom Semi Detached Bungalow</label>
<br>
<label><input type="checkbox" name="interest" value="2 Bedroom Flat" id="interest_3">2 Bedroom Flat</label>
<br>
<label><input type="checkbox" name="interest" value="3 Bedroom Flat" id="interest_4">3 Bedroom Flat</label>
<br>
<label><input type="checkbox" name="interest" value="3 Bedroom Terrace Dup + BQ" id="interest_5">3 Bedroom Terrace Dup + BQ</label>
<br>
</td>
<td style="width:40%;">
<label>
<input type="checkbox" name="interest" value="value1" id="interest_6">3 Bedroom Flat</label>
<br>
<label><input type="checkbox" name="interest" value="4 Bedroom Terrace Dup + BQ" id="interest_7">4 Bedroom Terrace Dup + BQ</label>
<br>
<label><input type="checkbox" name="interest" value="4 Bedroom Detached Dup + BQ" id="interest_8">4 Bedroom Detached Dup + BQ</label>
<br>
<label><input type="checkbox" name="interest" value="1 Bedroom Apartment" id="interest_9">1 Bedroom Apartment</label>
<br>
<label><input type="checkbox" name="interest" value="2 Bedroom Apartment" id="interest_10">2 Bedroom Apartment</label>
<br>
<label><input type="checkbox" name="interest" value="3 Bedroom Apartment" id="interest_11">3 Bedroom Apartment</label>
<br>
</td>
</tr>
</table>
</tr>
<tr>
<td style="width:{$left_col_width}; text-align:left; vertical-align:top; padding:{$cell_padding};">&nbsp;</td>
<td style="text-align:left; vertical-align:top; padding:{$cell_padding};"><img id="captcha" src="formfiles/contact-securimage_show.php" alt="CAPTCHA Image" /></td>
</tr>
<tr>
<td style="width:{$left_col_width}; text-align:left; vertical-align:top; padding:{$cell_padding}; font-weight:bold; {$code[3]}">{$code[0]}</td>
<td style="text-align:left; vertical-align:top; padding:{$cell_padding};"><input type="text" name="{$code[1]}" size="10" maxlength="5" id="{$code[1]}" /> {$code[4]}
<br /><br />(Please enter the text in the image above. Text is not case sensitive.)<br />
<a href="#" onclick="document.getElementById('captcha').src = 'formfiles/contact-securimage_show.php?' + Math.random(); return false">Click here if you cannot recognize the code.</a>
</td>
</tr>
<tr>
<td colspan="2" style="text-align:left; vertical-align:middle; padding:{$cell_padding}; font-size:90%; font-weight:bold;">All fields are required.</td>
</tr>
<tr>
<td colspan="2" style="text-align: center; vertical-align:middle;"><input type="submit" name="submit" value="Submit" class="button btn-secondary btn_normal caps_normal" id="submit_button" /></td>
</tr>
</table>
</form>
</div>
EOD;

if ($use_header_footer) include $footer_file;
}

function clean_var($variable) {
    $variable = strip_tags(stripslashes(trim(rtrim($variable))));
  return $variable;
}

/**
Email validation function. Thanks to http://www.linuxjournal.com/article/9585
*/
function validEmail($email)
{
   $isValid = true;
   $atIndex = strrpos($email, "@");
   if (is_bool($atIndex) && !$atIndex)
   {
      $isValid = false;
   }
   else
   {
      $domain = substr($email, $atIndex+1);
      $local = substr($email, 0, $atIndex);
      $localLen = strlen($local);
      $domainLen = strlen($domain);
      if ($localLen < 1 || $localLen > 64)
      {
         // local part length exceeded
         $isValid = false;
      }
      else if ($domainLen < 1 || $domainLen > 255)
      {
         // domain part length exceeded
         $isValid = false;
      }
      else if ($local[0] == '.' || $local[$localLen-1] == '.')
      {
         // local part starts or ends with '.'
         $isValid = false;
      }
      else if (preg_match('/\\.\\./', $local))
      {
         // local part has two consecutive dots
         $isValid = false;
      }
      else if (!preg_match('/^[A-Za-z0-9\\-\\.]+$/', $domain))
      {
         // character not valid in domain part
         $isValid = false;
      }
      else if (preg_match('/\\.\\./', $domain))
      {
         // domain part has two consecutive dots
         $isValid = false;
      }
      else if (!preg_match('/^(\\\\.|[A-Za-z0-9!#%&`_=\\/$\'*+?^{}|~.-])+$/', str_replace("\\\\","",$local)))
      {
         // character not valid in local part unless 
         // local part is quoted
         if (!preg_match('/^"(\\\\"|[^"])+"$/',
             str_replace("\\\\","",$local)))
         {
            $isValid = false;
         }
      }
      if ($isValid && function_exists('checkdnsrr'))
      {
      	if (!(checkdnsrr($domain,"MX") || checkdnsrr($domain,"A"))) {
         // domain not found in DNS
         $isValid = false;
       }
      }
   }
   return $isValid;
}


?>