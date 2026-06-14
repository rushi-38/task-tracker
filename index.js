if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
}
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const ejsMate = require("ejs-mate");

const flash = require("connect-flash");
const session = require("express-session");

const MongoStore =
require("connect-mongo").default;

const passport =
require("passport");

const LocalStrategy =
require("passport-local");

const ExpressError =
require("./utils/ExpressError");

const wrapAsync =
require("./utils/wrapAsync");

// models

const Task =
require("./models/tasks");

const User =
require("./models/user");

// utils

const getRemainingDays =
require("./utils/remainingDays");

// middleware

const {
    isLoggedIn
} = require("./middleware");

// express app

const app = express();

// database url

const dbUrl = process.env.ATLASDB_URL;

// port

const port = 8080;

// database connection

async function main() {

    try {

        await mongoose.connect(dbUrl);

        console.log(
            "Connected To MongoDB"
        );

    }

    catch (err) {

        console.log(
            "MongoDB Connection Error"
        );

        console.log(err);

    }

}

main();

// view engine

app.set(
    "view engine",
    "ejs"
);

app.set(
    "views",
    path.join(__dirname, "views")
);

app.engine(
    "ejs",
    ejsMate
);

// middleware

app.use(
    express.static(
        path.join(
            __dirname,
            "public"
        )
    )
);

app.use(
    express.urlencoded({
        extended: true
    })
);

// mongo store

const store =
MongoStore.create({

    mongoUrl: dbUrl,

    crypto: {
        secret:process.env.SECRET
    },

    touchAfter:
    24 * 3600

});

store.on(
    "error",

    (err) => {

        console.log(
            "SESSION STORE ERROR",
            err
        );

    }
);

// session setup

const sessionOptions = {

    store,

    secret: "mysupercode",

    resave: false,

    saveUninitialized: false,

    cookie: {

        expires:
        Date.now() +
        7 *
        24 *
        60 *
        60 *
        1000,

        maxAge:
        7 *
        24 *
        60 *
        60 *
        1000,

        httpOnly: true

    }

};

app.use(
    session(sessionOptions)
);

// passport setup

app.use(
    passport.initialize()
);

app.use(
    passport.session()
);

passport.use(
    new LocalStrategy(
        User.authenticate()
    )
);

passport.serializeUser(
    User.serializeUser()
);

passport.deserializeUser(
    User.deserializeUser()
);

// flash messages

app.use(
    flash()
);

app.use(
    (req, res, next) => {

        res.locals.success =
        req.flash("success");

        res.locals.error =
        req.flash("error");

        res.locals.currUser =
        req.user;

        next();

    }
);

// root route

app.get(
    "/",
    (req, res) => {

        res.redirect(
            "/dashboard"
        );

    }
);

// dashboard

app.get(

    "/dashboard",

    isLoggedIn,

    wrapAsync(async (req, res) => {

        const tasks =
        await Task.find({

            owner:
            req.user._id

        });

        tasks.forEach((task) => {

            task.remainingDays =
            getRemainingDays(

                task.dueDate,

                task.status

            );

        });

        res.render(

            "user/dashboard",

            { tasks }

        );

    })

);

// all tasks

app.get(

    "/all_tasks",

    isLoggedIn,

    wrapAsync(async (req, res) => {

        const tasks =
        await Task.find({

            owner:
            req.user._id

        });

        tasks.forEach((task) => {

            task.remainingDays =
            getRemainingDays(

                task.dueDate,

                task.status

            );

        });

        res.render(

            "tasks/tasks",

            { tasks }

        );

    })

);

// view task

app.get(

    "/tasks/:id/view",

    isLoggedIn,

    wrapAsync(async (req, res) => {

        const { id } =
        req.params;

        const task =
        await Task.findOne({

            _id: id,

            owner:
            req.user._id

        });

        if (!task) {

            req.flash(
                "error",
                "Task Not Found"
            );

            return res.redirect(
                "/dashboard"
            );

        }

        task.remainingDays =
        getRemainingDays(

            task.dueDate,

            task.status

        );

        res.render(

            "tasks/view",

            { task }

        );

    })

);

// add task form

app.get(

    "/addtask",

    isLoggedIn,

    (req, res) => {

        res.render(
            "tasks/add_task_form"
        );

    }

);

// add task

