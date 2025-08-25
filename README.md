# Twice Tagram Backend
# **see this service :** [twice tegarm backend](https://twice-tagram-backend.onrender.com)  

This is the backend service for the Twice Tagram app, providing API endpoints and business logic for managing content and user interactions.

## 🔗 Project Position in Full System

- **Frontend (fronend react app perform on netlify):** [twicetagram-ui](https://github.com/sana2912/twicetagram-ui.git)
- **Backend (perform on render):**  **this project**
- **for more understanding see full systems picture:** [image](https://res.cloudinary.com/ddlspu2uq/image/upload/v1756124393/system2_o95cvf.jpg)  

## Features
- provide API endpoints for app functionality
- User management and authentication
- Data storage with MongoDB
- media content strorage management with cloudinary
- Business logic for Twice Tagram content management

## Technologies Used

- **Node.js**: JavaScript runtime for server-side development.
- **Express**: Web framework for building REST APIs.
- **Mongoose**: ODM for MongoDB, managing schemas and interactions.
- **MongoDB Atlas**: Cloud database for storing album/track metadata.
- **Multer**: Middleware for handling multipart/form-data (file uploads).
- **Cloudinary**: Cloud storage for track files.

## Getting Started

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   - Add your MongoDB connection string and any other secrets to a `.env` file.

4. **Run the application**
   ```bash
   node app.js
   ```
