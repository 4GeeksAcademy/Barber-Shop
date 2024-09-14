from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import DateTime, Time, Numeric, Boolean, ForeignKey
from sqlalchemy.orm import relationship

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'user'
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(150), unique=False, nullable=False)
    is_active = db.Column(Boolean, default=True, unique=False, nullable=False)
    
    def __repr__(self):
        return f'<User {self.email}>'
    
    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            "is_active": self.is_active
            # do not serialize the password, its a security breach
        }
    
class UserAdmin(db.Model):
    __tablename__ = 'user_admin'
    id = db.Column(db.Integer, primary_key=True)
    employe_id = db.Column(db.Integer, ForeignKey('employee.id'), unique=False, nullable=False)
    is_active = db.Column(Boolean, unique=False, nullable=False)
    employee = relationship("Employee", back_populates="admin")
    
    def __repr__(self):
        return f'<AdminUser {self.id}>'
    
    def serialize(self):
        return {
            "id": self.id,
            "employe_id": self.employe_id,
            "is_active": self.is_active
        }

class Employee(db.Model):
    __tablename__ = 'employee'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, ForeignKey('user.id'), nullable=False)
    name = db.Column(db.String(100), unique=False, nullable=False)
    last_name = db.Column(db.String(100), unique=False, nullable=False)
    email = db.Column(db.String(150), unique=True, nullable=False)
    password = db.Column(db.String(150), unique=False, nullable=False)
    date_of_birth = db.Column(DateTime, unique=False, nullable=False)
    address = db.Column(db.String(255), unique=False, nullable=False)
    phone = db.Column(db.Integer, unique=True, nullable=False)
    hire_date = db.Column(DateTime, unique=False, nullable=False)
    job_position = db.Column(db.String(50), unique=False, nullable=False)
    admin_is_active = db.Column(Boolean, default=False, unique=False, nullable=False)
    salary = db.Column(Numeric(10, 2), unique=False, nullable=False)
    reservations_id = db.Column(db.Integer, unique=False, nullable=False)
    schedules_id = db.Column(db.Integer, unique=False, nullable=False)
    admin = relationship("UserAdmin", back_populates="employee")
    customer_favs = relationship("CustomerFav", back_populates="employee")
    appointments = relationship("Appointment", back_populates="employee")
    notifications = relationship("Notifications", back_populates="employee")
    user = db.relationship('User', backref=db.backref('employees', lazy=True))
    status = db.Column(db.String(50), unique=False, nullable=True)

    def __repr__(self):
        return f'<Employee {self.name}>'
    
    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "last_name": self.last_name,
            "email": self.email,
            "date_of_birth": self.date_of_birth,
            "address": self.address,
            "phone": self.phone,
            "hire_date": self.hire_date,
            "job_position": self.job_position,
            "admin_is_active": self.admin_is_active,
            "salary": self.salary,
            "reservations_id": self.reservations_id,
            "schedules_id": self.schedules_id,
            "status": self.status
        }
    
    
class Customer(db.Model):
    __tablename__ = 'customer'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, ForeignKey('user.id'), nullable=False)
    name = db.Column(db.String(100), unique=False, nullable=False)
    last_name = db.Column(db.String(100), unique=False, nullable=False)
    email = db.Column(db.String(150), unique=True, nullable=False)
    password = db.Column(db.String(150), unique=False, nullable=False)
    phone = db.Column(db.String(20), unique=True, nullable=False)  # Cambié el tipo de dato a String
    is_active = db.Column(Boolean, default=True, unique=False, nullable=False)
    customer_favs = db.relationship("CustomerFav", back_populates="customer")
    appointments = db.relationship("Appointment", back_populates="customer")
    notifications = db.relationship("Notifications", back_populates="customer")
    user = db.relationship('User', backref=db.backref('customers', lazy=True))
    
    def __repr__(self):
        return f'<Customer {self.name}>'
    
    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "last_name": self.last_name,
            "email": self.email,
            "phone": self.phone
        }


