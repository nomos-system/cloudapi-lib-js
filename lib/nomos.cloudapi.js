$.nomosCloudApi = {};

// REST

$.nomosCloudApi.rest = {};
$.nomosCloudApi.rest.init = function(options) {
	this.options = $.extend({}, $.nomosCloudApi.rest.defaults, options);
	return this;
};

$.nomosCloudApi.rest._call = function(url, type, params, callback) {
	var mimeType = '', dataType = '';
	switch($.nomosCloudApi.rest.options.outputFormat) {
		case 'json':
			mimeType = 'application/json, text/javascript';
			dataType = 'json';
			break;
		case 'jsonp':
			mimeType = 'application/json, text/javascript';
			dataType = 'json';
			url += '?callback=' + $.nomosCloudApi.rest.options.jsonpCallbackName;
		break;
		case 'xml':
			mimeType = 'application/xml, text/xml';
			dataType = 'xml';
		break;
	}
	
	var request = $.ajax({
		url: 'https://cloudapi.nomos-system.com/control/' + url,
		type: type,
		dataType: dataType,
		data: {param: params},
		timeout: 15000,
		headers: {'Accept': mimeType, 'Authorization': 'Bearer ' + $.nomosCloudApi.rest.options.accessToken},
	});
	request.success(function(data) {
		callback(data);
	});
	request.fail(function(jqXHR, textStatus) {
		if(jqXHR.status !== 200) {
			callback({error:1, status: jqXHR.status, statusText: jqXHR.statusText});
		}
		else {
			callback({error:0, status: jqXHR.status, statusText: jqXHR.statusText});
		}
	});
};

$.nomosCloudApi.rest.getUser = function(callback) {
	this._call('user', 'GET', {}, callback);
};
$.nomosCloudApi.rest.getSystems = function(callback) {
	this._call('system', 'GET', {}, callback);
};
$.nomosCloudApi.rest.getSystem = function(sid, callback) {
	this._call('system/'+sid, 'GET', {}, callback);
};
$.nomosCloudApi.rest.getSystemOnlineState = function(sid, callback) {
	this._call('system/'+sid+'/online', 'GET', {}, callback);
};
$.nomosCloudApi.rest.getSystemMeta = function(sid, callback) {
	this._call('system/'+sid+'/meta', 'GET', {}, callback);
};
$.nomosCloudApi.rest.getSystemClasses = function(sid, callback) {
	this._call('system/'+sid+'/class', 'GET', {}, callback);
};
$.nomosCloudApi.rest.getSystemClassCommands = function(sid, className, callback) {
	this._call('system/'+sid+'/class/'+className+'/command', 'GET', {}, callback);
};
$.nomosCloudApi.rest.getSystemClassSetPropertiesCommands = function(sid, className, callback) {
	this._call('system/'+sid+'/class/'+className+'/set', 'GET', {}, callback);
};
$.nomosCloudApi.rest.getSystemClassGetPropertiesCommands = function(sid, className, callback) {
	this._call('system/'+sid+'/class/'+className+'/get', 'GET', {}, callback);
};
$.nomosCloudApi.rest.getSystemClassValues = function(sid, className, callback) {
	this._call('system/'+sid+'/class/'+className+'/value', 'GET', {}, callback);
};
$.nomosCloudApi.rest.getSystemClassValue = function(sid, className, valueName, callback) {
	this._call('system/'+sid+'/class/'+className+'/value/'+valueName, 'GET', {}, callback);
};
$.nomosCloudApi.rest.executeRAW = function(sid, raw, callback) {
	this._call('system/'+sid+'/raw', 'POST', JSON.stringify(raw), callback);
};
$.nomosCloudApi.rest.executeSystemClassCommand = function(sid, className, commandName, params, callback) {
	this._call('system/'+sid+'/class/'+className+'/command/'+commandName, 'POST', params, callback);
};
$.nomosCloudApi.rest.setSystemClassProperty = function(sid, className, propertyName, params, callback) {
	this._call('system/'+sid+'/class/'+className+'/set/'+propertyName, 'POST', params, callback);
};
$.nomosCloudApi.rest.getSystemClassProperty = function(sid, className, propertyName, params, callback) {
	this._call('system/'+sid+'/class/'+className+'/get/'+propertyName, 'POST', params, callback);
};

$.nomosCloudApi.rest.defaults = {
	accessToken: '',
	outputFormat: 'json',	// xml, json, jsonp
	jsonpCallbackName: '',
};

window.nomosCloudRestApi = function nomosCloudRestApi(options) {
    return jQuery.nomosCloudApi.rest.init(options);
};


// Realtime

$.nomosCloudApi.realtime = {};
$.nomosCloudApi.realtime.init = function(options) {
	this.options = $.extend({}, $.nomosCloudApi.realtime.defaults, options);
	
	this.socket = io.connect('https://cloudapi.nomos-system.com/control', {query: $.param({access_token: $.nomosCloudApi.realtime.options.accessToken, 
														  client: $.nomosCloudApi.realtime.options.clientId})});
	this.socket.on('connect', $.nomosCloudApi.realtime.options.onConnect);
	this.socket.on('disconnect', $.nomosCloudApi.realtime.options.onDisconnect);
	this.socket.on('connect_error', $.nomosCloudApi.realtime.options.onConnectError);
	this.socket.on('error', $.nomosCloudApi.realtime.options.onError);
	this.socket.on('listenerEvent', $.nomosCloudApi.realtime.options.onListenerEvent);

	return this;
};

$.nomosCloudApi.realtime.emit = function(functionName, params, callback) {
	this.socket.emit(functionName, params, callback);
};

$.nomosCloudApi.realtime.defaults = {
	accessToken: '',
	clientId: '',
	onConnect: function() {},
	onDisconnect: function() {},
	onConnectError: function(e) {},
	onError: function(e) {},
	onListenerEvent: function(r) {},
};

window.nomosCloudRealtimeApi = function nomosCloudRealtimeApi(options) {
    return jQuery.nomosCloudApi.realtime.init(options);
};

