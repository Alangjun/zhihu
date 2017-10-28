<?php
	//sleep(1);
	require 'config.php';
	
	$_sql = mysql_query("SELECT COUNT(*) AS count FROM comment WHERE questionid='{$_POST['questionid']}'");  //统计comment这个表中questionid的个数，并将其命名为count
	$_result = mysql_fetch_array($_sql, MYSQL_ASSOC);
	
	$_pagesize = 2;  //每页显示的评论条数
	$_count = ceil($_result['count'] / $_pagesize);  //判断这么多条数的评论，需要有几页或者说应该需要几次能显示完
	$_page = 1;
	if (!isset($_POST['page'])) {  //判断page是否存在，不存在说明该条内容的评论数少于2条
		$_page = 1;
	} else {  //存在说明该条内容的评论数超过2条
		$_page = $_POST['page'];
		if ($_page > $_count) {
			$_page = $_count;
		}
	}
	
	$_limit = ($_page - 1) * $_pagesize;
	
	
	$query = mysql_query("SELECT ({$_count}) AS count,questionid,comment,user,date FROM comment 
	WHERE questionid='{$_POST['questionid']}' ORDER BY date DESC LIMIT {$_limit},{$_pagesize}") or die('SQL 错误！');
	
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