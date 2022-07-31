///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import React, { Component } from 'react';
import Grid from '@mui/material/Grid';

import Banner from './Banner'
import DMedit from './DMedit'

class App extends Component {

    render() {
        return (
          <Grid
            container
            spacing={2}
            direction="column"
            alignItems="center"
            justifyContent="flex-start"
            style={{ minHeight: '100vh' }}
          >
            <Grid item>
              <Banner/>
              <br/>
              <DMedit/>
            </Grid>
          </Grid>
        );
    }
}

export default App;
