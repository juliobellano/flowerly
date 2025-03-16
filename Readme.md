# Flowerly

Flowerly is a custom flower design application that lets users create and personalize virtual flowers and share them via unique links. Recipients can open these links to view the specially crafted designs. The project is built with Node.js, Express, CSS, and MongoDB, with secure authentication powered by Auth0 and Passport. Flowerly is designed to be cross-platform, working seamlessly on Android devices, web browsers, and as a web app.

## Features

- **Custom Flower Designer:** Create unique, personalized flower designs.
- **Personalized Sharing:** Each design generates a unique URL that you can send to friends or loved ones.
- **Secure Authentication:** User accounts are protected using Auth0 and Passport.
- **Multi-Platform Compatibility:** Enjoy Flowerly on Android, web browsers, and as a progressive web app.
- **Robust Data Storage:** Flower designs and user data are securely stored in MongoDB.

## Technology Stack

- **Backend:** Node.js and Express.js
- **Frontend:** HTML, CSS, and JavaScript
- **Database:** MongoDB
- **Authentication:** Auth0 and Passport
- **Deployment:** Compatible with Android, web browsers, and as a web app

## Installation

### Prerequisites

- [Node.js](https://nodejs.org/en/) installed on your machine
- A running instance of MongoDB (local or remote)
- An Auth0 account set up for authentication

### Setup

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/juliobellano/flowerly.git
   cd flowerly
   
2. **Install Dependencies:**

     ```bash
     npm install

3. **Configure Environment Variables:**

  Create a .env file in the root directory with the following keys (replace the placeholders with your actual configuration):
  
      ```bash
      MONGODB_URI=your_mongodb_connection_string
      AUTH0_CLIENT_ID=your_auth0_client_id
      AUTH0_CLIENT_SECRET=your_auth0_client_secret
      AUTH0_DOMAIN=your_auth0_domain
      SESSION_SECRET=your_session_secret


4. **Start the Application:**

      ```bash
      npm start

##The app will run on http://localhost:3000 by default.

