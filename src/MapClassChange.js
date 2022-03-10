///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import React from 'react';
import PropTypes from 'prop-types';

import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Backdrop from '@mui/material/Backdrop';

import 'leaflet/dist/leaflet.css';
import { MapContainer, GeoJSON, TileLayer } from 'react-leaflet';

import CategorySelect from './CategorySelect'
import DownloadMap from './DownloadMap'

const mapContainer = 'map-container';
const mapCenter = [43.8, -74.0];
const zoomLevel = 6;
const minZoomLevel = 5;
const maxZoomLevel = 9;

const MapClassChange = (props) => {

    const MapTypeButton = () => {
      return (
        <div className="leaflet-top leaflet-right">
          <div className="leaflet-control">
            <Button
              variant='contained'
              color='primary'
              size={'small'}
              onClick={() => {props.maptype==='dmcat' ? props.onchange_maptype('changes') : props.onchange_maptype('dmcat')}}
            >
              {props.maptype==='dmcat' ? 'Drought Monitor Editor' : 'User Changes To DM'}<br/>
              {'(change view)'}
            </Button>
          </div>
        </div>
      )
    }

    const DownloadMapButton = () => {
      let todayDate = new Date().toISOString().slice(0, 10);
      let fname = 'user-class-change-map-'+todayDate+'.png'
      return (
          <div className="leaflet-control leaflet-bar">
            <DownloadMap fname={fname} />
          </div>
      )
    }

    const MapButtonGroup = () => {
      return (
        <div className="leaflet-top leaflet-left" style={{"marginTop":80}}>
            <Grid container justify="center" alignItems="center" direction="column" spacing={0}>
              <Grid item>
                <DownloadMapButton />
              </Grid>
            </Grid>
        </div>
      )
    }

    const CategoryLegend = () => {
      return (
          <div id='cat-legend' className="leaflet-bottom leaflet-left">
            <div className="leaflet-control leaflet-bar">
                <CategorySelect
                  selected={props.category}
                  categories={props.categories}
                  onchange={props.onchange_category}
                  editable={props.editable}
                  maptype={props.maptype}
                />
            </div>
          </div>
      )
    }

    const findValueForFips = (fips) => {
      return props.values['drought_cat'][fips];
    }

    const getFeatureColor = (v) => {
      let c
      for (c of props.categories) {
        if (v===c.number) {return c.color}
      }
      return '#FFFFFF'
    }

    const featureStyle_grid = (feature) => {
      return {
        weight: 1,
        opacity: 0.8,
        //color: '#000000',
        color: null,
        dashArray: '1',
        fillColor: getFeatureColor(findValueForFips(feature.properties.id)),
        fillOpacity: 0.8,
      };
    }

    const featureStyle_county = (feature) => {
      return {
        weight: 1,
        opacity: 0.8,
        color: '#000000',
        dashArray: '1',
        fill: false,
      };
    }

    return (
      <div className="drought-map" id="drought-map">
        <MapContainer
            center={mapCenter}
            zoom={zoomLevel}
            minZoom={minZoomLevel}
            maxZoom={maxZoomLevel}
            zoomControl={true}
            dragging={!props.editable}
            attributionControl={true}
            className={mapContainer}
            style={{ height:720, width:900 }}
        >
            <TileLayer
                attribution="&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {props.values &&
            <GeoJSON
                data={props.gridboundaries}
                style={featureStyle_grid}
            />
            }

            {props.values &&
            <GeoJSON
                data={props.countyboundaries}
                style={featureStyle_county}
            />
            }

            <MapButtonGroup />

            <MapTypeButton />

            <CategoryLegend />

            {!props.values &&
              <Backdrop
                sx={{zIndex:1000}}
                invisible={true}
                open={!props.values}
              >
                <CircularProgress size={200} color="primary"/>
              </Backdrop>
            }
        </MapContainer>
      </div>
    );
}

MapClassChange.propTypes = {
  countyboundaries: PropTypes.object.isRequired,
  gridboundaries: PropTypes.object.isRequired,
  category: PropTypes.string.isRequired,
  categories: PropTypes.array.isRequired,
  values: PropTypes.object.isRequired,
  editable: PropTypes.bool.isRequired,
  maptype: PropTypes.string.isRequired,
  onchange_category: PropTypes.func.isRequired,
  onchange_maptype: PropTypes.func.isRequired,
};

export default MapClassChange;
