var http = require('http');
var fs   = require('fs');
var path = require('path');
var mime = require('mime');
var cache = {};

function send404(res){
  res.writeHead(404,{'Content-Type':'text/plain'});
  res.write('Error 404: resource not found.');
  res.end();
}

function sendFile(res, filePath, fileContents) {
  res.writeHead(200,{'Content-Type':mime.getType(path.basename(filePath))});
  res.end(fileContents)
}

function serveStatic( response, cache, absPath) {
  if (cache[absPath]) { //检查 文件 是否 缓存 在 内存 中
      sendFile(response, absPath, cache[absPath]); //从 内存 中 返回 文件
  } else {
    fs.exists(absPath, function(exists) { //检查 文件 是否 存在
      console.log(absPath);
      if (exists) {
        fs.readFile( absPath, function(err, data){ //从 硬盘 中 读取 文件
          if (err) {
            send404(response);
          } else {
            cache[absPath] = data;
            sendFile(response, absPath, data); //从 硬盘 中 读取 文件 并 返回
          }
        });
      } else {
        send404(response); //发送 HTTP 404 响应
      }
    });
  }
}

var server = http.createServer(function (req, res) {
  var filePath = false;
  if( req.url == '/'){
    filePath = 'public/index.html';
  }else {
    filePath = `public${req.url}`;
  }
  var absPath = `../${filePath}`;
  serveStatic(res,cache,absPath)
})
server.listen(3000,function () {
  console.log('Server listening no port 3000');
})