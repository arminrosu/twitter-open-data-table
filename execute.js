// execute script for twitter-open-data-table.xml; code here with rhino:
// java -jar rhino.jar -version 160 execute.js

// fake YQL query
importPackage(java.io);
var file = readFile('results.html');
var html = new XML(file);

var statuses = [];

// Helpers
if ( !Date.prototype.toISOString ) {
	( function() {

		function pad(number) {
			var r = String(number);
			if ( r.length === 1 ) {
				r = '0' + r;
			}
			return r;
		}

		Date.prototype.toISOString = function() {
			return this.getUTCFullYear() +
			'-' + pad( this.getUTCMonth() + 1 ) +
			'-' + pad( this.getUTCDate() ) +
			'T' + pad( this.getUTCHours() ) +
			':' + pad( this.getUTCMinutes() ) +
			':' + pad( this.getUTCSeconds() ) +
			'.' + String( (this.getUTCMilliseconds()/1000).toFixed(3) ).slice( 2, 5 ) +
			'Z';
		};

	}() );
}

if(!String.prototype.trim) {
	String.prototype.trim = function () {
		return this.replace(/^\s+|\s+$/g,'');
	};
}

var hasClass = function(node, nodeClass) {
	if ( node.attribute('class') && node.attribute('class').toString().indexOf(nodeClass) !== -1 ) {
		return true;
	}

	return false;
};

var getNodeText = function(node) {
	var string = ' ',
		children = node.children();

	// filter some elements
	if( hasClass(node, 'tco-ellipsis') ) {
		return '';
	} else if( hasClass(node, 'twitter-timeline-link') ) {
		return ' ' + node.attribute('data-expanded-url').toString();
	} else if ( hasClass(node, 'twitter-atreply') ||
		(node.parent() && hasClass(node.parent(), 'twitter-atreply')) ||
		hasClass(node, 'twitter-hashtag') ||
		(node.parent() && hasClass(node.parent(), 'twitter-hashtag')) ) {
		string = '';
	}

	if ( node.hasSimpleContent() ) {
		string += node;
	} else {
		for each(var child in children ) {
			if (hasClass(child, 'twitter-atreply')) {
				string += ' ';
			}
			string += getNodeText(child);
		}
	}
	return string;
};

for each(var tweet in html.div) {
	// > div.content
	var content = tweet.div.(@class == 'content'); // RHINO
	// var content = y.xpath(tweet, '//div[@class = "content"]')[0];
	// a.tweet-timestamp
	var aTweetTimestamp = tweet..a.(@class.indexOf('tweet-timestamp') !== -1); // RHINO
	// var aTweetTimestamp = y.xpath(tweet, '//a[contains(@class, "tweet-timestamp")]')[0];
	// p.tweet-text
	var pTweetText = tweet..p.(@class.indexOf('tweet-text') !== -1); // RHINO
	// var pTweetText = y.xpath(tweet, '//p[contains(@class, "tweet-text")]')[0];

	// data
	// var created_at = new Date( parseInt(aTweetTimestamp.span.attribute('data-time'), 10) * 1000);

	// user
	var mentions = [];
	if( tweet.attribute('data-mentions').toString().trim() !== '') {
		mentions = tweet.attribute('data-mentions').toString().trim().split(' ');
	}

	statuses.push({
		// 'created_at': created_at.toISOString(),
		'created_at': aTweetTimestamp.span.attribute('data-time').toString(),
		'user': {
			'name': tweet.attribute('data-name').toString(),
			'entities': {
				'user_mentions': mentions
			},
			'id': parseInt(tweet.attribute('data-user-id').toString(), 10),
			'id_str': tweet.attribute('data-user-id').toString(),
			'screen_name': tweet.attribute('data-screen-name').toString()
		},
		'text': getNodeText(pTweetText).trim(),
		'id': parseInt(tweet.attribute('data-tweet-id').toString(), 10),
		'id_str': tweet.attribute('data-tweet-id').toString()
	});
}

print( JSON.stringify({'items': statuses}) );
