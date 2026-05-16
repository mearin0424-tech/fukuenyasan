/*
 * Translated default messages for the jQuery validation plugin.
 * Language: JA
 * Skipped date/dateISO/number.
 */

// jQuery.extend(jQuery.validator.messages, {
// 	required: "必須項目です",
// 	maxlength: jQuery.format("{0} 文字以下を入力してください"),
// 	minlength: jQuery.format("{0} 文字以上を入力してください"),
// 	rangelength: jQuery.format("{0} 文字以上 {1} 文字以下で入力してください"),
// 	email: "メールアドレスを入力してください",
// 	url: "URLを入力してください",
// 	dateISO: "日付を入力してください",
// 	number: "有効な数字を入力してください",
// 	digits: "0-9までを入力してください",
// 	equalTo: "同じ値を入力してください",
// 	range: jQuery.format(" {0} から {1} までの値を入力してください"),
// 	max: jQuery.format("{0} 以下の値を入力してください"),
// 	min: jQuery.format("{0} 以上の値を入力してください"),
// 	creditcard: "クレジットカード番号を入力してください"
// });


/*
 * validate method plugin for the jQuery validation plugin.
 * Language: JA
 */

//全角ひらがな･カタカナのみ
jQuery.validator.addMethod("kana", function(value, element) {
    return this.optional(element) || /^([ァ-ヶーぁ-ん]+)$/.test(value);
}, "全角ひらがな･カタカナを入力してください"
);

//全角ひらがなのみ
jQuery.validator.addMethod("hiragana", function(value, element) {
    return this.optional(element) || /^([ぁ-ん　]+)$/.test(value);
}, "全角ひらがなを入力してください"
);

//全角カタカナのみ
jQuery.validator.addMethod("katakana", function(value, element) {
    return this.optional(element) || /^([ァ-ヶー]+)$/.test(value);
}, "全角カタカナを入力してください"
);

//半角カタカナのみ
jQuery.validator.addMethod("hankana", function(value, element) {
    return this.optional(element) || /^([ｧ-ﾝﾞﾟ]+)$/.test(value);
}, "半角カタカナを入力してください"
);

//半角アルファベット（大文字･小文字）のみ
jQuery.validator.addMethod("alphabet", function(value, element) {
    return this.optional(element) || /^([a-zA-z¥s]+)$/.test(value);
}, "半角英字を入力してください"
);

//半角アルファベット（大文字･小文字）もしくは数字のみ
jQuery.validator.addMethod("alphanum", function(value, element) {
    return this.optional(element) || /^([a-zA-Z0-9]+)$/.test(value);
}, "半角英数字を入力してください"
);

