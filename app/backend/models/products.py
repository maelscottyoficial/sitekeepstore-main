from core.database import Base
from datetime import datetime
from sqlalchemy import Boolean, Column, DateTime, Float, Integer, String


class Products(Base):
    __tablename__ = "products"
    __table_args__ = {"extend_existing": True}

    id = Column(Integer, primary_key=True, index=True, autoincrement=True, nullable=False)
    name = Column(String, nullable=False)
    original_price = Column(Float, nullable=True)
    current_price = Column(Float, nullable=False)
    discount = Column(Integer, nullable=True)
    installments = Column(Integer, nullable=True)
    installment_price = Column(Float, nullable=True)
    category = Column(String, nullable=False)
    gradient = Column(String, nullable=True)
    image_url = Column(String, nullable=True)
    description = Column(String, nullable=True)
    is_promotional = Column(Boolean, nullable=True)
    is_bestseller = Column(Boolean, nullable=True)
    active = Column(Boolean, nullable=True)
    created_at = Column(DateTime(timezone=True), default=datetime.now)
    updated_at = Column(DateTime(timezone=True), default=datetime.now, onupdate=datetime.now)