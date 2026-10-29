# PG Haven (PG Finder) 🏠

> A modern, full-stack platform designed to simplify Paying Guest (PG) accommodation discovery, room bookings, and property management for both tenants and PG owners.

---

## 🌟 Key Features

### 👤 For Tenants (Guests)
- **Smart Search & Filters**: Search listings across locations with filters for price range, occupancy type (single, double, triple, etc.), gender preference (male, female, unisex), and amenities (Wi-Fi, AC, Food, Power Backup, etc.).
- **Rich Media Gallery**: High-resolution image carousels and video walkthroughs with custom media player controls.
- **Side-by-Side Room Comparison**: Compare multiple PG options side by side on pricing, facilities, and rules.
- **Seamless Bookings**: Request room bookings directly and track reservation status.
- **My Stay & Rent Payment**: View current stay details, pay monthly rent via UPI/QR code, and upload payment screenshots for verification.

### 🏢 For PG Owners
- **Effortless Listing Management**: Create and edit property listings with multi-image and video uploads directly to Cloudinary.
- **Custom Payment QR Integration**: Upload property-specific UPI QR codes for streamlined rent collection.
- **Occupancy Management**: Manage tenant occupancies, track room availability, and handle check-ins.
- **Payment Verification**: Review submitted tenant rent payments, verify transaction proofs, and update payment statuses.

