'''Construct regional JSON files.

	Create regional info, county and grid jsons for use in DM Editor.
	For use at: https://dm-editor.nrcc.cornell.edu/

	Users must edit 'regions' dictionary to contain info for regions of interest.
	'regions' keys:
	'label': description of region
	'states': list of states that comprise region
	'grid_bounds': directional edges of area that encompasses region
	'grid_res': grid spatial resolution (degrees)

	Files output:
	regions_info.json
	<region>_county_with_fips.json
	<region>_grid_<grid_res>deg.json

	Place output files in src/public/data for use in DM Editor tool.

	bnb2
'''
import sys
import json
import requests
import numpy as np
import polyRoutines as poly

# regions info
regions = {
	'neweng': {
		'label':'New York and New England',
		'states':['NY','MA','ME','VT','NH','RI','CT'],
		'grid_bounds':{'slat':40.,'nlat':48.,'wlon':-80.,'elon':-66.},
		'grid_res':0.1
	},
	'midatl': {
		'label':'Mid-Atlantic',
		'states':['PA','NJ','WV','MD','DE'],
		'grid_bounds': {'slat':37.,'nlat':43.,'wlon':-83.,'elon':-72.},
		'grid_res':0.1
	}
}

def acis_ws(subdomain,method,params) :
	acis_url = 'http://'+subdomain+'.rcc-acis.org/'
	r = requests.post(acis_url+method,json=params,headers={'Accept':'application/json'})
	return r.json()

regionList = regions.keys()
for region in regionList:

	######
	print('ACIS call ... General/county')
	input_params = {"state":",".join(regions[region]['states']),"meta":"id,name,geojson,state"}
	countyGeojsonFeaturesFromACIS = acis_ws('data','General/county',input_params)

	######
	print('Construct county GeoJSON for region: '+region)
	featureList = []
	for feature in countyGeojsonFeaturesFromACIS["meta"]:
		if 'geojson' not in feature: continue
		if feature["state"] in regions[region]['states']:
			featureOut = {}
			featureOut["geometry"] = feature["geojson"]
			featureOut["type"] = "Feature"
			featureOut["properties"] = {"id":feature["id"],"state":feature["state"],"name":feature["name"].replace(' County','')}
			featureList.append(featureOut)

	countyFeatures = {}
	countyFeatures["type"] = "FeatureCollection"
	countyFeatures["features"] = featureList

	ofile = open(region+'_county_with_fips.json','w')
	json.dump(countyFeatures,ofile)
	ofile.close()

	######
	print('Construct grid GeoJSON for region: '+region)
	spatialRes = regions[region]['grid_res']
	lats = np.arange(regions[region]['grid_bounds']['slat'],regions[region]['grid_bounds']['nlat'],spatialRes)
	lons = np.arange(regions[region]['grid_bounds']['wlon'],regions[region]['grid_bounds']['elon'],spatialRes)

	id = 0
	featureList = []
	for lat in lats:
		for lon in lons:
			gridCoordList = [[lon,lat],[lon,lat+spatialRes],[lon+spatialRes,lat+spatialRes],[lon+spatialRes,lat],[lon,lat]]
			for feature in countyFeatures['features']:
				numPolygonsInCounty = len(feature['geometry']['coordinates'])
				for inum in range(numPolygonsInCounty):
					#polyToTest = [[-78.0,42.0],[-78.0,44.0],[-74.0,44.0],[-74.0,42.0],[-78.0,42.0]]
					polyToTest = feature['geometry']['coordinates'][inum][0]
					for glon,glat in gridCoordList:
						gridInPolygon = poly.pointInPolygon(glon,glat,polyToTest)
						if gridInPolygon: break
					for tlon,tlat in polyToTest:
						polygonInGrid = poly.pointInPolygon(tlon,tlat,gridCoordList)
						if polygonInGrid: break
					if gridInPolygon or polygonInGrid: break
				if gridInPolygon or polygonInGrid: break
			if gridInPolygon or polygonInGrid:
				featureOut={}
				featureOut["type"]="Feature"
				featureOut["geometry"]={"type":"MultiPolygon", "coordinates": [[gridCoordList]]}
				featureOut["properties"]={"id":str(id),"name":str(id)}
				featureList.append(featureOut)
				id+=1

	gridFeatures = {}
	gridFeatures["type"] = "FeatureCollection"
	gridFeatures["features"] = featureList

	ofile = open(region+'_grid_'+str(spatialRes)+'deg.json','w')
	json.dump(gridFeatures,ofile)
	ofile.close()

######
print('Construct regional info file')
regionsInfo = {}
for region in regionList:
	regionsInfo[region] = {
		'label':regions[region]['label'],
		'maxbounds':[
			[regions[region]['grid_bounds']['slat'],regions[region]['grid_bounds']['wlon']],
			[regions[region]['grid_bounds']['nlat'],regions[region]['grid_bounds']['elon']]
		]
	}
ofile = open('regions_info.json','w')
json.dump(regionsInfo,ofile)
ofile.close()

