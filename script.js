console.log('start');
document.addEventListener('selectionchange', highlightAndSearch);
document.addEventListener('mouseup', placeSearchButton);

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

	const left = event.x + window.scrollX + PX;
	const top = isEventOnTopScreenHalf(event)
		? event.y + window.scrollY + searchButton.offsetHeight / 1.5 + PX
		: event.y + window.scrollY - searchButton.offsetHeight / 1.5 + PX;

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
