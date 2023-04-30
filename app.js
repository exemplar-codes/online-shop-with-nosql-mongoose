const path = require("path");

const sequelize = require("./util/database");

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const errorController = require("./controllers/error");
const Product = require("./models/Product");
const User = require("./models/User");
const Cart = require("./models/Cart");
// const Cart = require("./models/Cart");
// const CartItem = require("./models/CartItem");

// app.set('view engine', 'pug');
// app.set('views', 'views'); // not needed for this case, actually
app.set("view engine", "ejs");
app.set("views", "views"); // not needed for this case, actually

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());
// mock authentication, i.e. get user who's making the request
app.use(async (req, res, next) => {
  req.user = await User.findByPk(1);
  next();
});

app.get("/try", async (req, res, next) => {
  await new Promise((r) => setTimeout(r, 1000));
  return res.json({ time: new Date().toLocaleTimeString() });
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

// for the admin user, 1-N
User.hasMany(Product);
Product.belongsTo(User, { onDelete: "CASCADE" }); // syntax: talks about onDelete of target.
// What it does here? Delete all products related to a user when the user is deleted

// // adding cart model, 1-1
// User.hasOne(Cart);
// Cart.belongsTo(User);

// // cart and cartItem, 1-N
// Cart.hasMany(CartItem);
// CartItem.belongsTo(Cart);

// // extra stuff, for ease of 'joined' pages
// // 1-
// CartItem.hasOne(Product);
// // Product.belongsTo(CartItem); // no, doesn't make sense, OMIT

// // N-M
// // Cart.hasMany(Product, { through: CartItem }); // correct, but Sequelize has weird notation, it forces `belongsToMany` on both sides.
// Cart.belongsToMany(Product, { through: CartItem });
// Product.belongsToMany(Cart, { through: CartItem });

sequelize
  .sync()
  .then(() => {
    app.listen(process.env.PORT || 3000);
  })
  .catch(console.log);
