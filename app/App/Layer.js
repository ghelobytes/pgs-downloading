Ext.define('PGP.Layer',{
	extend: 'Ext.data.Model',
	fields: ['text','layer_name','title', 'description','agency','tags', 'tiled', {name: 'qtip', type: 'string', mapping:'agency_name' }]
});