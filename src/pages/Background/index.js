const PENDING_ACTIONS = [];

function createTab({ url }, callback) {
    chrome.tabs.create({ url }, callback);
}

chrome.runtime.onMessage.addListener((message) => {
    switch (message.action) {
        case 'RUN_PROGRAM': {
            createTab({ url: 'https://www.cnbc.com/us-market-movers/' }, (tab) => {
                PENDING_ACTIONS.push({ message: { action: 'COPY_STOCK_DATA' }, tabId: tab.id });
            })
            break;
        }
        case 'FILL_STOCK_DATA': {
            createTab({ url: 'https://tinyurl.com/mtpzcucb' }, (tab) => {
                PENDING_ACTIONS.push({ message: { action: 'FILL_STOCK_DATA', data: message.data }, tabId: tab.id });
            })
            break;
        }
        default:
            console.warn('Unknown action');
    }
})

chrome.tabs.onUpdated.addListener((tabId, { status }) => {
    const pendingActionIndex = PENDING_ACTIONS.findIndex(action => action.tabId === tabId)
    if (pendingActionIndex > -1 && status === 'complete') {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            tabs.forEach(tab => {
                if (tab.id === tabId) {
                    chrome.tabs.sendMessage(tab.id, PENDING_ACTIONS[pendingActionIndex].message);
                    PENDING_ACTIONS.splice(pendingActionIndex, 1);
                }
            })
        })
    }
});

