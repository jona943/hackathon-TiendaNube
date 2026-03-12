# Hackathon Utel - Prototipo Simplificado

Este repositorio contiene el prototipo desarrollado para la Hackathon Utel, enfocado en la creación de un asistente inteligente integrado con la API de Gemini.

## Estructura del Proyecto

El desarrollo se ha dividido para mantener la claridad y simplicidad:

- **base_main/**: Contiene el desarrollo original y las investigaciones iniciales (ignorado por Git para evitar ruido en el historial).
- **Raíz (Este directorio)**: Contiene la nueva versión simplificada, optimizada para un alto rendimiento y bajo mantenimiento.

## Tecnologías Utilizadas

- **Backend**: Python con Flask (micro-framework ligero).
- **IA**: Google Generative AI (Gemini Pro).
- **Frontend**: HTML5, CSS3 y JavaScript (Vanilla / Puro).
- **Seguridad**: Variables de entorno (`.env`) para la gestión de API Keys.

## Cómo empezar

1. Clonar el repositorio.
2. Crear un entorno virtual: `python -m venv venv`.
3. Activar el entorno virtual:
   - Linux/Mac: `source venv/bin/activate`
   - Windows: `venv\Scripts\activate`
4. Instalar dependencias: `pip install -r requirements.txt`.
5. Configurar tu `GEMINI_API_KEY` en un archivo `.env`.
6. Ejecutar el servidor: `python app.py`.
