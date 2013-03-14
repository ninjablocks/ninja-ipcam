
var stream = require('stream')
  , util = require('util')
  , http = require('http')
  , https = require('https');


// Give our module a stream interface
util.inherits(Camera,stream);

// Export it
module.exports=Camera;

/**
 * Creates a new Device Object
 *
 * @property {Boolean} readable Whether the device emits data
 * @property {Boolean} writable Whether the data can be actuated
 *
 * @property {Number} G - the channel of this device
 * @property {Number} V - the vendor ID of this device
 * @property {Number} D - the device ID of this device
 *
 * @property {Function} write Called when data is received from the cloud
 *
 * @fires data - Emit this when you wish to send data to the cloud
 */

function Camera(camera,cloud,node,token,G) {


  var self = this;

  this.writeable = true;
  this.readable = true;
  this.V = 0;
  this.D = 1004;
  this.G = G;

  this._guid = [node,this.G,this.V,this.D].join('_');

  this._cameraOpts = camera;
  this._cloudOpts = cloud;
  this._token = token;

  process.nextTick(function() {
    self.emit('data','1')
    // this.emit('config',{
    //     G:this.G,
    //     V:this.V,
    //     D:this.D,
    //     type:'PLUGIN'
    // });
  });
};

/**
 * Called whenever there is data from the cloud
 * This is required if Device.writable = true
 *
 * @param  {String} data The data received
 */
Camera.prototype.write = function(data) {


  var self = this;
  var postOptions = {
    host:this._cloudOpts.streamHost,
    port:this._cloudOpts.streamPort,
    path:'/rest/v0/camera/'+this._guid+'/snapshot',
    method:'POST',
  };

  var proto = (this._cloudOpts.streamPort==443) ? https:http
  var getReq = http.get(this._cameraOpts,function(getRes) {

    postOptions.headers = getRes.headers;
    postOptions.headers['X-Ninja-Token'] = self._token

    var postReq = proto.request(postOptions,function(postRes) {

      postRes.on('end',function() {
        console.log('Stream Server ended');
      });
      postRes.resume();
    });

    postReq.on('error',function(err) {
      console.log('Error sending picture: ');
      console.log(err);
    });

    var lenWrote=0;
    getRes.on('data',function(data) {
      postReq.write(data,'binary');
      lenWrote+=data.length
    });

    getRes.on('end',function() {
      postReq.end();
      console.log("Image sent %s",lenWrote);
    });
    getRes.resume();
  });
  getReq.on('error',function(error) {
    console.log(error);
  });
  getReq.end();
  return true;
};

Camera.prototype.end = function() {
  // this.emit('config',{G:this.G,V:this.V,D:this.D,type:'UNPLUG'});
  // clearInterval(this._interval);
};
Camera.prototype.destroy = function() {
  // clearInterval(this._interval);
};