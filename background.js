chrome.action.onClicked.addListener(async () => {
	const currentTabId = await getCurrentTabId();

	chrome.scripting.executeScript({
		target: { tabId: currentTabId },
		files: ['script.js'],
	});

	// chrome.tabs.onActivated.addListener(activeInfo => console.log(activeInfo));


});

chrome.runtime.onMessage.addListener(openNewTabWithSearch);

async function getCurrentTabId() {
	const queryOptions = { active: true, currentWindow: true };
	const [tab] = await chrome.tabs.query(queryOptions);

	return tab.id;
}

function openNewTabWithSearch({ searchQuery }) {
	chrome.tabs.create({
		url: `https://www.google.com/search?q=${searchQuery}`,
	});
}