const { getStockFinancialHtml, getStockTechnicalData } = require('../request/stockinfo');
const cheerio = require('cheerio');
const _ = require('lodash');
const papa = require('papaparse');

module.exports = {
    getStockFinancial: async function (stockCode) {
        try {
            let { data } = await getStockFinancialHtml(stockCode);
            return module.exports.parseStockFinancialHtml(data);
        } catch (oException) {
            console.log(oException);
            return {};
        }
    },
    getStockTechnicalData : async function (stockCode, params) {
        try {
            let { data } = await getStockTechnicalData(stockCode, {
                num_rows   : params.num_rows   || 30,
                range_days : params.range_days || 30,
                startDate  : params.startDate  || '12/01/2020',
                endDate    : params.endDate    || '12/31/2020'
            });
            let records = await module.exports.parseStockTechnicalData(data);
            let recordData = records.data;

            return _.map(recordData, (record) => {
                let data = _.mapKeys(record, (value, key) => {
                    return key.trim();
                });
                return _.mapValues(data, (value, key) => {
                    if (key === 'Date') {
                        return value.trim();
                    }
                    return parseFloat(value.trim());
                })
            });
        } catch (oException) {
            console.log(oException);
            return oException;
        }
    },
    parseStockFinancialHtml : function (html) {
        const PE_RATIO_SELECTOR = '.cr_dataTable.cr_sub_valuation tbody tr:nth-child(1) td:nth-child(1) span.data_data';
        const PSALES_RATIO_SELECTOR = '.cr_dataTable.cr_sub_valuation tbody tr:nth-child(3) td:nth-child(1) span.data_data';
        const PBOOK_RATIO_SELECTOR = '.cr_dataTable.cr_sub_valuation tbody tr:nth-child(4) td:nth-child(1) span.data_data';
        const PCASH_FLOW_RATIO_SELECTOR = '.cr_dataTable.cr_sub_valuation tbody tr:nth-child(5) td:nth-child(1) span.data_data';

        const EPS_SELECTOR = '.cr_dataTable.cr_mod_pershare tbody tr:nth-child(1) td:nth-child(1) span.data_data';
        const BOOK_VALUE_SELECTOR = '.cr_dataTable.cr_mod_pershare tbody tr:nth-child(2) td:nth-child(1) span.data_data';
        
        const ROA_SELECTOR = '.cr_dataTable.cr_sub_profitability tbody tr:nth-child(5) td:nth-child(1) span.data_data';
        const ROE_SELECTOR = '.cr_dataTable.cr_sub_profitability tbody tr:nth-child(6) td:nth-child(1) span.data_data';

        const $ = cheerio.load(html);

        let oData = {};

        oData['priceEarningsRatio'] = $(PE_RATIO_SELECTOR);
        oData['priceSalesRatio'] = $(PSALES_RATIO_SELECTOR);
        oData['priceBookRatio'] = $(PBOOK_RATIO_SELECTOR);
        oData['priceCashFlowRatio'] = $(PCASH_FLOW_RATIO_SELECTOR);

        oData['earningsPerShare'] = $(EPS_SELECTOR);
        oData['bookValue'] = $(BOOK_VALUE_SELECTOR);

        oData['returnOnAssets'] = $(ROA_SELECTOR);
        oData['returnOnEquity'] = $(ROE_SELECTOR);

        oData = _.mapValues(oData, (oElement) => {
            // checks if it has a child `span` element
            let iChildLength = oElement.children('span').length;
            if (iChildLength > 0) {
                // if it has a child `span` element, get it
                oElement = oElement.children('span');
            }

            let sData = oElement.html();
            // if the data is not a number, return null
            if (isNaN(sData) === true) {
                return null;
            }

            // else, parse it as float.
            return parseFloat(sData);
        });
        
        return oData;
    },
    parseStockTechnicalData : async function (stream) {
        const asyncParse = function (file) {
            return new Promise(function(complete, error) {
                papa.parse(file, {
                    header : true,
                    complete,
                    error
                });
            });
        }

        return await asyncParse(stream);
    }
};