///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

//import React, { Component } from 'react';
import React from 'react';
import PropTypes from 'prop-types';

import Grid from '@mui/material/Grid';
//import List from '@mui/material/List';
//import ListItem from '@mui/material/ListItem';
import Button from '@mui/material/Button';
import HelpIcon from '@mui/icons-material/Help';
import EditIcon from '@mui/icons-material/Edit';
import UndoIcon from '@mui/icons-material/Undo';
//import IconButton from '@mui/material/IconButton';
//import CloseIcon from '@mui/icons-material/Close';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import Tooltip from '@mui/material/Tooltip';
import CircularProgress from '@mui/material/CircularProgress';
import Backdrop from '@mui/material/Backdrop';
//import Dialog from '@mui/material/Dialog';
//import DialogTitle from '@mui/material/DialogTitle';
//import DialogContent from '@mui/material/DialogContent';
//import Typography from '@mui/material/Typography';

import MuiToggleButton from "@mui/material/ToggleButton";
import { styled } from "@mui/material/styles";

import 'leaflet/dist/leaflet.css';
import { MapContainer, GeoJSON, TileLayer, useMap } from 'react-leaflet';

import CategorySelect from './CategorySelect'
//import DownloadFileForm from './DownloadFileForm'

import nrcclogo from './assets/nrccLogoStackedT.png'

const mapContainer = 'map-container';
const mapRef = React.createRef();
const maxBounds = [ [40.0, -80.0], [48.0, -66.0] ];
//const zoomLevel = 6;
const minZoomLevel = 5;
const maxZoomLevel = 9;

