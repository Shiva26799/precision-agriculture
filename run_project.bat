@echo off
echo Starting KrishiMitra Project...

:: Start Backend
start "KrishiMitra Backend (Flask)" cmd /k "cd backend && .\venv\Scripts\activate && python app.py"

:: Start Frontend
start "KrishiMitra Frontend (React)" cmd /k "cd frontend && npm run dev"

echo.
echo ========================================================
echo  Project is starting in two separate windows.
echo  1. Backend running on http://localhost:5000
echo  2. Frontend running on http://localhost:5173
echo.
echo  Please wait a few seconds, then open:
echo  http://localhost:5173
echo ========================================================
pause
