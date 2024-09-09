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
import datetime

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
# sirve para que inicien los clientes y los empleados.
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

# Paso 1: Solicitar restablecimiento de contraseña
# El cliente solicita restablecer su contraseña proporcionando su email. Se genera un token de restablecimiento y se envía un enlace al email del cliente.

# Código para solicitar restablecimiento de contraseña
@app.route('/api/request_password_reset', methods=['POST'])
def request_password_reset():
    body = request.get_json(silent=True)
    if body is None or 'email' not in body:
        return jsonify({'msg':'Debes enviar el campo email'}), 400

    user = User.query.filter_by(email=body['email']).first()
    if not user:
        return jsonify({'msg':'El email no está registrado'}), 404

    # Generar un token de restablecimiento de contraseña
    expires = datetime.timedelta(hours=1)
    reset_token = create_access_token(identity=user.email, expires_delta=expires)

    # Enviar el token al email del usuario (aquí solo se muestra el token)
    # En un entorno real, deberías enviar un email con un enlace que contenga el token
    return jsonify({
        'msg': 'Se ha enviado un enlace de restablecimiento de contraseña a tu email',
        'reset_token': reset_token
    }), 200

# Paso 2: Restablecer la contraseña
# El cliente usa el enlace con el token para acceder a la página de restablecimiento de contraseña y proporcionar una nueva contraseña.

# Código para restablecer la contraseña
@app.route('/api/reset_password', methods=['POST'])
@jwt_required()
def reset_password():
    body = request.get_json(silent=True)
    if body is None or 'new_password' not in body:
        return jsonify({'msg':'Debes enviar el campo new_password'}), 400

    # Obtener la identidad del usuario desde el token JWT
    current_user_email = get_jwt_identity()

    # Buscar al usuario usando el email del token
    user = User.query.filter_by(email=current_user_email).first()
    if not user:
        return jsonify({'msg':'Usuario no existe'}), 404

    # Actualizar la contraseña
    pw_hash = bcrypt.generate_password_hash(body['new_password']).decode('utf-8')
    user.password = pw_hash
    db.session.commit()

    return jsonify({
        'msg': '¡Tu contraseña ha sido restablecida!'
    }), 200

#Employee & admin

# la idea de esta ruta es para que el primer usuario que se registre se haga con esta y sera empleado admin
# lo que le permite registrar a otros empleados y hacerlos admin tambien 
@app.route('/api/register_first_admin', methods=['POST'])
def register_first_admin():
    body = request.get_json(silent=True)
    if body is None:
       return jsonify({'msg':'Debes enviar los siguientes campos:',
                       'campos':{
                           'name' :'requerido',
                           'last_name': 'requerido',
                           'email':'requerido',
                           'password':'requerido',
                           'phone': 'requerido'
                       }}), 400
    if 'name' not in body:
       return jsonify({'msg':'Debes enviar el campo name'}), 400
    if 'last_name' not in body:
       return jsonify({'msg':'Debes enviar el campo last_name'}), 400
    if 'email' not in body:
       return jsonify({'msg':'Debes enviar el campo email'}), 400
    if 'password' not in body:
       return jsonify({'msg':'Debes enviar el campo password'}), 400
    if 'phone' not in body:
       return jsonify({'msg':'Debes enviar el campo phone'}), 400

    # Crear el usuario en la tabla User
    pw_hash = bcrypt.generate_password_hash(body['password']).decode('utf-8')
    new_user = User(
        email=body['email'],
        password=pw_hash
    )
    db.session.add(new_user)
    db.session.commit()

    # Crear el empleado en la tabla Employee
    new_employee = Employee(
        user_id=new_user.id,
        name=body['name'],
        last_name=body['last_name'],
        email=body['email'],
        password=pw_hash,
        phone=body['phone'],
        is_active=True,
        admin_is_active=True  # El primer usuario es administrador
    )
    db.session.add(new_employee)
    db.session.commit()

    # Crear un registro en la tabla UserAdmin
    new_admin = UserAdmin(
        employe_id=new_employee.id,
        is_active=True
    )
    db.session.add(new_admin)
    db.session.commit()

    access_token = create_access_token(identity=new_user.email)
    return jsonify({
       'Msg':'¡El primer administrador ha sido creado!',
       'jwt_token': access_token
    }), 201


