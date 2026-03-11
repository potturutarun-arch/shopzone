from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel
import uuid

import models, schemas, database
from database import engine

# Create the database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="ShopZone API")

# Setup CORS to allow the Vite frontend to communicate
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict this
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Dependency ---
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def read_root():
    return {"message": "Welcome to the ShopZone Custom API"}

# --- Auth Endpoints ---
@app.post("/api/auth/signup", response_model=schemas.LoginResponse)
def signup(user: schemas.UserCreate, db: Session = Depends(get_db)):
    if user.email:
        db_user = db.query(models.User).filter(models.User.email == user.email).first()
        if db_user:
            raise HTTPException(status_code=400, detail="Email already registered")
    
    if user.phone:
        db_user = db.query(models.User).filter(models.User.phone == user.phone).first()
        if db_user:
            raise HTTPException(status_code=400, detail="Phone already registered")

    # Make first user admin automatically
    is_first = db.query(models.User).count() == 0

    db_user = models.User(
        email=user.email,
        phone=user.phone,
        password=user.password,
        name=user.name,
        pay_zone_balance=0.0,
        is_admin=is_first
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    # Fake token for now
    token = f"fake-jwt-token-{db_user.id}"
    return {"token": token, "user": db_user}

@app.post("/api/auth/login", response_model=schemas.LoginResponse)
def login(login_data: schemas.UserLogin, db: Session = Depends(get_db)):
    db_user = None
    
    if "@" in login_data.identifier:
        db_user = db.query(models.User).filter(models.User.email == login_data.identifier).first()
    else:
        db_user = db.query(models.User).filter(models.User.phone == login_data.identifier).first()
        
    if not db_user:
        raise HTTPException(status_code=400, detail="Account not found")
        
    # Check password or OTP
    if login_data.password:
        if db_user.password != login_data.password:
             raise HTTPException(status_code=400, detail="Invalid password")
    elif login_data.otp:
        # Mock OTP validation (super secure logic for demo)
        if login_data.otp != "1234":
            raise HTTPException(status_code=400, detail="Invalid OTP code")
    else:
         raise HTTPException(status_code=400, detail="Provide exactly one of password or OTP")

    token = f"fake-jwt-token-{db_user.id}"
    return {"token": token, "user": db_user}

# --- Mock OTP Endpoint ---
@app.post("/api/auth/send-otp")
def send_otp(identifier: str):
    # Imagine generating a code and sending via SMS/Email
    return {"message": f"OTP sent successfully to {identifier} (Use 1234 for demo)"}


# --- User & Wallet Endpoints ---
@app.get("/api/users/me", response_model=schemas.UserResponse)
def read_users_me(user_id: int, db: Session = Depends(get_db)):
    # Simulating extracting user_id from JWT token for now
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user

@app.post("/api/wallet/claim-gift-card", response_model=schemas.UserResponse)
def claim_gift_card(user_id: int, claim: schemas.GiftCardClaim, db: Session = Depends(get_db)):
    if not claim.code or len(claim.code.strip()) < 5:
        raise HTTPException(status_code=400, detail="Invalid gift card code")
        
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    
    import random
    amount = random.randint(100, 1000)
    db_user.pay_zone_balance += amount
    db.commit()
    db.refresh(db_user)
    
    return db_user

@app.post("/api/wallet/transfer-upi", response_model=schemas.UserResponse)
def transfer_upi(user_id: int, transfer: schemas.UPITransfer, db: Session = Depends(get_db)):
    if "@" not in transfer.upi_id:
        raise HTTPException(status_code=400, detail="Invalid UPI ID")
        
    if transfer.amount <= 0:
         raise HTTPException(status_code=400, detail="Amount must be strictly positive")
         
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
        
    if db_user.pay_zone_balance < transfer.amount:
         raise HTTPException(status_code=400, detail="Insufficient balance")
         
    db_user.pay_zone_balance -= transfer.amount
    db.commit()
    db.refresh(db_user)
    
    return db_user

# --- Order Endpoints ---
@app.post("/api/orders", response_model=schemas.MessageResponse)
def create_order(user_id: int, order: schemas.OrderCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
        
    import uuid
    new_order_id = f"ORD-{str(uuid.uuid4())[:8].upper()}"
    
    db_order = models.Order(
        id=new_order_id,
        user_id=user_id,
        total=order.total,
        status="Processing",
        payment_method=order.payment_method,
        payment_id=order.payment_id,
        payment_status=order.payment_status
    )
    db.add(db_order)
    
    for item in order.items:
        db_item = models.OrderItem(
            order_id=new_order_id,
            product_id=item.product_id,
            quantity=item.quantity,
            price=item.price
        )
        db.add(db_item)
        
    db.commit()
    return {"message": new_order_id}

@app.put("/api/orders/{order_id}/cancel", response_model=schemas.MessageResponse)
def cancel_order(order_id: str, user_id: int, db: Session = Depends(get_db)):
    db_order = db.query(models.Order).filter(
        models.Order.id == order_id, 
        models.Order.user_id == user_id
    ).first()
    
    if not db_order:
        raise HTTPException(status_code=404, detail="Order not found or not authorized")
        
    if db_order.status == "Delivered":
        raise HTTPException(status_code=400, detail="Cannot cancel a delivered order")
        
    db_order.status = "Cancelled"
    db_order.payment_status = "Refunded" if db_order.payment_status == "Paid" else "Cancelled"
    db.commit()
    
    return {"message": "Order cancelled successfully"}


# --- Admin Endpoints ---
@app.get("/api/admin/users", response_model=list[schemas.UserResponse])
def get_all_users(user_id: int, db: Session = Depends(get_db)):
    # Bypassed for demo
    # db_user = db.query(models.User).filter(models.User.id == user_id).first()
    # if not db_user or not db_user.is_admin:
    #     raise HTTPException(status_code=403, detail="Not authorized. Admin only.")
    
    return db.query(models.User).all()

@app.get("/api/admin/stats")
def get_admin_stats(user_id: int, db: Session = Depends(get_db)):
    # Bypassed for demo
    # db_user = db.query(models.User).filter(models.User.id == user_id).first()
    # if not db_user or not db_user.is_admin:
    #     raise HTTPException(status_code=403, detail="Not authorized. Admin only.")
    
    total_users = db.query(models.User).count()
    total_products = db.query(models.Product).count()
    total_orders = db.query(models.Order).count()
    
    return {
        "users": total_users,
        "products": total_products,
        "orders": total_orders,
        "revenue": sum(o.total for o in db.query(models.Order).all())
    }

@app.get("/api/admin/orders")
def get_all_orders(user_id: int, db: Session = Depends(get_db)):
    # Bypassed for demo
    # db_user = db.query(models.User).filter(models.User.id == user_id).first()
    # if not db_user or not db_user.is_admin:
    #     raise HTTPException(status_code=403, detail="Not authorized. Admin only.")
        
    orders = db.query(models.Order).order_by(models.Order.date.desc()).all()
    
    # Manually build response to include items
    result = []
    for order in orders:
        items_data = []
        for item in order.items:
            # We fetch the product name to display in the admin dashboard
            product = db.query(models.Product).filter(models.Product.id == item.product_id).first()
            items_data.append({
                "product_id": item.product_id,
                "product_name": product.name if product else "Unknown Product",
                "quantity": item.quantity,
                "price": item.price
            })
            
        result.append({
            "id": order.id,
            "total": order.total,
            "status": order.status,
            "payment_method": order.payment_method,
            "payment_id": order.payment_id,
            "payment_status": order.payment_status,
            "date": order.date.isoformat(),
            "user": {
                "id": order.user.id,
                "name": order.user.name,
                "email": order.user.email,
                "phone": order.user.phone
            },
            "items_count": len(order.items),
            "items": items_data
        })
        
    return result

class OrderStatusUpdate(BaseModel):
    status: str

@app.put("/api/admin/orders/{order_id}/status")
def update_order_status(order_id: str, user_id: int, status_update: OrderStatusUpdate, db: Session = Depends(get_db)):
    # Bypassed for demo
    # db_user = db.query(models.User).filter(models.User.id == user_id).first()
    # if not db_user or not db_user.is_admin:
    #     raise HTTPException(status_code=403, detail="Not authorized.")
        
    db_order = db.query(models.Order).filter(models.Order.id == order_id).first()
    if not db_order:
        raise HTTPException(status_code=404, detail="Order not found")
        
    db_order.status = status_update.status
    db.commit()
    return {"message": "Status updated successfully", "new_status": db_order.status}

@app.post("/api/admin/products", response_model=schemas.ProductResponse)
def create_product(user_id: int, product: schemas.ProductBase, db: Session = Depends(get_db)):
    # Bypassed for demo
    # db_user = db.query(models.User).filter(models.User.id == user_id).first()
    # if not db_user or not db_user.is_admin:
    #     raise HTTPException(status_code=403, detail="Not authorized. Admin only.")
        
    db_product = models.Product(**product.model_dump())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product
