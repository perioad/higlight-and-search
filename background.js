console.log("background start");

const searchEngines = {
	google: 'https://www.google.com/search?q=',
	yandex: 'https://yandex.ru/search/?text=',
	duckDuckGo: 'https://duckduckgo.com/?q=',
	cambridgeDictionary: 'https://dictionary.cambridge.org/us/dictionary/english/',
	merriamWebsterDictionary: 'https://www.merriam-webster.com/dictionary/',
};
let currentSearchEngine = 'google';

chrome.runtime.onInstalled.addListener(
	async (details) => {
		if (details.reason === 'install') {
			const initialStorage = {
				isOn: true,
				searchEngine: 'google',
				offSites: [],
			};

			await chrome.storage.sync.set(initialStorage);
		}
	}
);
chrome.runtime.onMessage.addListener(handleMessages);
chrome.storage.onChanged.addListener(function (changes) {
	const { searchEngine } = changes;

	if (searchEngine !== undefined) {
		currentSearchEngine = searchEngine.newValue;
	}
});

async function getCurrentTab() {
	const w = await chrome.windows.getCurrent();
	const queryOptions = { active: true, windowId: w.id };
	const [tab] = await chrome.tabs.query(queryOptions);

	return tab;
}

function getHostname(url) {
	return new URL(url).hostname;
}

async function handleMessages({ searchQuery }) {
	if (searchQuery) {
		const url = `${searchEngines[currentSearchEngine]}${searchQuery}`;

		chrome.tabs.create({
			url,
		});
	}

	// if (offThisSite !== undefined && offThisSite) {
	// 	const tab = await getCurrentTab();
	// 	const hostname = getHostname(tab.url);
	// 	tab.url;
	// } else if (offThisSite !== undefined && !offThisSite) {
	// 	const tab = await getCurrentTab();
	// 	tab.url;
	// }
}

(async () => {
	const { searchEngine } = await chrome.storage.sync.get(['searchEngine']);

	if (searchEngine !== undefined) {
		currentSearchEngine = searchEngine;
	}
})();

console.log("background end");
