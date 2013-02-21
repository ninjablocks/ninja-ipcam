var Device = require('./lib/device')
  , util = require('util')
  , stream = require('stream')
  , configHandlers = require('./lib/config')
  , url = require('url');

// Give our module a stream interface
util.inherits(ipcam,stream);

/**
 * Called when our client starts up
 * @constructor
 *
 * @param  {Object} opts Saved/default module configuration
 * @param  {Object} app  The app event emitter
 * @param  {String} app.id The client serial number
 *
 * @property  {Function} save When called will save the contents of `opts`
 * @property  {Function} config Will be called when config data is received from the cloud
 *
 * @fires register - Emit this when you wish to register a device (see Device)
 * @fires config - Emit this when you wish to send config data back to the cloud
 */
function ipcam(opts,app) {

  this._app = app;
  this._opts = opts;

  var self = this;

  app.on('client::up',function(){

    self._opts.urls.forEach(function(url,index) {
      // Register a device
      self.createCameraByUrl(url,index);
    });
  });
};

/**
 * Called when a user prompts a configuration
 * @param  {Object}   rpc     Used to match up requests.
 * @param  {Function} cb      Callback with return data
 */
ipcam.prototype.config = function(rpc,cb) {

  var self = this;

  if (!rpc) {
    return configHandlers.probe.call(this,cb);
  }

  switch (rpc.method) {
    case 'manual_set_url':     return configHandlers.manual_set_url.call(this,rpc.params,cb); break;
    case 'manual_get_url':     return configHandlers.manual_get_url.call(this,rpc.params,cb); break;
    case 'manual_show_remove': return configHandlers.manual_show_remove.call(this,rpc.params,cb); break;
    case 'manual_remove_url': return configHandlers.manual_remove_url.call(this,rpc.params,cb); break;

    default:                   return cb(true);                                              break;
  }
};

ipcam.prototype.createCameraByUrl = function(snapshot_url,index) {

  var opts = url.parse(snapshot_url);

  opts.port = opts.port || 80;
  opts.method='GET'

  var Camera = new Device(opts,this._app.opts,this._app.id,this._app.token,'U'+index);
  this.emit('register', Camera);
};

// Export it
module.exports = ipcam;