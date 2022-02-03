#!/bin/sh
export DATABASE_URL="postgresql://postgres:postgres@db:5432/ecom?connection_limit=2&pool_timeout=0";
export JWT_KEY="horse4bat";
export STRIPE_KEY="sk_test_51Ib8bCDRIyOVCuu17qHckpxZbPSOpMJ2EaX5hZc0FeraS9e5prpxiE1vIvMDk8mEZxyLX7O0QmE1f47xvtfMyryF00vDPgW5qq";
export HOST="https://acme-ecom.xyz"
export REDIS="cache"
npx prisma migrate dev && npx prisma db seed && npm run start;