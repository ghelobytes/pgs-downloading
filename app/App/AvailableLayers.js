Ext.define('PGP.AvailableLayers', {
    extend: 'Ext.Panel',
	alias: 'widget.availablelayers',
	width:300,
	title: 'Available layers',
	region: 'east',
	split: true,
	mappanel:'',
	title: 'Available Layers',
	loadLayer:function(layer_name){

		//display one layer at a time
		if (this.mappanel.map.getNumLayers()>1){
			this.mappanel.map.removeLayer(this.mappanel.map.layers[1])
		}

		//load selected layer
		 var sel_layer = new OpenLayers.Layer.WMS(
			layer_name,
			'http://geoserver.namria.gov.ph/geoserver/geoportal/wms',
			{
				layers:layer_name,
				transparent:true
			},
			{
				opacity:.7,
			}
	    )
		this.mappanel.map.addLayer(sel_layer);

	},
	buildItems:function(){
		return[
				{
				   xtype:'textfield',
				   fieldLabel:'Filter',
				   itemId:'txtFilter',
				   padding:'10 50 10 10',
				   height:25,
				   listeners:{
					   change: function(){

							var me = this.up().down('#Tpanel')

							var value = this.getValue();
							if (!value || value == '') {
								return;
							}
							me.store.clearFilter(true);
							me.store.filterBy(function(record,id){
								var stringToMatch = (
									record.get('title') + '|' +
									record.get('description') +  '|' +
									record.get('tags') +  '|' +
									record.get('agency')).toLowerCase();

								var match = (stringToMatch.indexOf(value.toLowerCase()) >= 0 );
								return match;
							});

					   }}

			    },
			    {
					xtype: 'treepanel',
					itemId:'Tpanel',
					region: 'center',
					store: Ext.data.StoreManager.lookup('layer_List'),
					border: false,
					rootVisible: false,
					autoScroll: true,
					listeners:{
						 itemclick:function(s,r){
							var me = this.up();
							me.loadLayer(r.data.layer_name);
					     }

					}
				}

		    ]
	},
    initComponent: function() {

		var layerList= Ext.create('Ext.data.TreeStore', {
			storeId:'layer_List',
			model:'PGP.Layer',
			proxy: {
				type: 'ajax',
				//url: 'http://localhost:3000/www.geoportal.gov.ph/webapi/api/layers/getlayersaz',
				url: './proxy?url=http://www.geoportal.gov.ph/webapi/api/layers/getlayersaz',
				reader: {
					type: 'json'
					}
			},
			root: {
				text: 'ROOT',
				id: 'src',
				expanded: true
				  },
			folderSort: true,
			sorters: [{
				property: 'text',
				direction: 'ASC'
			}]
		})

		this.items=this.buildItems();
		this.callParent(arguments);
	},
	getSelectedLayer: function(){
		var selection = this.down('#Tpanel').getSelection();
		//return (selection.length > 0 ? selection[0].get('layer_name') : null);
		return (selection.length > 0 ? selection[0] : null);
 	}

});



