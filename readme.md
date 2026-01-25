# Zen Easy BD

## Table of Contents

1.  [About Zen Easy BD](#about-zen-easy-bd)
2.  [Features](#features)
3.  [Technologies Used](#technologies-used)
4.  [Screenshots](#Screenshots)
5.  [Project Structure](#project-structure)
6.  [Getting Started](#getting-started)
    * [Prerequisites](#prerequisites)
    * [Backend Setup](#backend-setup)
    * [Frontend Setup](#frontend-setup)
7.  [Deployment](#deployment)
8.  [Contributing](#contributing)
9.  [Contact](#contact)
10.  [License](#license)

## About Zen Easy BD

Zen Easy BD is a comprehensive full-stack web application designed to simplify daily living in Bangladesh by connecting users with essential home services and rental properties. It provides a centralized, intuitive platform where individuals can easily find and book verified service providers, and property owners can effortlessly list and manage their rental advertisements.

The project aims to streamline the process of accessing everyday services and finding suitable accommodations, enhancing convenience and reliability for users across Bangladesh.

## Features

* **User Authentication:** Secure user registration and login using Email/Password with Firebase Authentication, including OTP verification and password reset functionality.
* **User Profiles:**
    * Personalized user profiles displaying contact information, personal details, and social media links.
    * Ability for users to edit their own profile information and profile pictures.
* **Professional Service Marketplace:**
    * **Service Offering:** Professionals can create and manage their service profiles (e.g., Maid, Home Shifter, Plumber, Electrician, Tutor, IT Provider, Painter).
    * **Service Discovery:** Users can browse and filter services by category, price range, availability, and search by keywords.
    * **Reviews & Ratings:** Clients can leave feedback and ratings for specific professional services.
* **Property Rental Hub:**
    * **Post Rent Ads:** Property owners can post detailed advertisements for various rental categories (bachelor room, family room, flat, store, office, shopping mall) with multiple images.
    * **Browse Rentals:** Users can search, filter, and sort rental properties by category, price, location, and availability.
    * **Property Details:** Detailed view for each rental property with image galleries.
* **Responsive UI/UX:** A modern, clean, and intuitive user interface designed to be fully responsive across desktop, tablet, and mobile devices.
* **Animations:** Smooth, subtle animations for enhanced user experience, including on-view animations for content sections.
* **Centralized Notifications:** Custom toast notification system for user feedback (success, error messages).

## Technologies Used

**Frontend:**

* **React.js:** A JavaScript library for building user interfaces.
* **TypeScript:** A superset of JavaScript that adds static types.
* **React Router DOM:** For declarative routing in React applications.
* **React Hook Form:** For efficient and flexible form management with validation.
* **React Datepicker:** A date picker component for React.
* **`react-icons`:** For popular icon sets.
* **`lucide-react`:** For a modern, customizable icon library.
* **SCSS (Sass):** CSS pre-processor for enhanced styling capabilities.
* **Tailwind CSS:** (Used for some utility classes and responsive design principles, as noted in previous interactions).
* **`lodash.debounce`:** For optimizing search input performance.
* **`js-cookie`:** For client-side cookie management.
* **`axios`:** For making HTTP requests to the backend API.
* **`react-hot-toast`:** (If used for notifications, or replaced by custom notification system).

**Backend:**

* **Node.js:** JavaScript runtime environment.
* **Express.js:** Fast, unopinionated, minimalist web framework for Node.js.
* **MongoDB:** NoSQL database for data storage.
* **Mongoose:** MongoDB object data modeling (ODM) library for Node.js.
* **Firebase Authentication:** For user authentication (Email/Password, OTP, Password Reset).
* **AWS S3:** Amazon Simple Storage Service for scalable and secure image storage.
* **`multer`:** Node.js middleware for handling `multipart/form-data` (file uploads).
* **`@aws-sdk/client-s3` & `@aws-sdk/lib-storage`:** AWS SDK for JavaScript to interact with S3.
* **`cors`:** Node.js middleware for enabling Cross-Origin Resource Sharing.
* **`dotenv`:** For loading environment variables from a `.env` file.
* **`bcryptjs`:** For password hashing (if implemented).
* **`jsonwebtoken`:** For JWT token generation (if implemented for session management).


## Screenshots
<img width="1914" height="875" alt="Image" src="https://github.com/user-attachments/assets/7594256a-8c6e-4634-aaed-2e12d4228f7d" />

<img width="1912" height="914" alt="Image" src="https://github.com/user-attachments/assets/7e4d4ac9-b0c0-406c-b64e-0ecf01597891" />

<img width="951" height="836" alt="Image" src="https://github.com/user-attachments/assets/77a75f07-976a-4ac2-9f91-0a65c2d83c37" />

<img width="882" height="863" alt="Image" src="https://github.com/user-attachments/assets/78a47baa-b7d0-44c8-9646-c89eceeb0868" />

<img width="1854" height="999" alt="Image" src="https://github.com/user-attachments/assets/bd8df5c4-3e09-48f3-b489-882a3a82cb7b" />

<img width="722" height="805" alt="Image" src="https://github.com/user-attachments/assets/36da0621-c339-4e73-b203-c0f89932a20e" />

<img width="1846" height="918" alt="Image" src="https://github.com/user-attachments/assets/f1a6ba0a-c7ad-4eb3-afe6-d10b07934cc9" />

<img width="730" height="862" alt="Image" src="https://github.com/user-attachments/assets/f39a318e-b4ed-494a-bd13-678cbbe751b4" />

![Image](https://github.com/user-attachments/assets/5d995d28-ac67-4b29-802b-ebab40c70054)

![Image](https://github.com/user-attachments/assets/af55fea2-b4a6-4940-85ce-782bef79ada4)

![Image](https://github.com/user-attachments/assets/2f0fb639-72a9-4431-9312-27b686a454cc)

![Image](https://github.com/user-attachments/assets/2b89c1d9-cd7b-4e18-ad68-7830ca9cf023)

![Image](https://github.com/user-attachments/assets/9b25c0da-17d2-4a25-b501-029fb6bd8761)

![Image](https://github.com/user-attachments/assets/04c57818-6ec3-4c24-b3a2-755eb34349d6)

![Image](https://github.com/user-attachments/assets/3a546c6b-5312-4f44-88df-0c43aaaa70fe)

## Getting Started

Follow these steps to set up the project locally.

### Prerequisites

* Node.js (v18 or higher recommended)
* npm or Yarn
* MongoDB Atlas account (or local MongoDB instance)
* Firebase Project (for Authentication)
* AWS S3 Bucket (for image storage)

### Backend Setup

1.  **Clone the repository:**
    ```bash
    git clone <https://github.com/aiarnob23/Zen-Easy>
    cd zen-easy-bd/backend
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```
3.  **Create `.env` file:**
    In the `backend` directory, create a `.env` file and add your environment variables:
    ```env
    PORT=4000
    MONGODB_URI="your_mongodb_connection_string"
    JWT_SECRET="your_jwt_secret_key"
    FIREBASE_API_KEY="your_firebase_web_api_key" 

    # AWS S3 Credentials
    AWS_REGION="your_aws_region" # e.g., ap-southeast-2
    AWS_ACCESS_KEY_ID="your_aws_access_key_id"
    AWS_SECRET_ACCESS_KEY="your_aws_secret_access_key"
    S3_BUCKET_NAME="your_s3_bucket_name"

    # Nodemailer Credentials
    GOOGLE_APP_PASSWORD="your google app password"
    GOOGLE_EMAIL="your provider email"
    ```
    *Replace placeholders with your actual credentials.*

4.  **Run the backend:**
    ```bash
    npx nodemon
    ```
    The backend server should start on `http://localhost:4000`.

### Frontend Setup

1.  **Navigate to the frontend directory:**
    ```bash
    cd ../frontend
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```
3.  **Create `.env` file:**
    In the `frontend` directory, create a `.env` file and add your environment variables:
    ```env
    VITE_FIREBASE_API_KEY="your_firebase_web_api_key"
    VITE_FIREBASE_AUTH_DOMAIN="your_firebase_auth_domain"
    VITE_FIREBASE_PROJECT_ID="your_firebase_project_id"
    VITE_FIREBASE_STORAGE_BUCKET="your_firebase_storage_bucket"
    VITE_FIREBASE_MESSAGING_SENDER_ID="your_firebase_messaging_sender_id"
    VITE_FIREBASE_APP_ID="your_firebase_app_id"
    VITE_FIREBASE_MEASUREMENT_ID="your_firebase_measurement_id"

    # Frontend API Base URL (for local development)
    VITE_API_BASE_URL="http://localhost:4000/api/v1"
    ```
    *Replace placeholders with your actual Firebase Web App config and local backend URL.*

4.  **Run the frontend:**
    ```bash
    npm run dev # Or your specific start/dev script
    # or
    yarn start
    ```
    The frontend application should open in your browser, typically at `http://localhost:5173` (if using Vite) or `http://localhost:3000` (if using Create React App).

## Deployment

This project is designed to be deployed on Vercel.

### Vercel Configuration (`vercel.json`)

Ensure you have `vercel.json` files in both your `frontend` and `backend` root directories for proper routing and environment variable handling.

**`frontend/vercel.json`** (for SPA client-side routing):
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

**`backend/vercel.json`** (for API routes, if needed, and to define build steps for serverless functions):
```json
{
  "functions": {
    "api/**/*.ts": { "runtime": "nodejs18.x" }
  },
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/$1"
    }
  ]
}
```
*Adjust `api/**/*.ts` to match your backend's entry point for serverless functions.*

### Environment Variables on Vercel

**Crucially, you must configure all production environment variables directly in your Vercel project settings for both frontend and backend projects.**

1.  Go to your Vercel Dashboard.
2.  Select your project (e.g., `zen-easy.vercel.app` for frontend, `zen-easy-bd-backend.vercel.app` for backend).
3.  Go to **Settings** > **Environment Variables**.
4.  Add all variables defined in your local `.env` files, especially:
    * **Backend:** `MONGODB_URI`, `JWT_SECRET`, `FIREBASE_API_KEY`, `AWS_REGION`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `S3_BUCKET_NAME`.
    * **Frontend:** `VITE_FIREBASE_...` variables, and `VITE_API_BASE_URL` (which should point to your deployed backend URL, e.g., `https://zen-easy-bd-backend.vercel.app/api/v1`).

### CORS Configuration for Backend

Ensure your backend's `cors` middleware (`app.use(cors(...))`) is configured to allow requests from your deployed frontend domain (`https://zen-easy.vercel.app`).

```typescript
// Example: backend/src/app.ts
app.use(cors({
  origin: '[https://zen-easy.vercel.app](https://zen-easy.vercel.app)', 
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
```

## Contributing

Contributions are welcome! If you have suggestions or find issues, please open an issue or submit a pull request.

## Contact

* **Creator:** aiarnob23@gmail.com

## License

This project is licensed under the MIT License.

---
