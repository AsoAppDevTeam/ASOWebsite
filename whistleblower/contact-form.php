<?php
if (session_id() == '') session_start();
/*******************************************************************************
*  Title: Easy PHP Contact Form (Captcha Version)
*  Version: 2.1 @ October 17, 2011
*  Author: Vishal P. Rao
*  Website: http://www.easyphpcontactform.com
********************************************************************************
*  COPYRIGHT NOTICE
*  Copyright 2010 Vishal P. Rao. All Rights Reserved.
*
*  This script may be used and modified free of charge by anyone
*  AS LONG AS COPYRIGHT NOTICES AND ALL THE COMMENTS REMAIN INTACT.
*  By using this code you agree to indemnify Vishal P. Rao or 
*  www.easyphpcontactform.com from any liability that might arise from 
*  it's use.
*
*  Selling the code for this program, in part or full, without prior
*  written consent is expressly forbidden.
*
*  Obtain permission before redistributing this software over the Internet
*  or in any other medium. In all cases copyright and header must remain
*  intact. This Copyright is in full effect in any country that has
*  International Trade Agreements with the India
*
*  Removing any of the copyright notices without purchasing a license
*  is illegal! 
*******************************************************************************/

/*******************************************************************************
 *	Script configuration - Refer README.txt
*******************************************************************************/

require "formfiles/contact-config.php";

$error_message = '';

