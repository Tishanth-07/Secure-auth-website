<h1 align="center">  Secure Auth Website </h1>

A **full-stack authentication and authorization practice project** built using Next.js, Node.js, and MongoDB.

This project focuses purely on secure user authentication workflows, including account creation, email verification, login, password recovery, and JWT-based authorization.

---

## 🔹Project Overview
Secure Auth Website is an individual learning project designed to understand and implement real-world authentication systems.

The application allows users to:
- Sign up with personal details
- Verify email via OTP
- Log in securely
- Reset forgotten passwords
- Access protected routes using JWT tokens

This project does not include business logic or dashboards — it is focused entirely on authentication best practices.

---

##  🔹Features  

###  User Authentication
- User signup (First Name, Last Name, Email, Password)
- Secure login with username/email & password
- Email verification using OTP
- Resend verification codes
- Forgot password & reset password flow

### Security
- Password hashing
- JWT token generation & validation
- Protected API routes
- Secure cookie / header-based authentication
- Input validation & error handling

### Authorization
- Auth-protected pages
- Token verification middleware
- Session handling using JWT

---

## 🔹Technologies Used

### Frontend
- Next.js
- React
- Tailwind CSS

### Backend
- Node.js
- Express.js
- JWT Authentication
- Nodemailer (Email OTP)

### Database
- MongoDB (Mongoose)

---

##  🔹Project Structure  
```
SECURE-AUTH-APP/
├── client/
│   ├── next/
│   │   ├── app/
│   │   │   ├── admin/
│   │   │   ├── components/
│   │   │   ├── dashboard/
│   │   │   ├── forgot-password/
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   ├── reset-password/
│   │   │   ├── verify-email/
│   │   │   └── verify-reset-code/
│   │   ├── favicon.ico
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── context/
│   │   ├── node_modules/
│   │   ├── public/
│   │   ├── utils/
│   │   ├── .env.local
│   │   ├── eslint.config.mjs
│   │   ├── next-env.d.ts
│   │   ├── next.config.ts
│   │   ├── package-lock.json
│   │   ├── package.json
│   │   ├── postcss.config.mjs
│   │   ├── README.md
│   │   └── tsconfig.json
│   └── (other client files if any)
└── server/
    ├── config/
    │   ├── db.js
    │   └── passport.js
    ├── controllers/
    │   ├── adminController.js
    │   └── authController.js
    ├── middleware/
    │   └── authMiddleware.js
    ├── models/
    │   └── User.js
    ├── node_modules/
    ├── routes/
    │   ├── adminRoutes.js
    │   └── authRoutes.js
    ├── utils/
    │   ├── generateToken.js
    │   └── sendEmail.js
    ├── .env
    ├── index.js
    ├── package-lock.json
    ├── package.json
    ├── .gitignore
└── README.md
```
---

## 🔹Getting Started

### Clone the Repository
`git clone https://github.com/your-username/secure-auth-website.git`
`cd secure-auth-website`

### Backend Setup
`cd backend`
`npm install`
`npm start`

Create .env file:

```
PORT=5000
MONGO_URI= mongodb_url
JWT_SECRET=jwt_secret
JWT_EXPIRES=7d
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=ramvadai07@gmail.com
SMTP_PASS=password
FRONTEND_URL=http://localhost:3000
GOOGLE_CLIENT_ID= client id
GOOGLE_CLIENT_SECRET= code
GOOGLE_CALLBACK_URL=http://localhost:5000/api/google/callback
```
Backend runs at: `http://localhost:5000`

### Frontend Setup
`cd frontend`
`npm install`
`npm run dev`

Frontend runs at: `http://localhost:3000`

---

## 🔹Authentication Flow

1. User registers
2. OTP sent to email
3. User verifies account
4. Login allowed
5. JWT issued
6. Protected routes accessible
7. Password reset via email OTP

---

## 🔹Notes
- This is a practice project
- Email uses test or development SMTP
- No third-party OAuth integration
- Designed for learning authentication concepts

---
