#!/usr/bin/env bash

set -e

echo "Setting up environment file..."

if [ ! -f .env ]; then
  cp .env.example .env
fi

echo "Installing dependencies..."
npm install

echo "Building for production..."
npm run build

echo "Starting preview server on port 5173..."
npm run preview -- --port 5173
