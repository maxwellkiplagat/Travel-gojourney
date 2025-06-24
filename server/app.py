from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, jwt_required
from flask_cors import CORS
from config import Config

app = Flask(__name__)
CORS(app, supports_credentials=True, origins=["http://localhost:5173"]) 
app.config.from_object(Config)

db = SQLAlchemy(app)
migrate = Migrate(app, db)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)

# Models & Controllers
from models import *
from controllers.auth_controller import handle_signup, handle_login
from controllers.trip_controller import (
    get_all_trips, get_my_trips, create_trip,
    update_trip, delete_trip, like_trip_public
)

@app.route("/")
def home():
    return jsonify({"message": "GoJourney backend is running!"})

@app.route("/auth/signup", methods=["POST"])
def signup():
    return handle_signup(request)

@app.route("/auth/login", methods=["POST"])
def login():
    return handle_login(request)

