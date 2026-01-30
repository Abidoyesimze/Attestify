# Deployment Guide

## Backend Deployment

### Using Docker

```bash
cd backend
docker build -t attestify-backend .
docker run -p 8000:8000 attestify-backend
```

### Using Heroku

```bash
heroku create attestify-backend
heroku config:set SECRET_KEY=your-secret-key
git push heroku main
```

### Environment Variables

Set these in your deployment platform:
- `SECRET_KEY`
- `DEBUG=False`
- `ALLOWED_HOSTS`
- `DATABASE_URL`
- `CORS_ALLOWED_ORIGINS`

## Frontend Deployment

### Using Vercel

1. Connect your GitHub repository
2. Set environment variables
3. Deploy automatically on push

### Using Docker

```bash
cd frontend
docker build -t attestify-frontend .
docker run -p 3000:3000 attestify-frontend
```

### Environment Variables

- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_CONTRACT_ADDRESS`
- `NEXT_PUBLIC_CHAIN_ID`

## Database Migrations

Always run migrations before deployment:

```bash
python manage.py migrate
```

## Static Files

Collect static files for production:

```bash
python manage.py collectstatic --noinput
```
