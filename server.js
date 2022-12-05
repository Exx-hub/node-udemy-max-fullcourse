const path = require("path");
const express = require("express");

const app = express();

// allows to set any value globally in our express application - to get stored value => app.get()
app.set("view engine", "ejs");
app.set("views", "views");

const port = 8080;

const sequelize = require("./util/database");

const Product = require("./models/product");
const User = require("./models/user");
const Cart = require("./models/cart");
const CartItem = require("./models/cart-item");

// Route imports
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const errorRoute = require("./controllers/error");
const Order = require("./models/order");
const OrderItem = require("./models/order-item");

// built in middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

// Custom middleware to retrieve user and make availble for all incoming requests.
app.use((req, res, next) => {
  User.findByPk(1)
    .then((user) => {
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

Product.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, { through: OrderItem });
Product.belongsToMany(Order, { through: OrderItem });

sequelize
  .sync()
  // .sync({ force: true })
  .then((result) => {
    return User.findByPk(1);
  })
  .then((user) => {
    if (!user) {
      return User.create({
        name: "Alvin",
        email: "alvinfloresacosta.gmail.com",
      });
    }
    return user;
  })
  // .then((user) => {
  //   // user.createCart();
  //   // return user;
  // })
  .then((user) => {
    app.listen(port, () => console.log(`Server Listening on port: ${port}.`));
  })
  .catch((err) => {
    console.log(err);
  });
