const path = require("path");

const { mongoConnect, getDb } = require("./util/database.js");

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

// const adminRoutes = require("./routes/admin");
// const shopRoutes = require("./routes/shop");
// const errorController = require("./controllers/error");
// const User = require("./models/User");

// app.set('view engine', 'pug');
// app.set('views', 'views'); // not needed for this case, actually
app.set("view engine", "ejs");
app.set("views", "views"); // not needed for this case, actually

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());
// mock authentication, i.e. get user who's making the request
// app.use(async (req, res, next) => {
//   req.user = await User.findByPk(1);
//   next();
// });

app.get("/try", async (req, res, next) => {
  await new Promise((r) => setTimeout(r, 1000));
  return res.json({ time: new Date().toLocaleTimeString() });
});

// app.use("/admin", adminRoutes);
// app.use(shopRoutes);

// app.use(errorController.get404);

// express code

// start express from inside the mongoConnect callback
mongoConnect(async (client) => {
  const db = getDb();
  console.log(db);
  // database setup code, if needed
  db.collection("trial-collection")
    .insertOne({ name: "Woods", friendName: "Mason" })
    .then(console.log)
    .catch(console.log);

  app.listen(3000);
});
