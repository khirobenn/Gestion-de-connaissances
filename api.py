from collections.abc import AsyncIterable
import asyncio
from fastapi import FastAPI
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
from sse_starlette import EventSourceResponse 
# from starlette.responses import StreamingResponse
from app import chain
from vector import retriever

class Item(BaseModel):
    question: str

app = FastAPI()
origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Hello!! I'm working"}

@app.post("/chat/")
async def post(question_item:Item):
    information = retriever.invoke(question_item.question)
    res = chain.invoke({"information": information, "question": question_item.question})
    return {"response":res}
    # return StreamingResponse(stream_generator(res), media_type='text/event-stream')

async def stream_response(chain, information, question_item):
    for chunk in chain.stream({"information": information, "question": question_item.question}):
    #     yield json.dumps({"event": "message", "message": chunk})
        yield chunk
        await asyncio.sleep(0.5)
    # yield json.dumps({"event" : "end"})

@app.post("/stream/", response_class=StreamingResponse)
async def stream(question_item:Item):
    information = retriever.invoke(question_item.question)
    return StreamingResponse(stream_response(chain, information, question_item), media_type="text/plain")

if __name__ == "__main__":
    uvicorn.run("api:app", port=5000, log_level="info")