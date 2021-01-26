const axios = require('axios');

const STOCK_LIST_ENDPOINT = 'https://pse.com.ph/stockMarket/companyInfoSecurityProfile.html?method=getListedRecords';

module.exports = {
    getStockList : async () => {
        return axios.post(
            STOCK_LIST_ENDPOINT,
            {},
            {
                headers : {
                    Host    : 'pse.com.ph',
                    Referer : 'https://pse.com.ph/',
                    Origin  : 'https://pse.com.ph/'
                }
            }
        );
    }
}