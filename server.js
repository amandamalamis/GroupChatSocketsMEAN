const express = require('express');
const app = express();
const path = require("path");

app.set('views', path.join(__dirname,'./views'));
app.set('view engine','ejs');

const session = require("express-session");

app.use(session({
    secret: 'thisissecret',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 99999 }
}));

var logged_in_users = [];
var board_messages = [];

app.get('/', function(req,res) {
    context = {
        'board_messages':board_messages,
        'logged_in_users':logged_in_users
    }
    res.render('index',context);
});

const server = app.listen(8000);
console.log("listening on port 8000")

const io = require('socket.io')(server);

io.on('connection', function (socket) {
    console.log(socket.id)

    socket.on('get_user', function(data) {
        logged_in_users.push(data);
        io.emit('new_user_to_list',data)
    })

    socket.on('new_message',function(data) {
        msg = {
            'message':data.values,
            'author':data.name
        }
        board_messages.push(msg);
        io.emit('add_new_message',msg);
    });

});
