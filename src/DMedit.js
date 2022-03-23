///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import React, { Component } from 'react';
import axios from 'axios';
import inside from 'point-in-polygon';

import MapDroughtMonitor from './MapDroughtMonitor'
import HelpDialogContent from './HelpDialogContent'
import DownloadFileForm from './DownloadFileForm'
import UploadFileDialogContent from './UploadFileDialogContent'
import {MyDialog, MyDialogTitle} from './CustomDialog'

import county_geojson from './assets/newengland_county_with_fips.json';
import grid_geojson from './assets/newengland_grid_0.1deg.json';

class DMedit extends Component {

    constructor(props) {
        super(props);
        this.categories = [
          {'number':-1, 'value':'ND','color':'#FFFFFF'},
          {'number':0, 'value':'D0','color':'#FFFB5B'},
          {'number':1, 'value':'D1','color':'#F4D589'},
          {'number':2, 'value':'D2','color':'#ECB236'},
          {'number':3, 'value':'D3','color':'#D82D1B'},
          {'number':4, 'value':'D4','color':'#661305'},
        ];
        this.categories_class_change = [
          {'number':5, 'value':'+5','color':'#661305'},
          {'number':4, 'value':'+4','color':'#D82D1B'},
          {'number':3, 'value':'+3','color':'#ECB236'},
          {'number':2, 'value':'+2','color':'#F4D589'},
          {'number':1, 'value':'+1','color':'#FFFB5B'},
          {'number':0, 'value':'NC','color':'#CCCCCC'},
          {'number':-1,'value':'-1','color':'#ceffd5'},
          {'number':-2, 'value':'-2','color':'#8bd48c'},
          {'number':-3, 'value':'-3','color':'#359767'},
          {'number':-4, 'value':'-4','color':'#006678'},
          {'number':-5, 'value':'-5','color':'#003e76'},
        ];
        this.mapValues_unchanged = null;
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
        this.state = {
            width: window.innerWidth,
            height: window.innerHeight,
            mapValues: null,
            category: 'D0',
            mouseIsDown: false,
            mouseIsUp: true,
            mapIsEditable: false,
            helpIsViewable: false,
            uploadFormIsViewable: false,
            downloadFormIsViewable: false,
            mapType: 'dmcat', //'dmcat' or 'changes'
        };
    }

    componentDidMount() {
      this.updateWindowDimensions();
      window.addEventListener('resize', this.updateWindowDimensions);
      this.initializeMapValues()
    }

    componentWillUnmount() {
      window.removeEventListener('resize', this.updateWindowDimensions);
    }

    updateWindowDimensions() {
      this.setState({ width: window.innerWidth, height: window.innerHeight });
    }

    initializeMapValues = () => {
      this.handleChange_mapValues(null)
      this.create_dmCurrent()
    }

    handleChange_category = (e) => {
      this.setState({
        category: e.target.value,
      })
    }

    getDataFromURL = (url) => {
      return axios(url).then(response => {
        return response.data
      });
    }

    create_dmCurrent = () => {
      // downloading current USDM polygons directly from https://nedews.nrcc.cornell.edu/data/usdm.json
      // produces 'blocked by CORS policy' error (No 'ACCESS-CONTROL-ALLOW-ORIGIN' header).
      // Instead, saving to publid/data and loading from there.
      let url = process.env.PUBLIC_URL + '/data/usdm.json'
      this.getDataFromURL(url)
        .then(data => {
          let gridValues = {}
          gridValues['drought_cat'] = {}
          // loop through each pixel of the grid, finding if pixel is within a USDM polygon.
          // If so, categorize that pixel appropriately by assigning category.
          //let pixel_id, pixel_coords, pixel_center, usdmcat, inPolygon
          let pixel_id, pixel_coords, usdmcat, inPolygon
          for (var feature of grid_geojson['features']) {
            pixel_id = feature['properties']['id']
            pixel_coords = feature['geometry']['coordinates'][0][0]
            //pixel_center = [(pixel_coords[0][0]+pixel_coords[2][0])/2.,(pixel_coords[0][1]+pixel_coords[1][1])/2.]
            // loop through all corners of pixel - if any corners are in polygon, then include in classification
            for (var point of pixel_coords) {
              for (var dmcat of data) {
                usdmcat = "D"+dmcat['properties']['DM'].toString()
                for (var catpoly of dmcat['geometry']['coordinates']) {
                  for (var usdmpolygon of catpoly) {
                    inPolygon = inside(point, usdmpolygon)
                    if (inPolygon === true) { gridValues['drought_cat'][pixel_id] = usdmcat }
                  }
                }
              }
            }
          }
          // make independent copy that will remain intact for comparison
          this.mapValues_unchanged = JSON.parse(JSON.stringify(gridValues));
          // update values that users can edit
          this.handleChange_mapValues(gridValues);
        })
        .catch(err => console.log(err))
    }

