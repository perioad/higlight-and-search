/*
	TODO:
	1. hide icon if the user presses backspace
	2. ctrl + a not showing icon
	3. stop propagation on listeners?
	4. check permissions
	5. remove listeners?
	6. handle selection of an empty string
	7. // chrome.windows.create(
	   // 	{ type: 'popup', url: 'http://www.google.com', width: 600, height: 400 }
	   // )
	8.
*/

const IMPORTANT = 'important';
const postfix = 'L8jAd7LRN8';
const PX = 'px';
const searchButtonClass = `highlightAndSearchButton_${postfix}`;
const searchButtonHiddenClass = `${searchButtonClass}--hidden`;
const searchButtonVisibleClass = `${searchButtonClass}--visible`;
const searchButton = createSearchButton();

let state = {
	selection: null,
	selectionText: null,
	isNewSelection: null,
	offSites: [],
};

function onSearchButtonClick() {
	hideSearchButton();
	chrome.runtime.sendMessage({ searchQuery: state.selectionText });
}

function highlightAndSearch() {
	state.selection = document.getSelection();
	state.selectionText = state.selection.toString();

	if (!state.selectionText) {
		hideSearchButton();

		return;
	}

	state.isNewSelection = true;
}

function placeSearchButton(event) {
	event.stopPropagation();

	if (!state.selectionText || !state.isNewSelection) {
		return;
	}

	const left = event.x + window.scrollX + 10 + PX;
	const top = isEventOnTopScreenHalf(event)
		? event.y + window.scrollY + 10 + PX
		: event.y + window.scrollY + 10 + PX;

	searchButton.style.setProperty('left', left, IMPORTANT);
	searchButton.style.setProperty('top', top, IMPORTANT);

	showSearchButton();
	state.isNewSelection = false;
}

function createSearchButton() {
	const searchButton = document.createElement('button');
	const iconUrl = chrome.runtime.getURL('icons/highlightandsearch256w.png');

	searchButton.classList.add(searchButtonClass, searchButtonHiddenClass);
	searchButton.style.setProperty('background-image', `url(${iconUrl}`, IMPORTANT);
	searchButton.addEventListener('click', onSearchButtonClick);
	document.body.append(searchButton);

	return searchButton;
}

function hideSearchButton() {
	searchButton.classList.replace(searchButtonVisibleClass, searchButtonHiddenClass);
}

function showSearchButton() {
	searchButton.classList.replace(searchButtonHiddenClass, searchButtonVisibleClass);
}

function isEventOnTopScreenHalf(event) {
	return window.innerHeight / 2 - event.y > 0;
}

function runHiglightAndSearch() {
	document.addEventListener('selectionchange', highlightAndSearch);
	document.addEventListener('mouseup', placeSearchButton);
}

function disableHiglightAndSearch() {
	hideSearchButton();
	document.removeEventListener('selectionchange', highlightAndSearch);
	document.removeEventListener('mouseup', placeSearchButton);
}

chrome.storage.onChanged.addListener(function (changes) {
	const { isOn } = changes;

	if (isOn !== undefined) {
		if (isOn.newValue) {
			runHiglightAndSearch();
		} else if (!isOn.newValue) {
			disableHiglightAndSearch();
		}
	}
});

chrome.runtime.onMessage.addListener(({offThisSite}) => {
	if (offThisSite) {

	} else {

	}
});

(async () => {
	console.log('start');

	const { isOn, offSites } = await chrome.storage.sync.get(['isOn', 'offSites']);

	if (isOn && !offSites.includes(document.location.hostname)) {
		state.offSites = offSites;

		runHiglightAndSearch();
	};
})();
