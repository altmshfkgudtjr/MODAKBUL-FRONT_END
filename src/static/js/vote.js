//라벨, 이름, 시간, 제목, 본문, 조회수, 공감수, 댓글, 첨부파일, 사진, 태그
var is_postmodal_open = 0;
var is_postmodal_fixed_open = 0;
var now_postmodal_top = 0;
var is_image_modal_open = 0;
var img_set = ['png', 'jpg', 'jpeg', 'gif', 'bmp'];
var file_path = "../static/files/";
var is_post_modify = 0;
var is_post_property = 0;
function postmodal_open(get_post_id){
	let token = localStorage.getItem('modakbul_token');
	if (token == null){
		snackbar("로그인해주세요.");
		return;
	}
	get_post_info(get_post_id);
	$('#M_menu_button_modify').removeClass('display_none_important');
	$('#M_menu_button_trash').removeClass('display_none_important');
	now_postmodal_top = $(window).scrollTop();
	history.pushState(null, null, "#post");
	is_postmodal_open = 1;
	$('#M_user_post_modal_background').css("height", $(window).height() + 100);
	$('#M_user_post_modal_background').css('position', "fixed");
	$('#M_user_post_modal_background').removeClass('display_none');
	$('#M_user_post_modal_background').removeClass('fadeOut');
	$('#M_user_post_modal_background').addClass('fadeIn');
	$('html, body').css({'overflow': 'hidden'});
	$('html, body').css({'top': now_postmodal_top*-1});
	$('html, body').addClass('M_modal_open_fixed');
	$('#M_user_post_modal_container').removeClass('fadeOutDown');
	$('#M_user_post_modal_container').addClass('fadeInUp');
	$('#M_user_post_modal_container').removeClass('display_none');
	$('#M_user_post_modal_container').css('height', $(window).height() - 70);
}

function postmodal_close(is_secret = null){
	is_postmodal_open = 0;
	image_modal_close();	
	$('#M_menu_button_modify').addClass('display_none_important');
	$('#M_menu_button_trash').addClass('display_none_important');
	$("#M_post_user_comment_input").blur();
	if (is_secret != 1){
		//조회수 증가 A_JAX
		let post_get_id = $('#M_user_post_modal_container').attr('alt').split('_')[1]*1;
		let a_jax2 = A_JAX(TEST_IP+"view_up/"+post_get_id, "GET", null, null);
	}
	history.replaceState(null, null, "#list");
	$('#M_user_post_modal_background').addClass('fadeOut');
	$('#M_user_post_modal_background').removeClass('fadeIn');
	$('#M_user_post_modal_container').addClass("fadeOutDown");
	$('#M_user_post_modal_container').removeClass('fadeInUp');
	setTimeout(function(){
  		$('#M_user_post_modal_container').addClass("display_none");
  		$('#M_user_post_modal_background').addClass('display_none');
  	}, 400);
	$('html, body').removeAttr("style");
	$('html, body').removeClass('M_modal_open_fixed');
	$('html').scrollTop(now_postmodal_top);
	$("#M_post_user_comment_input").val("");
	empty_post_info();
}

// modal 이 외 클릭 시, modal 닫기
$(document).mouseup(function (e) {
	if (is_postmodal_open == 1 && is_image_modal_open == 0){
		var container = $("#M_user_post_modal_container");
		var control_button = $('#ss_menu');
		if (!container.is(e.target) && container.has(e.target).length === 0 && !control_button.is(e.target) && control_button.has(e.target).length === 0 && !$('#M_post_user_comment_container').is(e.target) && $('#M_post_user_comment_container').has(e.target).length === 0){
			postmodal_close();
		}
	}
});

$(document).keydown(function(event){
	if (event.keyCode == 27){
		if (is_image_modal_open == 1){
			image_modal_close();
		}
		else {
			if (is_postmodal_open == 1){
				if ($("#M_post_user_comment_input").is(":focus")){
					$("#M_post_user_comment_input").val("");
    				$("#M_post_user_comment_input").blur();
				} else {
					postmodal_close();
				}
			}
			if (search_bar_value == 1){
				search_bar_value = 0;
				var container = $("#M_search_bar");
				var search_bar = $("#M_search_bar");
				search_bar.removeClass("fadeInDown");
				search_bar.addClass("fadeOutUp");
				setTimeout(function(){search_bar.addClass("display_none")}, 400);
				$("#M_search_input").val("")
			}
		}
	}
});

