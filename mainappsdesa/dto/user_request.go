package dto

type CreateUserRequest struct {
	Nikadmin	string `json:"nikadmin"`
	Email		string `json:"email"`
	Pass		string `json:"password"`
	NamaLengkap string `json:"namalengkap"`
	Role_id		string	`json:"role_id"`
}

type LoginUserRequest struct {
	Nikadmin	string `json:"nikadmin"`
	Pass  		string `json:"password"`
}

type ForgotPasswordRequest struct {
	Email string `json:"email" validate:"required,email"`
}

type ResetPasswordRequest struct {
    Token    string `json:"token"`
    Password string `json:"password" validate:"required,min=6"`
}