import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# Usa variable de entorno para la URL de la base de datos
DATABASE_URL = os.getenv("postgresql://list_to_do_user:ps0pY8iSlykRIPYFk3FKxtZiXKZrvKRz@dpg-d0stkv3uibrs73apr38g-a/list_to_do")

engine = create_engine(DATABASE_URL, pool_pre_ping=True)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

base = declarative_base()
