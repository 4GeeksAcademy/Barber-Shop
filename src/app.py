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
    customer_deactivate = Customer.query.filter_by(email=current_user_email).first()
    if not customer_deactivate:
        return jsonify({'msg':'Usuario no existe o el email está mal',
                        'campos':{
                           'email':'requerido'
                       }}), 404

    # Desactivar el cliente
    customer_deactivate.is_active = False

    user_deactivate = User.query.filter_by(id=customer_deactivate.user_id).first()
    user_deactivate.is_active = False
    db.session.commit()

    return jsonify({
       'Msg':'¡El cliente ha sido desactivado!'
    }), 200


#Appointment
@app.route('/api/appointments', methods=['GET'])
def get_appoinment():
    appointments = Appointment.query.all()
    appointments_serialized = [appointment.serialize() for appointment in appointments]
    return jsonify(appointments_serialized)

@app.route('/api/new_appointment', methods=['POST'])
def post_appointment():
    body_appointment = request.get_json(silent=True)
    if body_appointment is None:
        return jsonify({'msg': 'Debes enviar los siguientes campos:',
                        'campos':{
                           'order_date':'requerido',
                           'appointment_time':'requerido',
                           }}), 400
    if 'order_date' not in body_appointment:
       return jsonify({'msg':'Debes enviar el campo order_date'}), 400
    if 'appointment_time' not in body_appointment:
       return jsonify({'msg':'Debes enviar el campo appointment_time'}), 400
    
    # Verificar si el cliente, el empleado y el servicio existen
    existing_customer_id = Customer.query.filter_by(id=body_appointment['customer_id']).first()
    if existing_customer_id is None:
        return jsonify({'msg':'Debes estar registrado para reservar'})

    existing_employee_id = Employee.query.filter_by(id=body_appointment['employee_id']).first()
    if existing_employee_id is None:
        return jsonify({'msg':'Debes seleccionar el empleado'})
  
    existing_service_id = Services.query.filter_by(id=body_appointment['service_id']).first()
    if existing_service_id is None:
        return jsonify({'msg':'Debes seleccionar el servicio'})
    
    # Verificar si ya existe una cita para el mismo cliente y servicio
    existing_appointment = Appointment.query.filter_by(
        customer_id=body_appointment['customer_id'],
        service_id=body_appointment['service_id']
    ).first()

    if existing_appointment:
        return jsonify({'msg': 'Ya tienes una cita programada para este servicio.'}), 400
    
    # Verificar si la fecha existe en notifications
    existing_notification = Notifications.query.filter_by(appointment_date=body_appointment['appointment_date']).first()
    if not existing_notification:
        return jsonify({'msg': 'El appointment_date debe existir en notifications'}), 400

    # Crear nueva cita
    new_appointment = Appointment(
        order_date = body_appointment['order_date'],
        appointment_time = body_appointment['appointment_time'],
        customer_id = body_appointment['customer_id'],
        employee_id = body_appointment['employee_id'],
        service_id = body_appointment['service_id'],
        appointment_state_id = body_appointment['appointment_state_id'],
        appointment_date = body_appointment['appointment_date']
    )
    
    db.session.add(new_appointment)
    db.session.commit()

    return jsonify({'msg': 'Se ha creado tu reserva exitosamente'})

@app.route('/api/appointment', methods=['PUT'])
@jwt_required()
def put_appointment():
    body_appointment = request.get_json(silent=True)
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

    # Buscar la cita a modificar, ya sea por customer_id o employee_id
    appointment = None
    if customer_update_app:
        appointment = Appointment.query.filter_by(id=body_appointment['appointment_id'], customer_id=customer_update_app.id).first()
    elif employee_update_app:
        appointment = Appointment.query.filter_by(id=body_appointment['appointment_id'], employee_id=employee_update_app.id).first()

    if appointment is None:
        return jsonify({'msg': 'Cita no encontrada o no tienes permiso para modificar esta cita'}), 404

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

    return jsonify({'msg': 'Cita actualizada exitosamente'})          

# this only runs if `$ python src/main.py` is executed
if __name__ == '__main__':
    PORT = int(os.environ.get('PORT', 3001))
    app.run(host='0.0.0.0', port=PORT, debug=True)
