///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';

const UploadFileDialogContent = (props) => {

    const ImportFromFileBodyComponent = () => {
      let fileReader;
  
      const handleFileRead = (e) => {
        const content = fileReader.result;
        const content_json = JSON.parse(content);
        props.onchange_mapvalues(content_json);
        props.onchange_uploadformviewable();
      };
  
      const handleFileChosen = (file) => {
        fileReader = new FileReader();
        fileReader.onloadend = handleFileRead;
        fileReader.readAsText(file);
      };
  
      return <div>
        <input
          type='file'
          id='file'
          className='input-file'
          accept='.json'
          onChange={e => {
            handleFileChosen(e.target.files[0])
          }}
        />
      </div>;
    };

    return (
        <div>
            <Typography gutterBottom>
              Previously saved data files will have filenames similar to:<br/><br/>
              <b>dm-editor-save-</b><i>region-YYYY-MM-DD</i><b>.json</b><br/>(file saved on date <i>YYYY-MM-DD</i> for <i>region</i>)<br/><br/>
              NOTE: Class changes will reflect differences between this restored data and the <i>currently issued</i> drought monitor.<br/><br/>
            </Typography>
            <ImportFromFileBodyComponent/>
        </div>
    )

}

UploadFileDialogContent.propTypes = {
  onchange_mapvalues: PropTypes.func.isRequired,
  onchange_uploadformviewable: PropTypes.func.isRequired,
};

export default UploadFileDialogContent;
