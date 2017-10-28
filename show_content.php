<?php
	require 'config.php';
	
	$query = mysql_query("SELECT (SELECT COUNT(*) FROM comment WHERE questionid=a.id ) AS count, a.id,a.user,a.title,a.topic,a.content,a.date FROM question a ORDER BY a.date DESC LIMIT 0,5") or die('SQL 错误！');
	//a表示question的小名，类似于给一个div定义两个class名一样
	$json = '';
	
	while (!!$row = mysql_fetch_array($query, MYSQL_ASSOC)) {
		foreach ( $row as $key => $value ) {
			$row[$key] = urlencode(str_replace("\n","", $value));
		}
		$json .= urldecode(json_encode($row)).',';
	}
	
	echo '['.substr($json, 0, strlen($json) - 1).']';
	
	mysql_close();



?>