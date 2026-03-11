from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

# --- User Schemas ---
class UserBase(BaseModel):
    name: str = "User"
    email: Optional[str] = None
    phone: Optional[str] = None
    avatar: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    identifier: str # Email or Phone
    password: Optional[str] = None
    otp: Optional[str] = None

class UserResponse(UserBase):
    id: int
    pay_zone_balance: float
    is_admin: bool
    
    class Config:
        from_attributes = True

# --- API Response Models ---
class LoginResponse(BaseModel):
    token: str
    user: UserResponse

class MessageResponse(BaseModel):
    message: str

# --- Wallet/UPI Schemas ---
class UPITransfer(BaseModel):
    upi_id: str
    amount: float

class GiftCardClaim(BaseModel):
    code: str

# --- Product Schemas ---
class ProductBase(BaseModel):
    name: str
    category: str
    price: float
    old_price: Optional[float] = None
    img: str
    rating: float
    reviews: int
    in_stock: bool
    description: str

class ProductResponse(ProductBase):
    id: int

    class Config:
        from_attributes = True

# --- Order Schemas ---
class OrderItemCreate(BaseModel):
    product_id: int
    quantity: int
    price: float

class OrderCreate(BaseModel):
    total: float
    items: List[OrderItemCreate]
    payment_method: str = "Razorpay"
    payment_id: Optional[str] = None
    payment_status: str = "Pending"