class CustomerFav(db.Model):
    __tablename__ = 'customer_fav'    
    id = db.Column(db.Integer, primary_key=True)
    customer_id = db.Column(db.Integer, ForeignKey('customer.id'), nullable=False)
    employee_id = db.Column(db.Integer, ForeignKey('employee.id'), nullable=False)
    services_id = db.Column(db.Integer, ForeignKey('services.id'), nullable=False)
    customer = relationship("Customer", back_populates="customer_favs")
    employee = relationship("Employee", back_populates="customer_favs")
    service = relationship("Services", back_populates="customer_favs")
    
    def __repr__(self):
        return f'<CustomerFav {self.id}>'
    
    def serialize(self):
        return {
            "id": self.id,
            "customer_id": self.customer_id,
            "employee_id": self.employee_id,
            "services_id": self.services_id
        }
    
class Appointment(db.Model):
    __tablename__ = 'appointment'  
    id = db.Column(db.Integer, primary_key=True)
    customer_id = db.Column(db.Integer, ForeignKey('customer.id'), nullable=False)
    employee_id = db.Column(db.Integer, ForeignKey('employee.id'), nullable=False)
    order_date = db.Column(DateTime, default=db.func.current_timestamp(), nullable=False)
    appointment_date = db.Column(DateTime, nullable=False)
    appointment_time = db.Column(Time, nullable=False)
    appointment_state_id = db.Column(Boolean, nullable=False)
    service_id = db.Column(db.Integer, ForeignKey('services.id'), nullable=False)
    customer = relationship("Customer", back_populates="appointments")
    employee = relationship("Employee", back_populates="appointments")
    service = relationship("Services", back_populates="appointments")

    def __repr__(self):
        return f'<Appointment {self.id}>'

    def serialize(self):
        return {
            "id": self.id,
            "customer_id": self.customer_id,
            "employee_id": self.employee_id,
            "order_date": self.order_date.isoformat() if self.order_date else None,
            "appointment_date": self.appointment_date.isoformat() if self.appointment_date else None,
            "appointment_time": self.appointment_time.strftime('%H:%M:%S') if self.appointment_time else None,
            "appointment_state_id": self.appointment_state_id,
            "service_id": self.service_id
        }
    
class Services(db.Model):
    __tablename__ = 'services'   
    id = db.Column(db.Integer, primary_key=True)
    service_name = db.Column(db.String(50), unique=True, nullable=False)
    price = db.Column(Numeric(10, 2), nullable=False)
    customer_favs = relationship("CustomerFav", back_populates="service")
    appointments = relationship("Appointment", back_populates="service")
    
    def __repr__(self):
        return f'<Services {self.service_name}>'
    
    def serialize(self):
        return {
            "id": self.id,
            "service_name": self.service_name,
            "price": self.price
        }
    
class Notifications(db.Model):
    __tablename__ = 'notifications'
    id = db.Column(db.Integer, primary_key=True)
    customer_id = db.Column(db.Integer, ForeignKey('customer.id'), nullable=False)
    employee_id = db.Column(db.Integer, ForeignKey('employee.id'), nullable=False)
    admin_id = db.Column(db.Integer, ForeignKey('user_admin.id'), nullable=False)
    appointment_date = db.Column(DateTime, nullable=False)  
    services = db.Column(db.Integer, nullable=False)
    customer = relationship("Customer", back_populates="notifications")
    employee = relationship("Employee", back_populates="notifications")
    admin = relationship("UserAdmin")
    
    def __repr__(self):
        return f'<Notifications {self.id}>'
    
    def serialize(self):
        return {
            "id": self.id,
            "customer_id": self.customer_id,
            "employee_id": self.employee_id,
            "admin_id": self.admin_id,
            "appointment_date": self.appointment_date,
            "services": self.services
        }
