
$(function(){
	
	if($.cookie('user')){
		$('#index-user,#loginout').show();
		$('#reg_a,#login_a').hide();
		$('#index-user').html($.cookie('user'));
	}else{
		$('#index-user,#loginout').hide();
		$('#reg_a,#login_a').show();
	}
	
	$('#ques').resetForm();    //重置表单
	
	$('#loginout').click(function(){   //退出登录	
		$.removeCookie('user');   //移除cookie
		$('#index-user,#loginout').hide();     //隐藏用户及退出按键
		$('#reg_a,#login_a').show();
		
	});
	
	$('#reg_a').click(function(){    //点击注册
		$.cookie('reg-login','reg');
		window.location.href='reg_login.html';	
	});
	$('#login_a').click(function(){  //点击登录
		$.cookie('reg-login','login');		
		window.location.href='reg_login.html';	
	});		
	
	if($.cookie('reg-login')=='reg'){
		Reg();
	}else{
		Login();
	}
	
	$('#main-body .a-reg').click(function(){
		Reg();
	});
	$('#main-body .a-login').click(function(){
		Login();
	});
	
	function Reg(){
		$('#main-body .a-reg').css({
			'color':'#1E90FF',
			'border-bottom':'3px solid #1E90FF'
		});
		$('#main-body .a-login').css({
			'color':'#999',
			'border-bottom':'none'
		});
		$('.form-reg').css('display','block');
		$('.form-login').css('display','none');
	}	
	function Login(){
		$('#main-body .a-reg').css({
			'color':'#999',
			'border-bottom':'none'
		});
		$('#main-body .a-login').css({
			'color':' #1E90FF',
			'border-bottom':'3px solid #1E90FF'
		});
		$('.form-reg').css('display','none');
		$('.form-login').css('display','block');
	}
	
	
	$('#loading').dialog({
		autoOpen:false,
		resizable:false,
		modal:true,
		width:210,
		height:80,
	});
	
	$.ajax({    //提问的内容
		url:'show_content.php',
		type:'POST',
		success:function(response, status, xhr){
			var json=$.parseJSON(response);
			//alert(json);
			var html='';
			var arr=[];
			var summary=[];
			$.each(json,function(index,value){
				html+='<div class="all-content">'+'<span>'+'来自话题：'+value.topic+'</span>'+
				'<div class="user-date"><img src="img/comment_head.png" /><span><strong>'+value.user+'</strong>'+'，发表于'+value.date+'</span></div>'+
				'<h3>'+value.title+'</h3>'+
				'<p class="cnt-p">'+value.content+'</p>'+
				'<div class="content-footer">'+'<ul>'+
						'<li><a href="###" style="background:url(img/zan.png) no-repeat 0px center;" >'+'+5'+'</a></li>'+
						'<li class="cmt-li"><a href="###" style="background:url(img/comment.png) no-repeat 0px center;" class="cmt-number" cnt-id="'+value.id+'">'+value.count+'条评论'+'</a></li>'+
						'<li><a href="###" style="background:url(img/share.png) no-repeat 0px center;">'+'分享'+'</a></li>'+
						'<li><a href="###" style="background:url(img/collect.png) no-repeat 0px center;">'+'收藏'+'</a></li>'+
						'<li><a href="###" style="background:url(img/thanks.png) no-repeat 0px center;">'+'感谢'+'</a></li>'+
						'<li><a href="###"style="font-size:8px; padding-left:0;" >'+'●●●'+'</a></li>'+
				'</ul>'+'</div>'+'</div>';
			});
			$('#main .left-content').append(html);  //将HTML内容添加到#main .left-content中去
			
			$.each($('#main .all-content .cnt-p'),function(index,value){
				arr[index]=$(value).html();   //将每个content的内容存放在arr数组中
				summary[index]=arr[index].substr(0,200);    //将每个内容的前200个字符作为摘要存放在summary数组中				
				if(summary[index].substring(199,200)=='<'){
					summary[index]=replacePos(summary[index],200,' ');
				};
				if(summary[index].substring(198,200)=='</'){
					summary[index]=replacePos(summary[index],200,' ');
					summary[index]=replacePos(summary[index],199,' ');
				};
				if(arr[index].length>200){  //如果内容大于200个字，就在后边添加 显示更多
					summary[index]+='...<span class="down" style="padding-right:20px; cursor:pointer;background:url(img/down.png) no-repeat 65px 14px;">显示全部</span>';
					$(value).html(summary[index]);
				}
			});	

			$.each($('#main .all-content .cnt-p'),function(index,value){
				$(this).on('click','.down',function(){   //显示全部
					$(value).html(arr[index]+'<span class="up" style="padding:0 20px; cursor:pointer;background:url(img/up.png) no-repeat 50px 3px;">收起</span>');
				});
			});
			
			$.each($('#main .all-content .cnt-p'),function(index,value){
				$(this).on('click','.up',function(){   //收起
					$(value).html(summary[index]);
				});
			});
							
			$.each($('#main .all-content .content-footer .cmt-li'),function(index,value){
				$(this).on('click','.cmt-number',function(){   //点击评论条数时
					var cmt_this=this;
					if($.cookie('user')){
						if(!$('#main .content-footer').eq(index).has('.comment_list').length){   //防止重复添加评论框，只有当其不存在时才添加
							$('#main .content-footer').eq(index).append(
								'<div class="comment_list" style="display:none;">'+
									'<div class="cmt-btn-form">'+
										'<form id="cmt">'+
											'<textarea placeholder="添加你的评论内容" name="comment" class="cmt-textarea"  ></textarea>'+
										'</form>'+'<button class="cmt-button">'+'评论'+'</button>'+
									'</div>	'+
									'<div class="all-add-cmt">'+
									'</div>'+
									'<div class="loadmore" style="display:none;">'+'加载更多评论'+'</div>'+
								'</div>'
								);
							$.ajax({    //显示评论
								url:'show_comment.php',
								type:'POST',
								data:{
									questionid:$(cmt_this).attr('cnt-id')   //发送每个问题所对应的id值即questionid
								},
								beforeSend:function(jqXHR,settings){
									
								},
								success:function(response,status){  //response的类型是string
									//alert(response)
									var json_cmt=$.parseJSON(response);
									var count=0;   //判断这么多条数的评论，需要有几页或者说应该需要几次能显示完
									$.each(json_cmt,function(index2,value){
										count=value.count;
										$('#main .content-footer').eq(index).find('.comment_list .all-add-cmt').append(
											'<div class="comment_add">'+
												'<div class="cmt-add-header">'+
													'<img src="img/add_head.png" /><span class="add-user">'+value.user+'</span><span class="add-date">'+value.date+'</span>'+
												'</div>'+
												'<p>'+value.comment+'</p>'+
											'</div>'
										);
									});
									var page=2  //定义一个临时变量，特指评论有几页，用来与服务器返回的评论页数进行判定选择
									if(count>=page){   //如果服务器返回的评论页数不少于2页，就需要显示加载更多
										$('#main .content-footer').eq(index).find('.comment_list .loadmore').show();   //显示加载更多
									}
									$('#main .content-footer').eq(index).find('.comment_list .loadmore').on('click',function(){
										$.ajax({
											url:'show_comment.php',
											type:'POST',
											data:{
												questionid:$(cmt_this).attr('cnt-id'),
												page:page
											},
											beforeSend:function(){
												
											},
											success:function(response,status){
												var  json_cmt_more=$.parseJSON(response);
												$.each(json_cmt_more,function(index3,value){
													$('#main .content-footer').eq(index).find('.comment_list .all-add-cmt').append(
														'<div class="comment_add">'+
															'<div class="cmt-add-header">'+
																'<img src="img/add_head.png" /><span class="add-user">'+value.user+'</span><span class="add-date">'+value.date+'</span>'+
															'</div>'+
															'<p>'+value.comment+'</p>'+
														'</div>'
													);
												});
												page++;
												if(count<page){    //当所有评论显示完后，隐藏加载更多
													$('#main .content-footer').eq(index).find('.comment_list .loadmore').hide();   //显示加载更多
												}
											}
										});
									});
								},
							});	
						}
						if($('#main .content-footer .comment_list').eq(index).is(':hidden')){   //评论隐藏时
							$('#main .content-footer .comment_list').eq(index).show();    //点击显示
						}else{
							$('#main .content-footer .comment_list').eq(index).hide();     //点击隐藏
						}	/*	*/			
						$('#main .all-content .content-footer .comment_list .cmt-textarea').focus(function(){
							$(this).css('border','1px solid #9fadc7');  //获得焦点
						});
						$('#main .all-content .content-footer .comment_list .cmt-textarea').blur(function(){
							$(this).css('border','1px solid #e7eaf1');   //失去焦点
						});
					//存在的问题：只有点完第一个评论后才能点第二个，以此类推
						
						
						$('#main .content-footer .comment_list').eq(index).find('.cmt-button').click(function(){   //点击评论按钮时时
							$.ajax({   //增加评论
								url:'add_comment.php',
								type:'POST',
								data:{
									questionid:$('#main .content-footer').eq(index).find('.cmt-number').attr('cnt-id'),
									user:$.cookie('user'),
									comment:$('#main .all-content .content-footer .comment_list .cmt-textarea').eq(index).val()
								},
								beforeSend:function(formData, jqForm, options){  //注意 如果是ajaxSubmit的话这里是beforeSubmit
									$('#index-loading').dialog('open').css('background','url(img/loading.gif) no-repeat 30px center').css('text-indent','45px').html('正在提交评论...');
									$('#main .content-footer').eq(index).find('.cmt-button').css('background','#ccc').css('border','1px solid #ccc').attr('disabled',true);  //
								},
								success:function(responseText, statusText){
									if(responseText){
										setTimeout(function(){
											$('#index-loading').dialog('open').css('background','url(img/success.gif) no-repeat 45px center').css('text-indent','55px').html('评论成功');
										},1000)
										setTimeout(function(){
											//有一功能未添加：评论后立即显示，及不需要刷新页面
										//	var date=new Date();
											$('#index-loading').dialog('close');
											$('#main .all-content .content-footer .comment_list #cmt').eq(index).resetForm();    //重置表单
											$('#main .content-footer').eq(index).find('.cmt-button').css('background','#0f88eb').css('border','1px solid #0f88eb').attr('disabled',false); //恢复表单提交功能
										//	$('#main .content-footer').eq(index).find('.comment_list').prepend(
										//		'<div class="comment_add">'+
										//			'<div class="cmt-add-header">'+
										//				'<img src="img/add_head.png" /><span class="add-user">'+$.cookie('user')+'</span><span class="add-date">'+date.getFullYear() + '-' + (date.getMonth()+ 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' +date.getMinutes() + ':' + date.getSeconds() +'</span>'+
										//			'</div>'+
										//			'<p>'+$('#main .all-content .content-footer .comment_list .cmt-textarea').eq(index).val()+'</p>'+
										//		'</div>'
										//	);
										},2000)
									};
								},
							});
						});
					}else{
						$('#index-loading').css('background','#FFF url(img/caution.png) no-repeat 15px 23px').dialog('open').html('请登录后再评论...');
						setTimeout(function(){
							$('#index-loading').dialog('close');  //1秒后关闭
						},1000);
					}
				});
			});			
		},
	});
	

	
	$('#reg').validate({
		submitHandler:function(form){  //表单完成所有验证后执行该函数
			//alert('表单已经完成验证');
			$(form).ajaxSubmit({
				url:'reg_user.php',
				type:'POST',
				beforeSubmit:function(formData,jqForm,options){   //提交之前执行该函数
					alert('提交前');
					$('#loading').dialog('open').css('background','url(img/loading.gif) no-repeat 10px center').html('正在注册，请稍后...');     //打开正在注册提示框
					$('#reg').find('.reg-button').css('background','#ccc').attr('disabled', 'enabled');     //禁止提交
				},
				success:function(responseText,statusText){
					if(responseText){    //注册成功后
						$('#reg').find('.reg-button').css('background','#ccc').attr('disabled', 'disabled');     //可以提交
						$('#loading').dialog('open').css('background','url(img/success.gif) no-repeat 45px center').css('text-indent','55px').html('注册成功');			
						$.cookie('user',$('#user').val())	;// 获取注册用户的用户名，并将其赋值给第一个参数reg-user
						setTimeout(function(){
							$('#loading').dialog('open').css('background','url(img/loading.gif) no-repeat 10px center').css('text-indent','30px').html('正在登录，请稍后...');						
						},1000);						
						setTimeout(function(){
							window.location.href='index.html';		
						},2000)		;		
					};
				},
			});
		},
		errorPlacement:function(error,element){
			if(element.is('#user')){     //判断元素是否为#user
				error.appendTo(element.parent().find('.error_warning'));    //将错误存放在.error_warning中
			};
			if(element.is('#phone')){
				error.appendTo(element.parent().find('.error_warning'));
			};
			if(element.is('#pass')){
				error.appendTo(element.parent().find('.error_warning'));
			};
		},
		rules:{
			user:{
				required:true,
				minlength:2,
				remote:{
					url:'has_user',
					type:'POST'
				},
			},
			phone:{
				required:true,
				minlength:11,
			},
			pass:{
				required:true,
				minlength:6,
			},
		},
		messages:{
			user:{
				required:'请填写姓名',
				minlength:'请输入至少2个英文字符',
				remote:'用户名已被注册',
			},
			phone:{
				required:'请填写手机号',
				minlength:'请输入正确的手机号',
			},
			pass:{
				required:'请填写密码',
				minlength:'请输入6-128位的密码',
			},
		}
	});

	
	/**/
	$('.error_warning').click(function(){
		$(this).parent().find('input').focus();   //获取焦点
	});
	$('#reg .text').click(function(){
	});
	
	$('#login').validate({
		submitHandler:function(form){
			$(form).ajaxSubmit({
				url:'login.php',
				type:'POST',
				success:function(responseText,statusText){
				//若密码或用户名输入错误，则responseText返回false,否则返回true
					if(responseText=='false'){
						if($('#login_password').val()==''){   //密码输入为空时
							$('#login_password').parent().find('.error_warning').html('密码不得为空').css('font-weight','bold');
						}else{   //密码输入不为空时，但是不正确时
							$('#login_password').parent().find('.error_warning').html('密码不正确，请重新输入').css('font-weight','bold');
						};
					}else{  //用户名及密码输入正确
						$('#login_password').parent().find('.error_warning').html('');
						$('#loading').dialog('open').css('background','url(img/loading.gif) no-repeat 10px center').css('text-indent','30px').html('正在登录，请稍后...');
						$.cookie('user',$('#login_user').val())	;
						setTimeout(function(){  //延时一秒后跳转index.html页面
							window.location.href='index.html';		
						},1000)		;		
					};
				},
			})
		},
		errorPlacement:function(error,element){
			if(element.is('#login_user')){     //判断元素是否为#user
				error.appendTo(element.parent().find('.error_warning'));    //将错误存放在.error_warning中
			};
		},
		rules:{
			login_user:{    //login_user对应input的name，必须要一致
				required:true,     //是否为必填字段
				remote:{
					url:'login_is_user.php',
					type:'POST'
				},
			},
		},
		messages:{
			login_user:{
				required:'账户不得为空',     //错误提示
				remote:'此用户名不存在',
			},
		}
	});
	
	$('#question').dialog({
		autoOpen:false,
		modal:true,
		width:600,
		height:550,
		show:true,
		hide:true,
	});
	
	$('#question .ques-title').css('border','1px solid #9fadc7');    //初始化quesetion弹窗的问题标题栏的边框颜色
	$('#question textarea').focus(function(){
		$(this).parent().css('border','1px solid #9fadc7');   //获得焦点
	});
	$('#question textarea').blur(function(){    //失去焦点
		$(this).parent().css('border','1px solid #e7eaf1');
	});
	$('#question .close').click(function(){   //点击关闭question弹窗
		$('#question').dialog('close');
		$(document.body).css('overflow-y','auto');  //禁止滚动条
	});
	$('#index-loading').dialog({
		autoOpen:false,
		resizable:false,
		modal:true,
		width:210,
		height:80,
	});
	
	$('#main .left-header .ask').click(function(){   //点击左侧栏上的提问，弹出对话框
		QuestionHasUser();
	});
	$('#header .search .search-button').click(function(){   //点击导航上的提问，弹出对话框
		QuestionHasUser();
	});
	function QuestionHasUser(){
		if(!$.cookie('user')){   //如果用户未登录
			$('#index-loading').css('background','#FFF url(img/caution.png) no-repeat 15px 23px').dialog('open').html('请登录后再提问...');
			setTimeout(function(){
				$('#index-loading').dialog('close');
			},1000);
		}else{
			$('#question').dialog('open');
			$(document.body).css('overflow-y','hidden');  //禁止滚动条
		}
	}
	
	$('#question .ques-button').click(function(){
		/*alert($('#ques .qs-content').val());*/
		$.ajax({
			url:'add_content.php',
			type:'POST',
			data:{
				//dataName:'data'  //其中dataName即是add_content.php 中的$_POST['dataName']的dataName  要一一对应
				user:$.cookie('user'),    //user对应于add_content.php 中的$_POST[]
				title:$('#ques .qs-title').val(),
				topic:$('#ques .qs-topic').val(),
				content:$('#ques .qs-content').val(),
			},
			beforeSend:function(jqXHR,settings){
				$('#index-loading').dialog('open').css('background','url(img/loading.gif) no-repeat 10px center').css('text-indent','30px').html('正在提交，请稍后...');
				$('#question .ques-button').css('background','#ccc').css('border','1px solid #ccc').attr('disabled','disabled');
			},
			success:function(responseText,statusText){
				//发送成功后responseText返回值为1
				setTimeout(function(){
					$('#index-loading').dialog('open').css('background','url(img/success.gif) no-repeat 45px center').css('text-indent','55px').html('提交成功');		 //禁止表单提交	
				},1000);
				setTimeout(function(){
					$('#index-loading').dialog('close');
					$('#question').dialog('close');
					$('#ques').resetForm();    //重置表单
					$(document.body).css('overflow-y','auto');  //禁止滚动条
				},2000);
				setTimeout(function(){
					$('#question .ques-button').css('background','#0f88eb').css('border','1px solid #0f88eb').attr('disabled',false); //恢复表单提交功能
				},3000);
			},
		});
	});
	
	
	
	
	//固定index页面的侧栏
	right_width=($(window).width()-1000)/2;	
	$('#main-content .main-right').css({
		'position':'fixed',
		'top':'62px',
		'right':right_width+'px',
	});	
	$(window).resize(function(){    //浏览器窗口改变时
		right_width=($(window).width()-1000)/2;
		$('#main-content .main-right').css({
			'position':'fixed',
			'top':'62px',
			'right':right_width+'px',
		});
	});
	
	
	
});


function replacePos(strObj,pos,replaceText){   //将字符串strObj的第pos位替换成replaceText
	return strObj.substr(0,pos-1)+replaceText+strObj.substring(pos,strObj.length);
}












