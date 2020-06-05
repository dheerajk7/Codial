module.exports.chatSocket = function(socketServer)
{
    let io = require('socket.io')(socketServer);

    io.sockets.on('connection',function(socket)
    {
        console.log('New connection received ',socket.id);

        //to disconnect
        socket.on('disconnect',function()
        {
            console.log('Socket Disconnected !');
        });

        socket.on('send-message',function(data)
        {
            console.log('joining request received ',data);
            socket.join(data.chatroom);

            io.in(data.chatroom).emit('received-message',data);
        });
    });
}