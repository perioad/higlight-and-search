(async () => {
	const storage = await chrome.storage.sync.get(null);
	// alert('storage: ' + JSON.stringify(storage));

	if (storage.isOn) {
		window.onSwitch.checked = true;
	} else {
		window.offSwitch.checked = true;
	}

	window.switches.onchange = async () => {
		storage.isOn = window.onSwitch.checked;

		await chrome.storage.sync.set(storage);
	}

	window.searchEngineSelect.value = storage.searchEngine;
	window.searchEngineSelect.onchange = async () => {
		storage.searchEngine = window.searchEngineSelect.value;

		await chrome.storage.sync.set(storage);
	}


	// const offThisSiteLabelId = 'off-this-site-label';
	// const offThisSiteId = 'off-this-site';

	// const offThisSiteCheckbox = document.getElementById(offThisSiteId);

	// document.getElementById(offThisSiteLabelId).onchange = async () => {
	// 	chrome.runtime.sendMessage({ offThisSite: offThisSiteCheckbox.checked });
	// };
})();