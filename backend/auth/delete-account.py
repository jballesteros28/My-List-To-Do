from fastapi import APIRouter, Depends
from backend.models import User
from backend.database import get_db
from backend.auth import get_current_user  # tu función que obtiene el usuario logueado
from sqlalchemy.orm import Session
from backend.models import Tarea

router = APIRouter()

@router.delete("/delete-account")
def delete_account(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    # Elimina primero todas las tareas del usuario
    db.query(Tarea).filter(Tarea.user_id == current_user.id).delete()
    # Luego elimina el usuario
    db.delete(current_user)
    db.commit()
    return {"msg": "Cuenta eliminada correctamente"}

