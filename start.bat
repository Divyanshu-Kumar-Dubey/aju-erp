@echo off
title ERP Project Setup ^& Run
echo ===================================================
echo   Starting ERP System (Arka Jain University)
echo ===================================================
echo.

cd /d "%~dp0"

IF NOT EXIST "node_modules\" (
    echo Installing required dependencies for the first time...
    call npm install
    echo.
)

echo Starting the local server and opening your browser...
echo Closing this window will stop the server.
echo.

:: Start the Vite dev server and automatically open the default browser
call npm run dev -- --open

pause
