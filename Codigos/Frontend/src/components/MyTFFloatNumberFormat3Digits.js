import React from 'react';
import NumberFormat from 'react-number-format';
import PropTypes from 'prop-types';

export default function MyTFFloatNumberFormat3Digits(props) {
  
  const { inputRef, onChange, ...other } = props;
  
  function currencyFormatter(value) {
    if (!Number(value)) return "";  
    const amount = new Intl.NumberFormat("pt-BR", {
      style: "decimal",
      minimumFractionDigits: 3,
      maximumFractionDigits: 3,
    }).format(value/1000);  
    return `${amount}`;
  }

  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      format={currencyFormatter}
      onValueChange={values => {
        onChange({
          target: {
            value: values.value,
          },
        });
      }}
    />
  )
}

MyTFFloatNumberFormat3Digits.propTypes = {
  inputRef: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
};