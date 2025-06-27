from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename
import os
import uuid
from src.models.user import db
from src.models.post import Post

posts_bp = Blueprint('posts', __name__)

# Configurações de upload
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {
    'image': {'png', 'jpg', 'jpeg', 'gif', 'webp'},
    'audio': {'mp3', 'wav', 'ogg', 'm4a'},
    'video': {'mp4', 'webm', 'avi', 'mov'}
}

def allowed_file(filename, file_type):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS.get(file_type, set())

def save_file(file, file_type):
    if file and allowed_file(file.filename, file_type):
        # Criar diretório se não existir
        upload_path = os.path.join('src', 'static', UPLOAD_FOLDER, file_type)
        os.makedirs(upload_path, exist_ok=True)
        
        # Gerar nome único para o arquivo
        filename = secure_filename(file.filename)
        unique_filename = f"{uuid.uuid4()}_{filename}"
        file_path = os.path.join(upload_path, unique_filename)
        
        file.save(file_path)
        return f"/{UPLOAD_FOLDER}/{file_type}/{unique_filename}"
    return None

@posts_bp.route('/posts', methods=['GET'])
def get_posts():
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        category = request.args.get('category')
        
        query = Post.query.filter_by(published=True)
        
        if category:
            query = query.filter_by(category=category)
        
        posts = query.order_by(Post.created_at.desc()).paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        return jsonify({
            'posts': [post.to_dict() for post in posts.items],
            'total': posts.total,
            'pages': posts.pages,
            'current_page': page
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@posts_bp.route('/posts/<int:post_id>', methods=['GET'])
def get_post(post_id):
    try:
        post = Post.query.get_or_404(post_id)
        return jsonify(post.to_dict())
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@posts_bp.route('/posts', methods=['POST'])
def create_post():
    try:
        data = request.form.to_dict()
        
        # Validar campos obrigatórios
        if not data.get('title') or not data.get('content'):
            return jsonify({'error': 'Título e conteúdo são obrigatórios'}), 400
        
        # Criar novo post
        post = Post(
            title=data['title'],
            content=data['content'],
            summary=data.get('summary', ''),
            category=data.get('category', 'general'),
            tags=data.get('tags', ''),
            author=data.get('author', 'Admin')
        )
        
        # Processar uploads de arquivos
        if 'image' in request.files:
            image_url = save_file(request.files['image'], 'image')
            if image_url:
                post.image_url = image_url
        
        if 'audio' in request.files:
            audio_url = save_file(request.files['audio'], 'audio')
            if audio_url:
                post.audio_url = audio_url
        
        if 'video' in request.files:
            video_url = save_file(request.files['video'], 'video')
            if video_url:
                post.video_url = video_url
        
        db.session.add(post)
        db.session.commit()
        
        return jsonify(post.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@posts_bp.route('/posts/<int:post_id>', methods=['PUT'])
def update_post(post_id):
    try:
        post = Post.query.get_or_404(post_id)
        data = request.form.to_dict()
        
        # Atualizar campos
        if 'title' in data:
            post.title = data['title']
        if 'content' in data:
            post.content = data['content']
        if 'summary' in data:
            post.summary = data['summary']
        if 'category' in data:
            post.category = data['category']
        if 'tags' in data:
            post.tags = data['tags']
        if 'author' in data:
            post.author = data['author']
        
        # Processar novos uploads
        if 'image' in request.files:
            image_url = save_file(request.files['image'], 'image')
            if image_url:
                post.image_url = image_url
        
        if 'audio' in request.files:
            audio_url = save_file(request.files['audio'], 'audio')
            if audio_url:
                post.audio_url = audio_url
        
        if 'video' in request.files:
            video_url = save_file(request.files['video'], 'video')
            if video_url:
                post.video_url = video_url
        
        db.session.commit()
        return jsonify(post.to_dict())
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@posts_bp.route('/posts/<int:post_id>', methods=['DELETE'])
def delete_post(post_id):
    try:
        post = Post.query.get_or_404(post_id)
        db.session.delete(post)
        db.session.commit()
        return jsonify({'message': 'Post deletado com sucesso'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@posts_bp.route('/categories', methods=['GET'])
def get_categories():
    try:
        categories = db.session.query(Post.category).distinct().all()
        return jsonify([cat[0] for cat in categories])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

