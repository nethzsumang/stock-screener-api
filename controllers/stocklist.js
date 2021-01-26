const { getStockList } = require('../request/stocklist');

module.exports = {
    getStockList : async (req, res) => {
        let { data } = await getStockList();
        res.send(data);
    }
};