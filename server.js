const path = require("path");
const express = require("express");

const app = express();

const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const csrf = require("csurf");
const flash = require("connect-flash");
const multer = require("multer");

const mongoUri =
  "mongodb+srv://alvinacosta:lokalsoul@node-udemy-2022.j8p86sm.mongodb.net/shopDB?retryWrites=true&w=majority";

const store = new MongoDBStore({
  uri: mongoUri,
  collection: "sessions",
});

const csrfProtection = csrf();

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const fileFilterFunc = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

// allows to set any value globally in our express application - to get stored value => app.get()
app.set("view engine", "ejs");
app.set("views", "views");

const port = 8080;

// Route imports
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");
const errorController = require("./controllers/error");
const User = require("./models/user");

// middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(multer({ storage: fileStorage, fileFilter: fileFilterFunc }).single("image"));
app.use(cookieParser());
app.use(
  session({
    secret: "lokalsoul secret",
    resave: false,
    saveUninitialized: false,
    // cookie: {maxAge: 7 * 24 * 1000}
    store: store,
  })
);
app.use(csrfProtection);
app.use(flash());

app.use(express.static(path.join(__dirname, "public")));

// will look into "images" folder and serve files there, if path has with "/images"
// ex. http://localhost:8080/images/1675664935812-844825689-orange.jpg
// http://localhost:8080/images/ => will look in the images folder.
app.use("/images", express.static(path.join(__dirname, "images")));

// middleware
// so if there is a user stored in session, findById and store that user in req.user so routes below can use
// User object and methods.
// if no user stored in session yet, just run next so program flow can reach login where a user is stored
// in session. then, a user is stored and is accessible in all request thereafter.
app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }

  User.findById(req.session.user._id)
    .then((user) => {
      if (!user) {
        return next();
      }
      req.user = user;
      next();
    })
    .catch((err) => {
      throw new Error(err);
    });
});

// middleware
// set variables available to your views, so isAuthenticated variable and csrfToken is accessible in your views,
// even if you dont include them in your res.render options
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

// Application Routes
app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.get("/500", errorController.get500);

// if nothing matches above, this middleware route will match and return a 404 error and a 404 page
app.use(errorController.get404);

// express error middleware, gets call if next is passed with an error object
app.use((error, req, res, next) => {
  console.log("error:", error);
  console.log("express error middleware in action");
  res.redirect("/500");
});

// connect to database
try {
  mongoose.set("strictQuery", false);
  mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
} catch (err) {
  console.log(err);
}

// database event listeners
const db = mongoose.connection;

db.once("open", () => {
  console.log("DB connection Established");
  app.listen(port, () => console.log(`Server running on port ${port}`));
});

db.on("error", (err) => {
  console.log("connection error");
  console.log(err);
});
