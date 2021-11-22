chrome.action.onClicked.addListener(async () => {
	const currentTabId = await getCurrentTabId();

	chrome.scripting.executeScript({
		target: { tabId: currentTabId },
		files: ['script.js'],
	  });
});

async function getCurrentTabId() {
	const queryOptions = { active: true, currentWindow: true };
	const [tab] = await chrome.tabs.query(queryOptions);

	return tab.id;
  }