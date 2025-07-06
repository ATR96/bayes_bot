import time
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.responses import StreamingResponse

from backend.utils.logger import logger
from backend.utils.trace import generate_trace_id
from backend.llm.pipeline import generate_response_stream
from backend.utils.cache import clear_huggingface_cache, get_cache_size_mb

app = FastAPI()


class QueryRequest(BaseModel):
    question: str

# Endpoint: Ask a Question (Streaming Response)
@app.post("/ask")
def ask(req: QueryRequest):
    trace_id = generate_trace_id()
    start_time = time.time()

    try:
        logger.info(f"[{trace_id}] Received question: {req.question}")
        stream = generate_response_stream(req.question)

        def token_stream():
            yield f"[{trace_id}] "
            for chunk in stream:
                yield chunk

        logger.info(f"[{trace_id}] Streaming response initialized in {round(time.time() - start_time, 2)}s")
        return StreamingResponse(token_stream(), media_type="text/plain")

    except Exception as e:
        logger.exception(f"[{trace_id}] Failed to generate response")
        return {
            "error": "Internal server error",
            "trace_id": trace_id,
        }

# Endpoint: Ask a Question (Single Response)
# @app.post("/ask")
# def ask(req: QueryRequest):
#     trace_id = generate_trace_id()
#     start_time = time.time()

#     logger.info(f"[{trace_id}] Received question: {req.question}")
#     try:
#         response = generate_response(req.question)

#         logger.info(f"[{trace_id}] Retrieved chunks: {response.get('retrieved_chunks', [])}")
#         logger.info(f"[{trace_id}] Answer: {response.get('answer')}")
#         logger.info(f"[{trace_id}]  Response time: {round(time.time() - start_time, 2)}s")

#         return {
#             "answer": response["answer"],
#             "context": response["retrieved_chunks"],
#             "trace_id": trace_id,
#         }

#     except Exception as e:
#         logger.exception(f"[{trace_id}] Failed to generate response")
#         return {
#             "error": "Internal server error",
#             "trace_id": trace_id,
#         }

# Shutdown: Clean HF Cache
@app.on_event("shutdown")
def on_shutdown():
    before = get_cache_size_mb()
    print(f"[Shutdown] Cache size before: {before} MB")
    clear_huggingface_cache()
    after = get_cache_size_mb()
    print(f"[Shutdown] Cache size after: {after} MB")


# Health Check Endpoint
@app.get("/health")
def health_check():
    return {"status": "ok"}
