from fastapi import FastAPI
from pydantic import BaseModel
from backend.llm.pipeline import generate_response

app = FastAPI()

class QueryRequest(BaseModel):
    question: str

@app.post("/ask")
def ask(req: QueryRequest):
    response = generate_response(req.question)
    return {"answer": response}