const MapDroughtMonitor = (props) => {

    const ToggleButton = styled(MuiToggleButton)({
      "&.MuiToggleButton-root": {
        color: "#1976d2",
        backgroundColor: "white"
      },
      "&.MuiToggleButton-root:hover": {
        color: "#1976d2",
        backgroundColor: "transparent"
      },
      "&.Mui-selected": {
        color: "white",
        //backgroundColor: "#4caf50"
        backgroundColor: "#1976d2"
      },
      "&.Mui-selected:hover": {
        color: "#1976d2",
        backgroundColor: "transparent"
      },
    });

    const MapTypeButton = () => {
      return (
        <div className="leaflet-top leaflet-right">
          <div className="leaflet-control">
            <Button
              variant='contained'
              color='primary'
              size={'medium'}
              onClick={() => {props.maptype==='dmcat' ? props.onchange_maptype('changes') : props.onchange_maptype('dmcat')}}
            >
              {props.maptype==='dmcat' ? 'Drought Monitor Editor' : 'User Changes To Drought Monitor'}<br/>
              {props.maptype==='dmcat' ? '(click to view your class changes)' : '(click to return to DM Editor)'}
            </Button>
          </div>
        </div>
      )
    }

    const MapEditButton = () => {
      return (
          <div className="leaflet-control leaflet-bar">
            <Tooltip title={props.editable ? "Editing is ON" : "Editing is OFF"} placement="right">
              <ToggleButton
                style={{maxWidth: '28px', maxHeight: '28px', minWidth: '28px', minHeight: '28px'}}
                value={props.editable}
                selected={props.editable}
                onChange={() => {
                  props.onchange_editable();
                }}
              >
                <EditIcon />
              </ToggleButton>
            </Tooltip>
          </div>
      )
    }

    const UndoButton = () => {
      return (
          <div className="leaflet-control leaflet-bar">
            <Tooltip title="Undo all changes" placement="right">
              <Button
                style={{maxWidth: '28px', maxHeight: '28px', minWidth: '28px', minHeight: '28px'}}
                variant="outlined"
                color="primary"
                aria-label="Undo all changes"
                size="small"
                sx={{mx:0, px:0, background:"white"}}
                onClick={() => {
                  props.reset_map_values();
                }}
              >
                <UndoIcon />
              </Button>
            </Tooltip>
          </div>
      )
    }

    const UploadFileButton = () => {
      return (
          <div className="leaflet-control leaflet-bar">
            <Tooltip title="Upload saved data" placement="right">
              <ToggleButton
                style={{maxWidth: '28px', maxHeight: '28px', minWidth: '28px', minHeight: '28px'}}
                value={props.uploadformviewable}
                selected={props.uploadformviewable}
                onChange={() => {
                  props.onchange_uploadformviewable();
                }}
              >
                <FileUploadIcon />
              </ToggleButton>
            </Tooltip>
          </div>
      )
    }

    const DownloadFileButton = () => {
      return (
          <div className="leaflet-control leaflet-bar">
            <Tooltip title="Download data / maps" placement="right">
              <ToggleButton
                style={{maxWidth: '28px', maxHeight: '28px', minWidth: '28px', minHeight: '28px'}}
                value={props.downloadformviewable}
                selected={props.downloadformviewable}
                onChange={() => {
                  props.onchange_downloadformviewable();
                }}
              >
                <FileDownloadIcon />
              </ToggleButton>
            </Tooltip>
          </div>
      )
    }

    const HelpButton = () => {
      return (
          <div className="leaflet-control leaflet-bar">
            <Tooltip title={"Help"} placement="right">
              <ToggleButton
                style={{maxWidth: '28px', maxHeight: '28px', minWidth: '28px', minHeight: '28px'}}
                value={props.helpviewable}
                selected={props.helpviewable}
                onChange={() => {
                  props.onchange_helpviewable();
                }}
              >
                <HelpIcon />
              </ToggleButton>
            </Tooltip>
          </div>
      )
    }

    const MapButtonGroup = () => {
      return (
        <div className="leaflet-top leaflet-left" style={{"marginTop":80}}>
            {props.maptype==='dmcat' &&
              <Grid container justify="center" alignItems="center" direction="column" spacing={0}>
              <Grid item>
                <MapEditButton/>
              </Grid>
              <Grid item>
                <UndoButton />
              </Grid>
              <Grid item>
                <DownloadFileButton />
              </Grid>
              <Grid item>
                <UploadFileButton />
              </Grid>
              <Grid item>
                <HelpButton />
              </Grid>
              </Grid>
            }
            {props.maptype==='changes' &&
              <Grid container justify="center" alignItems="center" direction="column" spacing={0}>
              <Grid item>
                <HelpButton />
              </Grid>
              </Grid>
            }
        </div>
      )
    }

    const LogoImage = () => {
      return (
        <div className="leaflet-bottom leaflet-right" style={{"marginBottom":20, "marginRight":-160}}>
          <div className="leaflet-control">
            <img width="40%" src={nrcclogo} alt="Logo for the Northeast Regional Climate Center (NRCC)" />
          </div>
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
        if (props.maptype==='dmcat') {
          if (v===c.value) {return c.color}
        } else {
          if (v===c.number) {return c.color}
        }
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

    const ChangeDragging = () => {
      const map = useMap();
      if (props.editable) { map.dragging.disable() }
      if (!props.editable) { map.dragging.enable() }
      return null;
    }

    const CalculateMapHeight = () => {
      if (props.height<650) {
        return 600
      } else if (props.height>=650 && props.height<940) {
        return props.height*0.90
      } else if (props.height>=940) {
        return 850
      } else {
        return 600
      }
    }

    const CalculateMapWidth = () => {
      if (props.height<650) {
        return 750
      } else if (props.height>=650 && props.height<940) {
        return props.height*1.25
      } else if (props.height>=940) {
        return 1175
      } else {
        return 750
      }
    }

    return (
      <div className="drought-map" id="drought-map">
        <MapContainer
            whenCreated={ mapInstance => { mapRef.current = mapInstance } }
            bounds={maxBounds}
            minZoom={minZoomLevel}
            maxZoom={maxZoomLevel}
            zoomControl={true}
            dragging={!props.editable}
            attributionControl={true}
            className={mapContainer}
            style={{
              height:CalculateMapHeight(),
              width:CalculateMapWidth(),
            }}
        >
            <ChangeDragging />
            <TileLayer
                attribution="&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {props.values &&
            <GeoJSON
                data={props.gridboundaries}
                style={featureStyle_grid}
                onEachFeature={props.oneachfeature}
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

            <LogoImage />

        </MapContainer>

        {!props.values &&
          <Backdrop
            sx={{zIndex:1000}}
            invisible={true}
            open={!props.values}
          >
            <CircularProgress size={200} color="primary"/>
          </Backdrop>
        }

      </div>
    );
}

MapDroughtMonitor.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  countyboundaries: PropTypes.object.isRequired,
  gridboundaries: PropTypes.object.isRequired,
  category: PropTypes.string.isRequired,
  categories: PropTypes.array.isRequired,
  values: PropTypes.object,
  oneachfeature: PropTypes.func.isRequired,
  editable: PropTypes.bool.isRequired,
  helpviewable: PropTypes.bool.isRequired,
  uploadformviewable: PropTypes.bool.isRequired,
  downloadformviewable: PropTypes.bool.isRequired,
  maptype: PropTypes.string.isRequired,
  onchange_editable: PropTypes.func,
  onchange_helpviewable: PropTypes.func,
  onchange_uploadformviewable: PropTypes.func,
  onchange_downloadformviewable: PropTypes.func,
  onchange_category: PropTypes.func,
  onchange_maptype: PropTypes.func,
  onchange_mapvalues: PropTypes.func,
  reset_map_values: PropTypes.func,
};

export default MapDroughtMonitor;
