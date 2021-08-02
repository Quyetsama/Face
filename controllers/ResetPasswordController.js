const AccountSchema = require("../models/account");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const nodemailer =  require('nodemailer');
const async = require('async');



class ResetPasswordController{

    // [GET] auth/forgot_password 
    render_forgot_password_template(req, res, next){
        res.render('forgotpassword', {
            mess: req.flash('mess')
        });
    }

    // [POST] auth/send_mail
    send_gmail(req, res, next){
        async.waterfall([
            (done) => {
                AccountSchema.findOne({
                    email: req.body.mail
                }).exec((err, user) => {
                    console.log(user);
                    if(user){
                        done(err, user);
                    }
                    else{
                        done('User not found.');
                    }
                });
            },
    
            (user, done) => {
                // create token
                var tokenObject = {
                    id: user._id,
                    email: user.mail
                }
                
                var token = jwt.sign(tokenObject, 'resetpassword', {expiresIn: 36000}, (err, token) => {
                    console.log(token);
                    done(err, token);
                });
            },
    
            (token, done) => {
                //Tiến hành gửi mail, nếu có gì đó bạn có thể xử lý trước khi gửi mail
                var transporter =  nodemailer.createTransport({ // config mail server
                    host: 'smtp.gmail.com',
                    port: 465,
                    secure: true,
                    auth: {
                        user: 'vanquyetc2vc1@gmail.com', //Tài khoản gmail vừa tạo
                        pass: '0867985106' //Mật khẩu tài khoản gmail vừa tạo
                    },
                    tls: {
                        // do not fail on invalid certs
                        rejectUnauthorized: false
                    }
                });
                var content = '';
                content += `
                    <div style="padding: 10px; background-color: #003375">
                        <div style="padding: 10px; background-color: white;">
                            <h4 style="color: #0085ff">Truy cập vào link bên dưới để đặt lại mật khẩu.</h4>
                            <span style="color: black">http://localhost:3000/auth/reset_password?token=${token}'</span>
                        </div>
                    </div>
                `;
                var mainOptions = { // thiết lập đối tượng, nội dung gửi mail
                    from: 'NQH-Test nodemailer',
                    to: req.body.mail,
                    subject: 'Test Nodemailer',
                    text: 'Your text is here',//Thường thi mình không dùng cái này thay vào đó mình sử dụng html để dễ edit hơn
                    html: content //Nội dung html mình đã tạo trên kia :))
                }
                transporter.sendMail(mainOptions, function(err, info){
                    if (err) {
                        console.log(err);
                        req.flash('mess', 'Lỗi gửi mail: '+err); //Gửi thông báo đến người dùng
                        res.redirect('/auth/forgot_password');
                    } else {
                        console.log('Message sent: ' +  info.response);
                        req.flash('mess', 'Một email đã được gửi đến tài khoản của bạn'); //Gửi thông báo đến người dùng
                        // res.locals.message = req.flash();
                        res.redirect('/auth/forgot_password');
                    }
                });
            }
        ], (err) => {
            return res.status(422).json({ message: err });
        });
    }

    // [GET] auth/reset_password
    render_reset_password_template(req, res, next){

        try{
            var token = req.query.token;
            var idUser = jwt.verify(token, 'resetpassword');

            AccountSchema.findOne({
                _id: idUser.id
            })
            .then(user => {
                if(user){
                    res.render('resetpassword', {
                        token
                    });
                }
                else{
                    res.redirect('/login');
                }
            })
            .catch(error => {

            })
        }
        catch(error){
            console.log(error);
            res.redirect('/login');
        }
    }

    // [POST] auth/reset_password
    reset_password(req, res, next){
        try{
            var token = req.params.token;
            var idUser = jwt.verify(token, 'resetpassword');

            bcrypt.hash(req.body.newpass1, saltRounds, function(err, hash) {
                console.log(hash);
                AccountSchema.updateOne(
                    {_id: idUser.id},
                    {password: hash}
                )
                .then(() => res.redirect("/login"))
                .catch(err => {
                    console.log(err);
                    res.redirect('/login');
                })
            });
        }
        catch(error){
            console.log(error);
            res.redirect('/login');
        }
    }


}

module.exports = new ResetPasswordController;