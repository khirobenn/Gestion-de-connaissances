FROM python:3.10-slim-buster

WORKDIR /app

COPY requirements.txt requirements.txt
RUN pip3 install -r requirements.txt

COPY api.py app.py retriever.py ./

EXPOSE 8080
CMD ["python3", "api.py"]