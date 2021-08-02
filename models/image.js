const mongoose = require('mongoose');




const Schema = mongoose.Schema;

const ImageSchema = new Schema(
    {
        user: {type: String, required: true},
        content: {type: String, default: ''},
        url: {type: String, default: null},
        like: [String]
    },
    {
        collection: "image"
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

module.exports = mongoose.model('Image', ImageSchema);