# para registrar un empleado solo lo puede hacer un empleado administrador
@app.route('/api/register_employee', methods=['POST'])
@jwt_required()
def register_employee():
    current_user_email = get_jwt_identity()
    current_user = User.query.filter_by(email=current_user_email).first()
    current_employee = Employee.query.filter_by(user_id=current_user.id).first()

    if not current_employee.admin_is_active:
        return jsonify({'msg':'No tienes permisos para realizar esta acción'}), 403

    body = request.get_json(silent=True)
    if body is None:
       return jsonify({'msg':'Debes enviar los siguientes campos:',
                       'campos':{
                           'name' :'requerido',
                           'last_name': 'requerido',
                           'email':'requerido',
                           'password':'requerido',
                           'phone': 'requerido',
                           'date_of_birth': 'requerido',
                           'address': 'requerido',
                           'hire_date': 'requerido',
                           'job_position': 'requerido',
                           'salary': 'requerido'
                       }}), 400
    if 'name' not in body:
       return jsonify({'msg':'Debes enviar el campo name'}), 400
    if 'last_name' not in body:
       return jsonify({'msg':'Debes enviar el campo last_name'}), 400
    if 'email' not in body:
       return jsonify({'msg':'Debes enviar el campo email'}), 400
    if 'password' not in body:
       return jsonify({'msg':'Debes enviar el campo password'}), 400
    if 'phone' not in body:
       return jsonify({'msg':'Debes enviar el campo phone'}), 400
    if 'date_of_birth' not in body:
       return jsonify({'msg':'Debes enviar el campo date_of_birth'}), 400
    if 'address' not in body:
       return jsonify({'msg':'Debes enviar el campo address'}), 400
    if 'hire_date' not in body:
       return jsonify({'msg':'Debes enviar el campo hire_date'}), 400
    if 'job_position' not in body:
       return jsonify({'msg':'Debes enviar el campo job_position'}), 400
    if 'salary' not in body:
       return jsonify({'msg':'Debes enviar el campo salary'}), 400

    # Verificar si el email ya está registrado
    existing_employee = Employee.query.filter_by(email=body['email']).first()
    if existing_employee:
        return jsonify({'msg':'El email ya está registrado como empleado.'}), 400

    # Crear el usuario en la tabla User
    pw_hash = bcrypt.generate_password_hash(body['password']).decode('utf-8')
    new_user = User(
        email=body['email'],
        password=pw_hash
    )
    db.session.add(new_user)
    db.session.commit()

    # Crear el empleado en la tabla Employee
    new_employee = Employee(
        user_id=new_user.id,
        name=body['name'],
        last_name=body['last_name'],
        email=body['email'],
        password=pw_hash,
        phone=body['phone'],
        date_of_birth=body['date_of_birth'],
        address=body['address'],
        hire_date=body['hire_date'],
        job_position=body['job_position'],
        salary=body['salary'],
        is_active=True,
        admin_is_active=False  # Por defecto, el empleado no es administrador
    )
    db.session.add(new_employee)
    db.session.commit()

    access_token = create_access_token(identity=new_user.email)
    return jsonify({
       'Msg':'¡El empleado ha sido creado!',
       'jwt_token': access_token
    }), 201

