"""Routines to determine if a point is inside a given polygon or not
	Polygon is a list of (x,y) pairs.
"""

def pointInPolygon(x,y,poly):
	"""Determine if point is inside polygon.

		poly = list of (x,y) pairs
	"""
	n = len(poly)
	inside =False

	p1x,p1y = poly[0]
	for i in range(n+1):
		p2x,p2y = poly[i % n]
		if y > min(p1y,p2y):
			if y <= max(p1y,p2y):
				if x <= max(p1x,p2x):
					if p1y != p2y:
						xinters = (y-p1y)*(p2x-p1x)/(p2y-p1y)+p1x
					if p1x == p2x or x <= xinters:
						inside = not inside
		p1x,p1y = p2x,p2y

	return inside

def getInfoFromShp(shpFile):
	"""Read polygon from shp file and place in tuple.

		polyInfo = dictionary of polygon info (polygons are list of (x,y) pairs)
		shpFile = shp file to read from
		requires import of shpUtils module.
	"""

	import shpUtils

	polyInfo = {}

	shpRecs = shpUtils.loadShapefile(shpFile)
	numRecords = len(shpRecs)
	for irec in range(numRecords):
		polyInfo[irec] = {}
		polyInfo[irec]['POINTS'] = []
		numVertices = len(shpRecs[irec]['shp_data']['parts'][0]['points'])
		for ivert in range(numVertices):
			lon = shpRecs[irec]['shp_data']['parts'][0]['points'][ivert]['x']
			lat = shpRecs[irec]['shp_data']['parts'][0]['points'][ivert]['y']
			polyInfo[irec]['POINTS'].append((lon,lat))
	return polyInfo


if __name__=='__main__':
	# test on US shapefile
	# from http://www.vdstech.com/map_data.htm
	polyInfo = getInfoFromShp('./us/usa_st.shp')
	numPoly = len(polyInfo)
	lon=-126.00; lat=40.00
	for ipoly in range(numPoly):
		polyToTest = polyInfo[ipoly]['POINTS']
		res = pointInPolygon(lon,lat,polyToTest)
		if res:
			print lon,lat,'In US Polygon'
			break
		else:
			pass
	if not res: print lon,lat,'Outside US polygon'
else:
	pass
