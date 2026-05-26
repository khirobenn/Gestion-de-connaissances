FROM python:3.10-slim-bookworm

# 2. Python environment optimizations
# Prevents Python from writing .pyc files to disk
ENV PYTHONDONTWRITEBYTECODE=1
# Ensures logs are pushed directly to GCP Cloud Logging without buffering delays
ENV PYTHONUNBUFFERED=1

WORKDIR /app

COPY requirements.txt .

# 3. Use --no-cache-dir to keep the image size small
RUN pip3 install --no-cache-dir -r requirements.txt

COPY api.py app.py retriever.py ./

EXPOSE 8080

CMD ["uvicorn", "api:app", "--host", "0.0.0.0", "--port", "8080"]