//半角アルファベット（大文字･小文字）もしくは数字のみ /^(?:[a-zA-Z0-9#$@]+)*$/
jQuery.validator.addMethod("alphanumkigo", function(value, element) {
    return this.optional(element) || /^([a-zA-Z0-9#$@]+)$/.test(value);
}, "ランダムな半角英数字記号(#、$、@)を入力してください"
);

//半角アルファベット（大文字･小文字）もしくは数字のみ /^(?:[a-zA-Z0-9#$@]+)*$/
jQuery.validator.addMethod("alphanumandbar", function(value, element) {
    return this.optional(element) || /^([a-zA-Z0-9-_]+)$/.test(value);
}, "半角英数字、記号はアンダーバー、半角ハイフンのみ可"
);

//郵便番号（例:012-3456）
jQuery.validator.addMethod("postnum", function(value, element) {
    return this.optional(element) || /^¥d{3}¥-¥d{4}$/.test(value);
}, "郵便番号を入力してください（例:123-4567）"
);

//郵便番号（例:012-3456）+ 数字7桁
jQuery.validator.addMethod("postJP", function(value, element) {
    return this.optional(element) || /^\d{3}-\d{4}$|^\d{7}$/.test(value);
}, "有効な郵便番号を入力してください（例:1234567）"
);


//携帯番号（例:010-2345-6789）
jQuery.validator.addMethod("mobilenum", function(value, element) {
    return this.optional(element) || /^0¥d0-¥d{4}-¥d{4}$/.test(value);
}, "携帯番号を入力してください（例:010-2345-6789）"
);

//電話番号（例:012-345-6789）
jQuery.validator.addMethod("telnum", function(value, element) {
    // return this.optional(element) || /^[0-9-]{12}$/.test(value);
    return this.optional(element) || /^[0-9-]{12}$/.test(value);
}, "有効な電話番号を入力してください（例:012-345-6789）"
);

//電話番号 半角数字とハイフン(半角、全角)のみの場合OK
jQuery.validator.addMethod("phonenum", function(value, element) {
return this.optional(element) || /^[\d,－-]+$/.test(value);
}, "電話番号は半角数字を入力して下さい");

//電話番号　ハイフンは置換で除いてから10文字以上で入力してください
jQuery.validator.addMethod("phoneJP", function(phone_number, element) {
//phone_number = phone_number.replace(/[━.*‐.*―.*－.*\–.*ー.*\-]/gi, "");//ok
phone_number = phone_number.replace(/-/g, "");
//phone_number = phone_number.replace(/－/g, "");//phonenumでエラー発生
//phone_number = phone_number.replace(/‐/g, "");//phonenumでエラー発生
return this.optional(element) || phone_number.length > 10;
}, "電話番号は10文字以上で入力して下さい");

//電話番号　0から始まる2桁以上4桁以下-１桁以上4桁以下-3桁以上4桁以下
jQuery.validator.addMethod("phoneJPregrep", function(phone_number, element) {
phone_number = phone_number.replace(/-/g, "");
return this.optional(element) || phone_number.length > 10 &&
    phone_number.match(/^0\d{1,4}-\d{1,4}-\d{3,4}$/);
}, "Please specify a valid phone number");

//電話番号　ハイフンなし　7文字以上13文字以内
jQuery.validator.addMethod("phoneJPminmax", function(phone_number, element) {
phone_number = phone_number.replace(/-/g, "");
phone_number = phone_number.replace(/－/g, "");
return this.optional(element) || phone_number.match(/^\d{7,13}$/);
}, "電話番号は半角数字で7文字以上13文字以内で入力して下さい");


//電話番号　グループ　テキストエリア3つ

//パスワード
jQuery.validator.addMethod("chknocharkigo", function(value, element) {
    return this.optional(element) || /^(?:[a-zA-Z0-9#$@]+)*$/.test(value);
}, "半角英数字記号(#、$、@)で入力してください"
);

//半角チェック
jQuery.validator.addMethod("chkhankaku", function(value, element) {
    value = value.replace(/ /g,"");
    // console.log(jQuery.trim(value));
    return this.optional(element) || /^([a-zA-Z0-9!-/:-@¥[-`{-~]+)*$/.test(jQuery.trim(value));
}, "半角文字を入力してください"
);

jQuery.validator.addMethod('filesize', function(value, element, param) {
//console.log("img:"+element.files.length);
//アップない場合はチェックしない
if(element.files.length == 0){
    //console.log("1");
    return this.optional(element) || (true)
}else{
    return this.optional(element) || (element.files[0].size <= param)
}
// param = size (en bytes)
// element = element to validate (<input>)
// value = value of the element (file name)
}, 'ファイルサイズが8MBを超えています。');

jQuery.validator.addMethod('contactfilesize', function(value, element, param) {
//console.log("img:"+element.files.length);
//アップない場合はチェックしない
if(element.files.length == 0){
    //console.log("1");
    return this.optional(element) || (true)
}else{
    return this.optional(element) || (element.files[0].size <= param)
}
// param = size (en bytes)
// element = element to validate (<input>)
// value = value of the element (file name)
}, 'ファイルサイズが3MBを超えています。');

jQuery.validator.addMethod(
"datepast",
function(value,element,params){
    var now = new Date();
    var n = Date.parse(new Date());
    console.log(n);
    var from_date_y = $("#from_date_y").val();
    var from_date_m = $("#from_date_m").val();
    var from_date_d = $("#from_date_d").val();
    var from_date_h = $("#from_date_h").val();
    // var from_date_min = $("#from_date_min").val();
    var from_date_min = "00";
    console.log(from_date_y);
    console.log(from_date_h);
    var s = Date.parse(from_date_y+"/"+from_date_m+"/"+from_date_d+" "+from_date_h+":"+from_date_min);
    console.log(s);
    //sが日付妥当チェック
    dt=new Date(from_date_y,from_date_m-1,from_date_d);
    var chks = (dt.getFullYear()==from_date_y && dt.getMonth()==from_date_m-1 && dt.getDate()==from_date_d);
    console.log(chks);
    if(chks){
        console.log((s - n));
        if((s - n) < 0){
            console.log('error');
            return false;//error occured
        }else{
            console.log('ok');
            return true
        }

    }else{
        console.log('invalid from date');
        return true

    }
},
"現時点以降の日時を選択して下さい"
);


jQuery.validator.addMethod(
"datepast_mail",
function(value,element,params){
    var mainshow = $('[name=mainshow]:checked').val();
    console.log(mainshow);

    var now = new Date();
    var n = Date.parse(new Date());
    console.log(n);
    var from_date_y = $("#from_date_y").val();
    var from_date_m = $("#from_date_m").val();
    var from_date_d = $("#from_date_d").val();
    var from_date_h = $("#from_date_h").val();
    // var from_date_min = $("#from_date_min").val();
    var from_date_min = "00";
    console.log(from_date_y);
    console.log(from_date_h);

    if(mainshow == "1"){
        if(from_date_y == ""){
            console.log('error');
            return false;//error occured
        }
        if(from_date_m == ""){
            console.log('error');
            return false;//error occured
        }
        if(from_date_d == ""){
            console.log('error');
            return false;//error occured
        }
        if(from_date_h == ""){
            console.log('error');
            return false;//error occured
        }

    }
    var s = Date.parse(from_date_y+"/"+from_date_m+"/"+from_date_d+" "+from_date_h+":"+from_date_min);
    console.log(s);
    //sが日付妥当チェック
    dt=new Date(from_date_y,from_date_m-1,from_date_d);
    var chks = (dt.getFullYear()==from_date_y && dt.getMonth()==from_date_m-1 && dt.getDate()==from_date_d);
    console.log(chks);
    if(chks){
        console.log((s - n));
        if((s - n) < 0){
            console.log('error');
            return false;//error occured
        }else{
            console.log('ok');
            return true
        }

    }else{
        console.log('invalid from date');
        return true

    }
},
"現時点以降の日時を選択して下さい"
);


jQuery.validator.addMethod(
"todatepast",
function(value,element,params){
    var now = new Date();
    var n = Date.parse(new Date());
    console.log(n);
    var from_date_y = $("#to_date_y").val();
    var from_date_m = $("#to_date_m").val();
    var from_date_d = $("#to_date_d").val();
    var from_date_h = $("#to_date_h").val();
    var from_date_min = $("#to_date_min").val();
    console.log(from_date_y);
    var s = Date.parse(from_date_y+"/"+from_date_m+"/"+from_date_d+" "+from_date_h+":"+from_date_min);
    console.log(s);
    //sが日付妥当チェック
    dt=new Date(from_date_y,from_date_m-1,from_date_d);
    var chks = (dt.getFullYear()==from_date_y && dt.getMonth()==from_date_m-1 && dt.getDate()==from_date_d);
    console.log(chks);
    if(chks){
        console.log((s - n));
        if((s - n) < 0){
            console.log('error');
            return false;//error occured
        }else{
            console.log('ok');
            return true
        }

    }else{
        console.log('invalid from date');
        return true

    }
},
"現時点以降の日時を選択して下さい"
);

jQuery.validator.addMethod(
"datecheck",
function(value,element,params){
    var now = new Date();
    var n = Date.parse(new Date());
    // console.log(n);
    var from_date_y = $("#note12").val();
    var from_date_m = $("#note13").val();
    var from_date_d = $("#note14").val();
    if(from_date_y == "" && from_date_m == "" && from_date_d == ""){
        return true
    }
    // console.log(from_date_y);
    var s = Date.parse(from_date_y+"/"+from_date_m+"/"+from_date_d);
    // console.log(s);
    //sが日付妥当チェック
    dt=new Date(from_date_y,from_date_m-1,from_date_d);
    var chks = (dt.getFullYear()==from_date_y && dt.getMonth()==from_date_m-1 && dt.getDate()==from_date_d);
    // console.log(chks);
    if(chks){
            return true
    }else{
        console.log('invalid from date');
        return false;

    }
},
"生年月日の日付が不正です。"
);

jQuery.validator.addMethod(
"date_startend_compare",
function(value,element,params){
    var start = $("#start").val();
    var start_time = $("#start_time").val();
    var end = $("#end").val();
    var end_time = $("#end_time").val();

    if ($("#allday").is(":checked")) {
        var allday = true;
    } else {
        var allday = false;
    }

    if(allday){
        var parse_start = Date.parse(start);
        var parse_end = Date.parse(end);
    }else{
        var parse_start = Date.parse(start + " " + start_time);
        var parse_end = Date.parse(end + " " + end_time);
    }

    console.log(allday);
    console.log(parse_start);
    console.log(parse_end);
    if(parse_start > parse_end){
        console.log('error');
        return false;//error occured
    }else{
        console.log('ok');
        return true
    }
},
"終了日時は開始日時以降の日時を入力して下さい"
);
