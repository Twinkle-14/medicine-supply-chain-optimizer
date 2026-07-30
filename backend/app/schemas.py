from pydantic import BaseModel, EmailStr, ConfigDict


class UserRegister(BaseModel):
    full_name: str
    email: EmailStr
    password: str
    role: str
    hospital_id: int


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str


class UserRegister(BaseModel):
    full_name: str
    email: EmailStr
    password: str
    role: str

    model_config = ConfigDict(
        from_attributes=True
    )