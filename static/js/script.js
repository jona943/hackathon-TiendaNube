document.addEventListener('DOMContentLoaded', () => {
    const chatForm = document.getElementById('chat-form');
    const userInput = document.getElementById('user-input');
    const chatMessages = document.getElementById('chat-messages');
    const chatWindow = document.getElementById('chat-window');
    const storePreview = document.getElementById('store-preview');
    const fullCode = document.getElementById('full-code');
    const codeOverlay = document.getElementById('code-overlay');
    const toggleCode = document.getElementById('toggle-code');

    // Estado inicial de la tienda (un lienzo en blanco profesional)
    let storeCode = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <style>
                body { font-family: sans-serif; margin: 0; padding: 20px; color: #333; text-align: center; }
                .container { max-width: 800px; margin: auto; padding: 40px; border: 2px dashed #ccc; border-radius: 20px; }
            </style>
        </head>
        <body>
            <div class="container">
                <h2>Tu nueva tienda aparecerá aquí</h2>
                <p>Usa el chat para pedir diseños, productos o configuraciones.</p>
            </div>
        </body>
        </html>
    `;

    // Función para actualizar el visor
    const updateVisor = (newContent, type) => {
        // Al recibir código nuevo, reemplazamos el estado completo para verlo renderizado al 100%
        storeCode = newContent;

        // Renderizar en el iframe
        const doc = storePreview.contentWindow.document;
        doc.open();
        doc.write(storeCode);
        doc.close();

        // Actualizar overlay de código para usuarios curiosos
        fullCode.textContent = storeCode;
    };

    // Inicializar visor
    updateVisor(storeCode);

    // Toggle para ver código
    toggleCode.addEventListener('click', () => {
        codeOverlay.classList.toggle('hidden');
        toggleCode.textContent = codeOverlay.classList.contains('hidden') ? 'Ver Código' : 'Cerrar Código';
    });

    const processResponse = (text) => {
        const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
        let match;
        let cleanText = text;

        while ((match = codeBlockRegex.exec(text)) !== null) {
            const lang = match[1] || 'html';
            const code = match[2];
            
            updateVisor(code, lang);
            cleanText = cleanText.replace(match[0], `<div class="impl-hint">✨ ¡Vista previa actualizada!</div>`);
        }
        return cleanText;
    };

    const addMessage = (text, sender) => {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', sender);
        if (sender === 'bot') {
            messageDiv.innerHTML = processResponse(text);
        } else {
            messageDiv.textContent = text;
        }
        chatMessages.appendChild(messageDiv);
        chatWindow.scrollTop = chatWindow.scrollHeight;
    };

    chatForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const message = userInput.value.trim();
        if (!message) return;

        userInput.value = '';
        addMessage(message, 'user');

        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'message bot loading';
        loadingDiv.textContent = '...';
        chatMessages.appendChild(loadingDiv);

        try {
            const response = await fetch('/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: message }),
            });
            const data = await response.json();
            
            if (loadingDiv && loadingDiv.parentNode === chatMessages) {
                chatMessages.removeChild(loadingDiv);
            }

            if (data.response) {
                addMessage(data.response, 'bot');
            }
        } catch (error) {
            if (loadingDiv && loadingDiv.parentNode === chatMessages) {
                chatMessages.removeChild(loadingDiv);
            }
            addMessage('Error de conexión.', 'bot');
        }
    });
});
