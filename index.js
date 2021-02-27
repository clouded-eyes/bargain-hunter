if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

// Loading Packages & Modules
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");

// Sessions & Authentication
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const passportLocalMongoose = require("passport-local-mongoose");
const User = require("./models/user");

// Mongo
const MongoDBStore = require("connect-mongo")(session);
const flash = require("connect-flash");
const mongoSanitize = require("express-mongo-sanitize");

const methodOverride = require("method-override");
// Own Code
const ExpressError = require("./utilities/ExpressError");

// Connecting to Mongo DB
// const dbUrl = "mongodb://localhost:27017/yelp-camp";
const dbUrl = process.env.DB_URL || "mongodb://localhost:27017/bargain-hunter";
mongoose.connect(dbUrl, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("[00] MONGO DB CONNECTED");
});

////////////////////////////////
//////////// EXPRESS ///////////
////////////////////////////////
// Initialize Express
const app = express();
// EJS Mate for Partials
app.engine("ejs", ejsMate);
// EJS For Rendering
app.set("view engine", "ejs");
// Where all the views are
app.set("views", path.join(__dirname, "views"));

//////////////////////////////////
/////////// MIDDLEWARES //////////
//////////////////////////////////
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.use(mongoSanitize());
app.use(flash());

const secret = process.env.SECRET || "thisshouldbebettersecret";
const store = new MongoDBStore({
  url: dbUrl,
  secret,
  // secret: secret,
  touchAfter: 60 * 60 * 24,
});

store.on("error", function (err) {
  console.log("SESSION STORE ERROR:", err);
});

const sessionConfig = {
  store,
  name: "session",
  secret: secret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    // secure: true,
    expires: Date.now() + 100 * 60 * 60 * 24 * 7,
    maxAge: Date.now() + 100 * 60 * 60 * 24 * 7,
  },
};

app.use(session(sessionConfig));
app.use(flash());

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Local Variables
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

//////////////////////////////////
/////////// THE ROUTES ///////////
//////////////////////////////////

// ROUTE REQS
const userRoutes = require("./routes/users");

// HOME ROUTE
app.get("/", (req, res) => {
  res.render("home");
});

// OTHER ROUTES
app.use("/", userRoutes);
// app.use("/campgrounds", campgroundRoutes);
// app.use("/campgrounds/:id/reviews", reviewRoutes);

app.get("/products", (req, res) => {
  res.render("products/index");
});

// // CAMPGROUND ROUTES
// app.use("/", userRoutes);
// app.use("/campgrounds", campgroundRoutes);
// app.use("/campgrounds/:id/reviews", reviewRoutes);

//404 ROUTING
app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

//OPEN PORT
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`[00] EXPRESS LISTING ON PORT ${port}`);
});
