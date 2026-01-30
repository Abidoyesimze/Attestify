# Attestify Backend

Django REST API backend for Attestify platform.

## Setup

1. Create virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Copy environment file:
```bash
cp .env.example .env
```

4. Run migrations:
```bash
python manage.py migrate
```

5. Create superuser:
```bash
python manage.py createsuperuser
```

6. Run server:
```bash
python manage.py runserver
```

## API Documentation

Visit `/api/docs/` for Swagger documentation.

## Testing

Run tests:
```bash
python manage.py test
```

Or with pytest:
```bash
pytest
```

## Environment Variables

See `.env.example` for required environment variables.

## Project Structure

- `api/` - Django project settings
- `attestify/` - Main app with models, views, serializers
- `ai_assistant/` - AI assistant integration