    handleChange_mapType = (v) => {
      this.setState({
        mapType: v
      })
    }

    handleChange_mapValues = (v) => {
      // v = object containing key:value pairs of pixel:drought category
      this.setState({
        mapValues: v
      })
    }

    handleChange_mouseIsDown = (b) => {
      // b = boolean
      this.setState({
        mouseIsDown: b,
        mouseIsUp: !b,
      })
    }

    handleChange_mouseIsUp = (b) => {
      // b = boolean
      this.setState({
        mouseIsUp: b,
        mouseIsDown: !b,
      })
    }

    handleChange_mapIsEditable = () => {
      let b = this.state.mapIsEditable
      this.setState({
        mapIsEditable: !b
      })
    }

    handleChange_helpIsViewable = () => {
      let b = this.state.helpIsViewable
      this.setState({
        helpIsViewable: !b
      })
    }

    handleChange_uploadFormIsViewable = () => {
      let b = this.state.uploadFormIsViewable
      this.setState({
        uploadFormIsViewable: !b
      })
    }

    handleChange_downloadFormIsViewable = () => {
      let b = this.state.downloadFormIsViewable
      this.setState({
        downloadFormIsViewable: !b
      })
    }

    // action when features on a map are clicked.
    // in this case, update the drought category for pixel
    onEachFeature = (feature,layer) => {
      let valuesToEdit = this.state.mapValues
      layer.on({
        mouseover: () => {
          if (this.state.mouseIsDown && this.state.mapIsEditable && this.state.mapType==='dmcat') {
            valuesToEdit['drought_cat'][feature.properties.id] = this.state.category;
            this.handleChange_mapValues(valuesToEdit);
          }
        },
        mousedown: () => {
          this.handleChange_mouseIsDown(true);
          // the following conditional handles the feature already moused over
          if (this.state.mapIsEditable && this.state.mapType==='dmcat') {
            valuesToEdit['drought_cat'][feature.properties.id] = this.state.category;
            this.handleChange_mapValues(valuesToEdit);
          }
        },
        mouseup: () => {
          this.handleChange_mouseIsUp(true);
        },
      });
    }

