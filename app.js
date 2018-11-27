const  express=require('express');

const db=require('./db');


const router=require('./router');

const app=express();

//打包运行
// app.use(express.static('public'));

const http=require('http');
const server=http.createServer(app);
require('./socketIO')(server);

server.listen(5000,() => {
  console.log('服务器启动成功,请访问:http://localhost:5000')
});

(async () => {
  await db;
  app.use(router);
  
})()




app.listen(4000,err => {
if(!err) console.log('服务器启动成功了~');
else console.log(err);
})