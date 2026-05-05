@echo off
title Update ERP on GitHub and Firebase
echo ===================================================
echo   Updating ERP System (Arka Jain University)
echo ===================================================
echo.

cd /d "%~dp0"

echo [1/3] Committing changes to Git...
git add .
git commit -m "Auto-update from deploy.bat"
git push origin master

echo.
echo [2/3] Building production version...
call npm run build

echo.
echo [3/3] Deploying to Firebase Hosting...
call npx firebase-tools deploy --only hosting --project aju-erp-2026

echo.
echo ===================================================
echo   Update Complete!
echo ===================================================
pause
