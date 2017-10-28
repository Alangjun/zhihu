<?php
	header('Content-Type:text/html; charset=utf-8');
	
	define('DB_HOST', 'localhost');    //服务器名称
	define('DB_USER', 'root');       //登录服务器的用户名
	define('DB_PWD', 'jyl123.');       //登录密码
	define('DB_NAME', 'mypractice');     //数据库名称

	$conn = @mysql_connect(DB_HOST, DB_USER, DB_PWD) or die('数据库链接失败：'.mysql_error());
	
	@mysql_select_db(DB_NAME) or die('数据库错误：'.mysql_error());
	
	@mysql_query('SET NAMES UTF8') or die('字符集错误：'.mysql_error());
	
	//所有编码格式要一致，改为以UTF-8无BOM格式编码
	
?>