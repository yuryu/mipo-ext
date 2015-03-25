"use strict";

function onInit() {
    chrome.tabs.onUpdated.addListener(onTabUpdated);
    chrome.tabs.onSelectionChanged.addListener(onTabSelectionChanged);
    chrome.onMessage.addListener(onMessage);
}

function onTabUpdated(tabId, changeInfo, tab) {
    if ( changeInfo.status == 'loading' ) {

    }
}

function onTabSelectionChanged(activeInfo) {

}

chrome.runtime.onInstalled.addListener(onInit);

