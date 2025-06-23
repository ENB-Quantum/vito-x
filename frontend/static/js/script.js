// Basic script file for potential future use.
// For example, client-side form validation or dynamic content loading.

document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM fully loaded and parsed");

    // Example: Confirm before submitting a delete form
    const deleteForms = document.querySelectorAll('form.delete-form'); // Add class="delete-form" to forms
    deleteForms.forEach(form => {
        form.addEventListener('submit', function(event) {
            if (!confirm('Are you sure you want to delete this item?')) {
                event.preventDefault();
            }
        });
    });

    // Example: Basic toggle for a sidebar or menu (if we add one)
    // const menuToggle = document.getElementById('menu-toggle');
    // const sidebar = document.getElementById('sidebar');
    // if (menuToggle && sidebar) {
    //     menuToggle.addEventListener('click', function() {
    //         sidebar.classList.toggle('active');
    //     });
    // }
});
