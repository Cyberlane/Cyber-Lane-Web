var splitter = '{{ more }}';

YamlHeaderReader = function(){};

YamlHeaderReader.prototype.splitData = function(content, callback) {
	var data = {};
	content = content.split('\n');
	for (var i = 1; i < content.length; i++) {
		content[i] = content[i].replace('\r', '');
		if (content[i] == '---') {
			content = content.splice(i+1).join('\n');
			break;
		}
		var segments = content[i].split(':');
		var key = segments[0];
		var value = segments[1].trim();
		if (value[0] === '[' && value[value.length-1] === ']') {
			value = value.substring(1, value.length - 1).split(',');
		}
		data[key] = value;
	}
	var pos = content.indexOf(splitter);
	data.summary = pos > -1 ? content.substring(0, pos) : content;
	data.content = content.replace(splitter, '');
	callback(data);
};

exports.YamlHeaderReader = YamlHeaderReader;