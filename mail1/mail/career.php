<?php
          $script_root           = './';

          $referring_server      = 'asoplc.com, www.asoplc.com, amnac.com, www.amnac.com';       // Example: $referring_server = 'example.com, www.example.com';

          $language              = 'en';     // see folder /languages/

          $ip_banlist            = '';

          $ip_address_count      = '0';
          $ip_address_duration   = '48';

          $show_limit_errors     = 'yes';    // (yes, no)

          $log_messages          = 'no';     // (yes, no) -- make folder "temp" writable with: chmod 777 temp

          $text_wrap             = '';

          $show_error_messages   = 'yes';

          $attachment            = 'yes';    // (yes, no) -- make folder "temp" writable with: chmod 777 temp
          $attachment_files      = 'jpg, gif, png, zip, txt, pdf, doc, docx, ppt, tif, bmp, mdb, xls, xlsx, txt, vcf, csv';
          $attachment_size       =  9000000;
          
          $captcha               = 'yes';   // (yes, no) -- make folder "temp" writable with: chmod 777 temp

          $path['logfile']       = $script_root . 'logfile/logfile.txt';
          $path['templates']     = $script_root . 'templates/';

          $file['default_html']  = 'career.tpl.html';
          $file['default_mail']  = 'career.tpl.txt, responder.tpl.txt';
		  

  /*****************************************************
  ** Add further words, text, variables and stuff
  ** that you want to appear in the templates here.
  ** The values are displayed in the HTML output and
  ** the e-mail.
  *****************************************************/
          $add_text = array(
               'txt_name' => 'Name',
			   'txt_dob1' => 'Date',
			   'txt_dob2' => 'Month',
			   'txt_dob3' => 'Year',
			   'txt_sex' => 'Sex (Male/Female)',
			   'txt_state' => 'State',
			   'txt_nationality' => 'Nationality',
			   'txt_status' => 'Marital Status',
			   'txt_religion' => 'Religion',
			   'txt_secondary' => 'Secondary School (WASCE)',
			   'txt_university' => 'University/Polytechnic Attended',
			   'txt_course' => 'Course of Study',
			   'txt_degree' => 'Class of Degree',
			   'txt_qualify' => 'Additional Qualification(s) if any',
			   'txt_years' => 'Years of working Experience (Post NYSC)',
			   'txt_experience' => 'Please list your last 5 employers',
			   'txt_experience1' => '',
			   'txt_experience2' => '',
			   'txt_experience3' => '',
			   'txt_experience4' => '',
			   'txt_experience5' => '',
			   'txt_phone' => 'Phone',
			   'txt_address1' => 'Address',
			   'txt_address2' => '',
			   'txt_city' => 'City/Town',
			   'txt_state1' => 'State Of Origin',
			   'txt_comment2' => 'Additional Comments',
                            );


  /*****************************************************
  ** Do not edit below this line
  *****************************************************/




  /*****************************************************
  ** Send safety signal to included files
  *****************************************************/
          define('IN_SCRIPT', 'true');




  /*****************************************************
  ** Load formmail script code
  *****************************************************/
          include($script_root . 'inc/formmail.inc.php');
          
          echo $f6l_output;




?>