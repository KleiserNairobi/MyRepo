import React from 'react';
import NumberFormat from 'react-number-format';
import PropTypes from 'prop-types';

export default function MyTFMoneyNumberFormat(props) {
  
  const { inputRef, onChange, ...other } = props;
  
  function currencyFormatter(value) {
    if (!Number(value)) return "";  
    const amount = new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL"
    }).format(value / 100);  
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

MyTFMoneyNumberFormat.propTypes = {
  inputRef: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
};