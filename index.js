const express = require('express');
const bodyParser = require("body-parser");
const router = require("./config/route.js");
const cors = require("cors");

require("dotenv").config();

const app = express();

// const paramMorgan = ':date :method :url :status :res[content-length] - :response-time ms :remote-addr :req[headers] :res[headers] :user-agent';

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// app.use(mongoMorgan( process.env.MONGO_MORGAN_URI, paramMorgan, {
//   collection: 'logs'
// }));
app.use(cors());
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: {},
  });
});

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "*");
  res.setHeader("Access-Control-Allow-Headers", "Authorization");
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});
app.use(express.static('public'));
const port = process.env.PORT;
router.route(app);
app.listen(port, () => console.log(`Example app listening on port ${port}`));