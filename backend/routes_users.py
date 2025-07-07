from fastapi import APIRouter, Depends, HTTPException, status
import secrets
import smtplib
from dotenv import load_dotenv
import os
from email.mime.text import MIMEText
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from backend.schemas import UserCreate, ForgotPasswordRequest, ResetPasswordRequest, ValidateResetCodeRequest, ResendConfirmationRequest
from backend.models import User, ConfirmationToken, PasswordResetCode
from backend.auth import verify_password, create_access_token, pwd_context
from backend.database import get_db 
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from fastapi import BackgroundTasks
from backend.auth import get_current_user

load_dotenv()  # Esto carga el .env al entorno

router = APIRouter()


@router.post("/register")
def register(user: UserCreate, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(
        (User.email == user.email) | (User.username == user.username)
    ).first()
    if existing_user:
        if existing_user.email == user.email:
            raise HTTPException(status_code=409, detail="El email ya está registrado")
        else:
            raise HTTPException(status_code=409, detail="El nombre de usuario ya está registrado")


    # 1. Crear el usuario con is_active=False
    hashed_password = pwd_context.hash(user.password)
    db_user = User(username=user.username, email=user.email, hashed_password=hashed_password, is_active=False)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    # 2. Generar token de confirmación y guardar
    token = secrets.token_urlsafe(20)
    db_token = ConfirmationToken(user_id=db_user.id, token=token)
    db.add(db_token)
    db.commit()

    # 3. Enviar mail con link de confirmación
    confirmation_link = f"https://my-list-to-do.onrender.com/confirm-email?token={token}"
    background_tasks.add_task(
        send_email,
        to=user.email,
        subject="Confirma tu cuenta",
        body=f"¡Bienvenido! Haz click para confirmar tu cuenta: {confirmation_link}"
    )
    return {"msg": "Revisa tu correo para confirmar tu cuenta"}

from fastapi.responses import RedirectResponse

from fastapi.responses import RedirectResponse

@router.get("/confirm-email")
def confirm_email(token: str, db: Session = Depends(get_db)):
    db_token = db.query(ConfirmationToken).filter_by(token=token).first()
    if not db_token:
        return RedirectResponse(url="https://my-list-to-do.onrender.com/login?confirm=fail")
    user = db.query(User).filter_by(id=db_token.user_id).first()
    if not user:
        return RedirectResponse(url="https://my-list-to-do.onrender.com/login?confirm=fail")
    user.is_active = True
    db.delete(db_token)
    db.commit()
    # Redirige al login de tu frontend y puede pasar query param para feedback
    return RedirectResponse(url="https://my-list-to-do.onrender.com/login?confirm=success")




@router.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.username == form_data.username).first()
    if not db_user or not verify_password(form_data.password, db_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Credenciales incorrectas"
        )
    # Chequear si el usuario está activo (confirmó el mail)
    if not db_user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Debes confirmar tu correo antes de iniciar sesión"
        )
    access_token = create_access_token({"sub": db_user.username})
    return {"access_token": access_token, "token_type": "bearer"}



# Simulación: diccionario temporal para tokens
reset_tokens = {}


def send_email(to, subject, body):
    msg = MIMEText(body)
    msg['Subject'] = subject
    msg['From'] = os.environ.get('SMTP_USER')
    msg['To'] = to

    SMTP_HOST = os.environ.get('SMTP_HOST')
    SMTP_PORT = int(os.environ.get('SMTP_PORT', 587))
    SMTP_USER = os.environ.get('SMTP_USER')
    SMTP_PASS = os.environ.get('SMTP_PASS')
    
    if not SMTP_HOST or not SMTP_USER or not SMTP_PASS:
        raise ValueError("Faltan variables de entorno SMTP_HOST, SMTP_USER o SMTP_PASS")


    with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
        if SMTP_HOST and ("gmail" in SMTP_HOST or SMTP_PORT in [465, 587]):
            server.starttls()
        # Para Mailtrap, no hace falta starttls()
        server.login(SMTP_USER, SMTP_PASS)
        server.send_message(msg)





