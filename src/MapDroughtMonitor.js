///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Button from '@mui/material/Button';
import HelpIcon from '@mui/icons-material/Help';
import EditIcon from '@mui/icons-material/Edit';
import UndoIcon from '@mui/icons-material/Undo';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import Tooltip from '@mui/material/Tooltip';
import CircularProgress from '@mui/material/CircularProgress';
import Backdrop from '@mui/material/Backdrop';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Typography from '@mui/material/Typography';

import MuiToggleButton from "@mui/material/ToggleButton";
import { styled } from "@mui/material/styles";

import 'leaflet/dist/leaflet.css';
import { MapContainer, GeoJSON, TileLayer, useMap } from 'react-leaflet';

import CategorySelect from './CategorySelect'
import DownloadMap from './DownloadMap'

class MapDroughtMonitor extends Component {

    constructor(props) {
        super(props);
        this.state = {
          width: window.innerWidth,
          height: window.innerHeight
        };
        this.mapContainer = 'map-container'
        this.mapRef = React.createRef();
        this.maxBounds = [ [40.0, -80.0], [48.0, -66.0] ];
        this.zoomLevel = 6;
        this.minZoomLevel = 6;
        this.maxZoomLevel = 9;
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    }

    componentDidMount() {
      this.updateWindowDimensions();
      window.addEventListener('resize', this.updateWindowDimensions);
      setTimeout(
        () => this.mapRef.current.leafletElement.invalidateSize(false),
        1000
      );
    }

    componentWillUnmount() {
      window.removeEventListener('resize', this.updateWindowDimensions);
    }

    updateWindowDimensions() {
      this.setState({ width: window.innerWidth, height: window.innerHeight });
    }

