const AccountSchema = require("../models/account");
const jwt = require('jsonwebtoken');

class PermisstionController{


    // middleware check login
    checkLogin(req, res, next){
        try{
            // console.log(req.headers);
            var token = req.cookies.token;
            var idUser = jwt.verify(token, 'quyetdaica');
            AccountSchema.findOne({
                _id: idUser
            })
            .then(data => {
                // console.log(data);
                if(data){
                    // req.data = data; khong nho lam cai gi :))
                    next();
                }
                else{
                    res.json('NOT PERMISSTION');
                }
            })
            .catch(error => {

            })
        }
        catch(error){
            res.redirect('/login');
        }
    }


}

module.exports = new PermisstionController;