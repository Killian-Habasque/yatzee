// app.js
const express = require('express');
const cors = require('cors');
const routes = require('./routes/routes');
const cookieParser = require('cookie-parser');

const app = express();
app.use(express.json());
app.use(cookieParser());

const corsOptions = {
  origin: 'https://www.yatzee.fr',
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

app.use("/", express.static("./public"));
app.use('/api', routes);

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`Le serveur back tourne correctement sur le port ${port}`);
});