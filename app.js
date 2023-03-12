const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const app = express();

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

// app.set('view engine', 'pug');
// app.set('views', 'views'); // not needed for this case, actually
app.set('view engine', 'ejs');
app.set('views', 'views'); // not needed for this case, actually

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use((req, res, next) => {
  res.status(404).render('404', { myActivePath: '404-page', docTitle: 'Page Not Found'});
});

app.listen(process.env.PORT || 3000);
