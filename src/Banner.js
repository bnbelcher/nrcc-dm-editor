import React, { Component } from 'react'
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { Box } from '@mui/system';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import nidisLogo from './assets/nidisLogoT.png';
import nrccLogo from './assets/nrccLogoStackedT.png';

const theme = createTheme();

theme.typography.h2 = {
  fontFamily: 'sans-serif',
  fontSize: '2.0rem',
  color: '#6c5626',
};

export default class Banner extends Component {

  render() {
    return (
      <Box sx={{ bgcolor:'#f7f4eb', border:1, borderColor: '#6c5626' }}>
      <Grid
        container
        direction="row"
        spacing={0}
        justifyContent="space-between"
        alignItems="center"
      >
        <Grid item xs={2}>
          <a href="https://drought.gov" target="_blank" rel="noreferrer"><img width="100%" src={nidisLogo} alt="NIDIS" /></a>
        </Grid>
        <Grid item>
          <ThemeProvider theme={theme}>
            <Typography variant='h2'>
              Drought Monitor Editor
            </Typography>
          </ThemeProvider>
        </Grid>
        <Grid item xs={2}>
         <a href="http://www.nrcc.cornell.edu" target="_blank" rel="noreferrer"><img width="90%" src={nrccLogo} alt="NRCC" /></a>
        </Grid>
      </Grid>
      </Box>
    )
  }
}