//포스트 정보 가져오는 함수
function get_post_info(get_post_id) {
	let token = localStorage.getItem('modakbul_token');
	var a_jax = A_JAX(TEST_IP+"get_vote/"+get_post_id, "GET", token, null);
	$.when(a_jax).done(function(){
		var json = a_jax.responseJSON;
		console.log(json);
		if (json['result'] == "success"){
			$('#M_user_post_modal_container').attr('alt', "vote_"+get_post_id);
			$('#M_post_profile_color').css("background-color", "#d8d8d8");
			$('#M_post_author').append(json['vote']['vote_author']);
			$('#M_post_start_date').append(json['vote']['start_date']);
			$('#M_post_end_date').append(json['vote']['end_date']);
			$('#M_post_top_title').append(json['vote']['vote_title']);
			$('#M_post_url_copy').attr('alt', get_post_id);
			$('#M_post_body_icons_data').append(json['vote']['join_cnt']);
			$('#M_post_body').append(json['vote']['vote_content']);
			if (json['file'].length == 0){
				$('#M_vote_picture_container').addClass('display_none');
			} else {
				$('#M_vote_picture').attr('src', "../static/files/"+json['file'][0]['vote_file_path']);
			}
		}
		else {
			snackbar("일시적인 오류로 정보를 가져오지 못하였습니다.");
		}
	});
}

function empty_post_info(){
	$('#M_post_author').empty();
	$('#M_post_start_date').empty();
	$('#M_post_end_date').empty();
	$('#M_post_top_title').empty();
	$('#M_post_body').empty();
	$('#M_post_body_icons_data').empty();
}


// 모바일
var filter = "win16|win32|win64|mac|macintel";
if ( navigator.platform ) { //mobile
	if ( filter.indexOf( navigator.platform.toLowerCase() ) < 0 ) {
		$('#M_post_user_comment_input').focus(function() {
			let mobile_seletor = navigator.platform.toLowerCase();
			//IOS
			if (mobile_seletor.indexOf("iphone")>-1||mobile_seletor.indexOf("ipad")>-1||mobile_seletor.indexOf("ipod")>-1){
				$('#M_user_post_modal_container').animate({scrollTop : $('#M_user_post_modal_container').height() + $('#M_user_post_modal_container').height()/100*68}, 400);
			} else {	//ANDROID
				$('#M_post_user_comment_container').css("position", "fixed");
				$('#M_post_user_comment_container').css("padding", "10px 10px 0px 10px");
			}
		});
		$('#M_post_user_comment_input').blur(function() {
			if (comment_double_check == 1){
				let comment_id = $('#M_post_user_comment_input').attr('alt');
				$('#M_post_user_comment_input').removeAttr("alt");
				comment_double_check = 0;
				$('div[alt=comment_'+comment_id+']').removeAttr('style');
				$('div[alt=comment_'+comment_id+']').removeClass("comment_check");
			}
		});
	} else {	//pc
		$('#M_post_user_comment_input').blur(function(){
			if (comment_double_check == 1){
				let comment_id = $('#M_post_user_comment_input').attr('alt');
				$('#M_post_user_comment_input').removeAttr("alt");
				comment_double_check = 0;
				$('div[alt=comment_'+comment_id+']').removeAttr('style');
				$('div[alt=comment_'+comment_id+']').removeClass("comment_check");
			}
		});
	}
}

function image_modal_open(tag){
	is_image_modal_open = 1;
	let now_src = tag.getAttribute('src');
	$('#M_image_modal_container').attr('src', now_src);
	$('#M_image_modal_background').css('position', "fixed");
	$('#M_image_modal_background').removeClass('display_none');
	$('#M_image_modal_background').removeClass('fadeOut');
	$('#M_image_modal_background').addClass('fadeIn');
	$('html, body').css({'overflow': 'hidden'});
	$('html, body').addClass('M_modal_open_fixed');
}

function image_modal_close(){
	is_image_modal_open = 0;
	$('#M_image_modal_background').addClass('fadeOut');
	$('#M_image_modal_background').removeClass('fadeIn');
	setTimeout(function(){
  		$('#M_image_modal_background').addClass('display_none');
  	}, 400);
	$('html').scrollTop(now_postmodal_top);
}


