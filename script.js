console.log('start');
document.addEventListener('selectionchange', highlightAndSearch);

const glass = '#a8ccd766';
const searchButtonClass = makeUnique('highlightAndSearchButton');
const searchButtonHiddenClass = `${searchButtonClass}--hidden`;
const searchButtonVisibleClass = `${searchButtonClass}--visible`;
const iconUrl = chrome.runtime.getURL('icons/highlightandsearch256w.png');
const searchButton = createSearchButton();

let selectionText = null;

searchButton.addEventListener('click', onSearchButtonClick);

appendSearchButtonToBody(searchButton);
createStyles();

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

	// document.removeEventListener('mouseup', highlightAndSearch)
}

function getSelectionCoordinates(selection) {
	const firstSelection = selection.getRangeAt(0);

	return firstSelection.getBoundingClientRect();
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

function createStyles() {
	const styles = document.createElement('style');

	styles.innerHTML = `
		.${searchButtonClass} {
			position: absolute !important;
			width: 40px !important;
			height: 40px !important;
			transform: translate(-50%, -50%);
			background: url(${iconUrl}) no-repeat center ${glass} !important;
			background-size: contain !important;
			backdrop-filter: blur(0.5px);
			margin: 0 !important;
			padding: 0 !important;
			border: none !important;
			box-shadow: none !important;
			cursor: pointer !important;
			border-radius: 50% !important;
			z-index: 9999 !important;
			transition: width .2s, height .2s;
		}

		.${searchButtonClass}:hover {
			width: 50px !important;
			height: 50px !important;
		}

		.${searchButtonHiddenClass} {
			visibility: hidden !important;
		}

		.${searchButtonVisibleClass} {
			visibility: visible !important;
		}
	`;
	document.getElementsByTagName('head')[0].append(styles);
}

function makeUnique(str) {
	const uniqueString = '_L8jAd7LRN8';

	return str + uniqueString;
}

function createSearchButton() {
	const searchButton = document.createElement('button');

	searchButton.classList.add(searchButtonClass, searchButtonHiddenClass);

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
