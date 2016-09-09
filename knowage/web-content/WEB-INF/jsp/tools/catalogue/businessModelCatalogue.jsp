<%--
Knowage, Open Source Business Intelligence suite
Copyright (C) 2016 Engineering Ingegneria Informatica S.p.A.

Knowage is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published by
the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

Knowage is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
--%>


<%@page import="it.eng.spagobi.commons.bo.UserProfile"%>
<%@page import="it.eng.spago.security.IEngUserProfile"%>
<%@page import="it.eng.spagobi.commons.constants.SpagoBIConstants"%>
<%@page import="it.eng.spagobi.commons.dao.DAOFactory"%>
<%@page import="it.eng.spagobi.tools.dataset.federation.FederationDefinition"%>
<%@page language="java" contentType="text/html; charset=ISO-8859-1" pageEncoding="ISO-8859-1"%>


<%-- ---------------------------------------------------------------------- --%>
<%-- JAVA IMPORTS															--%>
<%-- ---------------------------------------------------------------------- --%>


<%@include file="/WEB-INF/jsp/commons/angular/angularResource.jspf"%>

<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html ng-app="businessModelCatalogueModule">
<head>

<%@include file="/WEB-INF/jsp/commons/angular/angularImport.jsp"%>

<!-- Styles -->
<!-- <link rel="stylesheet" type="text/css"	href="/knowage/themes/glossary/css/generalStyle.css"> -->

<!-- <link rel="stylesheet" type="text/css"	href="/knowage/themes/catalogue/css/catalogue.css"> -->
<link rel="stylesheet" type="text/css" href="<%=urlBuilder.getResourceLink(request, "themes/commons/css/customStyle.css")%>">

<%-- <script type="text/javascript" src="/knowage/js/src/angular_1.4/tools/commons/angular-table/AngularTable.js"></script> --%>
<script type="text/javascript" src="${pageContext.request.contextPath}/js/src/angular_1.4/tools/commons/angular-table/AngularTable.js"></script>

<%-- <script type="text/javascript" src="/knowage/js/src/angular_1.4/tools/catalogues/businessModelCatalogue.js"></script> --%>
<script type="text/javascript" src="${pageContext.request.contextPath}/js/src/angular_1.4/tools/catalogues/businessModelCatalogue.js"></script>

		<!-- Retrieveing datasets used in creating a federation definition, as well as the whole relationships column -->
		<%
			String user = "";
			if(userName!=null){
				user = userName;
			}
		%>
		
		<!-- check if use is admin or tecnical user -->
		
		<%
		boolean isAdmin=UserUtilities.isAdministrator(userProfile);
		boolean isTec=UserUtilities.isTechnicalUser(userProfile);
		
		%>
		<!-- Making lisOfDSL and relString avaliable for use in federatedDataset.js -->
		<script>
			var valueUser = '<%= user  %>';
		</script>

<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
<title>Business Model Catalogue</title>
</head>
<body  class="bodyStyle businessModelCatalog" ng-controller="businessModelCatalogueController as ctrl">
<rest-loading></rest-loading>
	<angular-list-detail show-detail="showMe">
		<list label='translate.load("sbi.tools.catalogue.metaModelsCatalogue")' new-function="createBusinessModel"> 

					<angular-table 
						flex
						id="businessModelList_id"
						ng-show="!bmLoadingShow"
						ng-model="businessModelList"
						columns='[{"label":"Name","name":"name"},{"label":"Description","name":"description"}]' 
						columns-search='["name","description"]'
						show-search-bar=true
						highlights-selected-item=true
						click-function ="leftTableClick(item)"
						selected-item="selectedBusinessModels"
						speed-menu-option="bmSpeedMenu"					
					></angular-table>

		</list>
		
		<detail label='selectedBusinessModel.name==undefined? "" : selectedBusinessModel.name'  
				save-function="saveBusinessModel"
				cancel-function="cancel"
				disable-save-button="!businessModelForm.$valid"
				show-save-button="showMe" show-cancel-button="showMe">
		   <form name="businessModelForm" novalidate >
		
		
          <md-card>
	        <md-card-content layout="column">
		        <md-input-container class="md-block" >
					<label>{{translate.load("sbi.ds.name")}}</label>
					<input ng-disabled="isEdit(selectedBusinessModel)"  ng-model="selectedBusinessModel.name" name="name" required ng-maxlength="100">
