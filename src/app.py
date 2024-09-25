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
from flask_mail import Mail, Message



from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
from flask_jwt_extended import JWTManager
from flask_bcrypt import Bcrypt
import datetime
from flask_cors import CORS
from datetime import timedelta

# from models import Person

ENV = "development" if os.getenv("FLASK_DEBUG") == "1" else "production"
static_file_dir = os.path.join(os.path.dirname(
    os.path.realpath(__file__)), '../public/')

app = Flask(__name__)
CORS(app)

app.config['MAIL_SERVER'] = os.getenv('MAIL_SERVER')
app.config['MAIL_PORT'] = int(os.getenv('MAIL_PORT'))
app.config['MAIL_USE_TLS'] = os.getenv('MAIL_USE_TLS') == 'True'
app.config['MAIL_USE_SSL'] = os.getenv('MAIL_USE_SSL') == 'True'
app.config['MAIL_USERNAME'] = os.getenv('MAIL_USERNAME')
app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD')
app.config['MAIL_DEFAULT_SENDER'] = os.getenv('MAIL_DEFAULT_SENDER')
app.config['MAIL_MAX_EMAILS'] = os.getenv('MAIL_MAX_EMAILS')
app.config['MAIL_ASCII_ATTACHMENTS'] = os.getenv('MAIL_ASCII_ATTACHMENTS') == 'True'

app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=int(os.getenv('JWT_ACCESS_TOKEN_EXPIRES_DAYS', 1)))

