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
2. Navigate to the "Create" page
3. Select flowers from the left panel
4. Arrange flowers on the canvas by dragging
5. Click "Save Design" to generate a shareable link
6. Share the link with friends so they can view your creation

## Future Enhancements

- Add more flower varieties
- Implement a "bouquet template" feature
- Add ability to add text messages
- Improve mobile responsiveness
- Add social sharing options