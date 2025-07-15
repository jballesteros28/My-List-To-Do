"""add created_at to user

Revision ID: a6bab4404411
Revises: e51e23f1b7f7
Create Date: 2025-07-07 11:51:42.863823

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa


revision: str = 'a6bab4404411'
down_revision: Union[str, None] = 'e51e23f1b7f7'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

def upgrade():
    op.add_column('users', sa.Column('created_at', sa.DateTime(), nullable=True))
    bind = op.get_bind()
    dialect = bind.dialect.name

    if dialect == 'sqlite':
        op.execute(
            "UPDATE users SET created_at = CURRENT_TIMESTAMP WHERE created_at IS NULL"
        )
    else:
        op.execute(
            "UPDATE users SET created_at = NOW() WHERE created_at IS NULL"
        )
        op.alter_column('users', 'created_at', nullable=False)

def downgrade() -> None:
    op.alter_column('users', 'is_active',
               existing_type=sa.BOOLEAN(),
               nullable=False)
    op.drop_column('users', 'created_at')

