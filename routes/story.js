var mongoose = require('mongoose');
var Story = mongoose.model('Story');

// Get all stories
exports.stories = function (req, res) {
    Story.find({}, function (error, stories) {
        res.render('home', {
            stories: stories,
            session: req.session
        });
    });
}

// Add a story
exports.addStory = function (req, res) {
    var title = req.body.title;
    var content = req.body.content;
    var summary = req.body.summary;
    var imageLink = req.body.imageLink;
    var author = req.session.username;
    console.log("Author name:" + author);

    var newStory = new Story();
        newStory.author = author;
        newStory.title = title;
        newStory.content = content;
        newStory.summary = summary;
        newStory.imageLink = imageLink;

    var lowercaseTitle = newStory.title.toLowerCase();
    var slug = lowercaseTitle.replace(/[^a-zA-Z0-9 ]/g, "");
    var addingHyphen = slug.replace(/\s+/g, '-');

    newStory.slug = addingHyphen;

    console.log("Slug: " + newStory.slug);

    newStory.save(function (error, savedStory) {
        if (error) {
            console.log("Error occurred when saving story.");
            return res.status(500).send();
        } else {
            res.redirect("/stories");
        }
    });
}

// Get story
exports.getStory = function (req, res) {
    var url = req.params.story;
    Story.findOne({
        slug: url
    }, function (error, mystory) {
        res.render('story', {
            story: mystory,
            session: req.session
        });
    });
}

// Save comment
exports.saveComment = function (req, res) {
    var story_slug = req.params.slug;
    var comment = req.body.comment;
    var posted_date = new Date();

    console.log("Story-slug: " + story_slug);
    console.log("Comment: " + comment);
    console.log("Posted date: " + posted_date);

    Story.findOne({slug: story_slug}, function (err, story) {
        story.comments.push({
            body: comment,
            commented_by: req.session.username,
            date: posted_date
        });

        story.save(function (error, savedStory) {
            if (error) {
                console.log("Error : While saving comments");
                return res.status(500).send();
            } else {
                res.render('story', {
                    story: story,
                    session: req.session
                });
            }
        });
    });
}