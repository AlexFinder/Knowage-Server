/*
 * Knowage, Open Source Business Intelligence suite
 * Copyright (C) 2016 Engineering Ingegneria Informatica S.p.A.
 * 
 * Knowage is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Knowage is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 * 
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */ 
 
  

/**
 * Object name
 * 
 * [description]
 * 
 * 
 * Public Properties
 * 
 * [list]
 * 
 * 
 * Public Methods
 * 
 * [list]
 * 
 * 
 * Public Events
 * 
 * [list]
 * 
 * Authors - Chiara Chiarelli (chiara.chiarelli@eng.it)
 */
Ext.ns("Sbi.profiling");

Sbi.profiling.ManageRoles = function(config) { 

	var paramsList = {MESSAGE_DET: "ROLES_LIST"};
	var paramsSave = {LIGHT_NAVIGATOR_DISABLED: 'TRUE',MESSAGE_DET: "ROLE_INSERT"};
	var paramsDel = {LIGHT_NAVIGATOR_DISABLED: 'TRUE',MESSAGE_DET: "ROLE_DELETE"};
	
	this.configurationObject = {};
	
	this.configurationObject.manageListService = Sbi.config.serviceRegistry.getServiceUrl({
		serviceName: 'MANAGE_ROLES_ACTION'
		, baseParams: paramsList
	});
	this.configurationObject.saveItemService = Sbi.config.serviceRegistry.getServiceUrl({
		serviceName: 'MANAGE_ROLES_ACTION'
		, baseParams: paramsSave
	});
	this.configurationObject.deleteItemService = Sbi.config.serviceRegistry.getServiceUrl({
		serviceName: 'MANAGE_ROLES_ACTION'
		, baseParams: paramsDel
	});
	
	// Meta Model Categories Services
	
	this.configurationObject.getMetaModelCategoriesService = Sbi.config.serviceRegistry.getRestServiceUrl({
		serviceName: 'domains/listValueDescriptionByType'
		, baseParams: {
				LIGHT_NAVIGATOR_DISABLED: 'TRUE',
				DOMAIN_TYPE:"BM_CATEGORY",
				EXT_VERSION: "3"
			}
	});
	
	// Dataset Categories Services
	
	this.configurationObject.getDatasetCategoriesService = Sbi.config.serviceRegistry.getRestServiceUrl({
		serviceName: 'domains/listValueDescriptionByType'
		, baseParams: {
				LIGHT_NAVIGATOR_DISABLED: 'TRUE',
				DOMAIN_TYPE:"CATEGORY_TYPE",
				EXT_VERSION: "3"
			}
	});

	// List Authorizations Service
	this.configurationObject.getAuthorizationsList = Sbi.config.serviceRegistry.getRestServiceUrl({
		serviceName: 'authorizations'
		, baseParams: {	}
	});
	
	

	var configSecurity = {};
	configSecurity.isInternalSecurity = config.isInternalSecurity;
	this.initConfigObject(configSecurity);
	config.configurationObject = this.configurationObject;
	config.singleSelection = true;
	config.configurationObject.gridWidth = 470;

	var c = Ext.apply({}, config || {}, {});

	Sbi.profiling.ManageRoles.superclass.constructor.call(this, c);	 
	
	this.rowselModel.addListener('rowselect',function(sm, row, rec) { 
		this.getForm().loadRecord(rec);  
		this.fillChecks(row, rec);
		this.enableChecks(null, rec, null);					
     }, this);

};

