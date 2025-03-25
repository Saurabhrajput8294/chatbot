require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const { Groq } = require('groq-sdk');
const fs = require('fs');
const axios = require('axios');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Initialize Groq client
const groq = new Groq({
    apiKey: "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"
});

// Configure file upload
const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// Create uploads directory if it doesn't exist
if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}

// Helper function to encode image to base64
async function imageToBase64(imagePath) {
    const image = fs.readFileSync(imagePath);
    return Buffer.from(image).toString('base64');
}

// Chat endpoint with image support
app.post('/chat', upload.single('image'), async (req, res) => {
    try {
        const { message } = req.body;
        let messages = [
            {
                role: "system",
                content: "You are a helpful AI assistant. Be concise, friendly, and professional in your responses. When analyzing images, provide detailed observations and insights."
            }
        ];

        // If there's an image, add it to the messages
        if (req.file) {
            const base64Image = await imageToBase64(req.file.path);
            messages.push({
                role: "user",
                content: [
                    {
                        type: "text",
                        text: message || "What do you see in this image?"
                    },
                    {
                        type: "image_url",
                        image_url: {
                            url: `data:image/${path.extname(req.file.originalname).substring(1)};base64,${base64Image}`
                        }
                    }
                ]
            });
        } else {
            messages.push({
                role: "user",
                content: message
            });
        }

        const completion = await groq.chat.completions.create({
            messages: messages,
            model: "llama-3.3-70b-versatile",
            temperature: 0.7,
            max_tokens: 1024,
        });

        res.json({ 
            reply: completion.choices[0].message.content,
            imageUrl: req.file ? `/uploads/${req.file.filename}` : null
        });

        // Clean up uploaded file after processing
        if (req.file) {
            fs.unlink(req.file.path, (err) => {
                if (err) console.error('Error deleting file:', err);
            });
        }
    } catch (error) {
        console.error('Groq Error:', error);
        res.status(500).json({ error: 'Failed to fetch response' });
    }
});

// File upload endpoint
app.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    res.json({ fileUrl: `http://localhost:5000/uploads/${req.file.filename}` });
});

// Start server
app.listen(5000, () => console.log('Server running on port 5000'));
