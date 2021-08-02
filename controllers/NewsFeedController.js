const AccountSchema = require("../models/account");
const ImageSchema = require("../models/image");
const CommentSchema = require("../models/comment");
const jwt = require('jsonwebtoken');



class NewsFeedController{

    // [GET] /
    home(req, res, next){

        // CommentSchema.create({
        //     idstatus: "60fbccc21b342328a4979f34",
        //     comment: "comment nhiều lên nào !!!",
        //     username: "admin"
        // })
        // .then(data => {
        //     console.log("comment successfully!!!");
        // })
        // .catch(next);

        // CommentSchema.find(
        //     {idstatus: "60fbccc21b342328a4979f34"}
        // )
        // .then(data => {
        //     console.log(data);
        // })
        // .catch(next);



        // var page = 4;
        // page = parseInt(page);

        // if(!(page > 0)){
        //     page = 1;
        // }

        // var countPass = (page-1) * 2;
        // CommentSchema.find(
        //     {
        //         idstatus: "60fbccc21b342328a4979f34"
        //     }
        // )
        // .skip(countPass)
        // .limit(2)
        // .then(data => {
        //     // console.log(data);
        //     CommentSchema.countDocuments(
        //         {
        //             idstatus: "60fbccc21b342328a4979f34"
        //         }
        //         )
        //     .then(total => {
        //         total = Math.ceil(total/2);
        //         console.log(total);
        //         console.log(data);
        //     })
        // })
        // .catch(next);










        console.log(req.cookies.username);
        ImageSchema.countDocuments({})
        .then(total => {
            total = Math.ceil(total/3);
            res.render("home", {
                total, 
                username: req.cookies.username
            });
        })
        .catch(next);
    }


    // [POST] /poststatus
    postStatus(req, res, next){

        try{
            // console.log(req.headers);
            var token = req.cookies.token;
            var idUser = jwt.verify(token, 'quyetdaica');
            console.log(idUser);
            var content = req.body.content;
            var imageFile;

            if(req.files){
                imageFile = req.files.imageFile;
                console.log(imageFile.name);

                if(imageFile.name.split('.')[1] == "png" || imageFile.name.split('.')[1] == "jpg"){
                    var imageName = Date.now() + "." + imageFile.name.split('.')[1];
    
                    imageFile.mv("uploads/image/" + imageName , function(error){
                        if(error){
                            console.log("Couldn't upload the image file");
                            console.log(error);
                        }
                        else{
                            console.log("Image file successfully uploaded");
                            ImageSchema.create({
                                user: idUser.username,
                                content: content,
                                url: imageName
                            })
                            .then(() => {
                                // res.json({
                                //     message: 'post success'
                                // })
                                res.redirect("back");
                            })
                            .catch(error => {
    
                            })
                        }
                    })
                }
            }
            else{
                ImageSchema.create({
                    user: idUser.username,
                    content: content,
                })
                .then(() => {
                    // res.json({
                    //     message: 'post success'
                    // })
                    res.redirect("back");
                })
                .catch(error => {

                })
            }    
        }
        catch(error){
            console.log(error);
            // res.redirect('/login');
            res.json("fail");
        }
    }

}

module.exports = new NewsFeedController;