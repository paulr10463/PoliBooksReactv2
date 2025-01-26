import { environment } from "../environment/environment.prod";
 
  async function saveBook(bookData, tokenId) {
    try {
      const response = await fetch(`${environment.HOST}/create/book`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: tokenId, // Simplified key assignment
        },
        body: JSON.stringify(bookData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al guardar el libro');
      }

      return await response.json(); // Return the response data
    } catch (error) {
      console.error('Error al hacer la solicitud:', error);
      throw error; // Re-throw the error for the caller to handle
    }
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

    fetch(`${environment.HOST}/update/book/${bookID}`, {
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