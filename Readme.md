

# Flowerly - Virtual Flower Arrangement App

A web application that allows users to create and share virtual flower arrangements as digital gifts.

## Features

- **Flower Selection**: Choose from a variety of flower designs
- **Interactive Canvas**: Drag and drop flowers to create custom arrangements
- **Sharing**: Generate a unique code to share your creation with friends
- **Authentication**: Log in with Google or email/password
- **Persistence**: Save your designs to continue working on them later

## Technologies Used

- **Frontend**: HTML, CSS, JavaScript, Three.js for 3D rendering
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Authentication**: Passport.js with Google OAuth
- **Deployment**: Hosted via Ngrok

## Setup Instructions

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file with the following variables:
   ```
   PORT=3000
   MONGO_URI=your_mongodb_connection_string
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   JWT_SECRET=your_jwt_secret
   BASE_URL=http://localhost:3000 (or your deployed URL)
   ```
4. Start the server:
   ```
   npm start
   ```

## Project Structure

- `app.js`: Main application file
- `public/`: Static assets
  - `javascripts/`: JavaScript files including Three.js implementation
  - `stylesheets/`: CSS files
  - `textures/`: Flower textures and images
- `routes/`: Express route handlers
- `views/`: HTML templates
- `models/`: Database models
- `passport/`: Authentication configuration

## Usage

1. Visit the home page and log in
   <img width="1440" alt="Screenshot 2025-03-21 at 22 55 29" src="https://github.com/user-attachments/assets/4d87c37d-9471-407b-bd6d-4832ca5ea468" />

2. Navigate to the "Log In" page
<img width="1440" alt="Screenshot 2025-03-21 at 22 58 51" src="https://github.com/user-attachments/assets/45676ca4-9f5f-4a17-9007-b51270f2a055" />

3. Start customizing flowers from the left panel
   <img width="1440" alt="Screenshot 2025-03-21 at 22 59 02" src="https://github.com/user-attachments/assets/26889f5e-70fa-4aa7-9db1-0498a856a85e" />
   
4. Arrange flowers on the canvas by dragging
   <img width="1440" alt="Screenshot 2025-03-21 at 22 59 19" src="https://github.com/user-attachments/assets/95e7adda-bec3-45a7-903e-828ba58181ec" />

5. Click "Save Design" to generate a shareable link
   <img width="1440" alt="Screenshot 2025-03-21 at 22 59 28" src="https://github.com/user-attachments/assets/28a01a37-2b5d-4bbd-8ff7-4e6b6a057f3a" />

6. Share the link with friends so they can view your creation

## Future Enhancements

- Add more flower varieties
- Implement a "bouquet template" feature
- Add ability to add text messages
- Improve mobile responsiveness
- Add social sharing options