# Inicializar Flask-Mail
mail = Mail(app)

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
    customer = Customer.query.filter_by(user_id = user.id).first()
    if not customer:   
        access_token = create_access_token(identity=user.email)
        return jsonify({
        'Msg':'Todos los datos están ok',
        'jwt_token': access_token,
        'type':'employee'
        }), 200

    access_token = create_access_token(identity=user.email)
    return jsonify({
       'Msg':'Todos los datos están ok',
       'jwt_token': access_token,
       'type':'customer',
       'email': user.email
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
    expires = datetime.timedelta(minutes=5)
    reset_token = create_access_token(identity=user.email, expires_delta=expires)

    reset_url = f"{os.getenv('FRONTEND_URL')}/reset-password?token={reset_token}" 
    # reset_url = url_for(os.getenv('FRONTEND_URL'), token = reset_token)
    try:
        msg = Message('Restablecimiento de contraseña', recipients=[body['email']])
        msg.body = f'Para restablecer tu contraseña, haz clic en el siguiente enlace: {reset_url}'
        mail.send(msg)
    except Exception as e:
        return jsonify({'msg': 'Error al enviar el correo electrónico'}), 500


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

@app.route('/api/employees', methods=['GET'])
def get_employees():
    employees = Employee.query.all()
    employees_serialized = [employee.serialize() for employee in employees]
    return jsonify(employees_serialized)

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
                           'date_of_birth':'YYYY-MM-DD Opcional',
                           'address': 'opcional',
                           'hire_date': 'opcional',
                           'job_position': 'opcional',
                           'status':'Aviable is default',
                           'salary': 'opcional'
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
        body['date_of_birth'] = None
    if 'address' not in body:
        body['address']= None
    if 'hire_date' not in body:
        body['hire_date']=None
    if 'job_position' not in body:
        body['job_position']=None
    if 'salary' not in body:
        body['salary']=None
    if 'status' not in body:
        body['status']= 'Available'
    
    # Verificar si el email ya está registrado
    existing_employee = Employee.query.filter_by(email=body['email']).first()
    if existing_employee:
        return jsonify({'msg':'El email ya está registrado.'}), 400

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
        status=body['status'],
        is_active=True,
        admin_is_active=False  # Por defecto, el empleado no es administrador
    )
    db.session.add(new_employee)
    db.session.commit()

    # access_token = create_access_token(identity=new_user.email)
    return jsonify({
       'Msg':'¡El empleado ha sido creado!',
    #    'jwt_token': access_token
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
                           'update_salary': 'opcional',
                           'update_status':'este es para cambiar si esta Aviable, Holiday o Day Off',
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
                           'update_salary': 'opcional',
                           'update_status':'este es para cambiar si esta Aviable, Holiday o Day Off',
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
    if 'update_status'in body:
        employee_update.status = body['update_status']
    
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
@app.route('/api/customers', methods=['GET'])
def get_customers():
    customers = Customer.query.all()
    customers_serialized = [customer.serialize() for customer in customers]
    return jsonify(customers_serialized)


@app.route('/api/customer_register', methods=['POST'])
def customer_register():
    body = request.get_json(silent=True)
    if body is None:
       return jsonify({'msg':'Debes enviar los siguientes campos:',
                       'campos':{
                           'name' :'opcional',
                           'last_name': 'opcional',
                           'email':'requerido',
                           'password':'requerido',
                           'phone': 'opcional'
                       }}), 400
    if 'email' not in body:
       return jsonify({'msg':'Debes enviar el campo email'}), 400
    if 'password' not in body:
       return jsonify({'msg':'Debes enviar el campo password'}), 400
    if 'name' not in body:
        body['name']= None
    if 'last_name' not in body:
        body['last_name']= None
    if 'phone' not in body:
        body['phone']= None
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


#SERVICES
@app.route('/api/services', methods=['GET'])
def get_services():
    services = Services.query.all()
    return jsonify([service.serialize() for service in services]), 200

@app.route('/api/new_services', methods=['POST'])
def create_service():
    data = request.get_json(silent=True)

    if data is None:
        return jsonify({'msg': 'Debes enviar los siguientes campos:',
                        'campos':{
                            'price': 'requerido',
                            'service_name': 'requerido'
                        }}),400

    service_name = data.get('service_name')
    price = data.get('price')
    
    if not service_name or not price:
        return jsonify({"msg": "El servicio y el precio son requeridos"}), 400

    new_service = Services(service_name=service_name, price=price)
    db.session.add(new_service)
    db.session.commit()
    
    return jsonify({'msg': 'El servicio ha sido creado exitosamente'}), 201

@app.route('/api/update_services', methods=['PUT'])
@jwt_required()
def update_service():
    # Obtener el email del usuario autenticado
    current_user_email = get_jwt_identity()
    
    # Buscar al empleado con el email proporcionado y verificar si es un admin activo
    employee = Employee.query.filter_by(email=current_user_email).first()
    
    # Verificar si el empleado existe y si es admin activo
    if not employee or not employee.admin_is_active:
        return jsonify({"msg": "No autorizado para actualizar servicios"}), 403

    # Obtener los datos para la actualización
    data = request.get_json(silent=True)
    
    # Obtener el id del servicio desde el body
    service_id = data.get('id')
    
    if not service_id:
        return jsonify({"msg": "Se requiere el ID del servicio"}), 400

    # Buscar el servicio a actualizar por ID
    service = Services.query.get(service_id)

    if not service:
        return jsonify({"msg": "Servicio no encontrado"}), 404

    # Actualizar el servicio solo si es necesario
    service.service_name = data.get('service_name', service.service_name)
    service.price = data.get('price', service.price)

    # Guardar los cambios en la base de datos
    db.session.commit()

    return jsonify({"msg": "Servicio modificado correctamente"}), 200
  
@app.route('/api/delete_services', methods=['DELETE'])
@jwt_required()
def delete_service():
    # Obtener el email del usuario autenticado
    current_user_email = get_jwt_identity()
    
    # Buscar al empleado con el email proporcionado y verificar si es un admin activo
    employee = Employee.query.filter_by(email=current_user_email).first()
    
    # Verificar si el empleado existe y si es admin activo
    if not employee or not employee.admin_is_active:
        return jsonify({"msg": "No autorizado para eliminar servicios"}), 403

    # Obtener los datos para la eliminación
    data = request.get_json(silent=True)
    
    # Obtener el id del servicio desde el body
    service_id = data.get('id')
    
    if not service_id:
        return jsonify({"msg": "Se requiere el ID del servicio"}), 400

    # Buscar el servicio a eliminar por ID
    service = Services.query.get(service_id)

    if not service:
        return jsonify({"msg": "Servicio no encontrado"}), 404
    
    service_name = service.service_name

    db.session.delete(service)
    db.session.commit()
    
    return jsonify({"msg": f"Servicio de {service_name} eliminado"}), 200

#appointment_GET
@app.route('/api/appointments', methods=['GET'])
def get_appoinment():
    appointments = Appointment.query.all()
    appointments_serialized = [appointment.serialize() for appointment in appointments]
    return jsonify(appointments_serialized)

#appointment_POST
@app.route('/api/new_appointment', methods=['POST'])
def post_appointment():
    body_appointment = request.get_json(silent=True)
    
    # Validar datos recibidos
    if body_appointment is None:
        return jsonify({'msg': 'Debes enviar los siguientes campos:',
                        'campos': {
                           'order_date': 'requerido',
                           'appointment_time': 'requerido',
                           'customer_id': 'requerido',
                           'employee_id': 'requerido',
                           'service_id': 'requerido',
                           'appointment_state_id': 'requerido',
                           'appointment_date': 'requerido',
                           }}), 400
    
    required_fields = ['order_date', 'appointment_time', 'customer_id', 'employee_id', 'service_id', 'appointment_state_id', 'appointment_date']
    for field in required_fields:
        if field not in body_appointment:
            return jsonify({'msg': f'Debes enviar el campo {field}'}), 400

    # Verificar existencia de cliente, empleado y servicio
    customer = Customer.query.filter_by(id=body_appointment['customer_id']).first()
    if customer is None:
        return jsonify({'msg': 'Debes estar registrado para reservar'}), 400

    employee = Employee.query.filter_by(id=body_appointment['employee_id']).first()
    if employee is None:
        return jsonify({'msg': 'Debes seleccionar el empleado'}), 400
    
    service = Services.query.filter_by(id=body_appointment['service_id']).first()
    if service is None:
        return jsonify({'msg': 'Debes seleccionar el servicio'}), 400
    
    # Verificar si ya existe una cita para el cliente y servicio
    existing_appointment = Appointment.query.filter_by(
        customer_id=body_appointment['customer_id'],
        service_id=body_appointment['service_id']
    ).first()

    if existing_appointment:
        return jsonify({'msg': 'Ya tienes una cita programada para este servicio.'}), 400
    
    # Verificar existencia en notifications
    # notification_exists = Notifications.query.filter_by(appointment_date=body_appointment['appointment_date']).first()
    # if not notification_exists:
    #     return jsonify({'msg': 'El appointment_date debe existir en notifications'}), 400

    # Crear nueva cita
    new_appointment = Appointment(
        order_date=body_appointment['order_date'],
        appointment_time=body_appointment['appointment_time'],
        customer_id=body_appointment['customer_id'],
        employee_id=body_appointment['employee_id'],
        service_id=body_appointment['service_id'],
        appointment_state_id=body_appointment['appointment_state_id'],
        appointment_date=body_appointment['appointment_date']
    )
    
    db.session.add(new_appointment)
    db.session.commit()

    # Obtener detalles para correos electrónicos
    customer_email = customer.email
    employee_email = employee.email
    customer_name = customer.name
    employee_name = employee.name
    service_name = service.service_name

    appointment_id = new_appointment.id
    # Crear y enviar correos electrónicos
    try:
        # Correo al cliente
        msg_to_customer = Message(
            subject="Confirmación de Cita",
            recipients=[customer_email],
            body=(
                f"Hola {customer_name},\n\n"
                f"Tu cita ha sido confirmada para el {body_appointment['appointment_date']} a las {body_appointment['appointment_time']}. "
                f"El servicio que recibirás es: {service_name}.\n"
                f"Tu cita será atendida por: {employee_name}.\n\n"
                f"¡Gracias por elegirnos!"
            ),
            sender=app.config['MAIL_DEFAULT_SENDER']
        )
        mail.send(msg_to_customer)

        # Correo al empleado
        msg_to_employee = Message(
            subject="Nueva Cita Programada",
            recipients=[employee_email],
            body=(
                f"Hola {employee_name},\n\n"
                f"Tienes una nueva cita programada para el {body_appointment['appointment_date']} a las {body_appointment['appointment_time']}. "
                f"El cliente es: {customer_name}.\n"
                f"El servicio reservado es: {service_name}.\n\n"
                f"¡Prepárate para la cita!"
            ),
            sender=app.config['MAIL_DEFAULT_SENDER']
        )
        mail.send(msg_to_employee)

    except Exception as e:
        print("Error al enviar correos:", e)
        return jsonify({'msg': 'Se ha creado tu reserva exitosamente, pero hubo un problema al enviar las notificaciones por correo.'}), 500

    return jsonify({'msg': 'Se ha creado tu reserva exitosamente y las notificaciones por correo se han enviado.', 'appointment_id': appointment_id})

#appointment_PUT
@app.route('/api/update_appointment', methods=['PUT'])
@jwt_required()
def put_appointment():
    body_appointment = request.get_json(silent=True)
    
    # Validar datos recibidos
    if body_appointment is None:
        return jsonify({'msg': 'Debes enviar los siguientes campos opcionales:',
                        'campos': {
                            'order_date': 'opcional',
                            'appointment_time': 'opcional',
                            'employee_id': 'opcional',
                            'service_id': 'opcional'
                        }}), 400

    # Obtener el correo electrónico del usuario autenticado
    current_user_email = get_jwt_identity()

    # Verificar si el usuario es un cliente o un empleado
    customer_update_app = Customer.query.filter_by(email=current_user_email).first()
    employee_update_app = Employee.query.filter_by(email=current_user_email).first()

    if customer_update_app is None and employee_update_app is None:
        return jsonify({'msg': 'Usuario no encontrado'}), 404

    # Verificar que el appointment_id está en el request
    if 'appointment_id' not in body_appointment:
        return jsonify({'msg': 'Debes enviar el appointment_id de la cita que quieres actualizar'}), 400

    # Buscar la cita a modificar
    appointment = None
    if customer_update_app:
        appointment = Appointment.query.filter_by(id=body_appointment['appointment_id'], customer_id=customer_update_app.id).first()
    elif employee_update_app:
        appointment = Appointment.query.filter_by(id=body_appointment['appointment_id'], employee_id=employee_update_app.id).first()

    if appointment is None:
        return jsonify({'msg': 'Cita no encontrada o no tienes permiso para modificar esta cita'}), 404

    # Obtener datos previos para comparar y enviar notificaciones adecuadas
    previous_customer_id = appointment.customer_id
    previous_employee_id = appointment.employee_id
    previous_service_id = appointment.service_id

    # Actualizar los campos opcionales si están presentes en el request
    if 'order_date' in body_appointment:
        appointment.order_date = body_appointment['order_date']

    if 'appointment_time' in body_appointment:
        appointment.appointment_time = body_appointment['appointment_time']

    if 'employee_id' in body_appointment:
        existing_employee = Employee.query.filter_by(id=body_appointment['employee_id']).first()
        if existing_employee is None:
            return jsonify({'msg': 'Empleado no encontrado'}), 404
        appointment.employee_id = body_appointment['employee_id']

    if 'service_id' in body_appointment:
        existing_service = Services.query.filter_by(id=body_appointment['service_id']).first()
        if existing_service is None:
            return jsonify({'msg': 'Servicio no encontrado'}), 404
        appointment.service_id = body_appointment['service_id']

    db.session.commit()

    # Obtener detalles actualizados
    updated_customer = Customer.query.get(appointment.customer_id)
    updated_employee = Employee.query.get(appointment.employee_id)
    updated_service = Services.query.get(appointment.service_id)

    # Obtener detalles para correos electrónicos
    customer_email = updated_customer.email
    employee_email = updated_employee.email
    customer_name = updated_customer.name
    employee_name = updated_employee.name
    service_name = updated_service.service_name

    # Crear y enviar correos electrónicos
    try:
        # Correo al cliente
        msg_to_customer = Message(
            subject="Confirmación de Modificación de Cita",
            recipients=[customer_email],
            body=(
                f"Hola {customer_name},\n\n"
                f"Tu cita ha sido modificada:\n"
                f"Fecha de reserva: {appointment.order_date}\n"
                f"Hora de la cita: {appointment.appointment_time}\n"
                f"Servicio a realizar: {service_name}\n"
                f"Barbero: {employee_name}\n\n"
                f"Gracias por mantenernos informados."
            ),
            sender=app.config['MAIL_DEFAULT_SENDER']
        )
        mail.send(msg_to_customer)

        # Correo al empleado
        msg_to_employee = Message(
            subject="Notificación de Modificación de Cita",
            recipients=[employee_email],
            body=(
                f"Hola {employee_name},\n\n"
                f"La cita con el cliente {customer_name} ha sido modificada:\n"
                f"Fecha de reserva: {appointment.order_date}\n"
                f"Hora de la cita: {appointment.appointment_time}\n"
                f"Servicio a realizar: {service_name}\n\n"
                f"Revisa tu calendario para actualizaciones."
            ),
            sender=app.config['MAIL_DEFAULT_SENDER']
        )
        mail.send(msg_to_employee)

    except Exception as e:
        print("Error al enviar correos:", e)
        return jsonify({'msg': 'Cita actualizada exitosamente, pero hubo un problema al enviar las notificaciones por correo.'}), 500

    return jsonify({'msg': 'Cita actualizada exitosamente y las notificaciones por correo se han enviado.'})

#appointment_delete
@app.route('/api/delete_appointment', methods=['DELETE'])
@jwt_required()
def delete_appointment():
    body_appointment = request.get_json(silent=True)
    if body_appointment is None or 'appointment_id' not in body_appointment:
        return jsonify({'msg': 'Debes enviar el appointment_id de la cita que quieres eliminar'}), 400

    # Obtener el correo electrónico del usuario autenticado
    current_user_email = get_jwt_identity()

    # Verificar si el usuario es un cliente o un empleado
    customer = Customer.query.filter_by(email=current_user_email).first()
    employee = Employee.query.filter_by(email=current_user_email).first()

    if customer is None and employee is None:
        return jsonify({'msg': 'Usuario no encontrado'}), 404

    # Buscar la cita a eliminar
    appointment = None
    if customer:
        appointment = Appointment.query.filter_by(id=body_appointment['appointment_id'], customer_id=customer.id).first()
    elif employee:
        appointment = Appointment.query.filter_by(id=body_appointment['appointment_id'], employee_id=employee.id).first()

    if appointment is None:
        return jsonify({'msg': 'Cita no encontrada o no tienes permiso para eliminar esta cita'}), 404

    # Guardar correos electrónicos de los involucrados
    customer_email = appointment.customer.email
    employee_email = appointment.employee.email
    print(customer_email)
    print(employee_email)

    # Obtener el admin_id dinámicamente
    # admin = UserAdmin.query.filter_by(is_active=True).first()  # Obtener el primer admin activo
    # if not admin:
    #     return jsonify({'msg': 'Admin no encontrado o no hay administradores activos'}), 404
    # admin_id = admin.id

    # Eliminar la cita
    db.session.delete(appointment)
    db.session.commit()

    # Verificar si ya existe una notificación con la misma appointment_date
    existing_notification_customer = Notifications.query.filter_by(appointment_date=appointment.appointment_date, customer_id=appointment.customer_id).first()
    existing_notification_employee = Notifications.query.filter_by(appointment_date=appointment.appointment_date, employee_id=appointment.employee_id).first()

    # Solo agregar la notificación si no existe una previa
    if not existing_notification_customer:
        notification_customer = Notifications(
            customer_id=appointment.customer_id,
            employee_id=appointment.employee_id,
            # admin_id=admin_id,  # Usando el admin_id dinámico
            appointment_date=appointment.appointment_date,
            services=appointment.service_id
        )
        db.session.add(notification_customer)

    if not existing_notification_employee:
        notification_employee = Notifications(
            customer_id=appointment.customer_id,
            employee_id=appointment.employee_id,
            # admin_id=admin_id,  # Usando el admin_id dinámico
            appointment_date=appointment.appointment_date,
            services=appointment.service_id
        )
        db.session.add(notification_employee)

    db.session.commit()

    # Obtener detalles actualizados
    delete_customer = Customer.query.get(appointment.customer_id)
    delete_employee = Employee.query.get(appointment.employee_id)
    delete_service = Services.query.get(appointment.service_id)

    # Obtener detalles para correos electrónicos
    customer_email = delete_customer.email
    employee_email = delete_employee.email
    customer_name = delete_customer.name
    employee_name = delete_employee.name
    service_name = delete_service.service_name

    # Enviar correos electrónicos de notificación
    send_email(
        subject="Cita Cancelada",
        recipients=[customer_email],
        body=(f"Hola {customer_name},\n\n"
              f"Tu cita ha sido cancelada:\n"
              f"Fecha de la reserva: {appointment.order_date}\n"
              f"Hora de la cita: {appointment.appointment_time}\n"
              f"Servicio a realizar: {service_name}\n"
              f"Empleado: {employee_name}\n\n"
              f"Gracias por mantenernos informados."
              ),
        sender=app.config['MAIL_DEFAULT_SENDER']
    )

    send_email(
        subject="Cita Cancelada",
        recipients=[employee_email],
        body=(
            f"Hola {employee_name},\n\n"
            f"La cita con el cliente {customer_name} ha sido cancelada:\n"
            f"Fecha de la reserva: {appointment.order_date}\n"
            f"Hora de la cita: {appointment.appointment_time}\n"
            f"Servicio a realizar: {service_name}\n\n"
            f"Revisa tu calendario para actualizaciones."
        ),
        sender=app.config['MAIL_DEFAULT_SENDER']
    )

    return jsonify({'msg': 'Cita cancelada exitosamente y notificaciones enviadas'}), 200

def send_email(subject, recipients, body, sender):
    msg = Message(subject, recipients=recipients)
    msg.body = body
    msg.sender = sender
    mail.send(msg) 
    
@app.route('/api/get_customer_id', methods=['GET'])
@jwt_required()
def get_customer_id():
    current_user = get_jwt_identity() 
    customer = Customer.query.filter_by(email=current_user).first()  # Buscar el cliente en la base de datos

    if customer:
        return jsonify(customer_id=customer.id), 200
    else:
        return jsonify({"msg": "Customer not found"}), 404



# this only runs if `$ python src/main.py` is executed
if __name__ == '__main__':
    PORT = int(os.environ.get('PORT', 3001))
    app.run(host='0.0.0.0', port=PORT, debug=True)
