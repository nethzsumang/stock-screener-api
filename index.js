const express = require('express');
const app = express();
const cors = require('cors');
const port = 3000;

app.use(cors());

const stockListController = require('./controllers/stocklist');

app.get('/api/v1/stocklist', stockListController.getStockList);

app.listen(port, () => {
  console.log(`Stock List API listening at http://localhost:${port}`);
});