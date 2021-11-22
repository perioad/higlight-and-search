console.log('start');
document.addEventListener('mouseup', highlightAndSearch);

const searchButtonClass = createUnique('highlightAndSearchButton');


function highlightAndSearch() {
	const selection = document.getSelection();
	const selectionText = selection.toString();

	if (!selectionText) {
		return;
	}

	createStyles();

	console.log('selection: ', selection);

	console.log(getSelectionCoordinates(selection));

	const selectionCoordinates = getSelectionCoordinates(selection);
	const searchButton = document.createElement('button');

	searchButton.innerText = 'Search';
	searchButton.className = searchButtonClass;
	document.body.append(searchButton);

	placeSearchButton(searchButton, selectionCoordinates)

	// document.removeEventListener('mouseup', highlightAndSearch)
}

function getSelectionCoordinates(selection) {
	const oRange = selection.getRangeAt(0);
	const oRect = oRange.getBoundingClientRect();

	return oRect;
}

function placeSearchButton(searchButton, selectionCoordinates) {
	if (window.innerHeight - selectionCoordinates.bottom - searchButton.offsetHeight > 0) {
		searchButton.style.top = selectionCoordinates.bottom + window.scrollY + 'px';
	} else {
		searchButton.style.top = selectionCoordinates.top - searchButton.offsetHeight + window.scrollY + 'px';
	}

	// check if it works when there is y-axis scroll bar
	if (window.innerWidth / 2 - selectionCoordinates.left > 0) {
		searchButton.style.left = selectionCoordinates.left + window.scrollX + 'px';
	} else {
		searchButton.style.right = window.innerWidth - selectionCoordinates.right + 'px';
	};
}

function createStyles() {
	const styles = document.createElement('style');
	// todo: find all text tags
	styles.innerHTML = `
		.${searchButtonClass} {
			position: absolute;
			width: 50px;
			height: 50px;
			color: #f2f2f2;
			background-image: url('./icons/highlightandsearch128.png');
			border-radius: 3px;
			box-shadow: 0 0 4px #f2f2f2;
			z-index: 9999;
		}
	`;
	document.getElementsByTagName('head')[0].append(styles);
}

function createUnique(str) {
	const uniqueString = 'L8jAd7LRN8';

	return str + uniqueString;
}