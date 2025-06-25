from flask import Flask, jsonify, request, redirect
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, jwt_required, create_access_token, get_jwt_identity
from flask_cors import CORS
from flask_dance.contrib.google import make_google_blueprint, google
import os
from config import Config
from dotenv import load_dotenv

load_dotenv()
app = Flask(__name__)
CORS(app, supports_credentials=True, origins=["http://localhost:5173"])
app.config.from_object(Config)

db = SQLAlchemy(app)
migrate = Migrate(app, db)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)


app.secret_key = os.environ.get("FLASK_SECRET_KEY", "supersecret")
google_bp = make_google_blueprint(
    client_id=os.environ["GOOGLE_CLIENT_ID"],
    client_secret=os.environ["GOOGLE_CLIENT_SECRET"],
    redirect_to="google_login_callback",
    scope=["profile", "email"]
)
app.register_blueprint(google_bp, url_prefix="/login")

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

@app.route("/login/google/authorized")
def google_login_callback():
    if not google.authorized:
        return redirect("/login")  

    resp = google.get("/oauth2/v2/userinfo")
    user_info = resp.json()

    from models.user import User
    user = User.query.filter_by(email=user_info["email"]).first()

    if not user:
        user = User(
            username=user_info["name"],
            email=user_info["email"],
            google_id=user_info["id"]
        )
        db.session.add(user)
        db.session.commit()

    access_token = create_access_token(identity=user.id)
    return jsonify({"token": access_token, "user": user.username}), 200

@app.route("/trips", methods=["GET"])
def trips():
    return get_all_trips()

@app.route("/trips", methods=["POST"])
@jwt_required()
def create():
    return create_trip(request)

@app.route("/trips/<int:id>", methods=["PATCH"])
@jwt_required()
def update(id):
    return update_trip(id, request)

@app.route("/trips/<int:id>", methods=["DELETE"])
@jwt_required()
def delete(id):
    return delete_trip(id)

@app.route("/trips/my-posts", methods=["GET"])
@jwt_required()
def my_posts():
    return get_my_trips()

@app.route("/trips/<int:trip_id>/like", methods=["POST"])
def like(trip_id):
    return like_trip_public(trip_id)

if __name__ == "__main__":
    app.run(debug=True, port=5555)
