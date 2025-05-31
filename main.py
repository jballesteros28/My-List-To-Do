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

@app.get("/tareas{tarea_id}", response_model=Tarea_out)
def obtener_tarea(tarea_id: int, db: session = Depends(get_db)):
    tarea = db.query(Tarea).filter(Tarea.id == tarea_id).first()
    if tarea is None:
        return {"error": "Tarea no encontrada"}
    return tarea

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