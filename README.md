# Fraud Scan

A comprehensive fraud reporting, verification, and intelligence platform helping businesses identify and prevent fraudulent activities.

## Features

- **Fraud Reporting**: Submit detailed fraud reports with evidence
- **Database Search**: Search verified fraud database with fuzzy matching
- **Enterprise Solutions**: API access and bulk verification services
- **Role-based Access**: Individual, enterprise, and admin user roles
- **Payment Integration**: Stripe integration for subscriptions
- **Email Notifications**: Automated alerts and notifications

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS 4
- **Backend**: Next.js API routes, MongoDB, Mongoose
- **Authentication**: JWT-based auth with role-based access control
- **Payments**: Stripe integration
- **File Storage**: Vercel Blob
- **Email**: Nodemailer with custom templates
- **Security**: reCAPTCHA, bcrypt password hashing

## Getting Started

First, install dependencies:

```bash
npm install
```

Set up environment variables:

```bash
cp .env.example .env.local
```

Configure the following environment variables:
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret for JWT token signing
- `STRIPE_SECRET_KEY`: Stripe secret key
- `NODEMAILER_USER`: Email service credentials
- `RECAPTCHA_SECRET_KEY`: reCAPTCHA secret key

Run the development server:

```bash
npm run dev
```

Open [https://fraudscans.com](https://fraudscans.com) to see the application.

## Deployment

The application is deployed on Vercel at [https://fraudscans.com](https://fraudscans.com).

## License

This project is released into the public domain under the Unlicense.
