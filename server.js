const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const cookieParser = require('cookie-parser');
const expressvalidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const app = express();

const mongo = require('mongodb');
const mongoose = require('mongoose');
mongoose.connect('mongodb://<dbuser>:<dbpassword>@ds123444.mlab.com:23444/cnoris')
let db = mongoose.connection;

// Routes


app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({'defaultLayout': 'layout'}));
app.set('view engine', 'handlebars');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : false}));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret : 'her',
  saveUnitialized : true,
  resave : true
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(expressvalidator({
  errorFormatter: (param, msg, value) => {
    var namespace = param.split('.')
    , root = namespace.shift()
    , formParam = root;

    while(namespace.length){
      formParam += '['+ namespace.shift() +']';
    }
    return{
      param : formParam,
      msg : msg,
      value : value
    };
  }
}));

app.use(flash());

app.use((req, res, next)=>{
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

require('./routes/index')(app, passport);


app.set('port', (process.env.PORT || 3000));

app.listen(app.get('port'), ()=>{
  console.log('server started on port' + app.get('port'));
});