<!-- 					<div ng-messages="businessModelForm.name.$error"> -->
<!-- 			          <div ng-message="required">Name is required.</div> -->
<!-- 			        </div> -->
				</md-input-container>
				
				<md-input-container class="md-block">
					<label>{{translate.load("sbi.ds.description")}}</label>
					<input ng-model="selectedBusinessModel.description"	ng-maxlength="100" > 
				</md-input-container>
				
				<md-input-container class="md-block"> 
					<label>{{translate.load("sbi.ds.catType")}}</label>
				   <md-select  aria-label="aria-label" ng-model="selectedBusinessModel.category" >
				    <md-option  ng-repeat="c in listOfCategories track by $index" value="{{c.valueId}}">{{c.valueName}} </md-option>
				    <md-option value="{{null}}"></md-option>
				   </md-select> 
				</md-input-container>
				
				<md-input-container class="md-block"> 
					<label>{{translate.load("sbi.ds.dataSource")}}</label>
				       <md-select  aria-label="aria-label" required name="ds"
				        ng-model="selectedBusinessModel.dataSourceLabel"> <md-option
				        ng-repeat="d in listOfDatasources" value="{{d.label}}">{{d.label}} </md-option>
				       </md-select>
<!-- 				       <div ng-messages="businessModelForm.ds.$error"> -->
<!-- 			        	  <div ng-message="required">Datasource is required.</div> -->
<!-- 			       		</div> -->
				       
				</md-input-container>
				
				<div layout="row" layout-wrap layout-align="start center">
					<label ng-if="!metaWebFunctionality"  class="buttonLabel">{{translate.load("sbi.ds.file.upload.button")}}:</label>
      				<file-upload ng-if="!metaWebFunctionality"  flex ng-model="fileObj" id="businessModelFile" flex></file-upload>
      				
      				
      				<% if(isAdmin || isTec){ %>
      				
      				<md-button ng-if="metaWebFunctionality" class="md-raised" aria-label="Profile" ng-click="createBusinessModels()" ng-disabled="selectedBusinessModel.dataSourceLabel==undefined">
						{{translate.load("sbi.bm.metaweb")}}
					</md-button>
					
					<md-button ng-if="metaWebFunctionality && togenerate" class="md-raised" aria-label="Profile" ng-click="buildBusinessModels()" ng-disabled="selectedBusinessModel.dataSourceLabel==undefined">
						{{translate.load("sbi.bm.generate")}}
					</md-button>
					
					<md-input-container ng-show="selectedBusinessModel.id!=unRdefined" flex>
			          <md-switch ng-model="metaWebFunctionality" >{{translate.load("sbi.bm.metaweb.enable")}}</md-switch>
			        </md-input-container>
					<%} %>
      				
      				<!-- ng-click="fileChange();checkChange()"  -->
      				<%
					if (userProfile.isAbleToExecuteAction(SpagoBIConstants.META_MODEL_LIFECYCLE_MANAGEMENT)) {%>
      				<md-input-container flex>
			          <md-switch ng-model="selectedBusinessModel.modelLocked" ng-change="businessModelLock()">{{ selectedBusinessModel.modelLocked ? translate.load("sbi.bm.unlockModel") : translate.load("sbi.bm.lockModel")}}</md-switch>
			        </md-input-container>
					<%} %>
      				
				</div>
			</md-card-content>
	      </md-card>
	      
	      <md-card ng-if="bmVersions!=undefined && bmVersions.length>0">

	      	<md-toolbar class="secondaryToolbar">
		      <div class="md-toolbar-tools">
		        <h2>
		          <span>{{translate.load("sbi.catalogues.generic.title.metadata")}}</span>
		        </h2>
		   
		      </div>
		    </md-toolbar>

	      <md-card-content>
	      	<div layout="column" layout-margin>
		      	<div  layout="row">
		      		<%
					if (userProfile.isAbleToExecuteAction(SpagoBIConstants.META_MODEL_SAVING_TO_RDBMS)) {%>
					<md-button ng-click="importMetadata(selectedBusinessModel.id)"  ng-disabled="bmImportingShow" class="md-raised md-ExtraMini" style="min-width:15rem;">{{translate.load("sbi.tools.catalogue.metaModelsCatalogue.import.metadata");}}</md-button>
					<%} %>
					<%
					if (userProfile.isAbleToExecuteAction(SpagoBIConstants.META_MODEL_CWM_EXPORTING)) {%>	
					<md-button ng-click="downloadCWMFile(selectedBusinessModel.id)" ng-disabled="bmCWMProcessingShow" class="md-raised" >{{translate.load("sbi.metadata.cwm.export.button")}}</md-button></div>
					<%} %>
				</div>
				<div   ng-show="bmImportingShow" >
    				<md-progress-linear md-mode="indeterminate"></md-progress-linear>
    				<div class="bottom-block">
				      <span>{{translate.load("sbi.catalogues.generic.import.progress")}}</span>
				    </div>
      			</div> 
      			<div   ng-show="bmCWMProcessingShow" >
    				<md-progress-linear md-mode="indeterminate"></md-progress-linear>
    				<div class="bottom-block">
				      <span>{{translate.load("sbi.metadata.cwm.export.progress")}}</span>
				    </div>
      			</div> 
	      	</div>
	      	 
	      	 <md-divider layout-margin></md-divider>
	      	<div layout="row" layout-wrap layout-align="start center">
				<label flex  class="buttonLabel">{{translate.load("sbi.metadata.cwm.import.file.upload")}}:</label>
		        <file-upload flex ng-model="fileObjCWM" id="cwmFile" ng-click="fileCWMChange();checkCWMChange()"></file-upload>
            	<div flex>
               		 <md-button  ng-click="importCWMFile(selectedBusinessModel.id)" ng-disabled="bmCWMDisableImportButton" class="md-raised">{{translate.load("sbi.metadata.cwm.import.button")}}</md-button>
            	</div>
               	

                                     						 
      		</div>
      		<div   ng-show="bmCWMImportingShow" >
    				<md-progress-linear md-mode="indeterminate"></md-progress-linear>
    				<div class="bottom-block">
				      <span>{{translate.load("sbi.metadata.cwm.import.progress")}}</span>
				    </div>
      			</div> 
	      </md-card-content>
	      </md-card>
	      
	      
	      <md-card layout="column">
	      	<md-toolbar class="secondaryToolbar">
		      <div class="md-toolbar-tools">
		        <h2>
		          <span>{{translate.load("sbi.widgets.catalogueversionsgridpanel.title")}}</span>
		        </h2>
		   
		      </div>
		    </md-toolbar>

	      <md-card-content layout="column">
	      	
				<md-radio-group ng-model="bmVersionsActive" >
				
				<angular-table
					ng-show="!versionLoadingShow"
					id="bmVersions_id"
					ng-model="bmVersions"
					columns='[
						{"label":"ACTIVE","name":"ACTION", "size":"100px"},
						{"label":"FILE NAME","name":"fileName"},
						{"label":"CREATOR","name":"creationUser"},
						{"label":"CREATION DATE","name":"creationDate"}
						]'
					columns-search='["creationUser","creationDate"]'
					show-search-bar=false
					selected-item="selectedVersions"
					highlights-selected-item=true
					speed-menu-option="bmSpeedMenu2"	
					no-pagination=false	
					click-function="clickRightTable(item)"
					layout-fill							
				>						
				</angular-table>
				</md-radio-group>
						
	      </md-card-content>
	      </md-card>

	      </form>
		</detail>
	</angular-list-detail>
</body>
</html>