    render() {

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
              size={'small'}
              onClick={() => {this.props.maptype==='dmcat' ? this.props.onchange_maptype('changes') : this.props.onchange_maptype('dmcat')}}
            >
              {this.props.maptype==='dmcat' ? 'Drought Monitor Editor' : 'User Changes To DM'}<br/>
              {'(change view)'}
            </Button>
          </div>
        </div>
      )
    }

    const MapEditButton = () => {
      return (
          <div className="leaflet-control leaflet-bar">
            <Tooltip title={this.props.editable ? "Editing is ON" : "Editing is OFF"} placement="right">
              <ToggleButton
                style={{maxWidth: '28px', maxHeight: '28px', minWidth: '28px', minHeight: '28px'}}
                //disabled={this.props.maptype!=='dmcat'}
                value={this.props.editable}
                selected={this.props.editable}
                onChange={() => {
                  this.props.onchange_editable();
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
                //disabled={this.props.maptype!=='dmcat'}
                variant="outlined"
                color="primary"
                aria-label="Undo all changes"
                size="small"
                sx={{mx:0, px:0, background:"white"}}
                onClick={() => {
                  this.props.reset_map_values();
                }}
              >
                <UndoIcon />
              </Button>
            </Tooltip>
          </div>
      )
    }

    const DownloadMapButton = () => {
      let todayDate = new Date().toISOString().slice(0, 10);
      let fname = (this.props.maptype==='dmcat') ? 'dm-edit-map-'+todayDate+'.png' : 'class-change-edit-map-'+todayDate+'.png'
      return (
          <div className="leaflet-control leaflet-bar">
            <DownloadMap fname={fname} />
          </div>
      )
    }

    const HelpDialog = () => {
      return (
        <Dialog onClose={this.props.onchange_helpviewable} open={this.props.helpviewable}>
          <DialogTitle>
            INSTRUCTIONS
            <IconButton
              aria-label="close"
              onClick={this.props.onchange_helpviewable}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                color: (theme) => theme.palette.grey[500],
              }}
            >
                <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers>
            <Typography gutterBottom>
              <b>TO EDIT MAP</b><br/>
            </Typography>
            <List>
              <ListItem>
              1. Zoom/Pan to area of interest. Editing is easier when zoomed in.
              </ListItem>
              <ListItem>
              2. Enable editing <EditIcon/> . Zoom/Pan ability will be disabled while you edit.
              </ListItem>
              <ListItem>
              3. Select a drought intensity classification from the map legend.
              </ListItem>
              <ListItem>
              4. Click (or click-and-drag) on map to apply selected category to a location.
              </ListItem>
              <ListItem>
              5. Disable editing <EditIcon/> when you finish an area. Zoom/Pan ability is restored.
              </ListItem>
              <ListItem>
              6. Repeat steps 1-5 as needed until all changes are complete.
              </ListItem>
            </List>
            <br/>
            <Typography variant="caption" display="block" sx={{ lineHeight: 0 }}>
              NOTE: Anytime during the editing process, you can toggle the category/class change views (upper-right-hand corner), or undo changes <UndoIcon /> and start over.
            </Typography>
            <br/><br/>
            <Typography gutterBottom>
              <b>TO SAVE/SUBMIT YOUR EDITED MAP</b><br/>
            </Typography>
            <List>
              <ListItem>
                1. Download the edited map <FileDownloadIcon/>. The filename will include today's date.
              </ListItem>
              <ListItem>
                2. Change the map view to your class changes, and download this image also.
              </ListItem>
              <ListItem>
                3. Send the saved files to&nbsp;<a href="mailto:nrcc@cornell.edu?subject=NE DEWS DM edits">nrcc@cornell.edu</a> .
              </ListItem>
            </List>
          </DialogContent>
        </Dialog>
      )
    }

    const HelpButton = () => {
      return (
          <div className="leaflet-control leaflet-bar">
            <Tooltip title={"Help"} placement="right">
              <ToggleButton
                style={{maxWidth: '28px', maxHeight: '28px', minWidth: '28px', minHeight: '28px'}}
                value={this.props.helpviewable}
                selected={this.props.helpviewable}
                onChange={() => {
                  this.props.onchange_helpviewable();
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
            <Grid container justify="center" alignItems="center" direction="column" spacing={0}>
              <Grid item>
                <MapEditButton/>
              </Grid>
              <Grid item>
                <UndoButton />
              </Grid>
              <Grid item>
                <DownloadMapButton />
              </Grid>
              <Grid item>
                <HelpButton />
              </Grid>
            </Grid>
        </div>
      )
    }

    const MapButtonGroupClassChange = () => {
      return (
        <div className="leaflet-top leaflet-left" style={{"marginTop":80}}>
            <Grid container justify="center" alignItems="center" direction="column" spacing={0}>
              <Grid item>
                <DownloadMapButton />
              </Grid>
              <Grid item>
                <HelpButton />
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
                  selected={this.props.category}
                  categories={this.props.categories}
                  onchange={this.props.onchange_category}
                  editable={this.props.editable}
                  maptype={this.props.maptype}
                />
            </div>
          </div>
      )
    }

    const findValueForFips = (fips) => {
      return this.props.values['drought_cat'][fips];
    }

    const getFeatureColor = (v) => {
      let c
      for (c of this.props.categories) {
        if (this.props.maptype==='dmcat') {
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
      if (this.props.editable) { map.dragging.disable() }
      if (!this.props.editable) { map.dragging.enable() }
      return null;
    }

    const CalculateMapHeight = () => {
      if (this.state.height<650) {
        return 600
      } else if (this.state.height>=650 && this.state.height<940) {
        return this.state.height*0.90
      } else if (this.state.height>=940) {
        return 850
      } else {
        return 600
      }
    }

    const CalculateMapWidth = () => {
      if (this.state.height<650) {
        return 750
      } else if (this.state.height>=650 && this.state.height<940) {
        return this.state.height*1.25
      } else if (this.state.height>=940) {
        return 1175
      } else {
        return 750
      }
    }

    return (
      <div className="drought-map" id="drought-map">
        <MapContainer
            whenCreated={ mapInstance => { this.mapRef.current = mapInstance } }
            bounds={this.maxBounds}
            minZoom={this.minZoomLevel}
            maxZoom={this.maxZoomLevel}
            zoomControl={true}
            dragging={!this.props.editable}
            attributionControl={true}
            className={this.mapContainer}
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

            {this.props.values &&
            <GeoJSON
                data={this.props.gridboundaries}
                style={featureStyle_grid}
                onEachFeature={this.props.oneachfeature}
            />
            }

            {this.props.values &&
            <GeoJSON
                data={this.props.countyboundaries}
                style={featureStyle_county}
            />
            }

            {this.props.maptype==='dmcat' &&
            <MapButtonGroup />
            }

            {this.props.maptype==='changes' &&
            <MapButtonGroupClassChange />
            }

            <MapTypeButton />

            <CategoryLegend />

            <HelpDialog />

            {!this.props.values &&
              <Backdrop
                sx={{zIndex:1000}}
                invisible={true}
                open={!this.props.values}
              >
                <CircularProgress size={200} color="primary"/>
              </Backdrop>
            }
        </MapContainer>
      </div>
    );
    }
}

MapDroughtMonitor.propTypes = {
  countyboundaries: PropTypes.object.isRequired,
  gridboundaries: PropTypes.object.isRequired,
  category: PropTypes.string.isRequired,
  categories: PropTypes.array.isRequired,
  values: PropTypes.object,
  oneachfeature: PropTypes.func.isRequired,
  editable: PropTypes.bool.isRequired,
  helpviewable: PropTypes.bool.isRequired,
  maptype: PropTypes.string.isRequired,
  onchange_editable: PropTypes.func.isRequired,
  onchange_helpviewable: PropTypes.func.isRequired,
  onchange_category: PropTypes.func.isRequired,
  onchange_maptype: PropTypes.func.isRequired,
  reset_map_values: PropTypes.func.isRequired,
};

export default MapDroughtMonitor;
