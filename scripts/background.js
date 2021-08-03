

// Called when the user clicks on the page action.
chrome.pageAction.onClicked.addListener(function(tab) {
  performPurge()
});

// Enable the badge on all pages
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) { 
  chrome.pageAction.show(tabId)
});

function performPurge() {
  chrome.tabs.executeScript(null, {file: "purge.js"}, function() {
    chrome.tabs.executeScript(null, {code: "purge();"})
  });
}
