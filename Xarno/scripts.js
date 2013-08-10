/* Defined in: "Textual.app -> Contents -> Resources -> JavaScript -> API -> core.js" */

/**
 Storage of the last message that was triggered in the post. 
 @property lastMsg
 @type Object
**/
var lastMsg = {
		/* type */
		/* sender */
	},
	
	/** 
	 Storage of previousSibling to the current history indicator positoin
	 @property markPrevNode
	 @type DOMNode
	**/
	markPrevNode;

/** 
 Looks at current line and previous line and tries to determine if they should
 be visually merged together. This is accomplished by adding `has-next` to the
 previous line and `hide-sender` to the current line being added.

 @method newMessagePostedToView
 @param {String} line Unique id of the line just added to the list
 */
Textual.newMessagePostedToView = function (line) {
	
	//(updateBodyHome && updateBodyHome());

	var lineQuery = _sub('#line{line}.line, #line-{line}.line', { line: line }),
		lineNode = document.querySelector(lineQuery),
		senderNode,
		sender,
		type;

	if (!lineNode || (lineNode.previousSibling && lineNode.previousSibling.id === 'mark')) {
		// TODO: Determine if `lastMsg` should be emptied if no lineNode was added
		//lastMsg = {};
		return;
	}

	senderNode = document.querySelector(lineQuery + ' .sender');
	sender = lineNode.getAttribute('data-sender');
	type = lineNode.getAttribute('data-type');

	if (!type) {
		// TODO: Determine if `lastMsg` should be emptied if no type was found
		//lastMsg = {};
		return;
	}

	if (lastMsg.type === type && lastMsg.sender === sender) {
		_addClass(lineNode, 'hide-sender');
		_addClass(lineNode.previousSibling, ' has-next');
	}

	lastMsg = {
		type: type,
		sender: sender || null
	};

};

/**
 When history mark is moved, check to see if it was previously between two like 
 line types from the same author. If they were, join them back together by adding
 `has-next` to the previous line className and `hide-sender` to the next line
 className

 @method historyIndicatorAddedToView
 **/
Textual.historyIndicatorAddedToView = function () {
	var markNode = document.querySelector('#mark'),
		prevLine = {},
		nextLine = {};

	if (markPrevNode) {
		prevLine = markPrevNode;
		nextLine = prevLine.nextSibling;

		prevLine = {
			node: prevLine,
			type: prevLine.getAttribute('data-type'),
			sender: prevLine.getAttribute('data-sender')
		};

		nextLine = {
			node: nextLine,
			type: nextLine.getAttribute('data-type'),
			sender: nextLine.getAttribute('data-sender')
		};

		if (prevLine.type === nextLine.type && prevLine.sender === nextLine.sender) {
			_addClass(prevLine.node, 'has-next');
			_addClass(nextLine.node, 'hide-sender');
		}
	}

	markPrevNode = markNode.previousSibling;
};


Textual.viewFinishedLoading = function () {
	Textual.fadeInLoadingScreen(1.00, 0.95);

	setTimeout(function() {
		Textual.scrollToBottomOfView()
	}, 500);

	lastMsg = {};

};

Textual.viewFinishedReload =  function () {
	Textual.viewFinishedLoading();
};


/**
 Does a simple string replace using object key value pairs. This substitution 
 method will replace `{key}` matches with the value of the key in the provided
 object. If an instance of `{key}` is in the source string but that key is not
 found, the token will remain in the returned string.
 @method _sub
 @protected
 @param {String} str Source string to have substitutions performed on
 @param {Object} obj Object consisting of key value pairs for replacement
 @return {String} Modified string after replacement
**/
var _sub = function (str, obj) {
		var regex;

		for (o in obj) {
			if (obj.hasOwnProperty(o)) {
				regex = new RegExp('{' + o + '}', 'ig');
				str = str.replace(regex, obj[o]);
			}
		}

		return str;
	},

	/**
	 Adds provided class(es) to the node. Ensures no duplicate classNames are added
	 due to this method.
	 @method _addClass
	 @protected
	 @param {DOMNode} node Node to which classNames will be added
	 @param {String} classes...n List of classnames to add to the provided node
	 */
	_addClass = function (node /*, classes...n */) {
		var args = Array.prototype.slice.call(arguments),
			node = args.shift(),
			className = (node.className || '').split(' '),
			i,
			len;

		for (i = 0, len = args.length; i < len; i++) {
			if (className.indexOf(args[i]) < 0) {
				className.push(args[i]);
			}
		}

		node.className = className.join(' ');
	};

