module.exports=function (server) {
  const io=require('socket.io')(server)
  io.on('connection',function (socket) {
    console.log('soketio connectde');
    socket.on('sendMsg',function (data) {
      console.log('服务器接受到浏览器的消息',data);
      io.emit('receiveMsg',data.name+'_'+data.date)
      console.log('服务器向浏览器发送消息',data)
    })

  })

}