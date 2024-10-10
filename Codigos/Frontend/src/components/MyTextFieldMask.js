import React from 'react';
import InputMask from 'react-input-mask';
import { TextField } from '@material-ui/core';

export default function MyTextFieldMask(props) {

  return (
    <InputMask
      mask={props.mask}
      maskChar=" "
      disabled={false}
      value={props.value}
      onChange={props.onChange}
    >
      {(inputProps) =>
        <TextField
          {...inputProps}
          fullWidth
          type="text"
          label={props.label}
          variant={props.variant}
          placeholder={props.placeholder}
          InputLabelProps={props.InputLabelProps}
          error={props.error}
          helperText={props.helperText}
        />
      }
    </InputMask>
  )
}
