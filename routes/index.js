const siteRouter = require("./site");
const apiRouter = require("./api");
const authRouter = require("./auth");

const users = new Map([])

function route(app){
    app.use("/auth", authRouter);
    app.use("/api", apiRouter);
    app.use("/", siteRouter);



    var io = app.get('socketio');
    io.on('connection', (socket) => {

        // AccountSchema.find({}, {username: 1, _id: 0})
        // .then(data => {
        //     console.log(data)
        // })
        // .catch(error => {
        //     console.log(error)
        // })

        //console.log(socket.handshake.auth.username, socket.handshake.auth.token)
        // socket.emit("session", socket.id);
        

        // console.log('Connected: ' + socket.id)

        socket.on('disconnect', () => { 
            users.delete(socket.username)
            let keys = Array.from( users.keys() );
            console.log(keys)
            io.sockets.emit('server-send-users', keys)
        })

        socket.on('client-send-token', (data) => {
            socket.join('user:' + data.username)



            // Thêm 1 thuộc tính username
            socket.username = data.username

            // thêm 1 phần tử vào map
            users.set(data.username, socket.id)

            // chuyển [Map interator] to array
            let keys = Array.from( users.keys() );
            console.log(keys)

            // send danh sách user đến client
            io.sockets.emit('server-send-users', keys)

            // for (let [id, socket] of io.of("/").sockets) {
            //     console.log(id + "-" + socket.username)
            // }
        })

        

        socket.on('user-send-message', (data) => {
            console.log(data)
            console.log(users.get(data.to))
            // io.to(users.get(data.to)).emit('server-send-message', 
            // {
            //     from: socket.username,
            //     message: data.message
            // })

            // nhieu tab = 1 user
            io.to('user:' + socket.username).emit('server-send-msg-for-me', 
            {
                to: data.to,
                message: data.message
            })

            io.to('user:' + data.to).emit('server-send-message', 
                {
                    from: socket.username,
                    message: data.message
                }
            )
        })
    })
}


module.exports = route;