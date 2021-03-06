var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");
var passport = require("passport");
var cookieSession = require("cookie-session");
var bodyParser = require('body-parser');

var sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY);


require("dotenv").config();
require("./config/database");

// these are the routes that are controlling the api routes
var eventRoute = require("./routes/events");
var eventsRoute = require("./routes/upcoming");
var indexRoute = require("./routes/index");
var usersRoute = require("./routes/users");
var feedbackRoute = require("./routes/feedback");
var thumbnailRoute = require("./routes/thumbnail");
const resetpasswordRoute = require("./routes/password");
const blogsRoute = require("./routes/blogs");
const projectsRoute = require("./routes/projects");

var app = express();

// app.all('*', (req, res, next) => {
//     if (req.secure) {
//         return next();
//     } else {
//         res.redirect(307, 'https://' + req.hostname + ':' + app.get('secPort') + req.url);
//     }
// })

app.use(cors());
app.use(
    cookieSession({
        maxAge: 3600 * 1000,
        keys: ["something"]
    })
);

// view engine setup
app.set("views", path.join(__dirname, "views"));

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
app.use(express.static(path.join(__dirname, 'public')));
// defining the routes
app.use("/", indexRoute);

app.use("/auth", usersRoute);
app.use("/api/events", eventRoute);
app.use("/api/upcoming", eventsRoute);
app.use("/feedback", feedbackRoute);
app.use("/thumbnail", thumbnailRoute);
app.use("/resetpassword", resetpasswordRoute);
app.use("/api/blogs", blogsRoute);
app.use("/api/projects", projectsRoute);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler

// app.use(function(err, req, res, next) {
//     // set locals, only providing error in development
//     res.locals.message = err.message;
//     res.locals.error = req.app.get('env') === 'development' ? err : {};

//     // render the error page
//     res.status(err.status || 500);
//     res.send('Error');
// });
app.listen(process.env.PORT, () => {
    console.log('Server Listening on ', process.env.PORT)
})
module.exports = app;