#para modificar o actualizar los datos un empleado
@app.route('/api/update_employee', methods=['PUT'])
@jwt_required()
def update_employee():
    body = request.get_json(silent=True)
    if body is None:
       return jsonify({'msg':'Debes enviar cualquiera de los siguientes campos para actualizar:',
                       'campos':{
                           'email':'requerido',
                           'update_name' :'opcional',
                           'update_last_name': 'opcional',
                           'update_email':'opcional',
                           'update_password':'opcional',
                           'update_phone': 'opcional',
                           'update_address': 'opcional',
                           'update_job_position': 'opcional',
                           'update_salary': 'opcional'
                       }}), 400

    current_user_email = get_jwt_identity()
    employee_update = Employee.query.filter_by(email=body.get('email')).first()
    if not employee_update:
        return jsonify({'msg':'Empleado no existe o el email está mal',
                        'campos':{
                           'email':'requerido',
                           'update_name' :'opcional',
                           'update_last_name': 'opcional',
                           'update_email':'opcional',
                           'update_password':'opcional',
                           'update_phone': 'opcional',
                           'update_address': 'opcional',
                           'update_job_position': 'opcional',
                           'update_salary': 'opcional'
                       }}), 404

    current_user = User.query.filter_by(email=current_user_email).first()
    current_employee = Employee.query.filter_by(user_id=current_user.id).first()
    # Verificar si el usuario actual es el mismo que el empleado o un administrador
    if current_user_email != employee_update.email and not current_employee.admin_is_active:
        return jsonify({'msg':'No tienes permiso para actualizar este empleado'}), 403

    # Actualizar los campos del empleado
    if 'update_name' in body:
        employee_update.name = body['update_name']
    if 'update_last_name' in body:
        employee_update.last_name = body['update_last_name']
    if 'update_email' in body:
        employee_update.email = body['update_email']
    if 'update_password' in body:
        pw_hash = bcrypt.generate_password_hash(body['update_password']).decode('utf-8')
        employee_update.password = pw_hash
    if 'update_phone' in body:
        employee_update.phone = body['update_phone']
    if 'update_address' in body:
        employee_update.address = body['update_address']
    if 'update_job_position' in body:
        employee_update.job_position = body['update_job_position']
    if 'update_salary' in body:
        employee_update.salary = body['update_salary']
    
    db.session.commit()

    # Actualizar los campos del usuario en la tabla User
    user_update = User.query.filter_by(id=employee_update.user_id).first()
    if 'update_email' in body:
        user_update.email = body['update_email']
    if 'update_password' in body:
        user_update.password = pw_hash
    
    db.session.commit()
    
    # Crear un nuevo token para identificar al usuario con el nuevo email
    access_token = create_access_token(identity=user_update.email)
    return jsonify({
       'Msg':'¡Tu usuario ha sido actualizado!',
       'jwt_token': access_token
    }), 200


#convertir un empleado a administrados (solo lo puede hacer admin otro admin)
@app.route('/api/make_admin', methods=['PUT'])
@jwt_required()
def make_admin():
    current_user_email = get_jwt_identity()
    current_user = User.query.filter_by(email=current_user_email).first()
    current_employee = Employee.query.filter_by(user_id=current_user.id).first()

    if not current_employee.admin_is_active:
        return jsonify({'msg':'No tienes permisos para realizar esta acción'}), 403

    body = request.get_json(silent=True)
    if body is None or 'email' not in body:
        return jsonify({'msg':'Debes enviar el campo email'}), 400

    # Buscar al empleado usando el email proporcionado
    employee = Employee.query.filter_by(email=body['email']).first()
    if not employee:
        return jsonify({'msg':'Empleado no encontrado'}), 404

    # Convertir al empleado en administrador
    employee.admin_is_active = True

    # Crear un registro en la tabla UserAdmin
    new_admin = UserAdmin(
        employe_id=employee.id,
        is_active=True
    )
    db.session.add(new_admin)
    db.session.commit()

    return jsonify({
        'msg': '¡El empleado ha sido convertido en administrador!'
    }), 200

