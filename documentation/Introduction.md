## Introducción
La comunidad politécnica necesita una plataforma en línea para comprar y vender libros fácilmente. Se propone una aplicación web segura que permita a los usuarios realizar transacciones. El proyecto se centra en la creación de una página web con inicio de sesión, registro de usuarios y gestión de libros. Busca impulsar el intercambio de libros en la comunidad politécnica.

## Objetivos
- Operaciones CRUD que permitan administrar información relevante de los libros.
- Diseñar y desarrollar una pantalla de inicio de sesión, registro de usuarios, restablecimiento de contraseña y una pantalla principal que se presente una vez que los usuarios se autentiquen.

## Planteamiento del problema 
La comunidad politécnica requiere una plataforma en línea para comprar y vender libros de manera fácil y segura. La falta de una solución digital centralizada dificulta el acceso a libros necesarios y la oportunidad de vender libros usados. Es necesario desarrollar una aplicación web que satisfaga estas necesidades y brinde una experiencia completa para administrar la información de los libros.

## Requerimientos funcionales

- La plataforma debe permitir que los usuarios se registren con nombres y apellidos, correo electrónico, contraseña y número de teléfono.
- Un usuario registrado debe ser capaz de publicar nuevos libros y editar o eliminar los que tenga publicados.
- Una publicación de venta de un libro debe contener título, descripción, nivel, marca, institución, costo, contacto, disponibilidad, costo y de 1-5 imagenes del libro. 
- Todas las características de la publicación de un libro deben poder ser editadas. 
- Se debe poder buscar una publicación del libro buscando el título de la publicación o una subcadena de esta. 
- Un usuario invitado debe ser capaz de poder ver el detalle de cualquier publicación de un libro que elija.
- Se debe permitir el filtrado los libros disponibles a partir del nivel de este. 
- A partir del detalle de un libro se debe poder redirijir a whatsapp para enviar un mensaje al vendedor. 
- La plataforma debe mantener un catálogo organizado de todas las publicaciones disponibles.

## Requerimientos no funcionales 
### Seguridad
- Al momento de que un vendedor inicia sesión se le debe asignar un token, el cual se verificará en cada acción de escritura, edición o eliminación de una de sus publicaciones. 

