#!/bin/bash
# Quick Start Script - Run this to start both backend and frontend

echo "=================================="
echo "Beauty Salon Auth System - Quick Start"
echo "=================================="

# Check if backend is running
echo ""
echo "Starting Backend (Port 5000)..."
cd "Backend"
npm run dev &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 2

# Check if frontend is running  
echo ""
echo "Starting Frontend (Port 5173)..."
cd "../frontend"
npm run dev &
FRONTEND_PID=$!

echo ""
echo "=================================="
echo "✓ Backend: http://localhost:5000"
echo "✓ Frontend: http://localhost:5173"
echo "=================================="
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""

# Keep script running
wait
