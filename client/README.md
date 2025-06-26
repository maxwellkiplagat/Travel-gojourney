# LinkUp Travel Platform

LinkUp is a fullstack travel experience sharing platform where users can:
- Share their travel adventures
- Discover hidden gems from around the world
- Like posts and interact with the travel community
- Securely sign up and log in
- Admins can manage and moderate content

---

## Tech Stack

### Frontend (React + Vite + Tailwind)
- React 19
- React Router DOM 7
- Axios
- Tailwind CSS
- Lucide React Icons
- Formik + Yup (forms + validation)
- JWT Decode (for auth)

### Backend (Flask + PostgreSQL)
- Flask
- Flask-SQLAlchemy
- Flask-Migrate
- Flask-JWT-Extended
- Marshmallow (for serialization)
- PostgreSQL (via SQLAlchemy)

---

## Installation & Setup

### Backend (Python 3.8+)
```bash
cd server
pip install -r requirements.txt
flask db upgrade
flask run
```

### Frontend
```bash
cd client
npm install
npm run dev
```

---

## Features
- JWT-based auth (sign up, login, logout, session check)
- Explore trips with like/unlike functionality
- Admin dashboard to manage trips & users
- Search trips by title or location
- CRUD for trips

---

## Folder Structure

```
LinkUp/
├── client/             # React Frontend
│   ├── src/
│   └── ...
├── server/             # Flask Backend
│   ├── models/
│   ├── controllers/
│   ├── routes/
│   └── ...
└── README.md
```

---

## Admin Actions
- View all trips
- Delete vulgar/flagged content
- View and delete user accounts

---