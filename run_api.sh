#!/bin/bash
set -e

cd /workspaces/ammg/backend
echo "Starting MinuteMinds Backend API..."
echo "=================="
echo "API will run on: http://localhost:5000"
echo "Login endpoint: POST http://localhost:5000/login"
echo "Admin endpoints: GET http://localhost:5000/admin/*"
echo "=================="
python app.py
