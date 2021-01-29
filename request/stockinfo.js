const axios = require('axios');
const _ = require('lodash');

const STOCK_INFO_FINANCIAL = 'https://www.wsj.com/market-data/quotes/PH/XPHS/{stock}/financials';
const STOCK_INFO_TECHNICAL = 'https://www.wsj.com/market-data/quotes/PH/XPHS/{stock}/historical-prices/download';

module.exports = {
    getStockFinancialHtml : async (stockCode) => {
        let sUrl = STOCK_INFO_FINANCIAL.replace('{stock}', stockCode.toUpperCase());
        return axios.get(sUrl);
    },
    getStockTechnicalData : async (stockCode, params) => {
        let sUrl = STOCK_INFO_TECHNICAL.replace('{stock}', stockCode.toUpperCase());
        let oParams = _.merge({ MOD_VIEW : 'page' }, params);
        return axios.get(sUrl, {
            params       : oParams,
            responseType : 'stream'
        })
    }
}