if (!isset($_POST['submit'])) {

  showForm();

} else { //form submitted

  $error = 0;
  
  if(!empty($_POST['doi'])) {
  	$doi[2] = clean_var($_POST['doi']);
  }
  else {
    $error = 1;
    $doi[3] = 'color:#FF0000;';
  }
  
  if(!empty($_POST['group'])) {
  	$group[2] = clean_var($_POST['group']);
  }
  else {
    $error = 1;
    $group[3] = 'color:#FF0000;';
  }
  
  if(!empty($_POST['incident'])) {
  	$incident[2] = clean_var($_POST['incident']);
  }
  else {
    $error = 1;
    $incident[3] = 'color:#FF0000;';
  }
  
  if(!empty($_POST['facts'])) {
  	$facts[2] = clean_var($_POST['facts']);
  }
  else {
    $error = 1;
    $facts[3] = 'color:#FF0000;';
  }
  
  if(!empty($_POST['name'])) {
  	$name[2] = clean_var($_POST['name']);
  }
  //else {
  //  $error = 1;
  //  $name[3] = 'color:#FF0000;';
  //}
  
  if(!empty($_POST['email'])) {
  	$email[2] = clean_var($_POST['email']);
  	if (!validEmail($email[2])) {
  	  $error = 1;
  	  $email[3] = 'color:#FF0000;';
  	  $email[4] = '<strong><span style="color:#FF0000;">Invalid email</span></strong>';
  	  }
  }
  //else {
  //  $error = 1;
  //  $email[3] = 'color:#FF0000;';
  //}
  
  if(!empty($_POST['phone'])) {
  	$phone[2] = clean_var($_POST['phone']);
  	if (function_exists('htmlspecialchars')) $phone[2] = htmlspecialchars($phone[2], ENT_QUOTES);  	
  }
  //else {
  //	$error = 1;
  //  $subject[3] = 'color:#FF0000;';
  //}  

  if(!empty($_POST['message'])) {
  	$message[2] = clean_var($_POST['message']);
  	if (function_exists('htmlspecialchars')) $message[2] = htmlspecialchars($message[2], ENT_QUOTES);
  }
  //else {
  //  $error = 1;
  //  $message[3] = 'color:#FF0000;';
  //}    

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
  	
  	if (function_exists('htmlspecialchars_decode')) $subject[2] = htmlspecialchars_decode($subject[2], ENT_QUOTES);
  	if (function_exists('htmlspecialchars_decode')) $message[2] = htmlspecialchars_decode($message[2], ENT_QUOTES);  	
  	
    $body = "$doi[0]: $doi[2]\r\n\r\n";
	$body .= "$group[0]: $group[2]\r\n\r\n";
	$body .= "$incident[0]: $incident[2]\r\n\r\n";
	$body .= "$facts[0]: $facts[2]\r\n\r\n";
	$body .= "$name[0]: $name[2]\r\n\r\n";
    $body .= "$phone[0]: $phone[2]\r\n\r\n";
	$body .= "$email[0]: $email[2]\r\n\r\n";
    $body .= "$message[0]:\r\n$message[2]\r\n\r\n";
    
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
global $doi, $group, $incident, $facts, $name, $phone, $email, $message, $code;
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
<table style="width:100%; height:{$form_height}; background:{$form_background}; border:{$form_border_width} {$form_border_style} {$form_border_color}; padding:10px;" id="contactForm">
<tr>
<th colspan="2" style="width:100%; text-align:left; vertical-align:top; padding:{$cell_padding}; font-weight:bold;"><h1>Required Information</h1></th>
</tr>
<tr>
<td style="width:{$left_col_width}; text-align:left; vertical-align:top; padding:{$cell_padding}; font-weight:bold; {$doi[3]}"><p style="margin-bottom:5px;"><span class="smlsize">{$doi[0]} *</span><br>
<input type="text" name="{$doi[1]}" value="{$doi[2]}" id="{$doi[1]}" /></p></td>
</tr>
<tr>
<td style="width:{$left_col_width}; text-align:left; vertical-align:top; padding:{$cell_padding}; font-weight:bold; {$group[3]}"><p style="margin-bottom:5px;"><span class="smlsize">{$group[0]} *</span><br>
<input type="text" name="{$group[1]}" value="{$group[2]}" id="{$group[1]}" /></p></td>
</tr>
<tr>
<td style="width:{$left_col_width}; text-align:left; vertical-align:top; padding:{$cell_padding}; font-weight:bold; {$incident[3]}"><p style="margin-bottom:5px;"><span class="smlsize">{$incident[0]} *</span><br>
<input type="text" name="{$incident[1]}" value="{$incident[2]}" id="{$incident[1]}" /></p></td>
</tr>
<tr>
<td style="width:{$left_col_width}; text-align:left; vertical-align:top; padding:{$cell_padding}; font-weight:bold; {$facts[3]}"><p><span class="smlsize">{$facts[0]} *</span><br>
<textarea name="{$facts[1]}" cols="40" rows="6" id="{$facts[1]}">{$facts[2]}</textarea></p></td>
</tr>
<tr>
<th colspan="2" style="width:100%; text-align:left; vertical-align:top; padding:{$cell_padding}; font-weight:bold;"><h1>Optional Information</h1></th>
</tr>
<tr>
<td style="width:{$left_col_width}; text-align:left; vertical-align:top; padding:{$cell_padding}; font-weight:bold; {$name[3]}"><p style="margin-bottom:5px;"><span class="smlsize">{$name[0]}</span><br>
<input type="text" name="{$name[1]}" value="{$name[2]}" id="{$name[1]}" /></p></td>
</tr>
<tr>
<td style="width:{$left_col_width}; text-align:left; vertical-align:top; padding:{$cell_padding}; font-weight:bold; {$phone[3]}"><p style="margin-bottom:5px;"><span class="smlsize">{$phone[0]}</span><br>
<input type="text" name="{$phone[1]}" value="{$phone[2]}" id="{$phone[1]}" /></p></td>
</tr>
<tr>
<td style="width:{$left_col_width}; text-align:left; vertical-align:top; padding:{$cell_padding}; font-weight:bold; {$email[3]}"><p style="margin-bottom:5px;"><span class="smlsize">{$email[0]}</span><br>
<input type="text" name="{$email[1]}" value="{$email[2]}" id="{$email[1]}" /> {$email[4]}</p></td>
</tr>
<tr>
<td style="width:{$left_col_width}; text-align:left; vertical-align:top; padding:{$cell_padding}; font-weight:bold; {$message[3]}"><p style="margin-bottom:5px;"><span class="smlsize">{$message[0]}</span><br>
<textarea name="{$message[1]}" cols="40" rows="6" id="{$message[1]}">{$message[2]}</textarea></p></td>
</tr>
<tr>
<td style="width:{$left_col_width}; text-align:left; vertical-align:top; padding:{$cell_padding};">&nbsp;<br>
<img id="captcha" src="formfiles/contact-securimage_show.php" alt="CAPTCHA Image" /></td>
</tr>
<tr>
<td style="width:{$left_col_width}; text-align:left; vertical-align:top; padding:{$cell_padding}; font-weight:bold; {$code[3]}"><p style="margin-bottom:5px;"><span class="smlsize">{$code[0]}</p>
<input type="text" name="{$code[1]}" size="10" maxlength="5" id="{$code[1]}" /> {$code[4]}
<br><span class="smlsize" style="font-weight:normal;">(Please enter the text in the image above. Text is not case sensitive.)</p>
<a href="#" onclick="document.getElementById('captcha').src = 'formfiles/contact-securimage_show.php?' + Math.random(); return false" class="smlsize">Click here if you cannot recognize the code.</a></span></span><br>
</td>
</tr>
<tr>
<td style="text-align:left; vertical-align:middle; padding:10px"><input type="submit" name="submit" value="Submit" class="btn-primary" id="submit_button" /></td>
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