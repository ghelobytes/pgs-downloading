

Ext.define('PGP.MapPanel',{
	extend:'GeoExt.panel.Map',
	alias:'Widget.mappanel',
	title: "Philippine Geoportal",
	layout:'border',
	region:'center',
	tPanel:'',
	width:100,
	height:100,
	buildButtons:function(){
		var me = this;
		return [
			{
				xtype:'button',
				text:'Add to List',
				handler: function(){

					var trans = me.ownerCt.down('#transactionPanel');
					var layersPanel = me.ownerCt.down('#layersPanel');

					var record = trans.getSelectedRecord();

					//TODO: get actual layer data like name and current map bounds
					var layers = record.get('layers');
					layers = (layers ? Ext.decode(layers) : []);

					if(layers) {
						//==========================
						var bounds = me.map.getExtent().transform('EPSG:900913','EPSG:4326').toString();

						var l = layersPanel.getSelectedLayer();
						console.log(l);

						layers.push({layer: l.get('layer_name'), title:l.get('title'), bounds:bounds });

						//==========================
						trans.updateGrid(layers);
						layers = JSON.stringify(layers);
						record.set('layers', layers);

					}
				}
			}

		]
	},
	buildItems:function(){
	},
	initComponent:function(){
		var popup, me=this;

		map = new OpenLayers.Map(
				{
				controls: [
					new OpenLayers.Control.Navigation(),
					new OpenLayers.Control.Zoom(),
					new OpenLayers.Control.MousePosition(),
					new OpenLayers.Control.LayerSwitcher(),


				],

				fallThrough: true,
				projection: 'EPSG:900913'

		});
		me.map = map;

       var pgp_basemap_cache = new OpenLayers.Layer.NAMRIA(
				'NAMRIA Basemap',
				'http://202.90.149.252/ArcGIS/rest/services/Basemap/PGS_Basemap/MapServer',
				{
					isBaseLayer: true,
					//displayInLayerSwitcher: false,
				}
		);


		map.addLayer(pgp_basemap_cache);

		this.buttons = this.buildButtons();



		Ext.apply(this, {
			map:map,

		});

		this.callParent(arguments);
    }


});


