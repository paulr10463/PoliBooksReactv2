import Swal from 'sweetalert2'

export function twoOptionShowBox(){
    return Swal.fire({
        title: '¿Estás seguro?',
        text: 'Esta acción no se puede deshacer',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, ¡hazlo!',
        cancelButtonText: 'Cancelar',
    })
}

export function loading(){
    return Swal.showLoading();
}