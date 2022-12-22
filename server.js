const path = require("path");
const express = require("express");

const app = express();

const { mongoConnect } = require("./util/database");
const User = require("./models/user");

// allows to set any value globally in our express application - to get stored value => app.get()
app.set("view engine", "ejs");
app.set("views", "views");

const port = 8080;

// Route imports
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const errorRoute = require("./controllers/error");

// built in middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  console.log("middleware!");
  User.findUserById("63a04fc1a0512f06e3d10aeb")
    .then((user) => {
      req.user = new User(user.name, user.email, user.cart, user._id);
      next();
    })
    .catch((err) => console.log(err));
});

// Application Routes
app.use("/admin", adminRoutes);
app.use(shopRoutes);

// if nothing matches above, this middleware route will match and return a 404 error and a 404 page
app.use(errorRoute);

mongoConnect().then(() => {
  app.listen(port, () => console.log("Server listening and db connected"));
});
