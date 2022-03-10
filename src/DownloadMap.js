///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import React from 'react';
import PropTypes from 'prop-types';
//import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
//import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import Tooltip from '@mui/material/Tooltip';
import domtoimage from 'dom-to-image';
import { saveAs } from 'file-saver';

const DownloadMap = (props) => {

        let filenameToSave = props.fname

        // download charts selected
        let downloadMapImage = (node) => {
            domtoimage.toBlob(document.getElementById(node))
                .then(function (blob) {
                    saveAs(blob, filenameToSave);
                });
        }

        return (
          <Tooltip title="Download Map" placement="right">
              <Button
                style={{maxWidth: '28px', maxHeight: '28px', minWidth: '28px', minHeight: '28px'}}
                variant="outlined"
                color="primary"
                aria-label="Download Map"
                size="small"
                sx={{mx:0, px:0, background:"white"}}
                onClick={() => {
                  downloadMapImage('dm-maps')
                }}
              >
                <FileDownloadIcon />
              </Button>
          </Tooltip>
        );

}

DownloadMap.propTypes = {
  fname: PropTypes.string.isRequired,
};

export default DownloadMap;

