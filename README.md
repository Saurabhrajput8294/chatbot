# AI Chat Assistant with Image Analysis

A modern, full-stack chat application that combines text-based conversations with image analysis capabilities using Groq AI. This application allows users to interact with an AI assistant that can process both text messages and images, providing intelligent responses and visual analysis.

## Features

- 💬 Real-time chat interface with a modern UI
- 🖼️ Image analysis and processing
- 📎 File attachment support
- ⚡ Fast response times using Groq AI
- 🎨 Responsive design with Bootstrap
- 🔄 Real-time typing indicators
- 📱 Mobile-friendly interface

## Tech Stack

### Frontend
- React.js
- Bootstrap 5
- React Icons
- Axios for API calls

### Backend
- Node.js
- Express.js
- Groq AI SDK
- Multer for file uploads

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- Groq API key

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/ai-chat-assistant.git
cd ai-chat-assistant
```

2. Install backend dependencies:
```bash
cd chatbot-app/backend
npm install
```

3. Install frontend dependencies:
```bash
cd ../frontend
npm install
```

4. Create a `.env` file in the backend directory:
```env
GROQ_API_KEY=your_groq_api_key_here
PORT=5000
```

## Running the Application

1. Start the backend server:
```bash
cd chatbot-app/backend
npm run dev
```

2. Start the frontend development server:
```bash
cd chatbot-app/frontend
npm start
```

3. Open your browser and navigate to `http://localhost:3000`

## Project Structure

```
chatbot-app/
├── backend/
│   ├── server.js
│   ├── package.json
│   └── .env
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── App.js
    │   ├── App.css
    │   ├── index.js
    │   └── index.css
    └── package.json
```

## Usage

1. **Text Chat**: Simply type your message and press Enter or click the send button
2. **Image Analysis**: 
   - Click the camera icon to upload an image
   - Optionally add a text message about the image
   - Send to receive AI analysis
3. **File Attachments**:
   - Click the paperclip icon to attach files
   - Send to share files with the chat

## API Endpoints

- `POST /chat`: Main chat endpoint for text and image processing
- `POST /upload`: File upload endpoint

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Groq AI](https://groq.com/) for providing the AI capabilities
- [React](https://reactjs.org/) for the frontend framework
- [Bootstrap](https://getbootstrap.com/) for the UI components
- [React Icons](https://react-icons.github.io/react-icons/) for the icons

## Contact

Your Name - [@yourtwitter](https://twitter.com/yourtwitter) - email@example.com

Project Link: [https://github.com/yourusername/ai-chat-assistant](https://github.com/yourusername/ai-chat-assistant) 