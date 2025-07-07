from pydantic import BaseModel, EmailStr

class TareaCreate(BaseModel):
    titulo: str
    
class TareaUpdate(BaseModel):
    titulo: str
    
class Tarea_out(BaseModel):
    id: int
    titulo: str
    user_id: int
    
    class Config:
        from_attributes = True  # Permite convertir modelos SQLAlchemy en dicts automáticamente  
        

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str  

class UserOut(BaseModel):
    id: int
    username: str
    email: EmailStr

    class Config:
        from_attributes = True

class UserLogin(BaseModel):
    username: str
    password: str  
    
class ForgotPasswordRequest(BaseModel):
    username: str
    email: EmailStr

class ResetPasswordRequest(BaseModel):
    username: str
    email: EmailStr
    otp: str
    new_password: str
    
class ValidateResetCodeRequest(BaseModel):
    username: str
    email: str
    otp: str
    

class ResendConfirmationRequest(BaseModel):
    email: EmailStr