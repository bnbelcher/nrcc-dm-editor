///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import React from 'react';
//import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import EditIcon from '@mui/icons-material/Edit';
import UndoIcon from '@mui/icons-material/Undo';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import FileUploadIcon from '@mui/icons-material/FileUpload';

const HelpDialogContent = (props) => {

      return (
        <div>
            <Typography gutterBottom>
              <b>TO EDIT MAP</b><br/>
            </Typography>
            <List disablePadding dense={true}>
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
            <Typography variant="caption" display="block" sx={{ lineHeight: 0 }} gutterBottom>
              NOTE: Anytime during the editing process, you can toggle the category/class change views (upper-right-hand corner), or undo changes <UndoIcon /> and start over.
            </Typography>
            <br/>
            <Typography gutterBottom>
              <b>TO SAVE / RESTORE YOUR DATA</b><br/>
            </Typography>
            <List disablePadding dense={true}>
              <ListItem>
                1. "Download Data" from <FileDownloadIcon/>. The JSON filename will include today's date.
              </ListItem>
              <ListItem>
                2. To restore data from the saved file, select the file for upload <FileUploadIcon/>.
              </ListItem>
            </List>
            <br/>
            <Typography gutterBottom>
              <b>TO DOWNLOAD / SUBMIT YOUR EDITED MAP IMAGES</b><br/>
            </Typography>
            <List disablePadding dense={true}>
              <ListItem>
                1. "Download map images" from <FileDownloadIcon/>. The filenames will include today's date.
              </ListItem>
              <ListItem>
                2. Send both saved image files to&nbsp;<a href="mailto:nrcc@cornell.edu?subject=NE DEWS DM edits">nrcc@cornell.edu</a> .
              </ListItem>
            </List>
        </div>
      )

}

//HelpDialogContent.propTypes = {
//};

export default HelpDialogContent;
