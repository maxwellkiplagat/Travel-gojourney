from ..extensions import db, bcrypt

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, unique=True, nullable=False)
    email = db.Column(db.String, unique=True, nullable=False)
    password_hash = db.Column(db.String, nullable=True)
    google_id = db.Column(db.String, unique=True, nullable=True)
    is_admin = db.Column(db.Boolean, default=False)

    trips = db.relationship('Trip', backref='author', cascade='all, delete')
    likes = db.relationship('Like', backref='user', cascade='all, delete')

    def set_password(self, password):
        self.password_hash = bcrypt.generate_password_hash(password).decode('utf-8')

    def check_password(self, password):
        if self.password_hash:
            return bcrypt.check_password_hash(self.password_hash, password)
        return False  