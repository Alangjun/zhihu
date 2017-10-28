<?php
	sleep(2);
	require 'config.php';
	
	$query = "INSERT INTO zhihu (user,phone,pass,date)  VALUES ('{$_POST['user']}', '{$_POST['phone']}', sha1('{$_POST['pass']}'), NOW())";

	mysql_query($query) or die('新增失败！'.mysql_error());
	
	echo mysql_affected_rows();
	
	mysql_close();
?>