<?php
	require 'config.php';
	
	$query = "INSERT INTO question (user,title,topic,content, date) VALUES ('{$_POST['user']}','{$_POST['title']}', '{$_POST['topic']}','{$_POST['content']}', NOW())";
	
	mysql_query($query) or die('新增失败！'.mysql_error());

	echo mysql_affected_rows();

	mysql_close();


?>