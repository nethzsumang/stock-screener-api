const { getStockFinancial, getStockTechnicalData } = require('../services/stockinfo');
const _ = require('lodash');

module.exports = {
    getStockFinancial : async (req, res) => {
        const stockCode = req.params.stock;
        let data = await getStockFinancial(stockCode);
        res.send(data);
    },
    getStockTechnical : async (req, res) => {
        const stockCode = req.params.stock;
        let data = await getStockTechnicalData(stockCode, req.query);
        res.send(data);
    },
    getCombinedStockInfo : async (req, res) => {
        const stockCode = req.params.stock;
        let financialData = await getStockFinancial(stockCode);
        let technicalData = await getStockTechnicalData(stockCode, req.query);
        res.send({
            fundamentals : financialData,
            technicals   : technicalData
        });
    }
};