from app import db
from datetime import datetime

class Trip(db.Model):
    __tablename__ = 'trips'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String, nullable=False)
    description = db.Column(db.Text)
    location = db.Column(db.String)
    image_url = db.Column(db.String)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, onupdate=datetime.utcnow)

    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    likes = db.relationship('Like', backref='trip', cascade='all, delete')

class Like(db.Model):
    __tablename__ = 'likes'

    id = db.Column(db.Integer, primary_key=True)
    trip_id = db.Column(db.Integer, db.ForeignKey('trips.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True) 
    ip_address = db.Column(db.String, nullable=False)

    __table_args__ = (db.UniqueConstraint('trip_id', 'ip_address', name='unique_like_by_ip'),)