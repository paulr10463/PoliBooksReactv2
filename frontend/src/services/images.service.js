import { environment } from "../environment/environment.prod";

export const postImage = async (formData, idToken) => {
  try {
    const response = await fetch(`${environment.HOST}/upload`, {
      method: 'POST',
      headers: {
        Authorization: `${idToken}`,
      },
      body: formData, // Automatically sets the correct Content-Type for FormData
    });

    // Throw an error for non-OK responses
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Error al subir el archivo");
    }

    // Return the parsed JSON data
    return response.json();
  } catch (error) {
    console.error("Error in postImage:", error);
    throw error; // Propagate the error to the caller
  }
};
