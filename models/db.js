var chalk = require('chalk');
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var SALT_WORK_FACTOR = 2;


var dbURI = 'mongodb://localhost/mydb';

// Connect to db
mongoose.connect(dbURI);

// Log when connected to db
mongoose.connection.on('connected', function () {
    console.log(chalk.yellow('Mongoose connected to ' + dbURI));
});

// Log when connection error
mongoose.connection.on('error', function (err) {
    console.log(chalk.red('Mongoose connection error: ' + err));
});

// Log when disconnected to db
mongoose.connection.on('disconnected', function () {
    console.log(chalk.red('Mongoose disconnected'));
});

// User schema
var userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true
    },
    email: {
        type: String,
        unique: true
    },
    password: String
});

// On save
userSchema.pre('save', function (next) {
    var user = this;
    console.log("About to register user...");

    // Check if password is actually changed
    if (!user.isModified('password')) return next();

    // Generate salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function (error, salt) {
        if (error) {
            return next(error);
        }

        // Hash password with salt
        console.log("Hashing password with salt...");
        bcrypt.hash(user.password, salt, function (error, hash) {
            if (error) return next(error);

            // override the cleartext password with the hashed one
            user.password = hash;
            console.log("Hash is: " + hash);
            next();
        });
    });
});

// Helper method to compare hashes
userSchema.methods.comparePassword = function (candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function (error, isMatch) {
        if (error) {
            return cb(error);
        }
        cb(null, isMatch);
    });
};

// Build the User model
mongoose.model('User', userSchema);

// Stories Schema
var storiesSchema = new mongoose.Schema({
    author: String,
    title: {
        type: String,
        unique: true
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    summary: String,
    content: {
        type: String
    },
    imageLink: String,
    comments: [{
        body: String,
        commented_by: String,
        date: Date
    }],
    slug: String
});

// Build the model
mongoose.model('Story', storiesSchema, 'stories');