CREATE TABLE tblamina
(
input_ID int(10) unsigned NOT NULL AUTO_INCREMENT,
property varchar(255) NOT NULL DEFAULT ' ',
name varchar(255) NOT NULL DEFAULT ' ',
email varchar(255) NOT NULL DEFAULT ' ',
phone varchar(255) NOT NULL DEFAULT ' ',
twitter varchar(255) NOT NULL DEFAULT ' ',
state varchar(255) NOT NULL DEFAULT ' ',
house_type varchar(255) NOT NULL DEFAULT ' ',
learnt_about_aso varchar(255) NOT NULL DEFAULT ' ',
data_insert timestamp NOT NULL,
PRIMARY KEY (input_ID),
INDEX (name),
INDEX (email)
) CHARACTER SET utf8 COLLATE utf8_unicode_ci;
