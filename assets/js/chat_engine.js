class ChatEngine
{
    constructor(chatBoxId,userEMail)
    {
        this.chatBox = ($(`#${chatBoxId}`));
        this.userEMail = userEMail;

        this.socket = io.connect('http://localhost:5000');

        if(this.userEMail)
        {
            this.connectionHanlder();
        }
    }

    connectionHanlder()
    {
        let self = this;
        this.socket.on('connect',function()
        {
            console.log('Connection established using sockets');
        

            self.socket.emit('join_room',{
                user_email:self.userEMail,
                chatroom:'codial',
            });

            self.socket.on('user_joined',function(data)
            {
                console.log('A new user joined ',data);
            });
        });

        $('#send-message').click(function()
        {
            let msg = $('#chat-message-input').val();
            if(msg != '')
            {
                self.socket.emit('send-message',{
                    message:msg,
                    user_email:self.userEMail,
                    chatroom:'codial',
                });
            }
        });

        self.socket.on('received-message',function(data)
        {
            console.log('Message received ',data.message);

            let newMessage = $('<li>');

            let messageType = 'other-message';
            if(data.user_email == self.userEMail)
            {
                messageType = 'self-message';
            }

            newMessage.append($('<span>', {
                'html': data.message
            }));

            newMessage.append($('<sub>', {
                'html': data.user_email
            }));

            newMessage.addClass(messageType);
            $('.chat-list').append(newMessage);
        });
    }
}