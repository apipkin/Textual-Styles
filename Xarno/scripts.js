var lastMsg = {};

/* Defined in: "Textual.app -> Contents -> Resources -> JavaScript -> API -> core.js" */
Textual.newMessagePostedToView = function (line) {
	var lineQuery = _sub('#line{line}.text, #line-{line}.text', { line: line }),
		lineNode = document.querySelector(lineQuery),
		senderNode,
		sender,
		type;

	if (!lineNode) {
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
	Textual.fadeInLoadingScreen(1.00, 0.95);

	setTimeout(function() {
		Textual.scrollToBottomOfView()
	}, 500);

	lastMsg = {};
};

Textual.viewFinishedReload = function () {
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