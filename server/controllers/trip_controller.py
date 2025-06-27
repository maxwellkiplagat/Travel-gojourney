from flask import jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from models.trip import Trip, Like
from models.user import User

def get_all_trips():
    try:
        verify_jwt_in_request(optional=True)
        user_id = get_jwt_identity()
    except Exception:
        user_id = None

    trips = Trip.query.order_by(Trip.created_at.desc()).all()

    return jsonify([{
        "id": t.id,
        "title": t.title,
        "description": t.description,
        "location": t.location,
        "image_url": t.image_url,
        "created_at": t.created_at.isoformat(),
        "like_count": len(t.likes),
        "author_id": t.user_id,
        "author_username": t.author.username,
        "is_liked": any(l.user_id == user_id for l in t.likes) if user_id else False
    } for t in trips]), 200
@jwt_required()
def get_my_trips():
    user_id = get_jwt_identity()
    trips = Trip.query.filter_by(user_id=user_id).all()
    return jsonify([{
        "id": t.id,
        "title": t.title,
        "description": t.description,
        "location": t.location,
        "image_url": t.image_url,
        "created_at": t.created_at.isoformat(),
        "like_count": len(t.likes)
    } for t in trips]), 200

@jwt_required()
def create_trip(req):
    data = req.get_json()
    user_id = get_jwt_identity()
    trip = Trip(
        title=data.get("title"),
        description=data.get("description"),
        location=data.get("location"),
        image_url=data.get("image_url"),
        user_id=user_id
    )
    db.session.add(trip)
    db.session.commit()
    return jsonify({"message": "Trip created", "id": trip.id}), 201

@jwt_required()
def update_trip(id, req):
    data = req.get_json()
    user_id = get_jwt_identity()
    trip = Trip.query.get_or_404(id)
    if trip.user_id != user_id:
        return jsonify({"error": "Unauthorized"}), 403

    trip.title = data.get("title", trip.title)
    trip.description = data.get("description", trip.description)
    trip.location = data.get("location", trip.location)
    trip.image_url = data.get("image_url", trip.image_url)
    db.session.commit()
    return jsonify({"message": "Trip updated"}), 200

@jwt_required()
def delete_trip(id):
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    trip = Trip.query.get_or_404(id)
    if not user.is_admin and trip.user_id != user_id:
        return jsonify({"error": "Unauthorized"}), 403

    db.session.delete(trip)
    db.session.commit()
    return jsonify({"message": "Trip deleted"}), 200

@jwt_required()
def like_trip(trip_id):
    user_id = get_jwt_identity()
    trip = Trip.query.get_or_404(trip_id)

    existing_like = Like.query.filter_by(trip_id=trip.id, user_id=user_id).first()
    if existing_like:
        db.session.delete(existing_like)
        db.session.commit()
        return jsonify({
            "message": "Unliked",
            "liked": False,
            "like_count": len(trip.likes)
        }), 200

    new_like = Like(trip_id=trip.id, user_id=user_id)
    db.session.add(new_like)
    db.session.commit()
    return jsonify({
        "message": "Liked",
        "liked": True,
        "like_count": len(trip.likes)
    }), 201
@jwt_required()
def get_all_users():
    user_id = get_jwt_identity()
    requester = User.query.get(user_id)
    if not requester or not requester.is_admin:
        return jsonify({"error": "Unauthorized"}), 403

    users = User.query.all()
    return jsonify([{
        "id": u.id,
        "username": u.username,
        "email": u.email,
        "is_admin": u.is_admin
    } for u in users]), 200

@jwt_required()
def delete_user(id):
    requester_id = get_jwt_identity()
    requester = User.query.get(requester_id)
    if not requester or not requester.is_admin:
        return jsonify({"error": "Unauthorized"}), 403

    user = User.query.get_or_404(id)
    db.session.delete(user)
    db.session.commit()
    return jsonify({"message": "User deleted"}), 200

def get_trip(id):
    trip = Trip.query.get(id)
    if not trip:
        return jsonify({"error": "Trip not found"}), 404

    return jsonify({
        "id": trip.id,
        "title": trip.title,
        "location": trip.location,
        "description": trip.description,
        "image_url": trip.image_url,
        "likes": len(trip.likes),
        "author": {
            "id": trip.author.id,
            "username": trip.author.username
        }
    }), 200

@jwt_required()
def update_trip_by_id(id):
    user_id = get_jwt_identity()
    trip = Trip.query.get(id)

    if not trip:
        return jsonify({"error": "Trip not found"}), 404

    if trip.user_id != user_id:
        return jsonify({"error": "Unauthorized"}), 403

    data = request.get_json()
    trip.title = data.get("title", trip.title)
    trip.location = data.get("location", trip.location)
    trip.description = data.get("description", trip.description)
    trip.image_url = data.get("image_url", trip.image_url)

    db.session.commit()

    return jsonify({
        "message": "Trip updated successfully",
        "trip": {
            "id": trip.id,
            "title": trip.title,
            "location": trip.location,
            "description": trip.description,
            "image_url": trip.image_url
        }
    }), 200

@jwt_required()
def admin_delete_trip(id):
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if not user or not user.is_admin:
        return jsonify({"error": "Unauthorized"}), 403

    trip = Trip.query.get_or_404(id)
    db.session.delete(trip)
    db.session.commit()
    return jsonify({"message": "Trip deleted by admin"}), 200

@jwt_required()
def get_all_trips_admin():
    user_id = get_jwt_identity()
    admin = User.query.get(user_id)

    if not admin or not admin.is_admin:
        return jsonify({"error": "Unauthorized"}), 403

    trips = Trip.query.order_by(Trip.created_at.desc()).all()
    return jsonify([{
        "id": t.id,
        "title": t.title,
        "location": t.location,
        "description": t.description,
        "image_url": t.image_url,
        "created_at": t.created_at.isoformat(),
        "author_id": t.user_id,
        "author_username": t.author.username,
        "likes": len(t.likes)
    } for t in trips]), 200

@jwt_required()
def get_all_trips_admin():
    user_id = get_jwt_identity()
    admin = User.query.get(user_id)

    if not admin or not admin.is_admin:
        return jsonify({"error": "Unauthorized"}), 403

    trips = Trip.query.order_by(Trip.created_at.desc()).all()
    return jsonify([{
        "id": t.id,
        "title": t.title,
        "location": t.location,
        "description": t.description,
        "image_url": t.image_url,
        "created_at": t.created_at.isoformat(),
        "author_id": t.user_id,
        "author_username": t.author.username,
        "likes": len(t.likes)
    } for t in trips]), 200