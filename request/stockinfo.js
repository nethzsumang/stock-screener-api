const axios = require('axios');

const STOCK_INFO_FINANCIAL = 'https://www.wsj.com/market-data/quotes/PH/XPHS/{stock}/financials';
module.exports = {
    getStockFinancialHtml : async (stockCode) => {
        let sUrl = STOCK_INFO_FINANCIAL.replace('{stock}', stockCode.toUpperCase());
        return axios.get(sUrl);
    }
}