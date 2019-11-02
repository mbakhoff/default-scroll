'use strict';

let registrations = new Map();

function getMatch(tab) {
  return new URL(tab.url).origin + '/*';
}

function setContentScript(match, enabled) {
  if (enabled) {
    return browser.contentScripts.register({
      js: [{file: 'content.js'}],
      runAt: 'document_start',
      matches: [match]
    }).then(r => registrations.set(match, r));
  } else {
    let reg = registrations.get(match);
    if (reg) {
      reg.unregister();
      registrations.delete(match);
    }
    return Promise.resolve();
  }
}

function toggleCurrent() {
  browser.tabs.query({active: true, currentWindow: true}).then(tabs => {
    for (let tab of tabs) {
      if (!tab.url || !tab.url.startsWith('http'))
        continue;

      let match = getMatch(tab);
      setContentScript(match, !registrations.has(match)).then(() => {
        updateBadge(tab);
        browser.tabs.reload(tab.id);
      });
    }
  });
}

function updateBadge(tab) {
  let enabled = tab.url && registrations.has(getMatch(tab));
  browser.browserAction.setBadgeText({
    text: enabled ? '+' : null,
    tabId: tab.id
  });
}

function updateBadgeOnUpdate(tabId, changeInfo, tab) {
  updateBadge(tab);
}

browser.browserAction.onClicked.addListener(toggleCurrent);
browser.tabs.onUpdated.addListener(updateBadgeOnUpdate);
