import os
from flask import Flask, render_template, request, jsonify
import google.generativeai as genai
from dotenv import load_dotenv

# Cargar variables de entorno (GEMINI_API_KEY)
load_dotenv()

# Configurar Flask
app = Flask(__name__)

# Configurar Gemini
api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    raise ValueError("No se encontró GEMINI_API_KEY en el archivo .env")

genai.configure(api_key=api_key)

# Inicializar el modelo (usaremos gemini-flash-latest por estabilidad de cuota)
model = genai.GenerativeModel('gemini-flash-latest')

# Instrucciones del sistema para el asistente
SYSTEM_PROMPT = """
Eres un asistente experto para TiendaNube. Tu objetivo es ayudar a emprendedores 
a configurar sus tiendas, resolver dudas sobre la plataforma y ofrecer consejos 
de e-commerce. Responde siempre de forma amable, profesional y concisa en Español.
"""

@app.route('/')
def index():
    """Ruta principal: Carga la interfaz del chat."""
    return render_template('index.html')

@app.route('/chat', methods=['POST'])
def chat():
    """Endpoint para procesar mensajes y obtener respuesta de Gemini."""
    try:
        data = request.json
        user_message = data.get('message', '')

        if not user_message:
            return jsonify({'error': 'Mensaje vacío'}), 400

        # Crear el chat o enviar el mensaje directamente
        # Nota: Podríamos mantener historial, pero para el prototipo ligero 
        # enviaremos el prompt del sistema + mensaje del usuario.
        response = model.generate_content(f"{SYSTEM_PROMPT}\n\nUsuario: {user_message}")
        
        return jsonify({
            'response': response.text
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    # Ejecución en modo debug para desarrollo fácil
    app.run(debug=True, port=5000)
