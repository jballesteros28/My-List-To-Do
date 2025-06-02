from sqlalchemy import Integer, String
from sqlalchemy.orm import mapped_column
from sqlalchemy.orm import Mapped
from backend.database import base

class Tarea(base):
    __tablename__ = "tareas" #nombre de la tabla en la base de datos
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    titulo: Mapped[str] = mapped_column(String(100), nullable=False)