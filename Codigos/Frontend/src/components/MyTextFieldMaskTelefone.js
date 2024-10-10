import React, { useState } from 'react';
import InputMask from 'react-input-mask';
import { InputAdornment, TextField } from '@material-ui/core';
import { Phone } from '@material-ui/icons';

export default function MyTextFieldMaskTelefone(props) {
  const [valor, setValor] = useState('');
  const [mascara, setMascara] = useState("(99)99999-9999");

  return (
    <div>
      <InputMask
        mask={mascara}
        maskChar=" "
        disabled={false}
        value={valor}
        onChange={(ev) => {
          setValor(ev.target.value);
          if (ev.target.value.replace(/([^\d])/g, "").length === 3) {
            const novoValor = ev.target.value.replace(/([^\d])/g, "").substring(3, 2);
            if (novoValor === '9') {
              setMascara("(99)99999-9999");
            } else {
              setMascara("(99)9999-9999");
            }
          }
        }}
      >
        {(inputProps) =>
          <TextField
            {...inputProps}
            fullWidth
            type="text"
            variant={props.variant}
            label={props.label}
            error={props.error}
            helperText={props.helperText}
            InputLabelProps={{ shrink: true }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Phone />
                </InputAdornment>
              ),
            }}
          />
        }
      </InputMask>
    </div>
  )
}