### 🔐 Authentication & Security
- **Dual Authentication**: Secure email/password authentication using bcrypt hashing and JWT tokens, alongside seamless **Google OAuth 2.0** single sign-on.
- **Role-Based Access Control (RBAC)**: Distinct user journeys and protected routes for Tenants and PG Owners.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/) built on [Radix UI primitives](https://www.radix-ui.com/)
- **State & Data Fetching**: [TanStack Query (React Query)](https://tanstack.com/query)
- **Routing**: [React Router v6](https://reactrouter.com/)
- **Icons & Media**: [Lucide React](https://lucide.dev/), [React Icons](https://react-icons.github.io/react-icons/), Swiper / Embla

### Backend
- **Runtime**: [Node.js](https://nodejs.org/) (>= 18)
- **Framework**: [Express.js](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) via [Mongoose ODM](https://mongoosejs.com/)
- **Authentication**: Passport.js (`passport-google-oauth20`), JSON Web Tokens (`jsonwebtoken`), `bcryptjs`
- **File Uploads & Media Storage**: [Multer](https://github.com/expressjs/multer) & [Cloudinary](https://cloudinary.com/) (`multer-storage-cloudinary`)

---

## 📁 Repository Structure

```text
pg-finder/
├── backend/
│   ├── config/             # Database, Cloudinary, and Passport configs
│   ├── controllers/        # Request handlers (authController, roomController)
│   ├── middleware/         # Auth & role verification middlewares
│   ├── models/             # Mongoose schemas (User, Room, Payment)
│   ├── routes/             # Express API routes (authRoutes, roomRoutes)
│   ├── uploads/            # Temporary local upload storage
│   ├── .env.example        # Backend environment variables template
│   ├── package.json        # Backend dependencies & scripts
│   └── server.js           # Server entry point & CORS configuration
│
├── frontend/
│   ├── public/             # Static public assets
│   ├── src/
│   │   ├── components/     # UI primitives & layout components (Header, Footer, etc.)
│   │   ├── config/         # API endpoint configurations
│   │   ├── context/        # React Context providers (AuthContext)
│   │   ├── data/           # Mock / fallback room data
│   │   ├── hooks/          # Custom React hooks
│   │   ├── pages/          # Application views (Index, Listings, RoomDetails, etc.)
│   │   ├── types/          # TypeScript interfaces & types
│   │   ├── App.tsx         # Main route definitions
│   │   └── main.tsx        # Application entry point
│   ├── .env.example        # Frontend environment variables template
│   ├── index.html          # HTML entry point
│   ├── package.json        # Frontend dependencies & scripts
│   ├── tailwind.config.ts  # Tailwind CSS theme configuration
│   └── vite.config.ts      # Vite dev server & build settings
│
├── .gitignore              # Root Git ignore rules
└── README.md               # Project documentation
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18.0.0 or higher)
- **npm** (or yarn / pnpm / bun)
- **MongoDB** instance (local or MongoDB Atlas connection string)
- **Cloudinary** account (for media uploads)

---

### 1. Clone the Repository

```bash
git clone https://github.com/Sanjeev-Chakaravarthy/PG-Finder.git
cd PG-Finder
```

---

### 2. Configure Environment Variables

#### Backend Configuration
Navigate to the `backend/` directory and create a `.env` file based on `.env.example`:

```bash
cd backend
cp .env.example .env
```

Update `.env` with your credentials:
```env
PORT=5001
NODE_ENV=development
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
FRONTEND_URL=http://localhost:8080

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5001/api/auth/google/callback

# Cloudinary
CLOUDINARY_NAME=your_cloudinary_cloud_name
CLOUDINARY_KEY=your_cloudinary_api_key
CLOUDINARY_SECRET=your_cloudinary_api_secret
```

#### Frontend Configuration
Navigate to the `frontend/` directory and configure the environment:

```bash
cd ../frontend
cp .env.example .env
```

Set the backend API URL:
```env
VITE_API_BASE_URL=http://localhost:5001
```

---

### 3. Install Dependencies & Run

#### Run the Backend Server
```bash
cd backend
npm install
npm run dev
```
The backend server will start at `http://localhost:5001`.

#### Run the Frontend Application
In a separate terminal:
```bash
cd frontend
npm install
npm run dev
```
The frontend dev server will launch at `http://localhost:8080`.

---

## 📡 API Overview

### Authentication (`/api/auth`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/api/auth/signup` | Register a new user | Public |
| `POST` | `/api/auth/login` | Log in with email & password | Public |
| `GET` | `/api/auth/me` | Fetch authenticated user profile | Protected |
| `GET` | `/api/auth/google` | Initiate Google OAuth sign-in | Public |
| `GET` | `/api/auth/google/callback` | Google OAuth callback URL | Public |

### Listings & Rooms (`/api/rooms`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/rooms` | Get all room listings (with filter query params) | Public |
| `GET` | `/api/rooms/:id` | Get specific room details by ID | Public |
| `GET` | `/api/rooms/my-stay` | Get user's active bookings / stay | Tenant |
| `GET` | `/api/rooms/payments` | Get user's payment records | Tenant |
| `POST` | `/api/rooms/book/:id` | Request booking for a room | Tenant |
| `POST` | `/api/rooms/cancel/:id` | Cancel a booking request | Tenant |
| `POST` | `/api/rooms/pay-rent` | Submit monthly rent payment & screenshot | Tenant |
| `GET` | `/api/rooms/my-listings` | Get all rooms owned by logged-in owner | Owner |
| `POST` | `/api/rooms` | Create a new room listing (media & QR upload) | Owner |
| `PUT` | `/api/rooms/:id` | Update an existing room listing | Owner |
| `DELETE` | `/api/rooms/:id` | Delete a room listing | Owner |
| `POST` | `/api/rooms/occupy/:id` | Confirm tenant occupancy | Owner |
| `GET` | `/api/rooms/owner/payments` | Get rent payments for owner's properties | Owner |
| `PATCH` | `/api/rooms/owner/verify-payment/:id` | Verify or reject a rent payment | Owner |

---

## 🚢 Deployment

- **Backend**: Can be deployed to services like [Render](https://render.com/), Railway, or AWS. Ensure the environment variables (including `FRONTEND_URL` and `NODE_ENV=production`) are configured in the host dashboard.
- **Frontend**: Optimized for deployment on [Vercel](https://vercel.com/) or Netlify. Set the `VITE_API_BASE_URL` environment variable to your production backend URL.

---

## 📄 License

This project is licensed under the [ISC License](LICENSE).
