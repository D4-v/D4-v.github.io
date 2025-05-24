document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('registrationForm');
    const messageDiv = document.getElementById('message');
    const nombreInput = document.getElementById('nombre');
    const telefonoInput = document.getElementById('telefono');
    
    // Validación en tiempo real para el campo de nombre
    nombreInput.addEventListener('input', function() {
        this.value = this.value.replace(/[^\w\sáéíóúüñÁÉÍÓÚÜÑ]/g, '');
    });
    
    // Validación en tiempo real para el campo de teléfono
    telefonoInput.addEventListener('input', function() {
        this.value = this.value.replace(/\D/g, '');
    });
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validar nombre (mínimo 2 palabras)
        const nombreValue = nombreInput.value.trim();
        const palabras = nombreValue.split(/\s+/).filter(word => word.length > 0);
        
        if (palabras.length < 2) {
            showMessage('Por favor ingresa tu nombre completo (mínimo 2 palabras)', 'error');
            nombreInput.focus();
            return;
        }
        
        if (nombreValue.length > 100) {
            showMessage('El nombre no puede exceder los 100 caracteres', 'error');
            nombreInput.focus();
            return;
        }
        
        // Telefono
        const telefonoValue = telefonoInput.value.trim();
        
        if (!/^\d{10,15}$/.test(telefonoValue)) {
            showMessage('Por favor ingresa un número telefónico válido (10-15 dígitos)', 'error');
            telefonoInput.focus();
            return;
        }
        
        // Preparar los datos del formulario
        const formData = new FormData(form);
        
        // Enviar los datos al endpoint
        fetch('https://wa.toolia.site/add_user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams(formData).toString()
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => { throw err; });
            }
            return response.text();
        })
        .then(data => {
            showMessage(data, 'success');
            form.reset();
        })
        .catch(error => {
            const errorMsg = error.error || 'Ocurrió un error al procesar tu registro. Por favor intenta nuevamente.';
            showMessage(errorMsg, 'error');
            console.error('Error:', error);
        });
    });
    
    function showMessage(message, type) {
        messageDiv.textContent = message;
        messageDiv.className = type;
    }
});
    