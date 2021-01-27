const { getStockFinancialHtml } = require('../request/stockinfo');
const { parseStockFinancialHtml } = require('../services/stockinfo');

module.exports = {
    getStockFinancial : async (req, res) => {
        const stockCode = req.params.stock;
        let { data } = await getStockFinancialHtml(stockCode);
        let oData = parseStockFinancialHtml(data);
        res.send(oData);
    }
};