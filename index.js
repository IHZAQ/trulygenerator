const express = require('express');
const { createCanvas, loadImage, registerFont } = require('canvas');
const path = require('path');

const app = express();
const port = 3000;

// Register the Minecraft font
const fontPath = path.resolve(__dirname, 'minecraft.ttf');

registerFont(fontPath, { family: 'Minecraft' });

// Function to draw the image
async function drawImage(baseImagePath, iconImagePath, title, description, color1, color2) {
    const canvas = createCanvas(320, 64);
    const ctx = canvas.getContext('2d');
    
    ctx.imageSmoothingEnabled = false;

    const base = await loadImage(baseImagePath);
    const icon = await loadImage(iconImagePath);

    // Draw the base Image
    ctx.drawImage(base, 0, 0);

    // Set font
    ctx.font = '15px "Minecraft"';
    
    // Draw the title and description with colors
    ctx.fillStyle = color1;
    ctx.fillText(title, 60, 28);
    
    ctx.fillStyle = color2;
    ctx.fillText(description, 60, 50);
    
    // Draw the icon
    ctx.drawImage(icon, 17, 16, 32, 32);

    return canvas.toBuffer('image/png');
}

app.get('/generate', async (req, res) => {
    const { title, description, icon, color1 = '#FFFF00', color2 = '#FFFFFF' } = req.query;

    if (!title || !description || !icon) {
        return res.status(400).send('Missing required query parameters: title, description, icon');
    }

    const baseImagePath = path.resolve(__dirname, 'base.png'); // Your base image path
    const iconImagePath = path.resolve(__dirname, `items/${icon}.png`); // Your icon image path

    try {
        const imageBuffer = await drawImage(baseImagePath, iconImagePath, title, description, color1, color2);
        res.set('Content-Type', 'image/png');
        res.send(imageBuffer);
    } catch (error) {
        res.status(500).send('Error generating image');
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});