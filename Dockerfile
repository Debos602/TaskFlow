# Build stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev
COPY . .
ARG VITE_API_URL=http://localhost:5000/api
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

# Production stage
FROM nginx:1.27-alpine AS runner
LABEL org.opencontainers.image.title="taskflow-frontend"

# nginx will serve from /usr/share/nginx/html
COPY --from=builder /app/dist /usr/share/nginx/html

# Default config: serve the SPA and fall back to index.html
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
