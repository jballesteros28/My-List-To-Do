from pydantic import BaseModel

class TareaCreate(BaseModel):
    titulo: str
    
class TareaUpdate(BaseModel):
    titulo: str
    
class Tarea_out(BaseModel):
    id: int
    titulo: str
    
    class Config:
        from_attributes = True  # Permite convertir modelos SQLAlchemy en dicts automáticamente    