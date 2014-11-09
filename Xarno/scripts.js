/* Defined in: "Textual 5.app -> Contents -> Resources -> JavaScript -> API -> core.js" */

var mappedSelectedUsers = new Array(),

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
	_sub = function (str, obj) {
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
	},

	/**
	 Removes provided class(es) from the node.
	 @method _removeClass
	 @protected
	 @param {DOMNode} node Node to which classNames will be added
	 @param {String} classes...n List of classnames to add to the provided node
	 */
	_removeClass = function (node /*, classes...n */) {
		var args = Array.prototype.slice.call(arguments),
			node = args.shift(),
			className = (node.className || '').split(' '),
			classes = [],
			i,
			len;

		for (i = 0, len = className.length; i < len; i++) {
			if (args.indexOf(className[i]) < 0) {
				classes.push(className[i]);
			}
		}

		node.className = classes.join(' ');
	};

Textual.viewBodyDidLoad = function()
{
	console.log('yup');

	Textual.fadeOutLoadingScreen(1.00, 0.95);

	setTimeout(function() {
		Textual.scrollToBottomOfView()
	}, 500);

console.log(document.querySelector('#toolbar button'));

	document.querySelector('#toolbar button').addEventListener('click', function (e) {
		var htmlNode = document.querySelector('html');

		if (htmlNode.className.match('dark')) {
			_removeClass(htmlNode, 'dark');
		} else {
			_addClass(htmlNode, 'dark');
		}
	});

}

Textual.newMessagePostedToView = function(line)
{
    var element = document.getElementById("line-" + line);

    updateNicknameAssociatedWithNewMessage(element);
}

Textual.nicknameSingleClicked = function(e)
{
	userNicknameSingleClickEvent(e);
}

function updateNicknameAssociatedWithNewMessage(e)
{
	/* We only want to target plain text messages. */
	var elementType = e.getAttribute("ltype");

	if (elementType == "privmsg" || elementType == "action") {
		/* Get the nickname information. */
		var senderSelector = e.querySelector(".sender");

		if (senderSelector) {
			/* Is this a mapped user? */
			var nickname = senderSelector.getAttribute("nickname");

			/* If mapped, toggle status on for new message. */
			if (mappedSelectedUsers.indexOf(nickname) > -1) {
				toggleSelectionStatusForNicknameInsideElement(senderSelector);
			}
		}
	}
}

function toggleSelectionStatusForNicknameInsideElement(e)
{
	/* e is nested as the .sender so we have to go three parents
	 up in order to reach the parent div that owns it. */
	var parentSelector = e.parentNode.parentNode.parentNode.parentNode;

	parentSelector.classList.toggle("selectedUser");
}

function userNicknameSingleClickEvent(e)
{
	/* This is called when the .sender is clicked. */
	var nickname = e.getAttribute("nickname");

	/* Toggle mapped status for nickname. */
	var mappedIndex = mappedSelectedUsers.indexOf(nickname);

	if (mappedIndex == -1) {
		mappedSelectedUsers.push(nickname);
	} else {
		mappedSelectedUsers.splice(mappedIndex, 1);
	}

	/* Gather basic information. */
    var documentBody = document.getElementById("body_home");

    var allLines = documentBody.querySelectorAll('div[ltype="privmsg"], div[ltype="action"]');

	/* Update all elements of the DOM matching conditions. */
    for (var i = 0, len = allLines.length; i < len; i++) {
        var sender = allLines[i].querySelectorAll(".sender");

        if (sender.length > 0) {
            if (sender[0].getAttribute("nickname") === nickname) {
				toggleSelectionStatusForNicknameInsideElement(sender[0]);
            }
        }
    }
}