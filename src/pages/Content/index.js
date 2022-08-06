chrome.runtime.onMessage.addListener(async ({ action, data }) => {
    switch (action) {
        case 'COPY_STOCK_DATA': {
            const stockData = await getStockData();
            chrome.runtime.sendMessage({ action: 'FILL_STOCK_DATA', data: stockData });
            break;
        }
        case 'FILL_STOCK_DATA': {
            fillStockData(data);
            break;
        }
        default:
            console.warn('Unknown action')
    }
})

function fillStockData(data) {
    const formFields = document.querySelectorAll('.formFieldWrapper input');
    formFields[0].value = data.nameOfStock;
    formFields[1].value = data.quoteChange;
    formFields[2].value = data.unixTimestamp
}

async function getStockData() {
    const secondHighestStockRowQuery = '.MarketTop-topTable tbody tr';
    await waitForElement(secondHighestStockRowQuery);
    const secondHighestStockRow = document.querySelectorAll(secondHighestStockRowQuery)[1];
    const nameOfStock = secondHighestStockRow.querySelector('.MarketTop-name').textContent;
    const quoteChange = secondHighestStockRow.querySelector('.MarketTop-quoteChange').textContent;
    const unixTimestamp = getCurrentUnixTime();
    return { nameOfStock, quoteChange, unixTimestamp };
}

function getCurrentUnixTime() {
    const date = new Date();
    const unixTimestamp = Math.floor(date.getTime() / 1000);
    return unixTimestamp;
}


function waitForElement(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(() => {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}
