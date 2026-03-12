document.addEventListener('DOMContentLoaded', () => {
    const chatForm = document.getElementById('chat-form');
    const userInput = document.getElementById('user-input');
    const chatMessages = document.getElementById('chat-messages');
    const chatWindow = document.getElementById('chat-window');

    // Función para añadir mensajes a la interfaz
    const addMessage = (text, sender) => {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', sender);
        messageDiv.textContent = text;
        chatMessages.appendChild(messageDiv);
        
        // Auto-scroll al final
        chatWindow.scrollTop = chatWindow.scrollHeight;
    };

    // Manejar el envío del formulario
    chatForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const message = userInput.value.trim();
        if (!message) return;

        // Limpiar input y mostrar mensaje del usuario
        userInput.value = '';
        addMessage(message, 'user');

        // Mostrar indicador de "pensando" (opcional, simplificado aquí)
        const loadingDiv = document.createElement('div');
        loadingDiv.classList.add('message', 'bot', 'loading');
        loadingDiv.textContent = '...';
        chatMessages.appendChild(loadingDiv);
        chatWindow.scrollTop = chatWindow.scrollHeight;

        try {
            // Petición al backend
            const response = await fetch('/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: message }),
            });

            const data = await response.json();
            
            // Eliminar indicador de carga
            chatMessages.removeChild(loadingDiv);

            if (data.response) {
                addMessage(data.response, 'bot');
            } else if (data.error) {
                addMessage('Lo siento, hubo un error: ' + data.error, 'bot');
            }
        } catch (error) {
            chatMessages.removeChild(loadingDiv);
            addMessage('Error de conexión. Por favor, intenta de nuevo.', 'bot');
            console.error('Error:', error);
        }
    });
});
