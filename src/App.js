///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import React, { Component } from 'react';
//import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';

import DMedit from './DMedit'

class App extends Component {

    render() {
        return (
          <Container fixed>
            <DMedit />
          </Container>
        );
    }
}

export default App;
