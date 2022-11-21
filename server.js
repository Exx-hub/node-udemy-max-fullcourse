const path = require("path");
const express = require("express");

const app = express();

// allows to set any value globally in our express application - to get stored value => app.get()
app.set("view engine", "ejs");
app.set("views", "views");

const port = 8080;

// Route imports
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const errorRoute = require("./controllers/errorController");

// built in middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

// Application Routes
app.use("/admin", adminRoutes);
app.use(shopRoutes);

// if nothing matches above, this middleware route will match and return a 404 error and a 404 page
app.use(errorRoute);

app.listen(port, () => console.log(`Server Listening on port: ${port}.`));
