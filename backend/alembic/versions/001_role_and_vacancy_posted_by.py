"""add user role and vacancy posted_by_user_id

Revision ID: 001_role_posted
Revises:
Create Date: 2026-03-21

"""

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID

revision = "001_role_posted"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column(
        "users",
        sa.Column("role", sa.String(length=20), nullable=False, server_default="candidate"),
    )
    op.add_column("vacancies", sa.Column("posted_by_user_id", UUID(as_uuid=True), nullable=True))
    op.create_foreign_key(
        "fk_vacancies_posted_by_user_id_users",
        "vacancies",
        "users",
        ["posted_by_user_id"],
        ["id"],
        ondelete="SET NULL",
    )
    op.create_index("ix_vacancies_posted_by_user_id", "vacancies", ["posted_by_user_id"])


def downgrade() -> None:
    op.drop_index("ix_vacancies_posted_by_user_id", table_name="vacancies")
    op.drop_constraint("fk_vacancies_posted_by_user_id_users", "vacancies", type_="foreignkey")
    op.drop_column("vacancies", "posted_by_user_id")
    op.drop_column("users", "role")
