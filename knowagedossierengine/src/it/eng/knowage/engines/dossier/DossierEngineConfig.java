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
package it.eng.knowage.engines.dossier;

import java.io.File;

import it.eng.spago.configuration.ConfigSingleton;
import it.eng.spagobi.services.common.EnginConf;
import it.eng.spagobi.tenant.TenantManager;

public class DossierEngineConfig {
	
	private static  EnginConf engineConfig;
	private static DossierEngineConfig instance;
	
	public static DossierEngineConfig getInstance() {
		if (instance == null) {
			instance = new DossierEngineConfig();
		}
		return instance;
	}
	public DossierEngineConfig() {
		setEngineConfig(EnginConf.getInstance());
	}
	public void setEngineConfig(EnginConf engineConfigparam) {
		engineConfig = engineConfigparam;
	}

	public static  EnginConf getEngineConfig(){
		return engineConfig;
		
	}
	
	public static String getEngineResourcePath(){
		String path = null;
		if (getEngineConfig().getResourcePath() != null) {
			path = getEngineConfig().getResourcePath() + System.getProperty("file.separator");
		} else {
			path = ConfigSingleton.getRootPath() + System.getProperty("file.separator") + "resources" + File.separatorChar
					+ TenantManager.getTenant().getName();
		}
		return path;
		
	}
}
