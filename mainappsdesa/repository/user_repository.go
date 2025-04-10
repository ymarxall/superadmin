package repository

import (
	"context"
	"database/sql"
	"godesaapps/model"
	"time"
)

type UserRepository interface {
	CreateUser(ctx context.Context, tx *sql.Tx, user model.User) (model.User, error)
	FindById(ctx context.Context, tx *sql.Tx, idUser string) (model.User, error)
	FindByNik(ctx context.Context, tx *sql.Tx, email string) (model.User, error)
	FindByEmail(email string) (*model.User, error)
	UpdateResetToken(email, token string, expiry time.Time) error
	FindByResetToken(token string) (*model.User, error)
	UpdatePassword(email, newPassword string) error
}