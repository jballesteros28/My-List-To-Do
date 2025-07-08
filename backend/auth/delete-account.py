from fastapi import APIRouter, Depends
from backend.models import User
from backend.database import get_db
from backend.auth import get_current_user  # tu función que obtiene el usuario logueado
from sqlalchemy.orm import Session

router = APIRouter()

@router.delete("/delete-account")
def delete_account(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    db.delete(current_user)
    db.commit()
    return {"msg": "Cuenta eliminada correctamente"}
