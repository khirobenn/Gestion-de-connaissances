from fastapi import FastAPI
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from langchain.messages import AIMessage
from pydantic import BaseModel
import uvicorn
from app import chain, context_discussion, title
from vector import retriever

class Item(BaseModel):
    question: str
    previous_discussion : str

class FirstDiscussion(BaseModel):
    user_message : str
    ai_answer : str

app = FastAPI()
origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    # allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

async def stream_response(chain, information, previous_discussion, question_item):
    resp = ""
    for chunk in chain.stream({"information": information, "previous_discussion": previous_discussion, "question": question_item.question}):
        resp += chunk.content
        yield chunk.content
        # await asyncio.sleep(0.5)

@app.post("/stream/", response_class=StreamingResponse)
async def stream(question_item:Item):
    previous_discussion = question_item.previous_discussion
    if len(previous_discussion) == 0:
        question = AIMessage(content=question_item.question)
    else:
        question = context_discussion.invoke({"discussion": previous_discussion, "last_question": question_item.question})
    information = retriever.invoke(question.content)
    return StreamingResponse(stream_response(chain, information, previous_discussion, question_item), media_type="text/plain")

@app.post("/title")
async def generate_title(question_answer:FirstDiscussion):
    my_title = title.invoke({"user_message": question_answer.user_message, "ai_answer": question_answer.ai_answer})
    return {"title":my_title.content}

if __name__ == "__main__":
    uvicorn.run("api:app", port=5000, log_level="info")