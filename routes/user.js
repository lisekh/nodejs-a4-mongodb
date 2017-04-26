var mongoose = require('mongoose');
var User = mongoose.model('User');

// Register user
exports.createUser = function (req, res) {
    var username = req.body.username;
    var email = req.body.email;
    var password = req.body.password;

    var newUser = new User();
    newUser.username = username;
    newUser.email = email;
    newUser.password = password;

    newUser.save(function (err, savedUser) {
        if (err) {
            console.log("Email or username already exists");
            var message = "Email or username already exists";
            res.render("register", {
                errorMessage: message
            });
            return;
        } else {
            req.session.newuser = savedUser.username;
            res.render("new-user", {
                session: req.session
            });
        }
    });
}

// When user is registrated
exports.userRegistrated = function (req, res) {
    res.render('new-user');
}

// Login user
exports.login = function (req, res) {
    var email = req.body.email;
    var password = req.body.password;

    User.findOne({email: email}, function (err, user) {
        console.log("Username: " + user);
        if (user == null) {
            console.log("User was null, displaying login page.");
            var message = "Invalid email or password.";
            res.render("login", {
                errorMessage: message
            });
            return;
        }
        // Compare hashes
        user.comparePassword(password, function (error, isMatch) {
            if (isMatch && isMatch == true) {
                console.log("Authentication was sucessfull!");
                req.session.username = user.username;
                req.session.loggedIn = true;
                console.log("User is: " + req.session.username);
                
                res.render("new-story", {
                    session: req.session
                });
            } else {
                console.log("Authentication unsucessfull.");
                var errorMsg = "Invalid email or password.";
                console.log("Message :" + errorMsg);
                res.render("login", {
                    errorMessage: errorMsg
                });
                return;
            }
        });
    });
}

// Logout a user
exports.logout = function (req, res) {
    console.log("Logg out user: " + req.session.username);
    var loggedOutUser = req.session.username;
    req.session.destroy();
    console.log("User logged out:" + loggedOutUser);
    res.render('logout', {
        loggedOutUser: loggedOutUser
    });
}