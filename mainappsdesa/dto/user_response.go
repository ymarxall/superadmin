package dto

type UserResponse struct {
	Id			string `json:"id"`
	Email		string `json:"email"`
	Nikadmin  	string `json:"nikadmin"`
	Pass		string `json:"password"`
	NamaLengkap	string	`json:"namalengkap"`
	Role_id		string `json:"role_id"`
}

type ForgotPasswordResponse struct {
	Message    string `json:"message"`
	ResetToken string `json:"reset_token,omitempty"`
}