from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from src.models.user import db

class Post(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    content = db.Column(db.Text, nullable=False)
    summary = db.Column(db.String(500), nullable=True)
    category = db.Column(db.String(50), nullable=False, default='general')
    tags = db.Column(db.String(200), nullable=True)
    author = db.Column(db.String(100), nullable=False, default='Admin')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    published = db.Column(db.Boolean, default=True)
    
    # Campos para arquivos de mídia
    image_url = db.Column(db.String(500), nullable=True)
    audio_url = db.Column(db.String(500), nullable=True)
    video_url = db.Column(db.String(500), nullable=True)

    def __repr__(self):
        return f'<Post {self.title}>'

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'content': self.content,
            'summary': self.summary,
            'category': self.category,
            'tags': self.tags.split(',') if self.tags else [],
            'author': self.author,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'published': self.published,
            'image_url': self.image_url,
            'audio_url': self.audio_url,
            'video_url': self.video_url
        }

