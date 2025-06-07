from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from backend.database import engine, SessionLocal
from backend.models import base, Tarea, Usuario
from backend.schemas import TareaCreate, Tarea_out,UsuarioCreate, Token, UsuarioOut
from backend import auth
from typing import List
# Importar las dependencias necesarias

app = FastAPI()


# Habilitar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://my-list-to-do.onrender.com",
                   "https://my-list-to-do-delta.vercel.app"
                   ],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

base.metadata.create_all(bind=engine) #crea las tablas en la base de datos

# dependencia para obtener la sesión de la base de datos
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
        
@app.post("/tareas/", response_model=Tarea_out)
def crear_tarea(tarea: TareaCreate, db: Session = Depends(get_db), usuario: Usuario = Depends(auth.obtener_usuario_actual)):
    nueva_tarea = Tarea(**tarea.model_dump(), usuario_id=usuario.id)
    db.add(nueva_tarea)
    db.commit()
    db.refresh(nueva_tarea)
    return nueva_tarea

@app.get("/tareas/", response_model=List[Tarea_out])
def lista_tareas(db: Session = Depends(get_db)):
    tareas = db.query(Tarea).all()
    return tareas

@app.get("/tareas", response_model=List[Tarea_out])
def obtener_tarea(db: Session = Depends(get_db),usuario: Usuario = Depends(auth.obtener_usuario_actual)):
    return db.query(Tarea).filter(Tarea.usuario_id == usuario.id).all()

@app.put("/tareas/{tarea_id}", response_model=Tarea_out)
def actualizar_tarea(tarea_id: int, tarea_data: TareaCreate, db: Session = Depends(get_db)):
    tarea = db.query(Tarea).filter(Tarea.id == tarea_id).first()
    if not tarea:
        return {"error": "Tarea no encontrada"}
    
    tarea.titulo = tarea_data.titulo
    db.commit()
    db.refresh(tarea)
    return tarea

@app.delete("/tareas/{tarea_id}")
def eliminar_tarea(tarea_id: int, db: Session = Depends(get_db)):
    tarea = db.query(Tarea).filter(Tarea.id == tarea_id).first()
    if not tarea:
        return {"error": "Tarea no encontrada"}
    
    db.delete(tarea)
    db.commit()
    return {"mensaje": "Tarea eliminada correctamente"}

@app.post("/registro", response_model=UsuarioOut)
def registrar(usuario: UsuarioCreate, db: Session = Depends(auth.get_db)):
    db_usuario = db.query(Usuario).filter(Usuario.email == usuario.email).first()
    if db_usuario:
        raise HTTPException(status_code=400, detail="Email ya registrado")
    
    
    hashed_pwd = auth.hashear_password(usuario.password)
    nuevo_usuario = Usuario(email=usuario.email,password=hashed_pwd)
    db.add(nuevo_usuario)
    db.commit()
    db.refresh(nuevo_usuario)
    return nuevo_usuario

@app.post("/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(auth.get_db)):
    usuario = auth.autenticar_usuario(db, form_data.username, form_data.password)
    if not usuario:
        raise HTTPException(status_code=401, detail="Credenciales inválidas")
    
    token = auth.crear_token({"sub": usuario.email})
    return {"access_token": token, "token_type": "bearer"}