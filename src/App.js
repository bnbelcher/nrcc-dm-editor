///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import React, { Component } from 'react';
import Grid from '@mui/material/Grid';

import DMedit from './DMedit'

class App extends Component {

    render() {
        return (
          <Grid
            container
            spacing={0}
            direction="column"
            alignItems="center"
            justifyContent="center"
            style={{ minHeight: '100vh' }}
          >
            <DMedit />
          </Grid>
        );
    }
}

export default App;
