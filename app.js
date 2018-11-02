const  express=require('express');

const db=require('./db');


const router=require('./router');

const app=express();

(async () => {
  await db;
  app.use(router);
  
})()




app.listen(4000,err => {
if(!err) console.log('服务器启动成功了~');
else console.log(err);
})