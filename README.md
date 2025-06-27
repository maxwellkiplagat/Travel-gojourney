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
- Clone the repo
```bash
git clone https://github.com/carly-cracker/GoJourney.git
```

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
	
4:58 PM







client/
├── public/
│   └── index.html
├── src/
│   ├── api/
│   │   └── axios.js
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── PostCard.jsx
│   │   └── ProtectedRoute.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Dashboard.jsx        
│   │   ├── NewPost.jsx
│   │   ├── EditPost.jsx
│   │   ├── PostDetail.jsx
│   │   └── AdminDashboard.jsx    
│   ├── index.css                
│   ├── App.jsx
│   └── main.jsx
├── .env                         
├── postcss.config.js
├── tailwind.config.js
├── vite.config.js
└── README.md
├── server/                        # Flask backend
│   ├── models/
│   │   ├── init.py
│   │   ├── user.py
│   │   ├── trip.py
│   │   └── like.py
│   ├── controllers/
│   │   ├── init.py
│   │   ├── auth_controller.py
│   │   └── trip_controller.py
│   ├── migrations/                
│   ├── .env                       
│   ├── app.py                     
│   ├── config.py                  
│   ├── requirements.txt
│
├── .gitignore
├── README.md


```

---

## Admin Actions
- View all trips
- Delete vulgar/flagged content
- View and delete user accounts

## Promoting user to admin (psql CLI)
- `psql -h localhost -U postgres -d LinkUp`
- `SELECT * FROM users;`
```sql
UPDATE users SET is_admin = true WHERE username = 'admin';
```
## Future Features
- User profiles
- User profile pictures
- User profile settings
- User profile notifications
---
####
- built with enthusiasm by Cliff, Deborah, Maxwell and Carlos