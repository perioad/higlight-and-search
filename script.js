console.log('start');
document.addEventListener('selectionchange', highlightAndSearch);

const glass = '#a8ccd766';
const uniquePostfix = 'L8jAd7LRN8';
const searchButtonClass = `highlightAndSearchButton_${uniquePostfix}`;
const searchButtonHiddenClass = `${searchButtonClass}--hidden`;
const searchButtonVisibleClass = `${searchButtonClass}--visible`;
const searchButton = createSearchButton();

let selectionText = null;

function onSearchButtonClick() {
	chrome.runtime.sendMessage({ searchQuery: selectionText });
}

function highlightAndSearch() {
	const selection = document.getSelection();

	selectionText = selection.toString();

	if (!selectionText) {
		hideSearchButton();

		return;
	}

	const selectionCoordinates = getSelectionCoordinates(selection);

	applySearchButtonCoordinates(searchButton, selectionCoordinates);
	showSearchButton();
}

function getSelectionCoordinates(selection) {
	const firstSelection = selection.getRangeAt(0);

	return firstSelection.collapsed
		? firstSelection.startContainer.getBoundingClientRect()
		: firstSelection.getBoundingClientRect();
}

function applySearchButtonCoordinates(searchButton, selectionCoordinates) {
	const px = 'px';

	if (window.innerHeight - selectionCoordinates.bottom - searchButton.offsetHeight >= 0) {
		searchButton.style.top = selectionCoordinates.bottom + searchButton.offsetHeight / 2 + window.scrollY + px;
	} else {
		searchButton.style.top = selectionCoordinates.top - searchButton.offsetHeight / 2 + window.scrollY + px;
	}

	searchButton.style.left = selectionCoordinates.left + selectionCoordinates.width / 2 + window.scrollX + px;
}

function createSearchButton() {
	const searchButton = document.createElement('button');
	const iconUrl = chrome.runtime.getURL('icons/highlightandsearch256w.png');

	searchButton.classList.add(searchButtonClass, searchButtonHiddenClass);
	searchButton.style.backgroundImage = `url(${iconUrl}`;
	searchButton.addEventListener('click', onSearchButtonClick);
	appendSearchButtonToBody(searchButton);

	return searchButton;
}

function appendSearchButtonToBody(searchButton) {
	document.body.append(searchButton);
}

function hideSearchButton() {
	searchButton.classList.replace(searchButtonVisibleClass, searchButtonHiddenClass);
}

function showSearchButton() {
	searchButton.classList.replace(searchButtonHiddenClass, searchButtonVisibleClass);
}
