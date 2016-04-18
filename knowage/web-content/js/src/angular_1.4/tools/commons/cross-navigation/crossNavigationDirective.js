angular.module('cross_navigation', ['ngMaterial','bread_crumb','angular_table'])
.config(['$mdThemingProvider', function($mdThemingProvider) {
	$mdThemingProvider.theme('knowage')
	$mdThemingProvider.setDefaultTheme('knowage');
}])
.service('$crossNavigationHelper',
		function($crossNavigationSteps,sbiModule_restServices,sbiModule_config,$mdDialog,sbiModule_translate){ 
		var cns=this;
		var selectedRole={};
		this.crossNavigationSteps=$crossNavigationSteps;
		
		this.changeNavigationRole=function(newRole){
			selectedRole=newRole;
		};
		
		//chartType,documentName, documentParameters, categoryName, categoryValue, serieName, serieValue, groupingCategoryName, groupingCategoryValue, stringParameters
		this.navigateTo=function(navData){
			 
			sbiModule_restServices.promiseGet("1.0/crossNavigation",this.crossNavigationSteps.currentDocument.name+"/loadCrossNavigationByDocument")
			.then(function(response){
				 var parameterStr="";
				var navObj=response.data;
				var targetUrl="";
				if(navObj.length==0){
					alert("non ci sono documenti di destinazione");
					return;
				}else if(navObj.length==1){
					execCross(navObj[0],navData); 
				}
				else if(navObj.length>=1){
				 
					$mdDialog.show({
					      controller: function($scope,documents,translate,$mdDialog){
					    	  $scope.translate=translate;
					    	  $scope.documents=documents;
					    	  $scope.cancel=function(){
					    		  $mdDialog.cancel();
					    	  };
					    	  $scope.selectDocument=function(item){
					    		  $mdDialog.hide(item);
					    	  }
					    	  
					    	  },
					      template: '<md-dialog aria-label="Select document" layout="column" ng-cloak style="max-width: 400px;">'
					    	  +'<md-toolbar>'
					    	  +'	<div class="md-toolbar-tools">'
					    	  +'		<h2>{{translate.load("Seleziona il documento di destinazione")}}</h2>'
					    	  +'	</div>'
					    	  +'</md-toolbar>'
					    	  +'<div layout-margin flex>'
					    	  +'	<angular-table flex id="selectDoctableCross" ng-model=documents columns="[{label:\'\',name:\'document.name\'}]" hide-table-head="true" click-function="selectDocument(item);"></angular-table>'
					    	  +'</div>'
					    	  +'<div layout="row">'
					    	  +'	<span flex></span>'
					    	  +'	<md-button ng-click="cancel()">Cancel</md-button>'
					    	  +'</div>'
					    	  +'</md-dialog>',
					      clickOutsideToClose:false, 
					      locals:{documents:navObj,
					    	  translate:sbiModule_translate}
					    })
					    .then(function(doc) {
					    	execCross(doc,navData);
					    }, function() {
					     return;
					    });
					
					
				}
				
				
				
				
			
			},function(response){
				sbiModule_restServices.errorHandler(response.data, "Errors while attempt to open target document")
			})
			 
		};
		
		function execCross(doc,navData){
			parameterStr=cns.responseToStringParameter(doc,navData);
			targetUrl= sbiModule_config.contextName 
			+ '/restful-services/publish?PUBLISHER=/WEB-INF/jsp/tools/documentexecution/documentExecutionNg.jsp'
			+ '&OBJECT_ID=' + doc.document.id
			+ '&OBJECT_LABEL=' + doc.document.label 
			+ '&SELECTED_ROLE=' + selectedRole.name
			+ '&SBI_EXECUTION_ID=null'
			+ '&OBJECT_NAME=' + doc.document.name
			+"&CROSS_PARAMETER="+parameterStr
			;
			cns.crossNavigationSteps.stepControl.insertBread({name:doc.document.label,id:doc.document.id,url:targetUrl});
		};
		
		this.responseToStringParameter=function(navObj,navData){
			var respStr={};
			
			if(angular.isArray(navData)){
				respStr={};
				for(var dataKey in navData){
//					var tmpObj={};
					
					for(var key in navObj.navigationParams){
						var parVal=navObj.navigationParams[key];
						if(parVal.fixed){
							if(!respStr.hasOwnProperty(key)){
								respStr[key]=[];
							}
							respStr[key].push(parVal.value);
						}else{
							if(navData[dataKey].hasOwnProperty(parVal.value) && navData[dataKey][parVal.value]!=undefined && navData[dataKey][parVal.value]!=null){ 
								if(!respStr.hasOwnProperty(key)){
									respStr[key]=[];
								}
								
								respStr[key].push(navData[dataKey][parVal.value]);
							}
						}
						
					}
					
//					respStr.push(tmpObj);
				}
				
				
			}else{
				for(var key in navObj.navigationParams){
					var parVal=navObj.navigationParams[key];
					if(parVal.fixed){
						respStr[key]=parVal.value
					}else{
						if(navData.hasOwnProperty(parVal.value) && navData[parVal.value]!=undefined && navData[parVal.value]!=null){ 
							respStr[key]=navData[parVal.value];
						}
					}
				}
			}
			
			respStr =  encodeURIComponent(JSON.stringify(respStr))
			.replace(/'/g,"%27")
			.replace(/"/g,"%22")
			.replace(/%3D/g,"=")
			.replace(/%26/g,"&");
			
			return respStr;
		}
})

.factory('$crossNavigationSteps',function(){
	return {stepControl:{},stepItem:[],value:{}}
})

.directive('crossNavigation', function() {
	return {
		template:'',
		replace:false,
		transclude : true,
		scope:{
			crossNavigationHelper:"=?"
		},
		controller: crossNavControllerFunct,
		link: function(scope, element, attrs, ctrl, transclude) {
			transclude(scope,function(clone,scope) {
			 	element.append(clone) ;
			});  
		}
	} 
})

.directive('crossNavigationBreadCrumb', function($timeout) {
	return {
		template:'<bread-crumb id="id" '
			+'ng-show=" crossNavigationHelper.crossNavigationSteps.stepItem.length>1" '
			+'ng-model=crossNavigationHelper.crossNavigationSteps.stepItem item-name="name" '
			+'selected-index="crossNavigationHelper.crossNavigationSteps.value" ' 
			+'control="crossNavigationHelper.crossNavigationSteps.stepControl" ' 
			+'move-to-callback=callbackFunct() '
			+'selected-item="crossNavigationHelper.crossNavigationSteps.currentDocument" > '
			+'</bread-crumb>',
		link: function(scope, element, attrs, ctrl, transclude) {
		  scope.callbackFunct=function(){
			   $timeout(function(){
				  scope.crossNavigationHelper.crossNavigationSteps.stepControl.refresh();
				  },0)
		  }
		}
	} 
});

function crossNavControllerFunct($scope,$timeout,$crossNavigationHelper){
 
	if($scope.crossNavigationHelper==undefined){
		$scope.crossNavigationHelper=$crossNavigationHelper; 
	}
}