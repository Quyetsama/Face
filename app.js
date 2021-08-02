const express = require("express");
const app = express();
const server = require('http').Server(app)
const io = require('socket.io')(server)

const cookieParser = require('cookie-parser')

const route = require("./routes");
const db = require("./db");

const bodyParser = require("body-parser");

const passport = require("passport");

const fileUpload = require("express-fileupload");

const flash = require('connect-flash');

const session = require("express-session");

app.set('socketio', io);

app.use(cookieParser('secret'));
app.use(session({cookie: { maxAge: 60000 }}));
app.use(flash());

app.use(passport.initialize());


app.use(bodyParser.urlencoded({extended: true}));

// Connect to db
db.connect();

app.set("view engine", "ejs");

app.use(express.static("uploads"));
app.use(express.static('public'))

app.use(cookieParser());

app.use(fileUpload());


route(app);




server.listen(process.env.PORT, function(){
    console.log("Server is running!!!");
});