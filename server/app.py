import sys

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from dotenv import load_dotenv
load_dotenv()


from flask import Flask, jsonify, request, redirect
from flask_cors import CORS
from flask_dance.contrib.google import make_google_blueprint, google
from flask_jwt_extended import jwt_required, create_access_token

from extensions import db, migrate, bcrypt, jwt
from config import Config

import os
SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL")




app = Flask(__name__)
app.config.from_object(Config)

CORS(app, supports_credentials=True, origins=["http://localhost:5173"])
db.init_app(app)
migrate.init_app(app, db)
bcrypt.init_app(app)
jwt.init_app(app)

app.secret_key = os.environ.get("SECRET_KEY", "supersecret")
google_bp = make_google_blueprint(
    client_id=os.environ["GOOGLE_CLIENT_ID"],
    client_secret=os.environ["GOOGLE_CLIENT_SECRET"],
    redirect_to="google_login_callback",
    scope=["profile", "email"]
)
app.register_blueprint(google_bp, url_prefix="/login")

from models import *  
from controllers.auth_controller import handle_signup, handle_login, check_session
from controllers.trip_controller import (
    get_all_trips, get_my_trips, create_trip,
    update_trip, delete_trip, like_trip,
    get_all_users, delete_user,get_trip,update_trip_by_id,get_all_trips_admin,
    admin_delete_trip,flag_trip, unflag_trip
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

@app.route("/auth/check-session", methods=["GET"])
@jwt_required()
def check():
    return check_session()

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
    return jsonify({
        "token": access_token,
        "user": {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "is_admin": user.is_admin
        }
    }), 200

@app.route("/trips", methods=["GET"])
def trips():
    return get_all_trips()

@app.route("/admin/trips/<int:id>/flag", methods=["PUT"])
@jwt_required()
def admin_flag_trip(id):
    return flag_trip(id)

@app.route("/admin/trips/<int:id>/unflag", methods=["PUT"])
@jwt_required()
def admin_unflag_trip(id):
    from .controllers.trip_controller import unflag_trip
    return unflag_trip(id)



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
@jwt_required()
def like(trip_id):
    return like_trip(trip_id)

@app.route("/admin/users", methods=["GET"])
@jwt_required()
def admin_users():
    return get_all_users()

@app.route("/admin/users/<int:id>", methods=["DELETE"])
@jwt_required()
def admin_delete_user(id):
    return delete_user(id)

@app.route("/trips/<int:id>", methods=["GET"])
def trip_detail(id):
    return get_trip(id)

@app.route("/trips/<int:id>", methods=["PATCH"])
@jwt_required()
def trip_update(id):
    return update_trip_by_id(id)

@app.route("/admin/trips", methods=["GET"])
@jwt_required()
def admin_all_trips():
    return get_all_trips_admin()

@app.route("/admin/trips/<int:id>", methods=["DELETE"])
@jwt_required()
def admin_remove_trip(id):
    return admin_delete_trip(id)

if __name__ == "__main__":
    import os
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5555)))