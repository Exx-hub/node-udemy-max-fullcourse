const path = require("path");
const express = require("express");

const app = express();

const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);

const mongoUri =
  "mongodb+srv://alvinacosta:lokalsoul@node-udemy-2022.j8p86sm.mongodb.net/shopDB?retryWrites=true&w=majority";

const store = new MongoDBStore({
  uri: mongoUri,
  collection: "sessions",
});

// allows to set any value globally in our express application - to get stored value => app.get()
app.set("view engine", "ejs");
app.set("views", "views");

const port = 8080;

// Route imports
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");
const errorRoute = require("./controllers/error");
const User = require("./models/user");

// built in middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
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
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

app.use(express.static(path.join(__dirname, "public")));

// Application Routes
app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

// if nothing matches above, this middleware route will match and return a 404 error and a 404 page
app.use(errorRoute);

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
  User.findOne().then((user) => {
    if (!user) {
      const user = new User({
        name: "Alvin",
        email: "alvinfloresacosta@gmail.com",
        cart: {
          items: [],
        },
      });

      user.save();
    }
  });

  console.log("DB connection Established");
  app.listen(port, () => console.log(`Server running on port ${port}`));
});

db.on("error", (err) => {
  console.log("connection error");
  console.log(err);
});
