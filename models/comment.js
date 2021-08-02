const mongoose = require('mongoose');




const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const CommentSchema = new Schema(
    {
        idstatus: {type: ObjectId, required: true},
        comment: {type: String, required: true},
        username: {type: String, required: true},
    },
    {
        collection: "comment"
    }
);


// Add plugins
// mongoose.plugin(slug);
// Film.plugin(mongooseDelete, { 
//   deletedAt : true,
//   overrideMethods: 'all' 
// });


// {
//     user: {type: String, required: true},
//     content: {type: String, default: ''},
//     url: {type: String, default: null},
//     like: [String],
//     comment: {type: String}
// }

module.exports = mongoose.model('Comment', CommentSchema);