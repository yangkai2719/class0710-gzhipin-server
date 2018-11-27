const Message=require('../models/messages');
module.exports=function (server) {
  const io=require('socket.io')(server)
  io.on('connection',function (socket) {
  console.log('soketio connected');
  
  socket.on('sendMsg',async function (data) {
  console.log('服务器接受到浏览器的消息',data)
  const  chat_id=[data.from,data.to].sort().join('-');
  const result=await Message.create({from:data.from,to:data.to,content:data.content,chat_id})
  
  io.emit('receiveMsg',{from:result.from,to:result.to,content:result.content,chat_id:result.chat_id,create_time:result.create_time,read:result.read})
  console.log('服务器向浏览器发送消息',result)
 
  
  })
  })
}