Ext.define('Sbi.chart.designer.ChartColumnsContainerManager', {
	requires: [
        'Sbi.chart.designer.ChartColumnsContainer',
        'Sbi.chart.designer.ChartUtils'
    ],

	constructor: function(config) {
	    this.initConfig(config);
	    this.callParent();
	},
	
	alternateClassName: ['ChartColumnsContainerManager'],
	
    statics: {
    	instanceIdFeed: 0,
    	
    	instanceCounter: 0,
    	
    	COUNTER_LIMIT: 4,
    	
		storePool: [],
		
		yAxisPool: [],
		
		resetContainers: function() {
			var yAxisPool = this.yAxisPool;
			var storePool = this.storePool;
			
			while(yAxisPool.length > 0) {
				var yAxis = yAxisPool[0];
				yAxis.destroy();
			}
			
			this.instanceCounter = 0;
			this.storePool = [];
			this.yAxisPool = [];
		},

		promptChangeSerieStyle: function (store, rowIndex) {
			var previousInstance = Ext.getCmp('serieStylePopup');
			
			if(previousInstance != undefined) {
				return;
				// previousInstance.destroy();
			}
			
			var serieStylePopup = Ext.create('Sbi.chart.designer.SerieStylePopup', {
				store: store,
				rowIndex: rowIndex,
			});
			
			serieStylePopup.show();
		},

		createChartColumnsContainer: function(idAxisesContainer, id, panelWhereAddSeries, isDestructible, 
				dragGroup, dropGroup, axis) {

			if( ChartColumnsContainerManager.instanceCounter == ChartColumnsContainerManager.COUNTER_LIMIT) {
				Ext.log('Maximum number of ChartColumnsContainer instances reached');
				return null;
			}
	    	
			ChartColumnsContainerManager.instanceIdFeed++;
	    	var idChartColumnsContainer = (id && id != '')? id: 'Axis_' + ChartColumnsContainerManager.instanceIdFeed;
	    	
	    	ChartColumnsContainerManager.instanceCounter++;
	    	
	    	var axisAlias = (axis && axis != null)? axis.alias: idChartColumnsContainer;
			var chartColumnsContainerStore = Ext.create('Sbi.chart.designer.AxisesContainerStore', {
				idAxisesContainer: idChartColumnsContainer,
				autoDestroy : true,
				axisAlias: axisAlias
			});
			
			Ext.Array.push(ChartColumnsContainerManager.storePool, chartColumnsContainerStore);
			
			var titleText = (axis && axis.TITLE && axis.TITLE.text &&  axis.TITLE.text != null) ? axis.TITLE.text : '';
			
			var axisData = (axis && axis != null)? 
					Sbi.chart.designer.ChartUtils.convertJsonAxisObjToAxisData(axis) : 
						Sbi.chart.designer.ChartUtils.createEmptyAxisData();
			var chartColumnsContainer = Ext.create("Sbi.chart.designer.ChartColumnsContainer", {
				id: idChartColumnsContainer,
				idAxisesContainer: idAxisesContainer,
				axisData: axisData,
				
				controller: Ext.create('Ext.app.ViewController', {
			        onTitleChange: function (barTextField, textValue) {
			        	this.view.axisData.titleText = textValue;
			        }
			    }),
				
				flex: 1,
				viewConfig: {
					plugins: {
						ptype: 'gridviewdragdrop',
						containerScroll: true,
						dragGroup: dragGroup,
						dropGroup: dropGroup
					},
					listeners: {
						beforeDrop: function(node, data, dropRec, dropPosition) {
							if(data.view.id != this.id) {
								data.records[0] = data.records[0].copy('droppedSerie_' + ChartColumnsContainer.idseed++);
								if( !data.records[0].get('serieGroupingFunction')) {
									data.records[0].set('serieGroupingFunction', 'SUM');
								}
								if( !data.records[0].get('axisName')) {
									var serieColumn = data.records[0].get('serieColumn', 'SUM');
									data.records[0].set('axisName', serieColumn);
								}
							}
						}
					}
				},
				
				store: chartColumnsContainerStore,
				
				title: {
					hidden: true 
				}, 
				tools:[
				    
				    // TEXT AREA
				    {
				    	xtype: 'textfield',
						flex: 10,
						allowBlank:  true,
			            emptyText: 'Insert axis title',
						selectOnFocus: true,
						value: titleText,
						listeners: {
				            change: 'onTitleChange'
				        }
					},
					
					// STYLE POPUP
					{
					    type:'gear',
					    tooltip: LN('sbi.chartengine.columnscontainer.tooltip.setaxisstyle'),
					    flex: 1,
					    handler: function(event, toolEl, panelHeader) {
					    	var thisChartColumnsContainer = panelHeader.ownerCt;
					    	
					    	var axisStylePopup = Ext.create('Sbi.chart.designer.AxisStylePopup', {
					    		axisData: thisChartColumnsContainer.getAxisData(),
					    		isYAxis: true
							});
							
					    	axisStylePopup.show();
						}
					},
					
					// PLUS BUTTON
					{
					    type:'plus',
					    tooltip: LN('sbi.chartengine.columnscontainer.tooltip.addaxis'),
					    flex: 1,
					    handler: function(event, toolEl, panelHeader) {
					    	var chartType = Sbi.chart.designer.Designer.chartTypeSelector.getChartType();
					    	
					    	if(chartType.toUpperCase() != 'PIE') {
					    		if (!panelWhereAddSeries.isVisible()) {
					    			panelWhereAddSeries.setVisible(true);
					    		}
					    		
					    		ChartAxisesContainer.addToAxisesContainer(panelWhereAddSeries);
					    	}
					    	
					    },
					    hidden: (panelWhereAddSeries == null)
					}
					
				],
				
				closable : isDestructible,
				closeAction : 'destroy',
				beforeDestroy: function(el, eOpts){
					ChartColumnsContainerManager.instanceCounter--;
					
					Ext.Array.remove(ChartColumnsContainerManager.storePool, chartColumnsContainerStore);
					Ext.Array.remove(ChartColumnsContainerManager.yAxisPool, this);
				},
				
				hideHeaders: true,
				columns: {
					items: [{
						dataIndex: 'serieColumn',
						flex: 12,
						layout: 'fit',
						sortable: false,
					}, {
		                dataIndex: 'serieGroupingFunction',
		                flex: 8,
						layout: 'fit',
						sortable: false,
						editor: {
							xtype: 'combobox',
							displayField: 'label',
							valueField: 'value',
							store: [
		                        ['AVG','AVG'],
		                        ['COUNT','COUNT'],
		                        ['MAX','MAX'],
		                        ['MIN','MIN'],
		                        ['SUM','SUM']
		                    ],
							fields: ['value', 'label']
						}
		            },
					{
						menuDisabled: true,
						sortable: false,
						flex: 1,
  						align : 'center',
						xtype: 'actioncolumn',
						items: [{
							icon: '/athena/themes/sbi_default/img/createTemplate.jpg',
							tooltip: LN('sbi.chartengine.columnscontainer.tooltip.style'),
							handler: function(grid, rowIndex, colIndex) {
								var store = grid.getStore();
								
								ChartColumnsContainerManager.promptChangeSerieStyle(store, rowIndex);
							}
						},{
							icon: '/athena/themes/sbi_default/img/delete.gif',
							tooltip: LN('sbi.chartengine.columnscontainer.tooltip.removecolumn'),
							handler: function(grid, rowIndex, colIndex) {
								var store = grid.getStore();
								var item = store.getAt(rowIndex);
								
								var serieColumn = item.get('serieColumn');
								var serieName = item.get('axisName');
								
								Ext.Msg.show({
	            					title : '',
	            					message : Sbi.locale.sobstituteParams(
	      								LN('sbi.chartengine.designer.removeserie'), 
	      								[serieColumn, serieName]),
	            					icon : Ext.Msg.QUESTION,
	            					closable : false,
	            					buttons : Ext.Msg.OKCANCEL,
	            					buttonText : 
	            					{
	            						ok : LN('sbi.chartengine.generic.ok'),
	            						cancel : LN('sbi.generic.cancel')
	            					},
	            					fn : function(buttonValue, inputText, showConfig){
	            						if (buttonValue == 'ok') {
	            							var rec = store.removeAt(rowIndex);
	            						}
	            					}
	            				});
							}
						}]
					}
				]},
				selModel: {
					selType: 'cellmodel'
				},
				plugins: [{
					ptype: 'cellediting',
					clicksToEdit: 1
				}]
			});
			
			Ext.Array.push(ChartColumnsContainerManager.yAxisPool, chartColumnsContainer);
			
			return chartColumnsContainer;
	    }
	}
});