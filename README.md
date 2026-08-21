<br/>
<div align="center">
  <h1 align="center">EBI Services</h1>
  <p align="center">
    A comprehensive modern web application built with the MERN stack for managing service requests, quotes, and administrative tasks.
  </p>
</div>

## About The Project

EBI Services is a full-stack web application designed to facilitate interactions between clients and the service provider. Clients can learn about services, request quotes (*devis*), and contact support. Administrators have access to a secure portal to manage messages, process quote requests, and oversee platform operations.

## Built With

This project is built using a modern, scalable technology stack:

### Frontend
- **[React](https://reactjs.org/)** (v19) - Component-based UI library
- **[Vite](https://vitejs.dev/)** - Next-generation frontend tooling
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework for styling
- **[Framer Motion](https://www.framer.com/motion/)** - Production-ready animation library
- **[Recharts](https://recharts.org/)** - Composable charting library for admin analytics

### Backend
- **[Node.js](https://nodejs.org/)** & **[Express](https://expressjs.com/)** - Fast, unopinionated web framework
- **[MongoDB](https://www.mongodb.com/)** & **[Mongoose](https://mongoosejs.com/)** - NoSQL database and object data modeling
- **[JWT (JSON Web Tokens)](https://jwt.io/)** - Secure authentication
- **[Multer](https://github.com/expressjs/multer)** - Middleware for handling file uploads
- **[Nodemailer](https://nodemailer.com/)** - Module for sending emails

## Project Structure

The repository is organized into two main workspaces:

- `frontend/`: Contains the React application. It includes all UI components, views (`HomeView`, `AdminView`, `ContactView`, etc.), styles, and client-side logic.
- `backend/`: Contains the Express server. It handles business logic, database models, REST API routes (authentication, messaging, quotes), and email services.

## Features

- **Responsive Landing Page:** Modern and dynamic interface for clients to explore services.
- **Quote Requests (Devis):** Users can easily request and submit details for project quotes.
- **Contact & Messaging:** Integrated contact forms that send messages directly to the backend.
- **Secure Authentication:** JWT-based login for administrators to securely access the portal.
- **Admin Dashboard:** A private area for admins to review metrics, read client messages, and manage service requests.
- **File Uploads:** Support for attaching documents using Multer.
- **Email Notifications:** Automated emails managed via Nodemailer.

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

Ensure you have the following installed on your local machine:
- [Node.js](https://nodejs.org/en/download/) (v18 or higher recommended)
- [MongoDB](https://www.mongodb.com/try/download/community) (Local instance or MongoDB Atlas cluster)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Yosr-Bejaoui/ebi-services.git
   cd ebi-services
   ```

2. **Setup the Backend:**
   ```bash
   cd backend
   npm install
   ```
   *Create a `.env` file in the `backend` directory based on your environment needs (e.g., `PORT`, `MONGO_URI`, `JWT_SECRET`).*

3. **Setup the Frontend:**
   ```bash
   cd ../frontend
   npm install
   ```
   *Create a `.env` file in the `frontend` directory if there are any specific Vite environment variables (e.g., `VITE_API_URL`).*

## Running the Application

To run the application locally, you will need to start both the backend server and the frontend development server.

**Start the Backend:**
```bash
cd backend
npm start
```
*(The server typically runs on `http://localhost:5000`)*

**Start the Frontend:**
```bash
cd frontend
npm run dev
```
*(The frontend typically runs on `http://localhost:5173`)*

## License

Distributed under the MIT License. See `LICENSE` for more information.
