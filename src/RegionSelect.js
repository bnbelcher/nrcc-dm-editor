///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import React from 'react';
import PropTypes from 'prop-types';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';

const RegionSelect = (props) => {

        //const { classes } = props;
        return (
          <form autoComplete="off">
            <FormControl>
              <Select
                sx={{
                  minWidth: 300,
                  bgcolor: '#FFFFFF',
                }}
                value={props.value}
                onChange={props.onchange}
                margin='dense'
                inputProps={{
                  name: 'region',
                  id: 'region',
                }}
              >
                {props.values &&
                  props.values.map((v,i) => (
                    <MenuItem key={i} value={v}>{props.valuelabels[v].label}</MenuItem>
                  ))
                }
              </Select>
            </FormControl>
          </form>
        );

}

RegionSelect.propTypes = {
  value: PropTypes.string.isRequired,
  values: PropTypes.array.isRequired,
  valuelabels: PropTypes.object.isRequired,
  onchange: PropTypes.func.isRequired,
};

export default RegionSelect;
