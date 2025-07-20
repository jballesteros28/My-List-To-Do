from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from backend.database import engine, get_db, SessionLocal
from backend.models import Base, Tarea, User
from backend.schemas import TareaCreate, Tarea_out
from typing import List
from backend.routes_users import router as users_router, cleanup_unconfirmed_users
from backend.auth import get_current_user
from apscheduler.schedulers.background import BackgroundScheduler


# Importar las dependencias necesarias

app = FastAPI()



def start_scheduler():
    scheduler = BackgroundScheduler()
    scheduler.add_job(lambda: cleanup_unconfirmed_users(SessionLocal()), 'interval', minutes=10)
    scheduler.start()
    

@app.on_event("startup")
def startup_event():
    start_scheduler()


# Habilitar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173",
                   "https://my-list-to-do-eight.vercel.app",
                   "http://127.0.0.1:5173",
                   "http://localhost:8000"
                   ],  # Podés poner tu frontend aquí para más seguridad
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine) #crea las tablas en la base de datos
app.include_router(users_router, prefix="/auth")


        
@app.post("/tareas/", response_model=Tarea_out)
def crear_tarea(
    tarea: TareaCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    nueva_tarea = Tarea(
        titulo=tarea.titulo,
        user_id=current_user.id  # Se asocia la tarea al usuario autenticado
    )
    db.add(nueva_tarea)
    db.commit()
    db.refresh(nueva_tarea)
    return nueva_tarea

@app.get("/tareas/", response_model=List[Tarea_out])
def lista_tareas(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    tareas = db.query(Tarea).filter(Tarea.user_id == current_user.id).all()
    return tareas


@app.get("/tareas{tarea_id}", response_model=Tarea_out)
def obtener_tarea(tarea_id: int, db: Session = Depends(get_db)):
    tarea = db.query(Tarea).filter(Tarea.id == tarea_id).first()
    if tarea is None:
        return {"error": "Tarea no encontrada"}
    return tarea

@app.put("/tareas/{tarea_id}", response_model=Tarea_out)
def actualizar_tarea(
    tarea_id: int,
    tarea_data: TareaCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    tarea = db.query(Tarea).filter(Tarea.id == tarea_id, Tarea.user_id == current_user.id).first()
    if not tarea:
        raise HTTPException(status_code=404, detail="Tarea no encontrada o no autorizada")
    tarea.titulo = tarea_data.titulo
    db.commit()
    db.refresh(tarea)
    return tarea

@app.delete("/tareas/{tarea_id}")
def eliminar_tarea(
    tarea_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    tarea = db.query(Tarea).filter(Tarea.id == tarea_id, Tarea.user_id == current_user.id).first()
    if not tarea:
        raise HTTPException(status_code=404, detail="Tarea no encontrada o no autorizada")
    db.delete(tarea)
    db.commit()
    return {"mensaje": "Tarea eliminada correctamente"}