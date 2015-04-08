$.nomosCloudApi = {};

// REST

$.nomosCloudApi.rest = {};
$.nomosCloudApi.rest.init = function(options) {
	this.options = $.extend({}, $.nomosCloudApi.rest.defaults, options);
	return this;
};

$.nomosCloudApi.rest._call = function(url, params, callback) {
	var request = $.ajax({
		url: 'https://cloudapi.nomos-system.com/control/' + url,
		type: 'GET',
		dataType: 'jsonp',
		crossDomain: true,
		data: {param: params, access_token: $.nomosCloudApi.rest.options.accessToken},
		timeout: 15000,
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
	this._call('user', {}, callback);
};
$.nomosCloudApi.rest.getSystems = function(callback) {
	this._call('system', {}, callback);
};
$.nomosCloudApi.rest.getSystem = function(sid, callback) {
	this._call('system/'+sid, {}, callback);
};
$.nomosCloudApi.rest.getSystemOnlineState = function(sid, callback) {
	this._call('system/'+sid+'/online', {}, callback);
};
$.nomosCloudApi.rest.getSystemMeta = function(sid, callback) {
	this._call('system/'+sid+'/meta', {}, callback);
};
$.nomosCloudApi.rest.getSystemClasses = function(sid, callback) {
	this._call('system/'+sid+'/class', {}, callback);
};
$.nomosCloudApi.rest.getSystemClassCommands = function(sid, className, callback) {
	this._call('system/'+sid+'/class/'+className+'/command', {}, callback);
};
$.nomosCloudApi.rest.getSystemClassSetPropertiesCommands = function(sid, className, callback) {
	this._call('system/'+sid+'/class/'+className+'/set', {}, callback);
};
$.nomosCloudApi.rest.getSystemClassGetPropertiesCommands = function(sid, className, callback) {
	this._call('system/'+sid+'/class/'+className+'/get', {}, callback);
};
$.nomosCloudApi.rest.getSystemClassValues = function(sid, className, callback) {
	this._call('system/'+sid+'/class/'+className+'/value', {}, callback);
};
$.nomosCloudApi.rest.getSystemClassValue = function(sid, className, valueName, callback) {
	this._call('system/'+sid+'/class/'+className+'/value/'+valueName, {}, callback);
};
$.nomosCloudApi.rest.executeRAW = function(sid, raw, callback) {
	if(typeof raw !== 'string') raw = JSON.stringify(raw);
	this._call('system/'+sid+'/raw', raw, callback);
};
$.nomosCloudApi.rest.executeSystemClassCommand = function(sid, className, commandName, params, callback) {
	this._call('system/'+sid+'/class/'+className+'/command/'+commandName, params, callback);
};
$.nomosCloudApi.rest.setSystemClassProperty = function(sid, className, propertyName, params, callback) {
	this._call('system/'+sid+'/class/'+className+'/set/'+propertyName, params, callback);
};
$.nomosCloudApi.rest.getSystemClassProperty = function(sid, className, propertyName, params, callback) {
	this._call('system/'+sid+'/class/'+className+'/get/'+propertyName, params, callback);
};

$.nomosCloudApi.rest.defaults = {
	accessToken: '',
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

