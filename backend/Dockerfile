FROM python:3.10.12-slim

WORKDIR /app

# Install system dependencies required for mysqlclient and MySQL CLI
RUN apt-get update && apt-get install -y \
    default-libmysqlclient-dev gcc python3-dev libmariadb-dev \
    mariadb-client pkg-config \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Expose Django application port
EXPOSE 8015

# Start the Django development server
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]

