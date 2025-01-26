const sanitizeInput = (data) => {
    if (typeof data === 'string') {
      return data.trim().replace(/[<>$]/g, ''); // Remueve caracteres peligrosos
    }
    if (typeof data === 'object' && data !== null) {
      for (const key in data) {
        if (data.hasOwnProperty(key)) {
          data[key] = sanitizeInput(data[key]);
        }
      }
    }
    return data;
  };
  
  const validateUID = (uid) => {
    if (!uid || typeof uid !== 'string') {
      throw new Error('UID inválido');
    }
    if (!/^[a-zA-Z0-9-_]{5,50}$/.test(uid)) {
      throw new Error('UID no cumple con el formato esperado');
    }
    return uid.trim();
  };

  module.exports = { sanitizeInput, validateUID };