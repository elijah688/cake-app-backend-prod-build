const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require("path");

const cakeRoutes = require("./routes/cake");
const authRoutes = require("./routes/auth");

mongoose.connect('mongodb+srv://Elijah:'+ process.env.MONGO_ATLAS_PW +'@cluster0-rpcqd.mongodb.net/cakes-app?retryWrites=true&w=majority', {useUnifiedTopology: true, useNewUrlParser: true})
  .then(()=>{
    console.log("Connection to MongoDB CLuster Successful!");
  }).catch(() => {
    console.log("Connection to MongoDB CLuster Failed!");
  });
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/images", express.static(path.join(__dirname + "/images")));


app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, OPTIONS, DELETE");
  next();
});

app.use("/api/cake", cakeRoutes);
app.use("/api/auth", authRoutes);

app.use((err, req, res, next) =>{
    console.log('ERROR==============================================================')
    console.error(err.stack)
    res.json(err.message);
});

module.exports = app;