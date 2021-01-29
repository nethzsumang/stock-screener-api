const cheerio = require('cheerio');
const _ = require('lodash');
const papa = require('papaparse');

module.exports = {
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