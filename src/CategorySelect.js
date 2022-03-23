///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import React from 'react';
import PropTypes from 'prop-types';
import {Radio,RadioGroup,FormControl,FormControlLabel} from '@mui/material';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

const CategorySelect = (props) => {

    if (props.editable && props.maptype==='dmcat') {
        return (
              <FormControl component="fieldset">
                <RadioGroup
                  aria-label="select drought category"
                  name="category"
                  value={props.selected}
                  onChange={props.onchange}
                >
                  {props.categories &&
                    props.categories.map((v,i) => (
                      <FormControlLabel
                        key={i}
                        value={v.value}
                        control={<Radio color="primary" size="small"/>}
                        label={<Typography variant="body2" color="#999999" style={{margin: 5}}>{v.value}</Typography>}
                        labelPlacement="start"
                        style={{backgroundColor: v.color, margin: 0}}
                      />
                    ))
                  }
                </RadioGroup>
              </FormControl>
        );
    } else {
        return (
            <div style={{ width: '100%' }}>
                <Box display="flex" flexDirection="column" p={0} m={0} bgcolor="background.paper">
                  {props.categories &&
                    props.categories.map((v,i) => (
                        <Box
                          key={i}
                          component="div"
                          display="inline"
                          bgcolor={v.color}
                        >
                          <Typography
                            variant="body2"
                            color="#999999"
                            style={{marginTop:9, marginBottom:9, marginLeft:5, marginRight:5}}
                          >
                            {v.value}
                          </Typography>
                        </Box>
                    ))
                  }
                </Box>
            </div>
        );
    }

}

CategorySelect.propTypes = {
  selected: PropTypes.string.isRequired,
  categories: PropTypes.array.isRequired,
  onchange: PropTypes.func,
  editable: PropTypes.bool.isRequired,
  maptype: PropTypes.string.isRequired,
};

export default CategorySelect;
