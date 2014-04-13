Ext.define('PGP.Transactions',{
	extend: 'Ext.panel.Panel',
	width: 520	,
	region:'west',
	alias: 'widget.Trans',
	bodyPadding:10,
	collapsible:true,
	//split: true,
	initComponent:function(){

		this.items = this.buildItems();
		this.callParent();
	},
	createNewTransaction: function(){
		var store = this.up('Trans').down('#transactionsGrid').getStore();
		var newT = Ext.create('Transaction', {});
		store.insert(0,newT);

	},
	buildItems:function(){
		var me = this;
		return[{
				xtype:'panel',
				title:'Transactions',
				height:200,
				tools:[
					{
					  xtype: 'button',
					  text: 'Add',
					  handler: me.createNewTransaction
					}
				],
				items:[

					{
						xtype: 'grid',
						itemId: 'transactionsGrid',
						width:502.1,
						height:260,
						padding:'0 0 20 0',
						columns:[
							{
								text:'Passcode',
								dataIndex:'passcode'
							},
							{
								text:'Contact',
								dataIndex:'contact_person',
								flex: 2
							},
							{
								xtype: 'datecolumn',
								text:'Expiration',
								dataIndex:'expiration_date',
								format: 'Y-m-d',
								align: 'center'
							},
							{
								text:'Agency',
								dataIndex:'agency'
							}
						],
						store: Ext.create('Ext.data.Store', {
							model: 'Transaction',
							autoLoad: true,
							autoSync: true
						}),
						listeners: {
							select: function(grid, record){

								var form = this.up('Trans').down('form');
								form.loadRecord(record);

								var layers = record.get('layers');
								layers = (layers ? Ext.decode(layers) : []);

								var layerGrid = this.up('Trans').down('#layerGrid');
								layerGrid.getStore().loadData(layers);
							}
						}
					}
				]
			  },
			  {
				xtype:'form',
				title:'Transaction Details',
				tools:[
				  {
					xtype:'button',
					text:'Save',
					handler:function(){
						var form = this.up('Trans').down('form');
						var record = form.getRecord();
						form.updateRecord(record);
					}
				  }
				],
				height:400,
				items:[
						{
						   xtype:'textfield',
						   padding:'10 0, 0, 20',
						   width:450,
						   fieldLabel:'Passcode',
						   name: 'passcode',
						   readOnly: true
					    },
					    {
						   xtype:'textfield',
						   padding:'20 0 0 20',
						   width:450,
						   fieldLabel:'Agency',
						   name: 'agency'
					    },
					    {
						   xtype:'textfield',
						   padding:'10 0 0 20',
						   width:450,
						   fieldLabel:'Contact',
						   name: 'contact_person'
					    },
					    {
						   xtype:'grid',
						   itemId: 'layerGrid',
						   width:472,
						   height:150,
						   padding:'10 0 0 20',
						   columns:[
							{
								text: 'Title',
								dataIndex: 'title',
								flex: 2
							},
							{
							 text:'Layer',
							 dataIndex:'layer',
							 flex: 1
							},
							{
							 text:'Bounds',
							 dataIndex:'bounds',
							 flex: 1
							}
						    ],
							store: Ext.create('Ext.data.Store', {
								model: 'Layer',
								data: []
							})
					    }

					]

				}


			];
	},
	getSelectedRecord: function(){
		return this.down('form').getRecord();
	},
	updateGrid: function(layers){
		var layerGrid = this.down('#layerGrid');
		layerGrid.getStore().loadData(layers);
	}

});


Ext.define('Transaction',{
	extend: 'Ext.data.Model',
	fields: [
		{
			name: 'passcode',
			type: 'string'
		},
		{
			name: 'date_requested',
			type: 'date'
		},
		{
			name: 'expiration_date',
			type: 'date'
		},
		{
			name: 'contact_person',
			type: 'string'
		},
		{
			name: 'agency',
			type: 'string'
		}
	],
	hasMany: 'Layer',
	idProperty: 'passcode',
	proxy: {
		type: 'rest',
		url: './dl/transactions'
	}
});

Ext.define('Layer', {
	extend: 'Ext.data.Model',
	fields: [
		{
			name: 'title',
			type: 'string'
		},
		{
			name: 'layer',
			type: 'string'
		},
		{
			name: 'bounds',
			type: 'string'
		}
	]
});



