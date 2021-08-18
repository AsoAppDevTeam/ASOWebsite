<?php
          $script_root           = './';

          $referring_server      = 'asoplc.com, www.asoplc.com';       // Example: $referring_server = 'example.com, www.example.com';

          $language              = 'en';     // see folder /languages/

          $ip_banlist            = '';

          $ip_address_count      = '0';
          $ip_address_duration   = '48';

          $show_limit_errors     = 'yes';    // (yes, no)

          $log_messages          = 'no';     // (yes, no) -- make folder "temp" writable with: chmod 777 temp

          $text_wrap             = '72';

          $show_error_messages   = 'yes';

          $attachment            = 'yes';    // (yes, no) -- make folder "temp" writable with: chmod 777 temp
          $attachment_files      = 'jpg, gif, png, zip, txt, pdf, doc, docx, ppt, tif, bmp, mdb, xls, txt, vcf, csv';
          $attachment_size       =  9000000;
          
          $captcha               = 'yes';   // (yes, no) -- make folder "temp" writable with: chmod 777 temp

          $path['logfile']       = $script_root . 'logfile/logfile.txt';
          $path['templates']     = $script_root . 'templates/';

          $file['default_html']  = 'contactus.tpl.html';
          $file['default_mail']  = 'contactus.tpl.txt';




  /*****************************************************
  ** Add further words, text, variables and stuff
  ** that you want to appear in the templates here.
  ** The values are displayed in the HTML output and
  ** the e-mail.
  *****************************************************/
          $add_text = array(
							  'txt_subscribe' => 'Keep me updated about ASO Property Listings.',
							  'txt_qualify' => 'What position are you applying for:',
                            );




  /*****************************************************
  ** Do not edit below this line - Ende der Einstellungen
  *****************************************************/














  /*****************************************************
  ** Send safety signal to included files
  *****************************************************/
          define('IN_SCRIPT', 'true');




  /*****************************************************
  ** Load formmail script code
  *****************************************************/
          include('inc/formmail.inc.php');
          
          echo $f6l_output;




?>