//클립보드 복사 함수
function clipboardCopy(tag) {
	let post_id = tag.getAttribute('alt');
	var clipboard_textarea = document.createElement('textarea');
	clipboard_textarea.setAttribute('id', 'clipboard_copy');
	clipboard_textarea.value = TEST_IP+"v/"+post_id;
	clipboard_textarea.style.zIndex = "-3000";
	document.body.appendChild(clipboard_textarea);
	clipboard_textarea.select();
	document.execCommand("copy");
	document.getElementById('clipboard_copy').blur();
	snackbar("URL 복사완료!");
	$('textarea').remove('#clipboard_copy');
}

//포스트 작성 함수
function post_write() {
	now_postmodal_top = $(window).scrollTop();
	postmodal_close(1);
	is_postmodal_fixed_open = 1;
	$('#M_user_post_modal_background_fixed').css("height", $(window).height() + 100);
	$('#M_user_post_modal_background_fixed').css('position', "fixed");
	$('#M_user_post_modal_background_fixed').removeClass('display_none');
	$('#M_user_post_modal_background_fixed').removeClass('fadeOut');
	$('#M_user_post_modal_background_fixed').addClass('fadeIn');
	$('html, body').css({'overflow': 'hidden'});
	$('html, body').addClass('M_modal_open_fixed');
	$('#M_user_post_modal_container_fixed').removeClass('fadeOutDown');
	$('#M_user_post_modal_container_fixed').addClass('fadeInUp');
	$('#M_user_post_modal_container_fixed').removeClass('display_none');
}

//포스트 수정 함수
function post_modify() {
	is_post_modify = 1;
	let token = localStorage.getItem('modakbul_token');
	if (token == null){
		snackbar("로그인을 해주세요.");
		post_write_cancel();
		return;
	}
	if (is_post_property == 0){
		snackbar("권한이 없습니다.");
		return;
	}
	now_postmodal_top = $(window).scrollTop();
	let post_id = $('#M_user_post_modal_container').attr('alt').split('_')[1]*1;
	let title = $('#M_post_top_title').text();
	let content = $('#M_post_body').html();
	postmodal_close(1);
	is_post_property = 0;
	is_postmodal_fixed_open = 1;
	$('#M_user_post_modal_container_fixed').attr('alt', "post_"+post_id);
	$('#M_user_post_modal_background_fixed').css("height", $(window).height() + 100);
	$('#M_user_post_modal_background_fixed').css('position', "fixed");
	$('#M_user_post_modal_background_fixed').removeClass('display_none');
	$('#M_user_post_modal_background_fixed').removeClass('fadeOut');
	$('#M_user_post_modal_background_fixed').addClass('fadeIn');
	$('html, body').css({'overflow': 'hidden'});
	$('html, body').addClass('M_modal_open_fixed');
	$('#M_user_post_modal_container_fixed').removeClass('fadeOutDown');
	$('#M_user_post_modal_container_fixed').addClass('fadeInUp');
	$('#M_user_post_modal_container_fixed').removeClass('display_none');
	$('#M_post_fixed_title_input').val(title);
	$('.note-editable').empty();
	$('.note-editable').append(content);
}

//포스트 삭제 함수
function post_delete() {
	let post_id = $('#M_user_post_modal_container').attr('alt').split('_')[1]*1;
	let token = localStorage.getItem('modakbul_token');
	if (token != null){
		let a_jax = A_JAX(TEST_IP+'vote_delete/'+post_id, "GET", token, null);
		$.when(a_jax).done(function(){
			let json = a_jax.responseJSON;
			if (json['result'] == "success"){
				snackbar("설문조사 삭제를 성공하였습니다.");
				postmodal_close(1);
				location.reload();
			} else if (json['result'] == "do not access") {
				snackbar("권한이 없습니다.");
			} else {
				snackbar("설문조사 삭제를 실패하였습니다.");
			}
		});
	} else {
		snackbar("권한이 없습니다.");
	}
}

$(function(){
	$('#files-upload').MultiFile({
		max: 1, //업로드 최대 파일 갯수 (지정하지 않으면 무한대)
		maxsize: 51200,  //전체 파일 최대 업로드 크기
		STRING: { //Multi-lingual support : 메시지 수정 가능
		    toomuch: "업로드할 수 있는 최대크기를 초과하였습니다.", 
		    toomany: "업로드할 수 있는 최대 갯수는 $max개 입니다."
		},
		list:"#files-upload" //파일목록을 출력할 요소 지정가능
	});
});

