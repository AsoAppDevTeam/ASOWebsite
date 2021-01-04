<?php

  /*****************************************************
  ** Title........: Form Mail Script Language File (Russian)
  ** Filename.....: language.ru.inc.php
  ** Author.......: Maxim Khropin (a.k.a. Zanon Zealous)
  ** Homepage.....: http://www.stadtaus.com/
  ** Contact......: mailto:info@stadtaus.com
  ** Version......: 1.0
  ** Notes........: Please, make reference to me
  **
  ** Last changed.: 06.04.2004 (the 6th April)
  ** Last change..: 
  *****************************************************/





  $txt = array (

  
                   'txt_attachment'                   => 'Attachment',
                   'txt_content_direction'            => 'Слева на право',
                   'txt_charset'                      => 'windows-1251',
                   'txt_cannot_lock_file'             => 'Не могу закрыть файл: ',
                   'txt_cannot_open_file'             => 'Не могу открыть файл: ',
                   'txt_captcha_note'                 => 'To prevent automated Bots from form spamming, please enter the text you see in the image below in the appropriate input box. Your comment will only be submitted if the strings match. Please ensure that your browser supports and accepts cookies, or your comment cannot be verified correctly.',
                   'txt_captcha_try_again'            => 'You did not enter the correct text displayed in the spam-prevention image box. Please look at the image and enter the values displayed there.',
                   'txt_comment'                      => 'Комментарии',
                   'txt_compare_and'                  => ' and ',
                   'txt_confirm_email'                => 'Confirm E-mail',
                   'txt_email'                        => 'E-mail',
                   'txt_email_syntax'                 => 'Пожалуйста, проверьте почтовые адреса в следующих формах:',
                   'txt_empty_referrer'               => 'Неизвестный отправитель. В целях безопасности эта форма может быть использована только если страница, с которой отправляется форма, является частью этого сайта. Эта ошибка могла возникнуть из-за веб-броузера, файрвола или другой программой, которая прячет адрес отправителя. Извините.',
                   'txt_error_captcha'                => 'Captcha image could not be generated.',
                   'txt_error_user_agent'             => 'User Agent error.',
                   'txt_fill_in'                      => 'Пожалуйста, заполните следующие формы:',
                   'txt_firstname'                    => 'Имя',
                   'txt_ip_address_expiration'        => 'Вы достигли максимального количества писем, которые вы можете отправить с одним и тем же IP-адресом. Это ограничение связано с безопасностью и призвано предотвратить неправильное использование формы. Вы сможете снова воспользоваться формой после того, как заново подключитесь к интернет.',
                   'txt_lastname'                     => 'Фамилия',
                   'txt_mandatory_fields'             => 'Обязательные поля',
                   'txt_no'                           => 'Нет',
                   'txt_popen_error'                  => 'Ошибка функции popen().',
                   'txt_preview'                      => 'Предварительный просмотр',
                   'txt_problems'                     => '<p><strong>Возникли проблеммы?</strong> Документация и инструкции по этому скрипту: <a href="./docu/" target="_blank">./docu/</a></p><p>Получи ответы на свои вопросы <a href="http://www.stadtaus.com/forum/" target="_blank">support forum</a>на сайте <a href="http://www.stadtaus.com/en/" target="_blank">скрипта отправки формы по почте</a>.</p>',
                   'txt_receive_information'          => 'Получить больше информации?',
                   'txt_required_lastname'            => 'Please enter your last name.',
                   'txt_required_email'               => 'Please enter your e-mail address.',
                   'txt_required_subject'             => 'Please enter a subject.',
                   'txt_syntax_email'                 => 'The e-mail format is not correct. Please enter a valid e-mail address.',
                   'txt_salutation'                   => 'Приветствие',
                   'txt_script_name'                  => 'Form Mail Script',
                   'txt_set_off_note'                 => '<b>Пометка:</b> Когда вы закончили конфигурацию скрипта, Вам следует выключить эти системные сообщения, учтановив опцию $show_error_messages в файле index.php в значение off.',
                   'txt_subject'                      => 'Тема',
                   'txt_submit'                       => 'Отправить',
                   'txt_subscribe_newsletter'         => 'Подписаться на рассылку?',
                   'txt_system_message'               => 'Системное сообщение',
                   'txt_thank_you'                    => 'Спасибо.Ваше сообщение отправлено.',
                   'txt_vote'                         => 'Вам нравится скрипт отправки формы по почте?',
                   'txt_wrong_html_template'          => 'HTML страница определенная в конфигурационном файле index.php (<i>$file[\'default_html\']</i>) или в &lt;input type=&quot;hidden&quot; name=&quot;html_template&quot; value=&quot;&quot; /&gt; не существует. Пожалуйста, убедитесь в том, что имя файла написано правильно (имя_файла\) и файл доступен в директории с шаблонами (templates).',
                   'txt_wrong_ip_address'             => 'IP-адрес, который вы используете в данный момент, находится в нашем черном списке. Вы не имеете права использовать эту форму.',
                   'txt_wrong_mail_template'          => 'Почтовый образец (mail_template) определенный в конфигурационном файле index.php (<i>$file[\'default_html\']</i>) или  &lt;input type=&quot;hidden&quot; name=&quot;mail_template&quot; value=&quot;&quot; /&gt; не существует. Пожалуйста, убедитесь в том, что имя файла написано правильно (имя_файла\) и файл доступен в директории с шаблонами (templates).',
                   'txt_wrong_referrer'               => 'Неверный отправитель. В целях безопасности эта форма может быть использована только если страница, с которой отправляется форма, является частью этого сайта.',
                   'txt_wrong_referrer_admin'         => '<br /><br />Заметка для Админа: Пожалуйста, добавьте имя вашего сервера в переменную отправителя в конфигурационном файле index.php',
                   'txt_wrong_template_path'          => 'Путь к директории с шаблонами неверен. Пожалуйста, введите правильный путь в переменную <i>$path[\'templates\']</i> в конфигурационном файле index.php',
                   'txt_yes'                          => 'Да',
                   'txt_your_data'                    => 'Здесь Ваши данные.'



               );



?>