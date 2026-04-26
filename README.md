# 🚀 Daily Standup Tool

A full-stack **MERN** team collaboration app to manage daily standups efficiently.  
Users can register/login, create or join teams, submit daily updates (**Yesterday, Today, Blockers**), and track team progress from a centralized dashboard.

---

## ✨ Features

- 🔐 **User Authentication (JWT)**
  - Secure registration and login
  - Protected routes for authenticated users

- 👥 **Team Management**
  - Create a team
  - Join an existing team using Team ID

- 📝 **Daily Standup Updates**
  - Submit:
    - Yesterday
    - Today
    - Blockers

- 📊 **Team Updates Feed**
  - View updates from users in the system/team context

- 🎨 **Dashboard UI**
  - Clean, modern interface with Tailwind CSS
  - Fast navigation and responsive layout

---

## 🛠️ Tech Stack

### Frontend
- React
- React Router
- Tailwind CSS
- Axios

### Backend
- Node.js
- Express.js

### Database
- MongoDB
- Mongoose

### Authentication
- JSON Web Tokens (JWT)

---

## 📁 Project Structure

```bash
daily-standup-tool/
├── backend/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── teamController.js
│   │   └── updateController.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Team.js
│   │   └── Update.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── teamRoutes.js
│   │   └── updateRoutes.js
│   ├── server.js
│   └── .env
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Login.js
    │   │   ├── Register.js
    │   │   ├── Dashboard.js
    │   │   ├── Sidebar.js
    │   │   └── ProtectedRoute.js
    │   ├── services/
    │   │   └── api.js
    │   ├── App.js
    │   └── index.js
    └── package.json
```

---

## ⚙️ Installation & Setup

## 1) Clone the repository

```bash
git clone https://github.com/<your-username>/daily-standup-tool.git
cd daily-standup-tool
```

## 2) Backend setup

```bash
cd backend
npm install
```

Create a `.env` file inside `backend/`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
CLIENT_URL=http://localhost:3000
```

Run backend server:

```bash
npm run dev
# or
node server.js
```

## 3) Frontend setup

Open a new terminal:

```bash
cd frontend
npm install
npm start
```

Frontend runs at: `http://localhost:3000`  
Backend runs at: `http://localhost:5000`

---

## 🔐 Environment Variables

Example (`backend/.env`):

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/daily-standup
JWT_SECRET=change_this_to_a_secure_secret
CLIENT_URL=http://localhost:3000
```

---

## 🌐 API Endpoints

> Base URL: `http://localhost:5000`

## Auth Routes (`/api/auth`)
- `POST /api/auth/register` → Register user
- `POST /api/auth/login` → Login user and get JWT

## Team Routes (`/api/team`)
- `POST /api/team/create` → Create a team (auth required)
- `POST /api/team/join` → Join team by teamId (auth required)
- `GET /api/team/my` → Get logged-in user teams (auth required)

## Update Routes (`/api/updates`)
- `POST /api/updates` → Submit daily update (auth required)
- `GET /api/updates` → Fetch updates list (auth required)

---

## 🔄 How the System Works

1. User registers or logs in.
2. Backend returns JWT token.
3. Frontend stores token in `localStorage`.
4. Axios interceptor attaches token to all protected API requests.
5. User can:
   - Create or join a team
   - Submit standup update
   - View updates in dashboard
6. Backend validates token via middleware and serves team/update data.

---

## 🧯 Common Errors & Fixes

## 1) 404 API Errors
**Issue:** `Cannot GET /api/...`  
**Fix:**
- Verify route mount path in `server.js`
- Match frontend endpoint with backend route exactly
- Restart backend after route changes

## 2) Token / Unauthorized Errors (401)
**Issue:** Protected routes fail  
**Fix:**
- Ensure token is stored after login
- Confirm Axios sends:
  `Authorization: Bearer <token>`
- Check JWT secret consistency in backend

## 3) Data Not Showing on UI
**Issue:** Teams/updates appear empty  
**Fix:**
- Verify API response in browser network tab
- Confirm MongoDB has data
- Check query logic in controllers
- Ensure user is authenticated and part of team

---

## 🚧 Future Improvements

- Team-specific update filtering
- Role-based access control (admin/member)
- Real-time updates using Socket.IO
- Email notifications/reminders
- Calendar view for standup history
- Export reports (CSV/PDF)
- Unit/integration tests (Jest + Supertest)

---

## 👩‍💻 Author

**Pushpa Sri Sindhu**

If you like this project, feel free to ⭐ the repository and contribute!
