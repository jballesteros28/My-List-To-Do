from pydantic import BaseModel


class UsuarioCreate(BaseModel):
    email: str
    password: str
    
class UsuarioOut(BaseModel):
    id : int
    email: str
    
    class Config:
        orm_mode = True
        
class Token(BaseModel):
    access_token: str
    token_type: str

class TareaCreate(BaseModel):
    titulo: str
    
class TareaUpdate(BaseModel):
    titulo: str
    
class Tarea_out(BaseModel):
    id: int
    titulo: str
    
    class Config:
        from_attributes = True  # Permite convertir modelos SQLAlchemy en dicts automáticamente    