@router.post("/forgot-password")
def forgot_password(req: ForgotPasswordRequest, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    user = db.query(User).filter_by(email=req.email).first()
    if user:
        code = str(secrets.randbelow(899999) + 100000)  # 6 dígitos
        expiration = datetime.utcnow() + timedelta(minutes=10)
        db_otp = PasswordResetCode(email=user.email, code=code, expiration=expiration)
        db.add(db_otp)
        db.commit()
        # Enviar el correo como tarea en segundo plano
        background_tasks.add_task(
            send_email,
            to=user.email,
            subject="Código de recuperación",
            body=f"Tu código para resetear la contraseña es: {code}"
        )
    return {"msg": "Si el mail existe, se envió un código"}

@router.post("/reset-password")
def reset_password(req: ResetPasswordRequest, db: Session = Depends(get_db)):
    """
    Cambia la contraseña del usuario si el código es válido. Borra el código después de usarlo.
    """
    # Verificar que el usuario existe y corresponde al email
    user = db.query(User).filter_by(username=req.username, email=req.email).first()
    if not user:
        raise HTTPException(status_code=400, detail="Usuario y/o email no válidos")

    # Verificar el código
    db_otp = db.query(PasswordResetCode).filter_by(email=req.email, code=req.otp).first()
    if not db_otp or db_otp.expiration < datetime.utcnow():
        raise HTTPException(status_code=400, detail="Código inválido o expirado")

    # Cambiar la contraseña
    user.hashed_password = pwd_context.hash(req.new_password)
    db.delete(db_otp)
    db.commit()
    return {"msg": "Contraseña cambiada con éxito"}



@router.post("/validate-reset-code")
def validate_reset_code(req: ValidateResetCodeRequest, db: Session = Depends(get_db)):
    """
    Valida que el código (otp) de recuperación para el usuario y email sea correcto y no esté expirado.
    """
    # Verificar que el usuario existe y corresponde al email
    user = db.query(User).filter_by(username=req.username, email=req.email).first()
    if not user:
        raise HTTPException(status_code=400, detail="Usuario y/o email no válidos")

    # Buscar el código activo
    db_otp = db.query(PasswordResetCode).filter_by(email=req.email, code=req.otp).first()
    if not db_otp or db_otp.expiration < datetime.utcnow():
        raise HTTPException(status_code=400, detail="Código inválido o expirado")
    return {"msg": "Código válido"}


@router.post("/resend-confirmation")
def resend_confirmation(req: ResendConfirmationRequest, db: Session = Depends(get_db)):
    email = req.email
    user = db.query(User).filter_by(email=email).first()
    if not user:
        # El usuario no existe
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    if user.is_active:
        # La cuenta ya fue confirmada
        return {"msg": "La cuenta ya fue confirmada"}

    # (Opcional) Borra tokens anteriores para evitar duplicados y problemas de seguridad
    db.query(ConfirmationToken).filter_by(user_id=user.id).delete()

    # Crea un nuevo token y lo guarda
    token = secrets.token_urlsafe(20)
    db_token = ConfirmationToken(user_id=user.id, token=token)
    db.add(db_token)
    db.commit()

    # Prepara el link de confirmación (ajusta la URL a tu frontend real)
    confirmation_link = f"https://my-list-to-do.onrender.com/confirm-email?token={token}"

    # Envía el correo de confirmación
    send_email(
        to=user.email,
        subject="Reenvío de confirmación de cuenta",
        body=f"¡Hola! Haz click en el siguiente enlace para confirmar tu cuenta:\n{confirmation_link}\n\nSi no pediste esto, ignora el mensaje."
    )
    return {"msg": "Te enviamos un nuevo correo de confirmación"}



@router.delete("/cleanup-unconfirmed-users")
def cleanup_unconfirmed_users(db: Session = Depends(get_db)):
    dias = 2  # Puedes ajustar este número
    fecha_limite = datetime.utcnow() - timedelta(days=dias)
    # Supón que tienes una columna "created_at" en User
    borrados = db.query(User).filter(
        User.is_active == False,
        User.created_at < fecha_limite
    ).delete(synchronize_session=False)
    db.commit()
    return {"borrados": borrados}


@router.delete("/delete-account")
def delete_account(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    db.delete(current_user)
    db.commit()
    return {"msg": "Cuenta eliminada correctamente"}

