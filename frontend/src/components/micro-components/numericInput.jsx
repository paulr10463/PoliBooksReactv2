import React, { Component } from 'react';

class NumericInput extends Component {
  handleKeyPress = (event) => {
    const charCode = event.which || event.keyCode;
    // Permitir solo caracteres numéricos (0-9) y teclas de control
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  };

  render() {
    return (
      <input
        type="text"
        onKeyDown={this.handleKeyPress}
        placeholder="Ingrese solo números"
      />
    );
  }
}

export default NumericInput;