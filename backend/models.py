from sqlalchemy import Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import mapped_column, Mapped, relationship
from backend.database import Base
from datetime import datetime

class Tarea(Base):
    __tablename__ = "tareas" #nombre de la tabla en la base de datos
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    titulo: Mapped[str] = mapped_column(String(100), nullable=False)
    #Foreign key a User
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    user = relationship("User", back_populates="tareas")
    
    
class User(Base):
    __tablename__ = "users"  # nombre de la tabla en la base de datos
    
    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    username: Mapped[str] = mapped_column(unique=True, nullable=False, index=True)
    email: Mapped[str] = mapped_column(unique=True, nullable=False, index=True)
    hashed_password: Mapped[str] = mapped_column(nullable=False)
    tareas = relationship("Tarea", back_populates="user")
    is_active: Mapped[bool] = mapped_column(default=False, nullable=True)
    confirmation_tokens = relationship("ConfirmationToken", back_populates="user")
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    

class ConfirmationToken(Base):
    __tablename__ = "confirmation_tokens"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), nullable=False)
    token: Mapped[int] = mapped_column(String(64), unique=True, nullable=False)
    created_at: Mapped[int] = mapped_column(DateTime, default=datetime.utcnow)
    expiration = mapped_column(DateTime, nullable=True)

    user = relationship("User", back_populates="confirmation_tokens")
    
    
class PasswordResetCode(Base):
    __tablename__ = "password_reset_codes"

    id: Mapped[int]= mapped_column(Integer, primary_key=True, index=True)
    email: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    code = mapped_column(String(10), nullable=False)
    created_at = mapped_column(DateTime, default=datetime.utcnow)
    expiration = mapped_column(DateTime, nullable=False)
    