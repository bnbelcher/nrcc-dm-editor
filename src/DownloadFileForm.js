///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import domtoimage from 'dom-to-image';
import { saveAs } from 'file-saver';
import CircularProgress from '@mui/material/CircularProgress';
import { orange } from '@mui/material/colors';

class DownloadFileForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            mapMainChecked: true,
            mapChangeChecked: true,
            dataChecked: false,
            downloadActive: false,
        }
        this.todayDate = new Date().toISOString().slice(0, 10);
        this.filenameMapMain = 'dm-editor-main-'+this.todayDate+'.png'
        this.filenameMapChange = 'dm-editor-changes-'+this.todayDate+'.png'
        this.filenameSave = 'dm-editor-save-'+this.todayDate+'.json'
    }

    componentDidUpdate(prevProps,prevState){
      if (this.state.downloadActive && this.state.downloadActive!==prevState.downloadActive) {
        setTimeout(() => {
          this.downloadSelectedFiles()
        }, 2000);
      }
    }

    handleChange_downloadActive = (e) => {
      let b = this.state.downloadActive
      this.setState({
        downloadActive: !b
      })
    }

    handleChange_mapMainChecked = (e) => {
      this.setState({
        mapMainChecked: e.target.checked
      })
    }

    handleChange_mapChangeChecked = (e) => {
      this.setState({
        mapChangeChecked: e.target.checked
      })
    }

    handleChange_dataChecked = (e) => {
      this.setState({
        dataChecked: e.target.checked
      })
    }

    // download charts selected
    downloadMapImage = (fnameMain,fnameChange,node) => {
        let scale = 2
        let domNode = document.getElementById(node)

        // both views are saved
        if (this.state.mapMainChecked && this.state.mapChangeChecked) {
          this.props.onchange_maptype('dmcat');
          domtoimage.toBlob(domNode, {
              width: domNode.clientWidth * scale,
              height: domNode.clientHeight * scale,
              style: {
                transform: 'scale('+scale+')',
                transformOrigin: 'top left'
              }
            })
            .then(blob => {
                saveAs(blob, fnameMain);

                // second map, created after first is done saving
                this.props.onchange_maptype('changes');
                domtoimage.toBlob(domNode, {
                      width: domNode.clientWidth * scale,
                      height: domNode.clientHeight * scale,
                      style: {
                        transform: 'scale('+scale+')',
                        transformOrigin: 'top left'
                      }
                    })
                    .then(blob => {
                        saveAs(blob, fnameChange);
                        this.props.onchange_maptype('dmcat');
                        this.props.onchange_downloadformviewable();
                    });
            });
        }

        // only drought intensity classifications are saved
        if (this.state.mapMainChecked && !this.state.mapChangeChecked) {
          this.props.onchange_maptype('dmcat');
          domtoimage.toBlob(domNode, {
              width: domNode.clientWidth * scale,
              height: domNode.clientHeight * scale,
              style: {
                transform: 'scale('+scale+')',
                transformOrigin: 'top left'
              }
            })
            .then(blob => {
                saveAs(blob, fnameMain);
                this.props.onchange_downloadformviewable();
            });
        }

        // only class changes are saved
        if (!this.state.mapMainChecked && this.state.mapChangeChecked) {
          this.props.onchange_maptype('changes');
          domtoimage.toBlob(domNode, {
              width: domNode.clientWidth * scale,
              height: domNode.clientHeight * scale,
              style: {
                transform: 'scale('+scale+')',
                transformOrigin: 'top left'
              }
            })
            .then(blob => {
                saveAs(blob, fnameChange);
                this.props.onchange_maptype('dmcat');
                this.props.onchange_downloadformviewable();
            });
        }

    }

    // Save data as json
    saveCatsFile = (fname,data) => {
        let fileToSave = new Blob([JSON.stringify(data, null, 4)], {
            type: 'application/json',
            name: fname
        });
        saveAs(fileToSave, fname);
        if (!this.state.mapMainChecked && !this.state.mapChangeChecked) { this.props.onchange_downloadformviewable(); }
    }

    // download files
    downloadSelectedFiles = () => {
      if (this.state.dataChecked) { this.saveCatsFile(this.filenameSave,this.props.values) };
      if (this.state.mapMainChecked || this.state.mapChangeChecked) { this.downloadMapImage(this.filenameMapMain,this.filenameMapChange,'dm-maps') };
    }

    render() {

      return (
        <div>
        <FormGroup>
          <FormControlLabel control={<Checkbox disabled={this.state.downloadActive} checked={this.state.mapMainChecked} onChange={this.handleChange_mapMainChecked} />} label="Download map image of edited drought classifications" />
            <Typography variant="caption" gutterBottom>
              This file will be saved as : <b>{this.filenameMapMain}</b>
            </Typography>
          <br/>
          <FormControlLabel control={<Checkbox disabled={this.state.downloadActive} checked={this.state.mapChangeChecked} onChange={this.handleChange_mapChangeChecked} />} label="Download map image of your class changes" />
            <Typography variant="caption" gutterBottom>
              This file will be saved as : <b>{this.filenameMapChange}</b>
            </Typography>
          <br/>
          <FormControlLabel control={<Checkbox disabled={this.state.downloadActive} checked={this.state.dataChecked} onChange={this.handleChange_dataChecked} />} label="Download JSON data to restore edits later" />
            <Typography variant="caption" gutterBottom>
              This file will be saved as : <b>{this.filenameSave}</b>
            </Typography>
        </FormGroup>
        <br/>
        {!this.state.downloadActive &&
        <Button
          variant='contained'
          color='primary'
          size={'medium'}
          disabled={!this.state.mapMainChecked && !this.state.mapChangeChecked && !this.state.dataChecked}
          onClick={() => {
            this.handleChange_downloadActive();
          }}
        >
          Download
        </Button>
        }
        {this.state.downloadActive &&
        <div>
          <CircularProgress color="primary"/>
          <Typography sx={{color:orange[800]}}>Creating and downloading files ... please wait.</Typography>
        </div>
        }
        </div>
      )
    }

}

DownloadFileForm.propTypes = {
  values: PropTypes.object,
  maptype: PropTypes.string.isRequired,
  onchange_downloadformviewable: PropTypes.func.isRequired,
  onchange_maptype: PropTypes.func.isRequired,
};

export default DownloadFileForm;

