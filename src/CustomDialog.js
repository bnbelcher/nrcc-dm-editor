import React from 'react';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Grid from '@mui/material/Grid';

const MyDialog = ({ open, handleClose, title, children }) => {
      return (
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>{title}</DialogTitle>
          <DialogContent>{children}</DialogContent>
        </Dialog>
      );
    };
export {MyDialog};

const MyDialogTitle = ({title, onClick}) => {
      return (
            <Grid container>
            <Grid>
              {title}
            </Grid>
            <Grid>
            <IconButton
              aria-label="close"
              onClick={onClick}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                color: (theme) => theme.palette.grey[500],
              }}
            >
                <CloseIcon />
            </IconButton>
            </Grid>
            </Grid>
      )
    }
export {MyDialogTitle};

