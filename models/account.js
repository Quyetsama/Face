const mongoose = require('mongoose');
// const slug = require('mongoose-slug-generator');
// const mongooseDelete = require('mongoose-delete');




const Schema = mongoose.Schema;

const AccountSchema = new Schema(
    {
        email: String,
        username: String,
        password: String,
        role: {type: Number, default: 1}
    },
    {
        collection: "account"
    }
);


// Add plugins
// mongoose.plugin(slug);
// Film.plugin(mongooseDelete, { 
//   deletedAt : true,
//   overrideMethods: 'all' 
// });

module.exports = mongoose.model('Account', AccountSchema);