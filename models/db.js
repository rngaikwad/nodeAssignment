var chalk = require('chalk');
var mongoose = require('mongoose');

var bcrypt = require('bcryptjs');
var SALT_WORK_FACTOR = 10;

/*var dbURI = 'mongodb://127.0.0.1/rndb';*/
var dbURI =  'mongodb://rndb:rndb@ds117889.mlab.com:17889/rndb';
console.log("Establishing connection to the DB");

mongoose.connect(dbURI);

mongoose.connection.on('connected', function () {
  console.log(chalk.yellow('Mongoose connected to ' + dbURI));
});

mongoose.connection.on('error', function (err) {
  console.log(chalk.red('Mongoose connection error: ' + err));
});

mongoose.connection.on('disconnected', function () {
  console.log(chalk.red('Mongoose disconnected'));
});

// ***** *******  *  *****   Schema defs
var userSchema = new mongoose.Schema({
  name:String,
  location:String,
  username: {type: String, unique:true},
  password: String,
}, /*{collection: 'bcryptusers'});*/
/*{collection: 'users'});*/
{collection: 'user'});

var feedbackSchema = new mongoose.Schema({
  name:String,
  location:String,
  comments:String,
  ans1:String,
  ans2:String,
  ans3:String,
  ans4:String
}, {collection: 'feedback'});



userSchema.pre('save', function(next) {
     var user = this;
     console.log("----Password hashing before saving new user data----");

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);

        // hash the password using our new salt
        console.log("SALT_WORK_FACTOR=%s  Salt=%s", SALT_WORK_FACTOR, salt);
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);
            console.log("user.password = [%s]  Hash = [%s]", user.password, hash);
            // override the cleartext password with the hashed one
            user.password = hash;

            next();
        });
    });
});







/*feedbackSchema.pre('save', function(next)
 {
     
            next();
  });*/

// register the User model
mongoose.model( 'UserModel', userSchema);
mongoose.model( 'FeedbackModel', feedbackSchema);
