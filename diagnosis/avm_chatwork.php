<?php 

//=======================================================================================
//	avm_common_chatwork.php
//	chatwork共通ルーチン
//	Copyright	Activation Marketing Co.Ltd, Keiju Minowa, Kunie Inukai
//	E-Mail kminowa@avm.co.jp
//	new	K.Minowa 2014.12.25 Ver0.1	開発開始
//	ref
//=======================================================================================
//	文字コードの扱い
//	表示部⇒sjis/uft-8	ロジック部,DB部⇒utf-8
//	このファイルのみ、先頭で読み込まれるため表示部として扱う
//=======================================================================================
/**
 * chatworkへの通知
 *
 * @param unknown $CD
 * @param unknown $EMOJI
 * @param unknown $multi_mode	0:各ユーザー系引数を変数と見なす 1:各ユーザー系引数を配列と見なす
 * @param unknown $room_id
 * @param unknown $subject
 * @param unknown $msg
 * @param unknown $account_id
 * @param unknown $account_name
 */
function avm_chatwork_alert($room_id,$subject,$msg,$account_id) {
//	avm_debug2($CD,__FUNCTION__,__LINE__,'start',$multi_mode);
//	avm_debug2($CD,__FUNCTION__,__LINE__,'room_id',print_r($room_id,1));
//	avm_debug2($CD,__FUNCTION__,__LINE__,'account_id',print_r($account_id,1));
//	avm_debug2($CD,__FUNCTION__,__LINE__,'account_name',print_r($account_name,1));

	$room_id = preg_replace("/[\r\n\s\t]/",'',$room_id);


	if ($room_id == '' || $room_id == 0 || $msg == ''){
		return;
	}

	if ($subject != ''){
		$body = '[info][title]' . $subject . '[/title]' . $msg . '[/info]';
	}
	else{
		$body = '[info]' . $msg . '[/info]';
	}

	if (isset($account_id)){
		$user_cnt = count($account_id);
	}
	else{
		$user_cnt = 0;
	}
	$body_to = '';
	//avm_debug2($CD,__FUNCTION__,__LINE__,'user_cnt',$user_cnt);

	$account_keys = array_keys($account_id);
		
	for ($itmp=0;$itmp<$user_cnt;$itmp++){
		$account_id_one = $account_keys[$itmp];	
		$account_name_one = $account_id[$account_id_one];
			
		if ($account_id_one > 0){
			if ($body_to != ''){
				$body_to .= ', ';
			}
			$body_to .= '[To:' . $account_id_one . ']' . $account_name_one . "さん";
		}
	}



	if ($body_to != ''){
		$body = $body_to . $body;
	}

	//charworkのend point
	$end_point_url = 'https://api.chatwork.com/v2/';
	$url = $end_point_url . 'rooms/' . $room_id . '/messages';
	$option = array('body' => $body);
	$charwork_token = array(
		'X-ChatWorkToken: 8c457096aa56b757a6e379e0586432d0'
	);
	//avm_debug2($CD,__FUNCTION__,__LINE__,'charwork_token',$CD['charwork_token']);

	//avm_debug2($CD,__FUNCTION__,__LINE__,'url',$url);
	//avm_debug2($CD,__FUNCTION__,__LINE__,'option',print_r($option,1));

	$ch = curl_init();
	curl_setopt($ch, CURLOPT_URL, $url);
	curl_setopt($ch, CURLOPT_HTTPHEADER, $charwork_token);
	curl_setopt($ch, CURLOPT_POST, 1);
	curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($option, '', '&'));
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
	$response = curl_exec($ch);
	curl_close($ch);

	//avm_debug2($CD,__FUNCTION__,__LINE__,'response',$response);

}
//=======================================================================================
/**
 * chatwork通知(通知ルーム)
 **/
function avm_chatwork_alert_room($cw_subject,$cw_body){
	//avm_debug2($CD,__FUNCTION__,__LINE__,'start','');

	$account_id = array();
		
	$account_id['578592'] = '箕輪';
/**
$account_id['831621'] = '嵯峨';
	$account_id['1185378'] = '原田';
	$account_id['1950016'] = '川原';
	$account_id['2780761'] = '村田';
	$account_id['3596990'] = '佐藤';
	$account_id['6022742'] = '菊川';
	$account_id['6022742'] = '幸田';

**/

	avm_chatwork_alert(342827744,$cw_subject,$cw_body,$account_id);
}
