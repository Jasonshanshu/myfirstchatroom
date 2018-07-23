var app = require('http').createServer(),
    io = require('socket.io')(app);
app.listen(8081);
PORT=8081,
clientCount=0;
io.on('connection',function(socket){
    socket.on('online',function(data){
        clientCount++;
        io.emit('clientNum',clientCount);
        socket.username = data
        io.emit('online',data)
        console.log('user:'+socket.username+'connected!')
    })
    socket.on('msg',function(data){
        io.emit('broadcastMsg',data);
        console.log(JSON.stringify(data)+"发消息了")
    })

    socket.on('disconnect',function(){
        if(clientCount>0){
            clientCount--;
        }
        io.emit('clientNum',clientCount);
        socket.broadcast.emit('offline',socket.username);
        console.log(socket.username+'下线了~')
    })
})

console.log('listening at :' +PORT)
// 