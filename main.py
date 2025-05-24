from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from database import engine, SessionLocal
from models import base, Tarea
from schemas import TareaCreate, Tarea_out
from typing import List
# Importar las dependencias necesarias

app = FastAPI()

base.metadata.create_all(bind=engine) #crea las tablas en la base de datos

# dependencia para obtener la sesión de la base de datos
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
        
@app.post("/tareas/")
def crear_tarea(tarea: TareaCreate, db: Session = Depends(get_db)):
    nueva_tarea = Tarea(titulo=tarea.titulo)
    db.add(nueva_tarea)
    db.commit()
    db.refresh(nueva_tarea)
    return {"id": nueva_tarea.id, "titulo": nueva_tarea.titulo}

@app.get("/tareas/", response_model=List[Tarea_out])
def lista_tareas(db: Session = Depends(get_db)):
    tareas = db.query(Tarea).all()
    return tareas