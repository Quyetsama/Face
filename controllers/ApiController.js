const AccountSchema = require("../models/account");
const ImageSchema = require("../models/image");
const CommentSchema = require("../models/comment");

class SiteController{

    // [GET] /api/newsfeed
    newsfeed(req, res, next){

        var page = req.query.page;
        page = parseInt(page);

        if(!(page > 0)){
            page = 1;
        }

        var countPass = (page-1) * 3;
        ImageSchema.find({})
        .skip(countPass)
        .limit(3)
        .then(data => {
            // console.log(data);
            ImageSchema.countDocuments({})
            .then(total => {
                total = Math.ceil(total/3);
                res.json({
                    total: total,
                    newsfeed: data
                });
            })
        })
        .catch(next);
    
    }

    // [GET] /api/like/:id/:username
    like(req, res, next){

        ImageSchema.findOne(
            {_id: req.params.id},
            {like: {$elemMatch: {$eq: req.params.username}}, countlike: { $size:"$like" }}
        )
        .then(data => {
            console.log(data);
            // console.log(data.like.length);
            var countLike = data.toObject().countlike;
            console.log(data.toObject().countlike);

            if(data.like.length == 0){
                ImageSchema.updateOne(
                    {_id: req.params.id},
                    {$push: {like: req.params.username}}
                )
                .then(data => {
                    res.status(200).json(
                        {
                            message: "like success",
                            like: (countLike + 1)
                        }
                    );
                })
                // .catch(error => {
                //     res.redirect("back");
                // })
            }
            else if(data.like.length == 1){
                ImageSchema.updateOne(
                    {_id: req.params.id},
                    {$pull: {like: req.params.username}}
                )
                .then(data => {
                    res.status(200).json(
                        {
                            message: "like success",
                            like: (countLike - 1)
                        }
                    );
                })
                // .catch(error => {
                //     res.redirect("back");
                // })
            }
        })
        .catch(error => {
            console.log(error);
            res.status(404).json(
                {
                    message: "fail"
                }
            );
        })
    }

    // [GET] /api/comment/:id
    getComment(req, res, next){
        var page = req.query.page;
        page = parseInt(page);

        if(!(page > 0)){
            page = 1;
        }

        var countPass = (page-1) * 2;
        CommentSchema.find(
            {
                idstatus: req.params.id
            }
        )
        .skip(countPass)
        .limit(2)
        .then(data => {
            // console.log(data);
            CommentSchema.countDocuments(
                {
                    idstatus: req.params.id
                }
                )
            .then(total => {
                total = Math.ceil(total/2);
                res.status(200).json(
                    {   
                        message: "success",
                        total: total,
                        comment: data
                    }
                )
            })
        })
        .catch(error => {
            console.log(error);
            res.status(400).json("fail");
        });
    }

    // [POST] /api/comment/:id/:username
    comment(req, res, next){
        CommentSchema.create({
            idstatus: req.params.id,
            comment: req.body.comment,
            username: req.params.username
        })
        .then(data => {
            res.status(201).json("comment successfully");
        })
        .catch(error => {
            console.log(error);
            res.status(400).json("comment fail");
        });
    }
}

module.exports = new SiteController;