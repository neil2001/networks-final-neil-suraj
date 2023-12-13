from flask import Flask, render_template, request, jsonify, send_from_directory
import os
from werkzeug.utils import secure_filename
import random

from backend.generate import make_text_features, get_meme_caption
from backend.image import add_caption

app = Flask(__name__)

cached_text_features = make_text_features()

# Set the upload folder
UPLOAD_FOLDER = 'uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Ensure the upload folder exists
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Set allowed file extensions
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route("/")
def index():
    print("hello")
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload():
    if 'photo' not in request.files:
        return jsonify({'message': 'No file part'}), 400

    file = request.files['photo']

    if file.filename == '':
        return jsonify({'message': 'No selected file'}), 400

    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)

        image_link = '/uploads/' + filename

        caption = get_meme_caption(1, filepath, cached_text_features)
        return jsonify({'message': 'Upload successful!', 'caption': caption, 'image_link': image_link})

    return jsonify({'message': 'Invalid file format. Allowed formats: png, jpg, jpeg, gif'}), 400

@app.route('/regenerate')
def regenerate():
    filepath = request.args.get('filename')[1:]
    random_number = random.randint(1, 10)
    caption = get_meme_caption(random_number, filepath, cached_text_features)
    return jsonify({'message': 'Upload successful!', 'caption': caption})

@app.route('/makeImage')
def makeImage():
    filepath = request.args.get('filename')[1:]
    filename = os.path.basename(filepath)

    caption = request.args.get('caption')
    add_caption(filepath, caption, 'output/' + filename)

    try: 
        return send_from_directory('output', filename)
    except FileNotFoundError:
        return jsonify({"error": "Image not found"})
    
if __name__ == '__main__':
    app.run(debug=True)
