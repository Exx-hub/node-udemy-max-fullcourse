const path = require("path");
const express = require("express");

const app = express();

const mongoose = require("mongoose");

const User = require("./models/user");

// allows to set any value globally in our express application - to get stored value => app.get()
app.set("view engine", "ejs");
app.set("views", "views");

const port = 8080;

const mongoUri =
  "mongodb+srv://alvinacosta:lokalsoul@node-udemy-2022.j8p86sm.mongodb.net/shopDB?retryWrites=true&w=majority";

// Route imports
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const errorRoute = require("./controllers/error");
const user = require("./models/user");

// built in middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  // console.log("middleware!");
  User.findById("63b11e6c23c02f1c35057228")
    .then((user) => {
      // console.log(user);
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

// Application Routes
app.use("/admin", adminRoutes);
app.use(shopRoutes);

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
