# E-COMMERCE

# Project Title

An Ecommerce App designed to be used as a template to easily deploy e-commerce websites.
By leveraging the power of server-side rendering through nextJS and database caching through redis, TTI (Time To Interactive) is increased.
Built with NodeJS for backend and React for frontend.

## Usage
```
docker-compose up
````
Requires ENV variables for Stripe key, postgres and redis in ./server
postgres and redis urls must reference the service name in docker-compose.yml


## Demo

Currently hosted on Linode.
Link: http://139.177.199.145:3000/

Domain name and SSL certification is coming soon


## Features

- Server-side Rendering through NextJS
- DB Caching through Redis
- Payment management by Stripe API
- Authentication by JSON webtoken
- Session cookie management
- Responsive for mobile and tablets



## Tech Stack
- TypeScript
- React
- Node.JS
- Postgres
- Redis
- NextJS
- Tailwind
- Jest
- Docker


## Roadmap

- Dev pipeline through Github Actions
- Stripe webhook to complete payment integration
- Pupeteer tests
- Admin Dashboard
- Analytics Dashboard



## License

[MIT](https://choosealicense.com/licenses/mit/)
