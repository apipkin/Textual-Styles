var lastMsg = {},

	updateBodyHome = function () {
		var winHeight = window.frames.innerHeight,
			homeNode = document.getElementById('body_home'),
			homeHeight = homeNode.scrollHeight;

		if (homeHeight > winHeight) {
			homeNode.className += ' big';
			setTimeout(function () {
				updateBodyHome = null;
			}, 0);
		}
	};


/* Defined in: "Textual.app -> Contents -> Resources -> JavaScript -> API -> core.js" */
Textual.newMessagePostedToView = function (line) {
	
	//(updateBodyHome && updateBodyHome());

	var lineQuery = _sub('#line{line}.text, #line-{line}.text', { line: line }),
		lineNode = document.querySelector(lineQuery),
		senderNode,
		sender,
		type;


	if (lineNode.previousSibling.id === 'mark') {
		lastMsg = {};
		return;
	}

	if (!lineNode) {
		lastMsg = {};
		return;
	}

	senderNode = document.querySelector(lineQuery + ' .sender');
	sender = lineNode.getAttribute('data-sender');
	type = lineNode.getAttribute('data-type');

	if (!type) {
		return;
	}

	if (lastMsg.type === type && lastMsg.sender === sender) {
		lineNode.className += ' hide-sender';
		lineNode.previousSibling.className += ' has-next';
	}

	lastMsg = {
		type: type,
		sender: sender || null
	};

};

Textual.viewFinishedLoading = function () {
	console.log('viewFinishedLoading');

	Textual.fadeInLoadingScreen(1.00, 0.95);

	setTimeout(function() {
		Textual.scrollToBottomOfView()
	}, 500);

	lastMsg = {};

};

Textual.viewFinishedReload =  function () {
	console.log('viewFinishedReload');
	Textual.viewFinishedLoading();
};


var _sub = function (str, obj) {
	var regex;

	for (o in obj) {
		if (obj.hasOwnProperty(o)) {
			regex = new RegExp('{' + o + '}', 'ig');
			str = str.replace(regex, obj[o]);
		}
	}

	return str;
};