app.post(

    "/addtask",

    isLoggedIn,

    wrapAsync(async (req, res) => {

        const newtask =
        new Task(req.body);

        newtask.owner =
        req.user._id;

        await newtask.save();

        req.flash(

            "success",

            "Task Added Successfully"

        );

        res.redirect(
            "/dashboard"
        );

    })

);

// complete task

app.get(

    "/task/:id/done",

    isLoggedIn,

    wrapAsync(async (req, res) => {

        const { id } =
        req.params;

        await Task.findOneAndUpdate(

            {

                _id: id,

                owner:
                req.user._id

            },

            {

                status:
                "Completed"

            }

        );

        req.flash(

            "success",

            "Task Completed"

        );

        res.redirect(
            "/dashboard"
        );

    })

);

// start task

app.get(

    "/task/:id/start",

    isLoggedIn,

    wrapAsync(async (req, res) => {

        const { id } =
        req.params;

        await Task.findOneAndUpdate(

            {

                _id: id,

                owner:
                req.user._id

            },

            {

                status:
                "In Progress"

            }

        );

        req.flash(

            "success",

            "Task Started"

        );

        res.redirect(
            "/dashboard"
        );

    })

);

// delete task

app.get(

    "/task/:id/delete",

    isLoggedIn,

    wrapAsync(async (req, res) => {

        const { id } =
        req.params;

        await Task.findOneAndDelete({

            _id: id,

            owner:
            req.user._id

        });

        req.flash(

            "success",

            "Task Deleted Successfully"

        );

        res.redirect(
            "/dashboard"
        );

    })

);

// signup form

app.get(

    "/signup",

    (req, res) => {

        res.render(
            "user/signup"
        );

    }

);

// signup user

app.post(

    "/signup",

    wrapAsync(async (
        req,
        res,
        next
    ) => {

        const {

            username,

            email,

            password

        } = req.body;

        const newUser =
        new User({

            username,

            email

        });

        const registeredUser =
        await User.register(

            newUser,

            password

        );

        req.login(

            registeredUser,

            (err) => {

                if (err) {

                    return next(err);

                }

                req.flash(

                    "success",

                    "Welcome To Student Tracker"

                );

                res.redirect(
                    "/dashboard"
                );

            }

        );

    })

);
// edit form

app.get(

    "/task/:id/edit",

    isLoggedIn,

    wrapAsync(async (req, res) => {

        const { id } =
        req.params;

        const task =
        await Task.findOne({

            _id: id,

            owner:
            req.user._id

        });

        if (!task) {

            req.flash(
                "error",
                "Task Not Found"
            );

            return res.redirect(
                "/dashboard"
            );

        }

        res.render(

            "tasks/edit",

            { task }

        );

    })

);
// update task

app.post(

    "/task/:id/edit",

    isLoggedIn,

    wrapAsync(async (req, res) => {

        const { id } =
        req.params;

        await Task.findOneAndUpdate(

            {

                _id: id,

                owner:
                req.user._id

            },

            req.body

        );

        req.flash(

            "success",

            "Task Updated Successfully"

        );

        res.redirect(
            "/dashboard"
        );

    })

);
// login form

app.get(

    "/login",

    (req, res) => {

        res.render(
            "user/login"
        );

    }

);

// login user

app.post(

    "/login",

    passport.authenticate(

        "local",

        {

            failureRedirect:
            "/login",

            failureFlash: true

        }

    ),

    (req, res) => {

        req.flash(

            "success",

            "Welcome Back!"

        );

        res.redirect(
            "/dashboard"
        );

    }

);

// logout

app.get(

    "/logout",

    (req, res, next) => {

        req.logout((err) => {

            if (err) {

                return next(err);

            }

            req.flash(

                "success",

                "Logged Out Successfully"

            );

            res.redirect(
                "/login"
            );

        });

    }

);

// 404 handler

app.use(

    (req, res, next) => {

        next(

            new ExpressError(
                404,
                "Page Not Found"
            )

        );

    }

);

// error handler

app.use(

    (
        err,
        req,
        res,
        next
    ) => {

        let {

            statusCode = 500,

            message =
            "Something Went Wrong"

        } = err;

        console.log(err);

        res.status(statusCode)
        .render(

            "user/error",

            { message }

        );

    }

);

// server

app.listen(

    port,

    () => {

        console.log(

            "Server Listening On Port 8080"

        );

    }

);