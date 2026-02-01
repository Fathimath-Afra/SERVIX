import Swal from 'sweetalert2';

export const deleteConfirm = (title, text) => {
    return Swal.fire({
        title: title || 'Are you sure?',
        text: text || "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#2563eb', 
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'Cancel',
        customClass: {
            popup: 'rounded-3xl',
        }
    });
};

export const successAlert = (title, text) => {
    Swal.fire({
        title: title || 'Success!',
        text: text,
        icon: 'success',
        confirmButtonColor: '#2563eb',
        timer: 2000,
        customClass: {
            popup: 'rounded-3xl',
        }
    });
};