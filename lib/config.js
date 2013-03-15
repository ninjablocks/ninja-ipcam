var messages = require('./config_messages');

exports.probe = function(cb) {

  cb(null,messages.probeGreeting);
};

exports.manual_get_url = function(params,cb) {

  cb(null,messages.fetchIpModal);
};

exports.manual_set_url = function(params,cb) {

  var snapshot_url = params.snapshot_url;
  var index = this._opts.urls.indexOf(params.snapshot_url||'');

  if (index===-1) {
    this._opts.urls.push(snapshot_url);
    this.save();
  }

  this.createCameraByUrl(snapshot_url,this._opts.urls.indexOf(snapshot_url));
  cb(null,messages.finish);
};

exports.manual_show_remove = function(params,cb) {

  var toShow = messages.removeIpModal;

  var urls = this._opts.urls;

  var optionArr = [];

  for (var i=0;i<urls.length;i++) {
    optionArr.push({name:urls[i],value:urls[i]});
  }

  if (optionArr.length>0) {
    toShow.contents[1].options = optionArr;
  }

  cb(null,toShow);
};

exports.manual_remove_url = function(params,cb) {

  var index = this._opts.urls.indexOf(params.snapshot_url||'');

  if (index>-1) {
    this._opts.urls.splice(index,1);
    this.save();
  }
  cb(null,messages.removeIpSuccess);
};