Ext.extend(Sbi.profiling.ManageRoles, Sbi.widgets.ListDetailForm, {
	
	configurationObject: null
	, gridForm:null
	, mainElementsStore:null
	, detailTab:null
	, authorizationTab:null
	, checkGroup: null

	,initConfigObject:function(configSecurity){
	    this.configurationObject.fields = ['id'
	                         	          , 'name'
	                        	          , 'description'
	                        	          , 'code'
	                        	          , 'typeCd'
	                        	          , 'savePersonalFolder'
	                        	          , 'saveMeta'
	                        	          , 'saveRemember'
	                        	          , 'saveSubobj'
	                        	          , 'seeMeta'
	                        	          , 'seeNotes'
	                        	          , 'seeSnapshot'
	                        	          , 'seeSubobj'
	                        	          , 'seeViewpoints'
	                        	          , 'sendMail'
	                        	          , 'buildQbe'
	                        	          , 'doMassiveExport'
	                        	          , 'manageUsers'
	                        	          , 'manageGlossaryBusiness'
	                        	          , 'manageGlossaryTechnical'
	                        	          , 'manageKpiValue'
	                        	          , 'manageCalendar'
	                        	          , 'seeDocBrowser'
	                        	          , 'seeFavourites'
	                        	          , 'seeSubscriptions'
	                        	          , 'seeMyData'
	                        	          , 'seeToDoList'
	                        	          , 'createDocument'
	                        	          , 'bmCategories'
	                        	          , 'kpiCommentEditAll'
	                        	          , 'kpiCommentEditMy'
	                        	          , 'kpiCommentDelete'
	                        	          , 'createSocialAnalysis'
	                        	          , 'viewSocialAnalysis'
	                        	          , 'hierarchiesManagement'
	                        	          , 'enableDatasetPersistence'
	                        	          , 'enableFederatedDataset'
	                        	        ];
		
		//Note: are we using this object?
	    this.configurationObject.emptyRecToAdd = new Ext.data.Record({
											id: 0,
											name:'', 
											label:'', 
											description:'',
											typeCd:'',
											code:'',
											saveSubobj: false,
											seeSubobj:false,
											seeViewpoints:false,
											seeSnapshot:false,
											seeNotes:false,
											sendMail:false,
											savePersonalFolder:false,
											saveRemember:false,
											seeMeta:false,
											saveMeta:false,
											buildQbe:false,
											manageUsers:false,
											manageGlossaryBusiness:false,
											manageGlossaryTechnical:false,
											manageKpiValue:false,
											manageCalendar:false,
											seeDocBrowser:false,
		                        	        seeFavourites:false,
		                        	        seeSubscriptions:false,
		                        	        seeMyData:false,
		                        	        seeToDoList:false,
		                        	        createDocument:false,
		                        	        kpiCommentEditAll: false,
		                        	        kpiCommentEditMy: false,
		                        	        kpiCommentDelete: false,
		                        	        createSocialAnalysis: false,
		                        	        viewSocialAnalysis: false,
		                        	        hierarchiesManagement: false,
		                        	        enableDatasetPersistence: false,
		                        	        enableFederatedDataset: false,
											bmCategories: [],
											dsCategories: []
										});
		
		this.configurationObject.gridColItems = [
					{id:'name',header: LN('sbi.attributes.headerName'), width: 200, sortable: true, locked:false, dataIndex: 'name'},
					{header:  LN('sbi.attributes.headerDescr'), width: 220, sortable: true, dataIndex: 'description'}
				];
		
		this.configurationObject.panelTitle = LN('sbi.roles.rolesManagement');
		this.configurationObject.listTitle = LN('sbi.roles.rolesList');
		
		/*create buttons toolbar's list (Add and Synchronize buttons)*/
		if (configSecurity.isInternalSecurity !== undefined && configSecurity.isInternalSecurity == false) {
			var tbButtonsArray = new Array();
			tbButtonsArray.push(new Ext.Toolbar.Button({
		            text: LN('sbi.roles.rolesSynchronization'),
		            iconCls: 'icon-refresh',
		            handler: this.synchronize,
		            width: 30,
		            scope: this	            
		            }));
			this.configurationObject.tbListButtonsArray = tbButtonsArray;
		}
		this.initTabItems();
    }

	,initTabItems: function(){
		

		
		this.initDetailtab();
		this.initChecksTab();
		this.enableConfigurableAuthorizations();
		this.initBusinessModelTab();
		this.initDatasetTab();
		this.configurationObject.tabItems = [ this.detailTab, this.authorizationTab, this.businessModelsTab, this.datasetsTab];
	}

	,initDetailtab: function() {

		this.typesStore = new Ext.data.JsonStore({
 	        fields: ['typeCd', 'valueNm'],
 	        data: config,
 	        listeners: {
	                'load': {
                        fn: function( store, records, options) {
                             for (i=0; i< records.length; i++){ 
                            	 var a = LN(records[i].data.valueNm);                            	 
                            	 var b = records[i].data.typeCd;                            	 
                            	 
                            	 records[i].set('typeCd1', b);
                            	 records[i].set('valueNm1', a);
                            	 records[i].commit();
                             }
                             
                        }
	                }
	        },
 	        autoLoad: false
 	    });
		
		//START list of detail fields
	 	   var detailFieldId = {
	                 name: 'id',
	                 hidden: true
	       };
	 		   
	 	   var detailFieldName = {
	            	 maxLength:100,
	            	 minLength:1,
	            	 //regex : new RegExp("^([a-zA-Z1-9_\x2F])+$", "g"),
	            	 regexText : LN('sbi.roles.alfanumericString'),
	                 fieldLabel: LN('sbi.roles.headerName'),
	                 allowBlank: false,
	                 validationEvent:true,
	                 //preventMark: true,
	                 name: 'name'
	             };
	 			  
	 	   var detailFieldCode = {
	            	 maxLength:20,
	            	 minLength:0,
	            	 //regex : new RegExp("^([A-Za-z0-9_])+$", "g"),
	            	 regexText : LN('sbi.roles.alfanumericString2'),
	                 fieldLabel:LN('sbi.roles.headerCode'),
	                 validationEvent:true,
	                 name: 'code'
	             };	  
	 		   
	 	   var detailFieldDescr = {
	            	 maxLength:160,
	            	 minLength:1,
	            	 //regex : new RegExp("^([a-zA-Z1-9_\x2F])+$", "g"),
	            	 regexText : LN('sbi.roles.alfanumericString'),
	                 fieldLabel: LN('sbi.roles.headerDescr'),
	                 validationEvent:true,
	                 name: 'description'
	             };


	 	   var detailFieldNodeType =  new Ext.form.ComboBox({
	 		   		  id: 'comboTypeCd',
	            	  name: 'typeCd',
	            	  hiddenName: 'typeCd',
	                  store: this.typesStore,
	                  fieldLabel: LN('sbi.roles.headerRoleType'),
	                  displayField: 'valueNm1',   // what the user sees in the popup
	                  valueField: 'typeCd1',      // what is passed to the 'change' event
	                  typeAhead: true,
	                  forceSelection: true,
	                  mode: 'local',
	                  triggerAction: 'all',
	                  selectOnFocus: false,
	                  editable: false,
	                  allowBlank: false,
	                  validationEvent:true,
	                  tpl: '<tpl for="."><div ext:qtip="{typeCd1}" class="x-combo-list-item">{valueNm1}</div></tpl>'
	             });  
	 	  
	 	   detailFieldNodeType.on('select',this.enableChecks, this);

	 	  //END list of detail fields
	 	   
	 	  this.detailTab = new Ext.Panel({
		        title: LN('sbi.roles.details')
		        , autoScroll  : true
		        , id: 'detail'
		        , layout: 'fit'
		        , items: {
		 		   	     id: 'role-detail',   	              
		 		   	     columnWidth: 0.4,
		 		   	     autoWidth: true,
			             xtype: 'fieldset',
			             labelWidth: 110,
			             defaults: {width: 220, border:false},    
			             defaultType: 'textfield',
			             autoHeight: true,
			             border: false,
			             bodyStyle: Ext.isIE ? 'padding:0 0 5px 15px;' : 'padding:10px 15px;',
			             border: false,
			             style: {
			                 "margin-left": "20px", 
			                 "margin-right": Ext.isIE6 ? (Ext.isStrict ? "-20px" : "-23px") : "20"  
			             },
			             items: [ detailFieldId, detailFieldName, detailFieldCode, 
			                      detailFieldDescr, detailFieldNodeType]
		    	}
		    });

	}
	
	/* ------------------------------------------------
	 * Business Model Categories Panel Initialization
	 * ------------------------------------------------
	 */
	
	,initBusinessModelTab: function() {
		//Invoke Service to get Categories List
		
		this.categoryStore = new Ext.data.JsonStore(
				{
					url : this.configurationObject.getMetaModelCategoriesService,
					autoLoad : true,
					root : 'domains',
					fields : [ 'VALUE_NM', 'VALUE_ID' ],
					restful : true
				});
		
		//create internal panel for checkbox
		this.businessModelsCheckGroup = {
		           xtype:'fieldset'
		           ,id: 'businessModelsCheckGroup'
		           //,columnWidth: 0.8
		           ,autoHeight: true
		           ,autoWidth: true
		           ,items :[]
				   ,border: false
		 	    };

		//Create the main panel Tab
		this.businessModelsTab = new Ext.Panel({
		        title: LN('sbi.roles.businessModels')
		        //, width: 430
		        , autoScroll: true
		        , items: [this.businessModelsCheckGroup]
		        , itemId: 'businessModelsCategoriesTab'
		        , layout: 'fit'
		    });
		
		var thisPanel = this;
		var checkBoxConfigs = [];
		this.categoryStore.load({
		    callback: function () {
		    	if (this.getRange().length > 0){
					this.getRange().forEach(function(record){
						checkBoxConfigs.push({ //pushing into array
					        id:record.data.VALUE_ID,
					        boxLabel:record.data.VALUE_NM
					    });
					});
					var myCheckboxgroup = new Ext.form.CheckboxGroup({
				        id:'businessModelsCategoriesCheckGroup',
				        fieldLabel: LN('sbi.roles.businessModels.categories'),
				        columns:1,
				        items:checkBoxConfigs,
				        boxMinWidth  : 150,
			            boxMinHeight  : 100,
			            hideLabel  : false
				    });

			        thisPanel.businessModelsTab.getComponent('businessModelsCheckGroup').add( myCheckboxgroup);
		    	}
		     }
		 });
	}
	//----------------------------------------------------------
	
	/* ------------------------------------------------
	 * Dataset Categories Panel Initialization
	 * ------------------------------------------------
	 */
	
	,initDatasetTab: function() {
		//Invoke Service to get Ds Categories List
		
		this.dsCategoryStore = new Ext.data.JsonStore(
				{
					url : this.configurationObject.getDatasetCategoriesService,
					autoLoad : true,
					root : 'domains',
					fields : [ 'VALUE_NM', 'VALUE_ID' ],
					restful : true
				});
		
		//create internal panel for checkbox
		this.datasetsCheckGroup = {
		           xtype:'fieldset'
		           ,id: 'datasetsCheckGroup'
		           //,columnWidth: 0.8
		           ,autoHeight: true
		           ,autoWidth: true
		           ,items :[]
				   ,border: false
		 	    };
		
		//Create the main panel Tab
		this.datasetsTab = new Ext.Panel({
		        title: LN('sbi.roles.datasets')
		        //, width: 430
		        , autoScroll: true
		        , items: [this.datasetsCheckGroup]
		        , itemId: 'datasetsCategoriesTab'
		        , layout: 'fit'
		    });
		
		var thisPanel = this;
		var checkBoxConfigs = [];
		this.dsCategoryStore.load({
		    callback: function () {
		    	if (this.getRange().length > 0){
					this.getRange().forEach(function(record){
						checkBoxConfigs.push({ //pushing into array
					        id:record.data.VALUE_ID,
					        boxLabel:record.data.VALUE_NM
					    });

					});
					var myCheckboxgroup = new Ext.form.CheckboxGroup({
				        id:'datasetsCategoriesCheckGroup',
				        fieldLabel: LN('sbi.roles.datasets.categories'),
				        columns:1,
				        items:checkBoxConfigs,
				        boxMinWidth  : 150,
			            boxMinHeight  : 100,
			            hideLabel  : false
				    });

			        thisPanel.datasetsTab.getComponent('datasetsCheckGroup').add( myCheckboxgroup);
		    	}
		     }
		 });
	}
	//----------------------------------------------------------
	
	,initChecksTab: function(){
		
		 /*====================================================================
 	     * CheckGroup Is able to
 	     *====================================================================*/


 	    this.checkGroup = {
           xtype:'fieldset'
           ,id: 'checks-form'
           ,columnWidth: 0.8
           ,autoHeight: true
           ,autoWidth: true
           ,border: false
           ,items :[
				{
		            xtype: 'checkboxgroup',
		            itemId: 'isAbleToSave',
		            columns: 1,
		            boxMinWidth  : 150,
		            //boxMinHeight  : 100,
		            hideLabel  : false,
		            fieldLabel: LN('sbi.roles.save')
		            ,items: [
		                {boxLabel: LN('sbi.roles.savePersonalFolder'), name: 'savePersonalFolder',id: 'savePersonalFolder', checked:'savePersonalFolder',inputValue: 1},
		                {boxLabel: LN('sbi.roles.saveMeta'), name: 'saveMeta', id: 'saveMeta', checked:'saveMeta',inputValue: 1},
		                {boxLabel: LN('sbi.roles.saveRemember'), name: 'saveRemember',id: 'saveRemember', checked:'saveRemember',inputValue: 1},
		                {boxLabel: LN('sbi.roles.saveSubobj'), name: 'saveSubobj',id: 'saveSubobj', checked:'saveSubobj',inputValue: 1}
		            ]
		        },
		        {
		            xtype: 'checkboxgroup',
		            itemId: 'isAbleToSee',
		            columns: 1,
		            boxMinWidth  : 150,
		            //boxMinHeight  : 100,
		            hideLabel  : false,
		            fieldLabel: LN('sbi.roles.see'),
		            items: [
		                {boxLabel: LN('sbi.roles.seeMeta'), name: 'seeMeta',id: 'seeMeta', checked: 'seeMeta', inputValue: 1},
		                {boxLabel: LN('sbi.roles.seeNotes'), name: 'seeNotes',id: 'seeNotes', checked:'seeNotes',inputValue: 1},
		                {boxLabel: LN('sbi.roles.seeSnapshot'), name: 'seeSnapshot',id: 'seeSnapshot', checked:'seeSnapshot',inputValue: 1},
		                {boxLabel: LN('sbi.roles.seeSubobj'), name: 'seeSubobj', id: 'seeSubobj', checked:'seeSubobj',inputValue: 1},
		                {boxLabel: LN('sbi.roles.seeViewpoints'), name: 'seeViewpoints',id: 'seeViewpoints', checked:'seeViewpoints',inputValue: 1}
		            ]
		        },
		        {
		            xtype: 'checkboxgroup',
		            columns: 1,
		            boxMinWidth  : 150,
		            hideLabel  : false,
		            fieldLabel: LN('sbi.roles.send'),
		            itemId: 'isAbleToSend',
		            //height:200,
		            items: [
		                {boxLabel: LN('sbi.roles.sendMail'), name: 'sendMail',id: 'sendMail', checked:'sendMail',inputValue: 1}
		            ]
		        },
		        {
		            xtype: 'checkboxgroup',
		            columns: 1,
		            boxMinWidth  : 150,
		            hideLabel  : false,
		            fieldLabel: LN('sbi.roles.build'),
		            itemId: 'isAbleToBuild',
		            items: [
		                {boxLabel: LN('sbi.roles.buildQbe'), name: 'buildQbe',id: 'buildQbe', checked:'buildQbe',inputValue: 1}
		            ]
		        },
		        {
		            xtype: 'checkboxgroup',
		            columns: 1,
		            boxMinWidth  : 150,
		            hideLabel  : false,
		            fieldLabel: LN('sbi.roles.export'),
		            itemId: 'isAbleToDo',
		            items: [
		                {boxLabel: LN('sbi.roles.doMassiveExport'), name: 'doMassiveExport',id: 'doMassiveExport', checked:'doMassiveExport',inputValue: 1}
		            ]
		        },
		        {
		            xtype: 'checkboxgroup',
		            columns: 1,
		            boxMinWidth  : 150,
		            hideLabel  : false,
		            fieldLabel: LN('sbi.roles.manage'),
		            itemId: 'isAbleToManage',
		            items: [
		                {boxLabel: LN('sbi.roles.manageUsers'), name: 'manageUsers',id: 'manageUsers', checked:'manageUsers',inputValue: 1},

		                {boxLabel: LN('sbi.roles.manageGlossaryBusiness'), name: 'manageGlossaryBusiness', id: 'manageGlossaryBusiness', id:'manageGlossaryBusiness', checked:'manageGlossaryBusiness',inputValue: 1},
		                {boxLabel: LN('sbi.roles.manageGlossaryTechnical'), name: 'manageGlossaryTechnical', id: 'manageGlossaryTechnical', id:'manageGlossaryTechnical', checked:'manageGlossaryTechnical',inputValue: 1},
		                {boxLabel: LN('sbi.roles.manageKpiValue'), name: 'manageKpiValue', id: 'manageKpiValue',  checked:'manageKpiValue',inputValue: 1},
		                {boxLabel: LN('sbi.roles.manageCalendar'), name: 'manageCalendar', id: 'manageCalendar',  checked:'manageCalendar',inputValue: 1}

		                ]
		        },
		        {
		            xtype: 'checkboxgroup',
		            columns: 1,
		            boxMinWidth  : 150,
		            hideLabel  : false,
		            fieldLabel: LN('sbi.roles.edit'),
		            itemId: 'isAbleTokpiCommentEditAll',
		            items: [
		                {boxLabel: LN('sbi.roles.allKpiComment'), name: 'kpiCommentEditAll',id: 'kpiCommentEditAll', checked:'kpiCommentEditAll',inputValue: 1}
		            ]
		        },
		        {
		            xtype: 'checkboxgroup',
		            columns: 1,
		            boxMinWidth  : 150,
		            hideLabel  : false,
		            fieldLabel: LN('sbi.roles.edit'),
		            itemId: 'isAbleTokpiCommentEditMy',
		            items: [
		                {boxLabel: LN('sbi.roles.myKpiComment'), name: 'kpiCommentEditMy',id: 'kpiCommentEditMy', checked:'kpiCommentEditMy',inputValue: 1}
		            ]
		        },
		        {
		            xtype: 'checkboxgroup',
		            columns: 1,
		            boxMinWidth  : 150,
		            hideLabel  : false,
		            fieldLabel: LN('sbi.roles.delete'),
		            itemId: 'isAbleTokpiCommentDelete',
		            items: [
		                {boxLabel: LN('sbi.roles.kpiComment'), name: 'kpiCommentDelete',id: 'kpiCommentDelete', checked:'kpiCommentDelete',inputValue: 1}
		            ]
		        },
		        {
		            xtype: 'checkboxgroup',
		            columns: 1,
		            boxMinWidth  : 150,
		            hideLabel  : false,
		            fieldLabel: LN('sbi.roles.enable'),
		            itemId: 'isAbleToEnableDatasetPersistence',
		            items: [
		                    {boxLabel: LN('sbi.roles.enableDatasetPersistence'), name: 'enableDatasetPersistence',id: 'enableDatasetPersistence', checked:'enableDatasetPersistence',inputValue: 1}
		            ]
		        },
		        {
		            xtype: 'checkboxgroup',
		            columns: 1,
		            boxMinWidth  : 150,
		            hideLabel  : false,
		            fieldLabel: LN('sbi.roles.view'),
		            itemId: 'isAbleToEnableFederatedDataset',
		            items: [
		                    {boxLabel: LN('sbi.roles.enableFederatedDataset'), name: 'enableFederatedDataset',id: 'enableFederatedDataset', checked:'enableFederatedDataset',inputValue: 1}
		            ]
		        },
		        {
		            xtype: 'checkboxgroup',
		            itemId: 'finalUserCan',
		            columns: 1,
		            boxMinWidth  : 150,
		            //boxMinHeight  : 100,
//		            hideLabel  : false,
		            fieldLabel: LN('sbi.roles.finalUserCan'),
		            items: [
		                {boxLabel: LN('sbi.roles.seeDocumentBrowser'), name: 'seeDocBrowser',id: 'seeDocBrowser', checked: 'seeDocBrowser', inputValue: 1},
		                {boxLabel: LN('sbi.roles.seeMyData'), name: 'seeMyData', id: 'seeMyData', checked:'seeMyData',inputValue: 1},
		                {boxLabel: LN('sbi.roles.seeFavourites'), name: 'seeFavourites',id: 'seeFavourites', checked:'seeFavourites',inputValue: 1},
		                {boxLabel: LN('sbi.roles.seeSubscriptions'), name: 'seeSubscriptions', id: 'seeSubscriptions', checked:'seeSubscriptions',inputValue: 1},
		                {boxLabel: LN('sbi.roles.seeToDoList'), name: 'seeToDoList',id: 'seeToDoList', checked:'seeToDoList',inputValue: 1},
		                {boxLabel: LN('sbi.roles.createDocument'), name: 'createDocument',id: 'createDocument', checked:'createDocument',inputValue: 1},
		                {boxLabel: LN('sbi.roles.createSocialAnalysis'), name: 'createSocialAnalysis',id: 'createSocialAnalysis', id:'createSocialAnalysis',checked:'createSocialAnalysis',inputValue: 1},
		                {boxLabel: LN('sbi.roles.viewSocialAnalysis'), name: 'viewSocialAnalysis',id: 'viewSocialAnalysis', id:'viewSocialAnalysis', checked:'viewSocialAnalysis',inputValue: 1},
		                {boxLabel: LN('sbi.roles.hierarchiesManagement'), name: 'hierarchiesManagement', id: 'hierarchiesManagement', id:'hierarchiesManagement', checked:'hierarchiesManagement',inputValue: 1},
		            ]
		        }
           ]
 	    };
 	    
 	    this.authorizationTab = new Ext.Panel({
	        title: LN('sbi.roles.authorizations')
	        , items: this.checkGroup
	        , itemId: 'checks'
	        , layout: 'fit'
	        , autoScroll: true
	    });
 	    

 	    

	}

	//-------------------------------------------------------
	,fillChecks : function(row, rec) {
		Ext.getCmp('checks-form').items.each(function(item){	   	                   		  
        		  if(item.getItemId() == 'isAbleToSave'){
            		  item.setValue('saveMeta', rec.get('saveMeta'));
            		  item.setValue('saveRemember', rec.get('saveRemember'));
            		  item.setValue('saveSubobj', rec.get('saveSubobj'));	   	              
            		  item.setValue('savePersonalFolder', rec.get('savePersonalFolder'));
        		  }else if(item.getItemId() == 'isAbleToSee'){
            		  item.setValue('seeMeta', rec.get('seeMeta'));
            		  item.setValue('seeNotes', rec.get('seeNotes'));
            		  item.setValue('seeSnapshot', rec.get('seeSnapshot'));	   	              
            		  item.setValue('seeSubobj', rec.get('seeSubobj'));
            		  item.setValue('seeViewpoints', rec.get('seeViewpoints'));
        		  }else if(item.getItemId() == 'isAbleToSend'){
            		  item.setValue('sendMail', rec.get('sendMail'));
        		  }else if(item.getItemId() == 'isAbleToBuild'){
            		  item.setValue('buildQbe', rec.get('buildQbe'));
        		  }else if(item.getItemId() == 'isAbleToDo'){
            		  item.setValue('doMassiveExport', rec.get('doMassiveExport'));
        		  }else if(item.getItemId() == 'isAbleToManage'){
            		  item.setValue('manageUsers', rec.get('manageUsers'));
            		  item.setValue('manageGlossaryBusiness', rec.get('manageGlossaryBusiness'));
            		  item.setValue('manageGlossaryTechnical', rec.get('manageGlossaryTechnical'));
            		  item.setValue('manageKpiValue', rec.get('manageKpiValue'));
            		  item.setValue('manageCalendar', rec.get('manageCalendar'));
        		  }else if(item.getItemId() == 'isAbleTokpiCommentDelete'){
            		  item.setValue('kpiCommentDelete', rec.get('kpiCommentDelete'));
        		  }else if(item.getItemId() == 'isAbleTokpiCommentEditMy'){
            		  item.setValue('kpiCommentEditMy', rec.get('kpiCommentEditMy'));
        		  }else if(item.getItemId() == 'isAbleTokpiCommentEditAll'){
            		  item.setValue('kpiCommentEditAll', rec.get('kpiCommentEditAll'));
            	  }else if(item.getItemId() == 'isAbleToEnableDatasetPersistence'){
        			  item.setValue('enableDatasetPersistence', rec.get('enableDatasetPersistence'));
        		  }else if(item.getItemId() == 'isAbleToEnableFederatedDataset'){
        			  item.setValue('enableFederatedDataset', rec.get('enableFederatedDataset'));
        		  }
            	  else  if(item.getItemId() == 'finalUserCan'){
        			  item.setValue('seeDocBrowser', rec.get('seeDocBrowser'));
        			  item.setValue('seeMyData', rec.get('seeMyData'));
        			  item.setValue('seeSubscriptions', rec.get('seeSubscriptions'));           
        			  item.setValue('seeFavourites', rec.get('seeFavourites'));
        			  item.setValue('seeToDoList', rec.get('seeToDoList'));
        			  item.setValue('createDocument', rec.get('createDocument'));
        			  item.setValue('createSocialAnalysis', rec.get('createSocialAnalysis'));
        			  item.setValue('viewSocialAnalysis', rec.get('viewSocialAnalysis'));
        			  item.setValue('hierarchiesManagement', rec.get('hierarchiesManagement'));
            	  }        		  
     	  });
		
		
		//fill checks for Business Model Categories
		var bmCategoriesArray = rec.get('bmCategories');

		var businessModelsCheckGroup = Ext.getCmp('businessModelsCheckGroup');
		//Force rendering check boxes if not already rendered
		businessModelsCheckGroup.doLayout();

		var businessModelsCategoriesCheckGroup = businessModelsCheckGroup.getComponent('businessModelsCategoriesCheckGroup');
		var bmCheckBoxes;
		if ((businessModelsCategoriesCheckGroup != undefined) && (businessModelsCategoriesCheckGroup.items != undefined) && (businessModelsCategoriesCheckGroup.items.items != undefined)){
			bmCheckBoxes = businessModelsCategoriesCheckGroup.items.items
		}
		
		if ((bmCheckBoxes != null) && (bmCheckBoxes !== undefined)){
			bmCheckBoxes.forEach(function(item){
		    	//set default to false
				item.setValue('false');

				//for each checkbox item
				for (var i = 0; i < bmCategoriesArray.length; i++) {
				    if(item.getItemId() == bmCategoriesArray[i]){	  			  
			      		item.setValue('true');
			  		}

				}

			});
		}
		
		//fill checks for Dataset Categories
		var dsCategoriesArray = rec.get('dsCategories');

		var datasetsCheckGroup = Ext.getCmp('datasetsCheckGroup');
		//Force rendering check boxes if not already rendered
		datasetsCheckGroup.doLayout();

		var datasetsCategoriesCheckGroup = datasetsCheckGroup.getComponent('datasetsCategoriesCheckGroup');
		var dsCheckBoxes;
		if ((datasetsCategoriesCheckGroup != undefined) && (datasetsCategoriesCheckGroup.items != undefined) && (datasetsCategoriesCheckGroup.items.items != undefined)){
			dsCheckBoxes = datasetsCategoriesCheckGroup.items.items
		}
		
		if (dsCategoriesArray && (dsCheckBoxes != null) && (dsCheckBoxes !== undefined)){
			dsCheckBoxes.forEach(function(item){
		    	//set default to false
				item.setValue('false');

				//for each checkbox item
				for (var i = 0; i < dsCategoriesArray.length; i++) {
				    if(item.getItemId() == dsCategoriesArray[i]){	  			  
			      		item.setValue('true');
			  		}

				}

			});
		}
        	 
       }
	
	


	//OVERRIDING ADD METHOD
	, addNewItem : function(){

		var emptyRecToAdd = new Ext.data.Record({
								id: 0,
								name:'', 
								label:'', 
								description:'',
								typeCd:'',
								code:'',
								saveSubobj: this.isVisible('saveSubobj'),
								seeSubobj:this.isVisible('seeSubobj'),
								seeViewpoints:this.isVisible('seeViewpoints'),
								seeSnapshot:this.isVisible('seeSnapshot'),
								seeNotes:this.isVisible('seeNotes'),
								sendMail:this.isVisible('sendMail'),
								savePersonalFolder:this.isVisible('savePersonalFolder'),
								saveRemember:this.isVisible('saveRemember'),
								seeMeta:this.isVisible('seeMeta'),
								saveMeta:this.isVisible('saveMeta'),
								buildQbe:this.isVisible('buildQbe'),
								doMassiveExport:this.isVisible('doMassiveExport'),
								manageUsers:false,
								manageGlossaryBusiness:false,
								manageGlossaryTechnical:false,
								manageKpiValue:false,
								manageCalendar:false,
								seeDocBrowser:this.isVisible('seeDocBrowser'),
                    	        seeFavourites:this.isVisible('seeFavourites'),
                    	        seeSubscriptions:this.isVisible('seeSubscriptions'),
                    	        seeMyData:this.isVisible('seeMyData'),
                    	        seeToDoList:this.isVisible('seeToDoList'),
                    	        createDocument:this.isVisible('createDocument'),
                    	        kpiCommentEditAll:this.isVisible('kpiCommentEditAll'),
                    	        kpiCommentEditMy:this.isVisible('kpiCommentEditMy'),
                    	        kpiCommentDelete:this.isVisible('kpiCommentDelete'),
                    	        createSocialAnalysis: this.isVisible('createSocialAnalysis'),
                    	        viewSocialAnalysis: this.isVisible('viewSocialAnalysis'),
                    	        hierarchiesManagement: this.isVisible('hierarchiesManagement'),
                    	        enableDatasetPersistence: this.isVisible('enableDatasetPersistence'),
                    	        enableFederatedDataset: this.isVisible('enableFederatedDataset'),
								bmCategories: [],
								dsCategories: []
							});
		
		this.getForm().loadRecord(emptyRecToAdd); 
		this.fillChecks(0, emptyRecToAdd);

		this.tabs.setActiveTab(0);
	}
	

, fillRecord : function(record){
		
		var values = this.getForm().getValues();	
 
        var savePf =values['savePersonalFolder'];
        var saveSo =values['saveSubobj'];
        var seeSo =values['seeSubobj'];
        var seeV =values['seeViewpoints'];
        var seeSn =values['seeSnapshot'];
        var seeN =values['seeNotes'];
        var sendM =values['sendMail'];
        var saveRe =values['saveRemember'];
        var seeMe =values['seeMeta'];
        var saveMe =values['saveMeta'];
        var builQ =values['buildQbe'];             
        var doMassiveExport =values['doMassiveExport'];
        var manageUsers =values['manageUsers'];  
        var manageGlossaryBusiness =values['manageGlossaryBusiness'];  
        var manageGlossaryTechnical =values['manageGlossaryTechnical'];  
        var manageKpiValue = values['manageKpiValue'];
        var manageCalendar = values['manageCalendar'];
        var seeDocBrowser =values['seeDocBrowser'];  
        var seeMyData =values['seeMyData'];  
        var seeFavourites =values['seeFavourites'];  
        var seeSubscriptions =values['seeSubscriptions'];  
        var seeToDoList =values['seeToDoList'];  
        var createDocument =values['createDocument'];
        var createSocialAnalysis =values['createSocialAnalysis'];
        var viewSocialAnalysis =values['viewSocialAnalysis'];
        var hierarchiesManagement =values['hierarchiesManagement'];
        var kpiCommentEditAll =values['kpiCommentEditAll'];  
        var kpiCommentEditMy =values['kpiCommentEditMy'];  
        var kpiCommentDelete =values['kpiCommentDelete'];
        var enableDatasetPersistence =values['enableDatasetPersistence'];  
        var enableFederatedDataset =values['enableFederatedDataset'];  

		if(savePf == 1){
        	record.set('savePersonalFolder', true);
        }else{
        	record.set('savePersonalFolder', false);
        }
        if(saveSo == 1){
        	record.set('saveSubobj', true);
        }else{
        	record.set('saveSubobj', false);
        }
        if(seeSo == 1){
        	record.set('seeSubobj', true);
        }else{
        	record.set('seeSubobj', false);
        }
        if(seeV == 1){
        	record.set('seeViewpoints', true);
        }else{
        	record.set('seeViewpoints', false);
        }
        if(seeSn == 1){
        	record.set('seeSnapshot', true);
        }else{
        	record.set('seeSnapshot', false);
        }
        if(seeN == 1){
        	record.set('seeNotes', true);
        }else{
        	record.set('seeNotes', false);
        }
        if(sendM == 1){
        	record.set('sendMail', true);
        }else{
        	record.set('sendMail', false);
        }
        if(saveRe == 1){
        	record.set('saveRemember', true);
        }else{
        	record.set('saveRemember', false);
        }
        if(seeMe == 1){
        	record.set('seeMeta', true);
        }else{
        	record.set('seeMeta', false);
        }
        if(saveMe == 1){
        	record.set('saveMeta', true);
        }else{
        	record.set('saveMeta', false);
        }
        if(builQ == 1){
        	record.set('buildQbe', true);
        }else{
        	record.set('buildQbe', false);
        }
        if(doMassiveExport == 1){
        	record.set('doMassiveExport', true);
        }else{
        	record.set('doMassiveExport', false);
        }
        if(manageUsers == 1){
        	record.set('manageUsers', true);
        }else{
        	record.set('manageUsers', false);
        }
        if(manageGlossaryBusiness == 1){
        	record.set('manageGlossaryBusiness', true);
        }else{
        	record.set('manageGlossaryBusiness', false);
        }
        if(manageKpiValue == 1){
        	record.set('manageKpiValue', true);
        }else{
        	record.set('manageKpiValue', false);
        }
        if(manageGlossaryTechnical == 1){
        	record.set('manageGlossaryTechnical', true);
        }else{
        	record.set('manageGlossaryTechnical', false);
        }
        if(manageCalendar == 1){
        	record.set('manageCalendar', true);
        }else{
        	record.set('manageCalendar', false);
        }
        if(seeDocBrowser == 1){
        	record.set('seeDocBrowser', true);
        }else{
        	record.set('seeDocBrowser', false);
        }
        if(seeMyData == 1){
        	record.set('seeMyData', true);
        }else{
        	record.set('seeMyData', false);
        }
        if(seeFavourites == 1){
        	record.set('seeFavourites', true);
        }else{
        	record.set('seeFavourites', false);
        }
        if(seeSubscriptions == 1){
        	record.set('seeSubscriptions', true);
        }else{
        	record.set('seeSubscriptions', false);
        }
        if(seeToDoList == 1){
        	record.set('seeToDoList', true);
        }else{
        	record.set('seeToDoList', false);
        }
        if(createDocument == 1){
        	record.set('createDocument', true);
        }else{
        	record.set('createDocument', false);
        }
        if(kpiCommentEditAll == 1){
        	record.set('kpiCommentEditAll', true);
        }else{
        	record.set('kpiCommentEditAll', false);
        }
        if(kpiCommentEditMy == 1){
        	record.set('kpiCommentEditMy', true);
        }else{
        	record.set('kpiCommentEditMy', false);
        }
        if(kpiCommentDelete == 1){
        	record.set('kpiCommentDelete', true);
        }else{
        	record.set('kpiCommentDelete', false);
        }
        if(createSocialAnalysis == 1){
        	record.set('createSocialAnalysis', true);
        }else{
        	record.set('createSocialAnalysis', false);
        }
        if(viewSocialAnalysis == 1){
        	record.set('viewSocialAnalysis', true);
        }else{
        	record.set('viewSocialAnalysis', false);
        }
        if(hierarchiesManagement == 1){
        	record.set('hierarchiesManagement', true);
        }else{
        	record.set('hierarchiesManagement', false);
        }
        if(enableDatasetPersistence == 1){
        	record.set('enableDatasetPersistence', true);
        }else{
        	record.set('enableDatasetPersistence', false);
        }
        if(enableFederatedDataset == 1){
        	record.set('enableFederatedDataset', true);
        }else{
        	record.set('enableFederatedDataset', false);
        }
        
        //Find selected business models categories
		var bmCategoriesArray = [];
		var bmItems = Ext.getCmp('businessModelsCheckGroup').getComponent('businessModelsCategoriesCheckGroup');
		if (bmItems !== undefined && bmItems !== null &&
			bmItems.items !== undefined && bmItems.items !== null	){
			var bmCheckBoxes = bmItems.items.items;
			if ((bmCheckBoxes != null) && (bmCheckBoxes !== undefined)){
				bmCheckBoxes.forEach(function(item){
			    	//if is checked
					if(item.getValue()){
						bmCategoriesArray.push(item.getItemId());
					}
	
				});
			}
			record.set('bmCategories',bmCategoriesArray);
		}
		
		//Find selected datasets categories
		var dsCategoriesArray = [];
		var dsItems = Ext.getCmp('datasetsCheckGroup').getComponent('datasetsCategoriesCheckGroup');
		if (dsItems !== undefined && dsItems !== null &&
			dsItems.items !== undefined && dsItems.items !== null	){
			var dsCheckBoxes = dsItems.items.items;
			if ((dsCheckBoxes != null) && (dsCheckBoxes !== undefined)){
				dsCheckBoxes.forEach(function(item){
			    	//if is checked
					if(item.getValue()){
						dsCategoriesArray.push(item.getItemId());
					}
	
				});
			}
			record.set('dsCategories',dsCategoriesArray);
		}
        
		return record;		
	}
	
	,save : function() {
		var values = this.getForm().getValues();
		var idRec = values['id'];
		var newRec;
	
		if(idRec ==0 || idRec == null || idRec === ''){
			newRec =new Ext.data.Record({
					name :values['name'],
			        description :values['description'],
			        typeCd :values['typeCd'],
			        code :values['code']
			});	  

			newRec = this.fillRecord(newRec);
			
		}else{
			var record;
			var length = this.mainElementsStore.getCount();
			for(var i=0;i<length;i++){
	   	        var tempRecord = this.mainElementsStore.getAt(i);
	   	        if(tempRecord.data.id==idRec){
	   	        	record = tempRecord;
				}			   
	   	    }	
			record.set('name',values['name']);
			record.set('description',values['description']);
			record.set('typeCd',values['typeCd']);
			record.set('code',values['code']);
			
			newRec = this.fillRecord(record);
			
		}

        var params = {
        	name : newRec.data.name,
        	description : newRec.data.description,
        	typeCd : newRec.data.typeCd,
        	code : newRec.data.code,
			saveSubobj: newRec.data.saveSubobj,
			seeSubobj:newRec.data.seeSubobj,
			seeViewpoints:newRec.data.seeViewpoints,
			seeSnapshot:newRec.data.seeSnapshot,
			seeNotes:newRec.data.seeNotes,
			sendMail:newRec.data.sendMail,
			savePersonalFolder:newRec.data.savePersonalFolder,
			saveRemember:newRec.data.saveRemember,
			seeMeta:newRec.data.seeMeta,
			saveMeta:newRec.data.saveMeta,
			buildQbe:newRec.data.buildQbe,
			doMassiveExport:newRec.data.doMassiveExport,
			manageUsers:newRec.data.manageUsers,
			manageGlossaryBusiness:newRec.data.manageGlossaryBusiness,
			manageGlossaryTechnical:newRec.data.manageGlossaryTechnical,
			manageKpiValue:newRec.data.manageKpiValue,
			manageCalendar:newRec.data.manageCalendar,
			seeDocBrowser: newRec.data.seeDocBrowser,
			seeMyData: newRec.data.seeMyData,
			seeFavourites: newRec.data.seeFavourites,
			seeSubscriptions: newRec.data.seeSubscriptions,
			seeToDoList: newRec.data.seeToDoList,
			createDocument: newRec.data.createDocument,
			createSocialAnalysis: newRec.data.createSocialAnalysis,
			viewSocialAnalysis: newRec.data.viewSocialAnalysis,
			hierarchiesManagement: newRec.data.hierarchiesManagement,
			kpiCommentEditAll: newRec.data.kpiCommentEditAll,
			kpiCommentEditMy: newRec.data.kpiCommentEditMy,
			kpiCommentDelete: newRec.data.kpiCommentDelete,
			enableDatasetPersistence: newRec.data.enableDatasetPersistence,
			enableFederatedDataset: newRec.data.enableFederatedDataset,
			bmCategories: newRec.data.bmCategories,
			dsCategories: newRec.data.dsCategories
        };
        if(idRec){
        	params.id = newRec.data.id;
        }
        
        Ext.Ajax.request({
            url: this.services['saveItemService'],
            params: params,
            method: 'GET',
            success: function(response, options) {
				if (response !== undefined) {			
		      		if(response.responseText !== undefined) {

		      			var content = Ext.util.JSON.decode( response.responseText );
		      			if(content.responseText !== 'Operation succeded') {
			                    Ext.MessageBox.show({
			                        title: LN('sbi.roles.error'),
			                        msg: content,
			                        width: 150,
			                        buttons: Ext.MessageBox.OK
			                   });
			      		}else{
			      			var roleID = content.id;
			      			if(roleID != null && roleID !==''){
			      				newRec.set('id', roleID);
			      				this.mainElementsStore.add(newRec);  
			      			}
			      			this.mainElementsStore.commitChanges();
			      			if(roleID != null && roleID !==''){
								this.rowselModel.selectLastRow(true);
				            }
			      			
			      			Ext.MessageBox.show({
			                        title: LN('sbi.attributes.result'),
			                        msg: LN('sbi.roles.resultMsg'),
			                        width: 200,
			                        buttons: Ext.MessageBox.OK
			                });

			      		}      				 

		      		} else {
		      			Sbi.exception.ExceptionHandler.showErrorMessage('Server response is empty', 'Service Error');
		      		}
				} else {
					Sbi.exception.ExceptionHandler.showErrorMessage('Error while saving Role', 'Service Error');
				}
            },
            failure: function(response) {
	      		if(response.responseText !== undefined) {
	      			var content = Ext.util.JSON.decode( response.responseText );
	      			var errMessage ='';
					for (var count = 0; count < content.errors.length; count++) {
						var anError = content.errors[count];
	        			if (anError.localizedMessage !== undefined && anError.localizedMessage !== '') {
	        				errMessage += anError.localizedMessage;
	        			} else if (anError.message !== undefined && anError.message !== '') {
	        				errMessage += anError.message;
	        			}
	        			if (count < content.errors.length - 1) {
	        				errMessage += '<br/>';
	        			}
					}

	                Ext.MessageBox.show({
	                    title: LN('sbi.attributes.validationError'),
	                    msg: errMessage,
	                    width: 400,
	                    buttons: Ext.MessageBox.OK
	               });
	      		}else{
	                Ext.MessageBox.show({
	                    title: LN('sbi.roles.error'),
	                    msg: 'Error while Saving Role',
	                    width: 150,
	                    buttons: Ext.MessageBox.OK
	               });
	      		}
            }
            ,scope: this
        });
    }
	
	,synchronize : function() {
		var syncUrl = Sbi.config.serviceRegistry.getServiceUrl({
					  serviceName: 'MANAGE_ROLES_ACTION'
					, baseParams: {LIGHT_NAVIGATOR_DISABLED: 'TRUE',MESSAGE_DET: "ROLES_SYNCHRONIZATION"}
			});
		
        Ext.Ajax.request({
            url: syncUrl,
            success: function(response, options) {
				if (response !== undefined) {
		      		if(response.responseText !== undefined) {
		      			var content = Ext.util.JSON.decode( response.responseText );
		      			if(content.responseText !== 'Operation succeded') {
			                    Ext.MessageBox.show({
			                        title: LN('sbi.roles.error'),
			                        msg: content,
			                        width: 150,
			                        buttons: Ext.MessageBox.OK
			                   });
			      		}else{		
			      			this.mainElementsStore.load();
			      			Ext.MessageBox.show({
			                        title: LN('sbi.roles.result'),
			                        msg: LN('sbi.roles.resultMsg'),
			                        width: 200,
			                        buttons: Ext.MessageBox.OK
			                });
			      		}      				 

		      		} else {
		      			Sbi.exception.ExceptionHandler.showErrorMessage('Server response is empty', 'Service Error');
		      		}
				} else {
					Sbi.exception.ExceptionHandler.showErrorMessage('Error while synchronize Roles', 'Service Error');
				}
            },
            failure: function(response) {
	      		if(response.responseText !== undefined) {
	      			var content = Ext.util.JSON.decode( response.responseText );
	      			var errMessage ='';
					for (var count = 0; count < content.errors.length; count++) {
						var anError = content.errors[count];
	        			if (anError.localizedMessage !== undefined && anError.localizedMessage !== '') {
	        				errMessage += anError.localizedMessage;
	        			} else if (anError.message !== undefined && anError.message !== '') {
	        				errMessage += anError.message;
	        			}
	        			if (count < content.errors.length - 1) {
	        				errMessage += '<br/>';
	        			}
					}

	                Ext.MessageBox.show({
	                    title: LN('sbi.attributes.validationError'),
	                    msg: errMessage,
	                    width: 400,
	                    buttons: Ext.MessageBox.OK
	               });
	      		}else{	      			
	                Ext.MessageBox.show({
	                    title: LN('sbi.roles.error'),
	                    msg: 'Error while synchronize Roles',
	                    width: 150,
	                    buttons: Ext.MessageBox.OK
	               });
	      		}
            }
            ,scope: this
        });
    }
	
	, enableChecks: function(combo, rec, idx){
		var userFuncs = this.authorizationTab.items.items[0].items.items;
		var userChecks = null;
		for (key in userFuncs) {
			var elem = userFuncs[key];
			 if (elem.itemId == 'finalUserCan'){
				 userChecks = userFuncs[key];
				 break;
			 }
		}
		
		if (rec.get('typeCd') !== undefined && rec.get('typeCd') == 'USER'){
		    userChecks.setDisabled(false);		    
		}else{					
		    userChecks.setDisabled(true);
		}		
		
	}
	
	, enableConfigurableAuthorizations: function(){
		//Load list of authorization configurable for this tenant (related to product types)
		this.authorizationsStore = new Ext.data.JsonStore(
				{
					url : this.configurationObject.getAuthorizationsList,
					autoLoad : false,
					root : 'root',
					fields : [ 'name' ],
					restful : true
				});
		var thisPanel = this;
		this.authorizationsStore.load({

			callback: function(r,option,success){
				// alert("loaded store");
				
				//load authorizations mapping to elements gui
				var mapping = Sbi.profiling.AuthorizationsMapping;
				var auths = mapping.authorizations;
				for(var i=0; i < auths.length; i++){
					var aMapping = auths[i];
					thisPanel.checkAuthorizationVisibility(aMapping);
				}	 
				
				thisPanel.hideEmptyCheckBoxGroup();
			}
		});
	}
	
	, checkAuthorizationVisibility: function(authorizationMapping){
		//check if the authorization is in the list of the authorization of the user's tenant
		//if not, hide the corresponding GUI element
		var index = this.authorizationsStore.find("name",authorizationMapping[1])
		if (index == -1){
			//hide component
			var aCheck = Ext.getCmp(authorizationMapping[0]);
			aCheck.setValue('false');
			aCheck.hide();
		}
	}
	, hideEmptyCheckBoxGroup: function(){
		var checksForm = Ext.getCmp('checks-form');
		checksForm.items.each(function(item){
			var checkGroupItemsCount = item.items.length
			var hiddenItemsCount = 0;
			item.items.each(function(item){
				if (!item.isVisible()){
					//count how many hidden items are inside the checkbox group
					hiddenItemsCount = hiddenItemsCount + 1;
				}
			});
			
			//hide the entire checkBoxGroup because all his items are hidden
			if (hiddenItemsCount == checkGroupItemsCount) {			
				item.hideLabel = true;
				var label = item.label
				//force css display:none because only hide keeps empty space
				label.setDisplayed('none')
				item.getEl().setDisplayed('none')

			}
		});

	}
	
	, isVisible: function(elementId){
		//check if the element is hidden or not
		var element = Ext.getCmp(elementId);
		return element.isVisible();
	}

});
