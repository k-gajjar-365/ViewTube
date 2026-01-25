# 📺 ViewTube 

**Version:** 1.0.0  
**Type:** Fullstack Video Sharing Platform  
**Status:** In Development 🚧  
**Data Models**: [Click here.](https://app.eraser.io/workspace/Qarrf2uidxMyciMLqaDN)

ViewTube is a learning project inspired by YouTube, built with **Node.js, Express.js, and planned frontend integration**.  
It provides backend APIs for user authentication, video uploads, and content management, with a future goal of adding a frontend for video playback, playlists, and user interaction.  

This project is mainly a **revision exercise** to practice backend development first, then expand into a fullstack application.

---

## 🚧 Development Status

| Module            | Status       | Notes                                      |
|-------------------|--------------|--------------------------------------------|
| 🔐 Authentication | ✅ Completed | User registration, login, logout, and JWT secured routes implemented |
| 🩺 Health Check      | ⏳ Pending    | System status endpoint implemented and working
| 📹 Video Uploads  | ⏳ Pending    | Multer + Cloudinary integration in progress |
| 📦 Playlists      | ⏳ Pending    | Playlist creation and video grouping planned |
| 👥 User Profiles  | ⏳ Pending    | Profile routes and customization to be added |
| 🎨 Frontend UI    | ⏳ Planned    | React frontend for video playback and user interaction |
| 📊 Analytics      | ⏳ Planned    | Basic view count and tracking in future phase |

---

## 🚀 Features

### 🔐 Authentication & Authorization
- User registration and login with JWT tokens  
- Password change functionality for logged in users  
- Secure logout and refresh token system  

### 📹 Video Management
- Upload videos with Multer  
- Store media securely on Cloudinary    

### 📦 Playlist Management
- Create and manage playlists  
- Add/remove videos from playlists  

### 👥 User Profiles
- Basic profile info (username, email)  
- Planned: profile picture upload and customization  



---

## 🧰 Tech Stack

- **Backend:** Node.js, Express.js  
- **Database:** MongoDB ( ODM: [mongoose](https://mongoosejs.com/) )  
- **Authentication:** [JWT](https://www.jwt.io/introduction#what-is-json-web-token) ( Json Web Tokens )  
- **File Handling:** [Multer](https://www.npmjs.com/package/multer), [Cloudinary](https://cloudinary.com/documentation/node_integration)  
- **Frontend (planned):** React.js
- **Security:** [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS/Errors) 

---

## 📁 Project Structure

    src/
    └── ├── app.js        # Main Express app setup 
        ├── constants.js  # Centralized constants 
        ├── index.js       # Entry point, starts the server
        |
        ├── controllers/  # Business logic for each feature    
        │   ├── user.controller.js   # Handles user model related controllers
        |
        ├── db/           # Database connection
        │   └── index.js      # DB connection setup(Mongoose)
        |
        ├── middlewares/  # Custom middleware
        │   ├── auth.middleware.js      # JWT auth check  
        │   └── multer.middleware.js    # Multer setup for file uploads
        |
        ├── models/       # Data model schemas
        │   ├── user.model.js          # User schema 
        │   ├── video.model.js         # Video schema 
        │   ├── playlist.model.js      # Playlist schema
        │   └── like.model.js          # Like Schema
        │   ├── subscription.model.js  # Subscription schema 
        │   ├── tweet.model.js         # Tweet schema
        │   └── comment.model.js       # Comment Schema
        |
        ├── routes/      # Express route definitions
        │   ├── user.routes.js   # Routes for register, login etc.
        |
        └── utils/         # Helper functions
            ├── ApiResponse.js          # Standardized API response formatting
            ├── ApiError.js          # Standardized API Errors formatting
            ├── asyncHandler.js         # Utility to wrap async functions and catch errors
            ├── cloudinary.js           # Cloudinary helper functions for uploads


---

## 📖 What I Learned
- How to set up an **Express server** from scratch.  
- The difference between **middleware functions** and **route handlers**.  
- Handling **file uploads** with Multer and solving path issues.  
- Uploading files to **Cloudinary** and managing credentials securely.  
- Writing cleaner code with a proper folder structure.  
- Sending correct **status codes** for success and errors.  
- Planning how backend and frontend will connect in a fullstack app.  

---

## ▶️ How to Run

### Backend
1. Clone the repository  
   ```bash
   // to set link of project


2. Install dependencies
    ```bash
    npm install
    ```
3. Create .env file with required environment variables
    ```bash
    MONGODB_URI=your_mongodb_connection_string
    PORT=8000
    CORS_ORIGIN=*

    ACCESS_TOKEN_SECRET=your_access_token_secret
    ACCESS_TOKEN_EXPIRY=1d

    REFRESH_TOKEN_SECRET=your_refresh_token_secret
    REFRESH_TOKEN_EXPIRY=10d

    CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
    CLOUDINARY_API_KEY=your_cloudinary_api_key
    CLOUDINARY_API_SECRET=your_cloudinary_api_secret
    ```
---

## 🎯 Future Improvements
- Add a frontend for video playback and user interaction.
- Improve error handling and validation.
- Deploy the project to a hosting service.
- Add analytics for views, likes, and comments.

## 👨‍🎓 Note
This project is mainly for practice and revision.
I’m still learning, so feedback and suggestions are always welcome!

