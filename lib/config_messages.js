exports.probeGreeting = {
  "contents":[
    { "type":"heading",    "text":"Generic IP Camera"},
    { "type": "submit", "name": "Add Manually", "rpc_method": "manual_get_url" },
    { "type": "submit", "name": "Remove Existing", "rpc_method": "manual_show_remove" }

  ]
};

exports.fetchIpModal = {
  "contents":[
    { "type":"heading"  ,    "text":"Generic IP Camera (Manual)"},
    { "type":"paragraph",    "text":"Please enter the URL of the IP Cameras snapshot"},
    { "type":"input_field_text", "field_name": "snapshot_url", "value": "", "label": "Snapshot Url", "placeholder": "http://x.x.x.x/snapshot.cgi?user=admin&pwd=", "required": true},
    { "type":"submit"   ,     "name": "Add", "rpc_method": "manual_set_url" }
  ]
};

exports.removeIpModal = {
  "contents":[
    { "type":"heading"  ,    "text":"Generic IP Camera (Manual)"},
    { "type":"paragraph",    "text":"Please choose the URL to remove"},
    { "type": "input_field_select", "field_name": "snapshot_url", "label": "Choose URL", "options": [{ "name": "No urls", "value": "", "selected": true}], "required": false },
    { "type":"submit"   ,    "name": "Delete", "rpc_method": "manual_remove_url" }
  ]
};

exports.finish = {
  "finish": true
};