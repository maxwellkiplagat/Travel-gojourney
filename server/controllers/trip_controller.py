from flask import jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from models.trip import Trip, Like
from models.user import User

def get_all_trips():
    trips = Trip.query.all()
    return jsonify([{
        "id": t.id,
        "title": t.title,
        "description": t.description,
        "location": t.location,
        "image_url": t.image_url,
        "likes": len(t.likes),
        "author": t.author.username
    } for t in trips]), 200

@jwt_required()
def get_my_trips():
    user_id = get_jwt_identity()
    trips = Trip.query.filter_by(user_id=user_id).all()
    return jsonify([
        {
            "id": t.id,
            "title": t.title,
            "description": t.description,
            "location": t.location,
            "image_url": t.image_url,
        }
        for t in trips
    ]), 200

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


def like_trip_public(trip_id):
    ip_address = request.remote_addr
    trip = Trip.query.get_or_404(trip_id)

    existing = Like.query.filter_by(trip_id=trip.id, ip_address=ip_address).first()
    if existing:
        return jsonify({"message": "You have already liked this trip."}), 400

    new_like = Like(trip_id=trip.id, ip_address=ip_address)
    db.session.add(new_like)
    db.session.commit()

    return jsonify({"message": "Trip liked!"}), 201