#para desactivar a un empleado, solo puede ser desactivado por un admin
@app.route('/api/deactivate_employee', methods=['PUT'])
@jwt_required()
def deactivate_employee():
    body = request.get_json(silent=True)
    if body is None:
       return jsonify({'msg':'Debes enviar el campo email para desactivar el empleado:',
                       'campos':{
                           'email':'requerido'
                       }}), 400

    current_user_email = get_jwt_identity()
    current_user = User.query.filter_by(email=current_user_email).first()
    current_employee = Employee.query.filter_by(user_id=current_user.id).first()

    # Verificar si el usuario actual es un administrador
    if not current_employee.admin_is_active:
        return jsonify({'msg':'No tienes permisos para realizar esta acción'}), 403

    employee_deactivate = Employee.query.filter_by(email=body.get('email')).first()
    if not employee_deactivate:
        return jsonify({'msg':'Empleado no existe o el email está mal',
                        'campos':{
                           'email':'requerido'
                       }}), 404

    # Desactivar el empleado
    employee_deactivate.is_active = False

    user_deactivate = User.query.filter_by(id=employee_deactivate.user_id).first()
    user_deactivate.is_active = False
    db.session.commit()

    return jsonify({
       'Msg':'¡El empleado ha sido desactivado!'
    }), 200


#Customer
@app.route('/api/customer_register', methods=['POST'])
def customer_register():
    body = request.get_json(silent=True)
    if body is None:
       return jsonify({'msg':'Debes enviar los siguientes campos:',
                       'campos':{
                           'name' :'requerido',
                           'last_name': 'requerido',
                           'email':'requerido',
                           'password':'requerido',
                           'phone': 'requerido'
                       }}), 400
    if 'name' not in body:
       return jsonify({'msg':'Debes enviar el campo name'}), 400
    if 'last_name' not in body:
       return jsonify({'msg':'Debes enviar el campo last_name'}), 400
    if 'email' not in body:
       return jsonify({'msg':'Debes enviar el campo email'}), 400
    if 'password' not in body:
       return jsonify({'msg':'Debes enviar el campo password'}), 400
    if 'phone' not in body:
       return jsonify({'msg':'Debes enviar el campo phone'}), 400

    # Verificar si el email ya está registrado
    existing_customer = Customer.query.filter_by(email=body['email']).first()
    if existing_customer:
        if existing_customer.is_active:
            return jsonify({'msg':'El usuario ya existe. Se recomienda recuperar la contraseña.'}), 400
        else:
            # Actualizar los datos del cliente existente y reactivar la cuenta
            existing_customer.name = body['name']
            existing_customer.last_name = body['last_name']
            pw_hash = bcrypt.generate_password_hash(body['password']).decode('utf-8')
            existing_customer.password = pw_hash
            existing_customer.phone = body['phone']
            existing_customer.is_active = True

            # Actualizar los datos del usuario en la tabla User
            user_update = User.query.filter_by(id=existing_customer.user_id).first()
            user_update.password = pw_hash
            user_update.is_active = True

            db.session.commit()

            access_token = create_access_token(identity=user_update.email)
            return jsonify({
               'Msg':'¡Tu usuario ha sido actualizado y reactivado!',
               'jwt_token': access_token
            }), 200
    else:
        # Crear el usuario en la tabla User
        pw_hash = bcrypt.generate_password_hash(body['password']).decode('utf-8')
        new_user = User(
            email=body['email'],
            password=pw_hash
        )
        db.session.add(new_user)
        db.session.commit()

        # Crear el cliente en la tabla Customer
        new_customer = Customer(
            user_id=new_user.id,
            name=body['name'],
            last_name=body['last_name'],
            email=body['email'],
            password=pw_hash,
            phone=body['phone'],
            is_active=True
        )
        db.session.add(new_customer)
        db.session.commit()

        access_token = create_access_token(identity=new_user.email)
        return jsonify({
           'Msg':'¡Tu usuario ha sido creado!',
           'jwt_token': access_token
        }), 201

