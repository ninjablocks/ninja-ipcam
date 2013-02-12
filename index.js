var Device = require('./lib/device')
  , util = require('util')
  , stream = require('stream');

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

  var self = this;

  app.on('client::up',function(){

    // Register a device
    createDevice.call(self);
  });
};


function createDevice() {

  // var cameraOpts = {
  //   host:'10.0.1.162',
  //   port:80,
  //   path:'/snapshot.cgi?user=admin&pwd=',
  //   method:'GET'
  // }
  // var Camera = new Device(cameraOpts,this._app.opts,this._app.id,this._app.token,0);
  // this.emit('register', Camera);

}

// Export it
module.exports = ipcam;