from sqlalchemy import Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.orm import mapped_column
from sqlalchemy.orm import Mapped
from backend.database import base


class Usuario(base):
    __tablename__ = "usuarios" #nombre de la tabla en la base de datos

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    email: Mapped[str] = mapped_column(String(100), unique=True, index=True, nullable=False)
    contraseña: Mapped[str] = mapped_column(String(100), nullable=False)
    
    tareas = relationship("Tarea", back_populates="usuario", cascade="all, delete-orphan")  # Relación con Tarea

class Tarea(base):
    __tablename__ = "tareas" #nombre de la tabla en la base de datos
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    titulo: Mapped[str] = mapped_column(String(100), nullable=False)
    usuario_id: Mapped[int] = mapped_column(Integer, ForeignKey("usuarios.id"),nullable=False)  # ID del usuario propietario de la tarea
    
    creador = relationship("Usuario", back_populates="tareas")  # Relación con Usuario