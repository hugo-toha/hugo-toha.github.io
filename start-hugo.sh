#!/bin/bash

set -e  # Exit immediately if a command exits with a non-zero status

echo "🚿 Tidying Hugo modules..."
hugo mod tidy

echo "📦 Packing Hugo npm dependencies..."
hugo mod npm pack

echo "📥 Installing npm packages..."
npm install

echo "🔧 Fixing npm vulnerabilities..."
npm audit fix --force

echo "🚀 Starting Hugo server with watch..."
hugo server -w
