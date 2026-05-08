from pydantic import BaseModel

class UserInput(BaseModel):
    age: int
    income: int
    occupation: str
    state: str
    category: str
    gender: str
    disability: str