@app.route('/api/customer_update', methods=['PUT'])
@jwt_required()
def customer_update():
    body = request.get_json(silent=True)
    if body is None:
       return jsonify({'msg':'Debes enviar cualquiera de los siguientes campos para actualizar:',
                       'campos':{
                           'email':'requerido',
                           'update_name' :'opcional',
                           'update_last_name': 'opcional',
                           'update_email':'opcional',
                           'update_password':'opcional',
                           'update_phone': 'opcional'
                       }}), 400
    current_user_email = get_jwt_identity()
    customer_update = Customer.query.filter_by(email=current_user_email).first()
    if not customer_update:
        return jsonify({'msg':'Usuario no existe o el email está mal',
                        'campos':{
                           'email':'requerido',
                           'update_name' :'opcional',
                           'update_last_name': 'opcional',
                           'update_email':'opcional',
                           'update_password':'opcional',
                           'update_phone': 'opcional'
                       }}), 404

    current_user = User.query.filter_by(email=current_user_email).first()
    employee = Employee.query.filter_by(user_id=current_user.id).first()

    # Verificar si el usuario actual es el mismo que el cliente o un empleado
    if current_user_email != customer_update.email and employee is None:
        return jsonify({'msg':'No tienes permiso para actualizar este cliente'}), 403


    # Actualizar los campos del cliente
    if 'update_name' in body:
        customer_update.name = body['update_name']
    if 'update_last_name' in body:
        customer_update.last_name = body['update_last_name']
    if 'update_email' in body:
        customer_update.email = body['update_email']
    if 'update_password' in body:
        pw_hash = bcrypt.generate_password_hash(body['update_password']).decode('utf-8')
        customer_update.password = pw_hash
    if 'update_phone' in body:
        customer_update.phone = body['update_phone']
    
    db.session.commit()

    # Actualizar los campos del usuario en la tabla User
    user_update = User.query.filter_by(id=customer_update.user_id).first()
    if 'update_email' in body:
        user_update.email = body['update_email']
    if 'update_password' in body:
        user_update.password = pw_hash
    
    db.session.commit()
    
    # Crear un nuevo token para identificar al usuario con el nuevo email
    access_token = create_access_token(identity=user_update.email)
    return jsonify({
       'Msg':'¡Tu usuario ha sido actualizado!',
       'jwt_token': access_token
    }), 200

@app.route('/api/deactivate_customer', methods=['PUT'])
@jwt_required()
def deactivate_customer():
    body = request.get_json(silent=True)
    if body is None:
       return jsonify({'msg':'Debes enviar el campo email para desactivar el cliente:',
                       'campos':{
                           'email':'requerido'
                       }}), 400

    current_user_email = get_jwt_identity()
    customer_deactivate = Customer.query.filter_by(email=body.get('email')).first()
    if not customer_deactivate:
        return jsonify({'msg':'Usuario no existe o el email está mal',
                        'campos':{
                           'email':'requerido'
                       }}), 404

    current_user = User.query.filter_by(email=current_user_email).first()
    # Verificar si el usuario actual es el mismo que el cliente o un administrador
    user_admin = UserAdmin.query.filter_by(employe_id=current_user.id).first()
    if current_user_email != customer_deactivate.email and (user_admin is None or not user_admin.is_active):
        return jsonify({'msg':'No tienes permiso para desactivar este cliente'}), 403

    # Desactivar el cliente
    customer_deactivate.is_active = False

    user_deactivate = User.query.filter_by(id=customer_deactivate.user_id).first()
    user_deactivate.is_active = False
    db.session.commit()

    return jsonify({
       'Msg':'¡El cliente ha sido desactivado!'
    }), 200


# this only runs if `$ python src/main.py` is executed
if __name__ == '__main__':
    PORT = int(os.environ.get('PORT', 3001))
    app.run(host='0.0.0.0', port=PORT, debug=True)
