"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
import os
from flask import Flask, request, jsonify, url_for, send_from_directory
from flask_migrate import Migrate
from flask_swagger import swagger
from api.utils import APIException, generate_sitemap
from api.models import db, User, UserAdmin, Appointment, Employee, Customer, CustomerFav, Services, Notifications
from api.routes import api
from api.admin import setup_admin
from api.commands import setup_commands



from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
from flask_jwt_extended import JWTManager
from flask_bcrypt import Bcrypt


# from models import Person

ENV = "development" if os.getenv("FLASK_DEBUG") == "1" else "production"
static_file_dir = os.path.join(os.path.dirname(
    os.path.realpath(__file__)), '../public/')

app = Flask(__name__)

app.url_map.strict_slashes = False

#setup de JWT
app.config["JWT_SECRET_KEY"] = os.getenv("JWT-KEY")  # Change this!
jwt = JWTManager(app)
#instanciar bcrypt
bcrypt = Bcrypt(app)

# database condiguration
db_url = os.getenv("DATABASE_URL")
if db_url is not None:
    app.config['SQLALCHEMY_DATABASE_URI'] = db_url.replace(
        "postgres://", "postgresql://")
else:
    app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:////tmp/test.db"

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
MIGRATE = Migrate(app, db, compare_type=True)
db.init_app(app)

# add the admin
setup_admin(app)

# add the admin
setup_commands(app)

# Add all endpoints form the API with a "api" prefix
app.register_blueprint(api, url_prefix='/api')

# Handle/serialize errors like a JSON object


@app.errorhandler(APIException)
def handle_invalid_usage(error):
    return jsonify(error.to_dict()), error.status_code

# generate sitemap with all your endpoints


@app.route('/')
def sitemap():
    if ENV == "development":
        return generate_sitemap(app)
    return send_from_directory(static_file_dir, 'index.html')

# any other endpoint will try to serve it like a static file


@app.route('/<path:path>', methods=['GET'])
def serve_any_other_file(path):
    if not os.path.isfile(os.path.join(static_file_dir, path)):
        path = 'index.html'
    response = send_from_directory(static_file_dir, path)
    response.cache_control.max_age = 0  # avoid cache memory
    return response


@app.route('/api/users', methods=['GET'])
def users():
    users = User.query.all()
    users_serialized = [user.serialize() for user in users]
    return jsonify(users_serialized)

@app.route('/api/login', methods=['POST'])
def login():
    body = request.get_json(silent=True)
    if body is None:             
        return jsonify({'Msg: Debes enviar los siguientes campos:':
                        {
                        'email':'requerido',
                        'password':'requerido'
                        }}), 400

    # Verificar que solo se envíen los campos 'email' y 'password'
    allowed_keys = {'email', 'password'}
    if not allowed_keys.issuperset(body.keys()):
        return jsonify({'msg': 'Solo se permiten los campos email y password'}), 400

    if 'email' not in body:
       return jsonify({'msg':'Debes enviar el campo email'}), 400
    if 'password' not in body:
       return jsonify({'msg':'Debes enviar el campo password'}), 400

    user = User.query.filter_by(email=body['email']).first()
    if user is None:
        return jsonify({'msg':'Email o contraseña incorrecta'}), 400

    password_db = bcrypt.check_password_hash(user.password, body['password'])
    if not password_db:
       return jsonify({'msg':'Email o contraseña incorrecta'}), 400

    access_token = create_access_token(identity=user.email)
    return jsonify({
       'Msg':'Todos los datos están ok',
       'jwt_token': access_token
    }), 200

#Customer
@app.route('/api/customer_register', methods=['POST'])
def customer_register():
    return 'ok para register'

@app.route('/api/customer_update', methods=['PUT'])
def customer_update():
    return 'ok para update'


@app.route('/api/customer_delete', methods=['PUT'])
def customer_delete():
    return 'ok para delete se usa para desactivar el customer'

# this only runs if `$ python src/main.py` is executed
if __name__ == '__main__':
    PORT = int(os.environ.get('PORT', 3001))
    app.run(host='0.0.0.0', port=PORT, debug=True)
