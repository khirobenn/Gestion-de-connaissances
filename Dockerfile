FROM python:3.10-slim-buster

WORKDIR /app

COPY requirements.txt requirements.txt
RUN pip3 install -r requirements.txt

COPY .env api.py app.py retriever.py ./

CMD ["python3", "api.py"]