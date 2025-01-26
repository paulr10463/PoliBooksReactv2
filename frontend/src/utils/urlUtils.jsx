function transformImages(images) {
    if (!images) return [];
    const transformedImages = images.map(image => {
        return {
            url: image
        }
    });
    return transformedImages;
}   

function getNameFromURL(url) {
    const URLparts = url.split('/');
    const fileName = URLparts[URLparts.length - 1];
    // Si la URL contiene parámetros de consulta, elimínalos
    const fileNameSinQueryWihoutQuery = fileName.split('?')[0];
    const decoded = decodeURIComponent(fileNameSinQueryWihoutQuery);
    return decoded.split('/')[1];  
}

export { transformImages, getNameFromURL };