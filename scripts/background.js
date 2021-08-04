// Enable the badge on all pages
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) { 
  if(changeInfo.status == "complete" && tab.url.includes("youtube.com/feed/subscriptions")){
    performPurge()
  }
});

function performPurge() {
  chrome.tabs.executeScript(null, {file: "scripts/purge.js"}, function() {
    chrome.tabs.executeScript(null, {code: "startPurge();"})
  });
}