function post_write_accept() {
	if ($('#M_post_fixed_title_input').val() == ""){
		snackbar("제목을 입력해주세요.");
	}
	let token = localStorage.getItem('modakbul_token');
	let is_anony = 0;
	let content = $('#M_vote_fixed_body_input').html();
	let send_data = new FormData();
	var M_files = document.getElementById('files_upload').files;
	var M_list = [];
	if (is_post_modify == 0) {
		for (var i = 0; i < M_files.length; i++){
			M_list.push(M_files[i]);
		}
		if ($('input:checkbox[id="M_post_user_post_anony"]').is(":checked") == true){
			is_anony = 1;
		}
		send_data.append("title", $('#M_post_fixed_title_input').val());
		send_data.append("content", content);
		if (content.length >= 50000){
			snackbar("작성 범위를 초과하였습니다.")
		}
		send_data.append("anony", is_anony);
		send_data.append("tags", "설문조사");
		for (var i = 0; i< M_files.length; i++){
			send_data.append('files', M_list[i]);
		}
		let a_jax = A_JAX(TEST_IP+"post_upload", "POST", token, send_data);
		$.when(a_jax).done(function(){
			let json = a_jax.responseJSON;
			if (json['result'] == "success"){
				snackbar("설문조사를 성공적으로 업로드하였습니다.");
				post_write_cancel();
				location.reload();
    	  	}
    	  	else if (json['result'] == 'bad request'){
    	  	 	snackbar("설문조사 업로드를 실패하였습니다.");
    	  	}
    	  	else if (json['result'] == 'fail_save_file'){
    	  		snackbar("설문조사 업로드를 실패하였습니다.");
    	  	}
    	  	else if (json['result'] == "wrong_file"){
    	  		snackbar("잘못된 파일 확장자명입니다.");
    	  	}
    	  	else {
    	  		snackbar("설문조사 업로드를 실패하였습니다.");
    	  	}
		});
	} else {
		for (var i = 0; i < M_files.length; i++){
			M_list.push(M_files[i]);
		}
		if ($('input:checkbox[id="M_post_user_post_anony"]').is(":checked") == true){
			is_anony = 1;
		}
		send_data.append("post_id", $('#M_user_post_modal_container_fixed').attr('alt').split('_')[1]*1);
		send_data.append("title", $('#M_post_fixed_title_input').val());
		send_data.append("content", content);
		if (content.length >= 50000){
			snackbar("작성 범위를 초과하였습니다.")
		}
		send_data.append("anony", is_anony);
		for (var i = 0; i< M_files.length; i++){
			send_data.append('files', M_list[i]);
		}
		let a_jax = A_JAX(TEST_IP+"post_update", "POST", token, send_data);
		$.when(a_jax).done(function(){
			let json = a_jax.responseJSON;
			if (json['result'] == "success"){
				snackbar("게실글을 성공적으로 업로드하였습니다.");
				post_write_cancel();
				location.reload();
    	  	}
    	  	else if (json['result'] == 'bad request'){
    	  	 	snackbar("게시글 업로드를 실패하였습니다.");
    	  	}
    	  	else if (json['result'] == 'fail_save_file'){
    	  		snackbar("게시글 업로드를 실패하였습니다.");
    	  	}
    	  	else if (json['result'] == "wrong_file"){
    	  		snackbar("잘못된 파일 확장자명입니다.");
    	  	}
    	  	else {
    	  		snackbar("게시글 업로드를 실패하였습니다.");
    	  	}
		});
	}
}

function post_write_cancel() {
	is_postmodal_fixed_open = 0;
	$('#M_post_fixed_title_input').val("");
	$('#M_file_route').empty();
	$('.note-editable').empty();
	history.replaceState(null, null, "#list");
	$('#M_user_post_modal_background_fixed').addClass('fadeOut');
	$('#M_user_post_modal_background_fixed').removeClass('fadeIn');
	$('#M_user_post_modal_container_fixed').addClass("fadeOutDown");
	$('#M_user_post_modal_container_fixed').removeClass('fadeInUp');
	setTimeout(function(){
  		$('#M_user_post_modal_container_fixed').addClass("display_none");
  		$('#M_user_post_modal_background_fixed').addClass('display_none');
  	}, 400);
	$('html, body').removeAttr("style");
	$('html, body').removeClass('M_modal_open_fixed');
	$('html').scrollTop(now_postmodal_top);
}

/*
//디버그 확인용 코드
for (var value of send_data.values()) {
   	console.log(value); 
}
*/