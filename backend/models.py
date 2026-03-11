from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Float, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=True)
    phone = Column(String, unique=True, index=True, nullable=True)
    password = Column(String)
    name = Column(String, default="User")
    avatar = Column(String, nullable=True)
    pay_zone_balance = Column(Float, default=0.0)
    is_admin = Column(Boolean, default=False)

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    category = Column(String, index=True)
    price = Column(Float)
    old_price = Column(Float, nullable=True)
    img = Column(String)
    rating = Column(Float)
    reviews = Column(Integer)
    in_stock = Column(Boolean, default=True)
    description = Column(String)

class Order(Base):
    __tablename__ = "orders"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    total = Column(Float)
    status = Column(String)
    payment_method = Column(String, default="Razorpay")
    payment_id = Column(String, nullable=True)
    payment_status = Column(String, default="Pending")
    date = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="orders")
    items = relationship("OrderItem", back_populates="order")

class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(String, ForeignKey("orders.id"))
    product_id = Column(Integer)  # No FK constraint allowing frontend mock items to be purchased
    quantity = Column(Integer)
    price = Column(Float)

    order = relationship("Order", back_populates="items")

User.orders = relationship("Order", back_populates="user")
