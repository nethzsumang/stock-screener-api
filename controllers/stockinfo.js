const { getStockFinancialHtml, getStockTechnicalData } = require('../request/stockinfo');
const { parseStockFinancialHtml, parseStockTechnicalData } = require('../services/stockinfo');
const _ = require('lodash');

module.exports = {
    getStockFinancial : async (req, res) => {
        const stockCode = req.params.stock;
        try {
            let { data } = await getStockFinancialHtml(stockCode);
            let oData = parseStockFinancialHtml(data);
            res.send(oData);
        } catch (oException) {
            res.send({});
        }
    },
    getStockTechnical : async (req, res) => {
        const stockCode = req.params.stock;
        try {
            let { data } = await getStockTechnicalData(stockCode, {
                num_rows   : req.query.num_rows || 30,
                range_days : req.query.range_days || 30,
                startDate  : req.query.startDate || '12/01/2020',
                endDate    : req.query.endDate || '12/31/2020'
            });
            let records = await parseStockTechnicalData(data);
            let recordData = records.data;

            recordData = _.map(recordData, (record) => {
                let data = _.mapKeys(record, (value, key) => {
                    return key.trim();
                });
                return _.mapValues(data, (value, key) => {
                    if (key === 'Date') {
                        return value.trim();
                    }
                    return parseFloat(value.trim());
                })
            })
            res.send(recordData);
        } catch (oException) {
            res.send(oException);
        }
    }
};