    updateClassChanges = () => {
      // loop through all values in mapValues, these will include all changed and unchanged pixels.
      // During this loop, we compare to values for the pixel from the unchanged DM categories.
      // Class change magnitude is returned as object in same format as mapValues.
      let cat
      let cat_unchanged
      let idsFromUser
      let idsFromDM
      let idsUnion
      let catDiff = null
      let classChanges = {}
      classChanges['drought_cat'] = {}
      idsFromUser = this.state.mapValues ? Object.keys(this.state.mapValues['drought_cat']) : []
      idsFromDM = this.mapValues_unchanged ? Object.keys(this.mapValues_unchanged['drought_cat']) : []
      idsUnion = [...new Set([...idsFromUser, ...idsFromDM])];
      if (idsFromDM===[]) {
        // not loaded yet
        return classChanges
      }
      if (idsFromUser===[]) {
        // no changes from user, all changes are zero
        catDiff = 0
        for (const id of idsUnion) {
          classChanges['drought_cat'][id] = catDiff
        }
        return classChanges
      }
      for (const id of idsUnion) {
        cat = this.state.mapValues['drought_cat'][id]
        cat_unchanged = this.mapValues_unchanged['drought_cat'][id]
        if (!(id in this.state.mapValues['drought_cat']) && id in this.mapValues_unchanged['drought_cat']) {
          catDiff = 0
        } else if (id in this.state.mapValues['drought_cat'] && id in this.mapValues_unchanged['drought_cat']) {
          // change cat to numbers so that differencing can occur
          cat = (cat!=='ND') ? parseInt(cat.slice(-1),10) : -1
          cat_unchanged = (cat_unchanged!=='ND') ? parseInt(cat_unchanged.slice(-1),10) : -1
          catDiff = cat - cat_unchanged
        } else if (id in this.state.mapValues['drought_cat'] && !(id in this.mapValues_unchanged['drought_cat'])) {
          // change cat to numbers so that differencing can occur
          cat = (cat!=='ND') ? parseInt(cat.slice(-1),10) : -1
          if (cat!==-1) {
            catDiff = cat + 1
          } else {
            catDiff = null
          }
        } else {
        }
        if (catDiff!=null) { classChanges['drought_cat'][id] = catDiff }
      }
      return classChanges
    }

    render() {

        return (
          <div id="dm-maps">
                <MapDroughtMonitor
                  width={this.state.width}
                  height={this.state.height}
                  countyboundaries={county_geojson}
                  gridboundaries={grid_geojson}
                  category={this.state.category}
                  categories={(this.state.mapType==='dmcat') ? this.categories : this.categories_class_change}
                  values={(this.state.mapType==='dmcat') ? this.state.mapValues : this.updateClassChanges()}
                  oneachfeature={this.onEachFeature}
                  editable={this.state.mapIsEditable}
                  helpviewable={this.state.helpIsViewable}
                  uploadformviewable={this.state.uploadFormIsViewable}
                  downloadformviewable={this.state.downloadFormIsViewable}
                  maptype={this.state.mapType}
                  onchange_editable={this.handleChange_mapIsEditable}
                  onchange_helpviewable={this.handleChange_helpIsViewable}
                  onchange_uploadformviewable={this.handleChange_uploadFormIsViewable}
                  onchange_downloadformviewable={this.handleChange_downloadFormIsViewable}
                  onchange_category={this.handleChange_category}
                  onchange_maptype={this.handleChange_mapType}
                  onchange_mapvalues={this.handleChange_mapValues}
                  reset_map_values={this.initializeMapValues}
                />

                <MyDialog
                  open={this.state.helpIsViewable}
                  handleClose={this.handleChange_helpIsViewable}
                  title={<MyDialogTitle title={'INSTRUCTIONS'} onClick={this.handleChange_helpIsViewable} />}
                   children={<HelpDialogContent />}
                />

                <MyDialog
                  open={this.state.downloadFormIsViewable}
                  handleClose={this.handleChange_downloadFormIsViewable}
                  title={<MyDialogTitle title={'DOWNLOAD OPTIONS'} onClick={this.handleChange_downloadFormIsViewable} />}
                  children={
                    <DownloadFileForm
                      values={this.state.mapValues}
                      maptype={this.state.mapType}
                      onchange_downloadformviewable={this.handleChange_downloadFormIsViewable}
                      onchange_maptype={this.handleChange_mapType}
                    />
                  }
                />

                <MyDialog
                  open={this.state.uploadFormIsViewable}
                  handleClose={this.handleChange_uploadFormIsViewable}
                  title={<MyDialogTitle title={'UPLOAD SAVED DATA'} onClick={this.handleChange_uploadFormIsViewable} />}
                  children={
                    <UploadFileDialogContent
                      onchange_mapvalues={this.handleChange_mapValues}
                      onchange_uploadformviewable={this.handleChange_uploadFormIsViewable}
                    />
                  }
                />

          </div>
        );
    }
}

export default DMedit;
