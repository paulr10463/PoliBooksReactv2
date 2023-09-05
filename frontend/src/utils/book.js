async function saveBook(userID, tokenId, title, description, brand, level, availability, image, institution, unitCost, contact) {
    // Crear un objeto con la información del libro
    const bookData = {
      title: title,
      description: description,
      brand: brand,
      level: level,
      availability: availability,
      image: image,
      institution: institution,
      price: unitCost,
      contact: contact,
      userID: userID,
    };

    fetch('https://polibooksapi.azurewebsites.net/api/create/book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${tokenId}`,
        },
        body: JSON.stringify(bookData),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data); // Datos de la respuesta del servidor
          return true;
        })
        .catch((error) => {
          console.error('Error al hacer la solicitud:', error);
          return false;
        });
  }

  async function updateBookinDB(bookID, userID, tokenId, title, description, brand, level, availability, image, institution, unitCost, contact) {
    // Crear un objeto con la información del libro
    const bookData = {
      title: title,
      description: description,
      brand: brand,
      level: level,
      availability: availability,
      image: image,
      institution: institution,
      price: unitCost,
      contact: contact,
      userID: userID,
    };

    fetch(`https://polibooksapi.azurewebsites.net/api/update/book/${bookID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${tokenId}`,
        },
        body: JSON.stringify(bookData),
      })
        .then((response) => {
            if (response.ok) {
                return true;
            }
         })
        .catch((error) => {
          console.error('Error al hacer la solicitud:', error);
          return false;
        });
  }

export  { saveBook, updateBookinDB };