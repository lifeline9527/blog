@echo off
cd /d "%~dp0"
if exist "C:\Program Files\nodejs\node.exe" set "PATH=C:\Program Files\nodejs;%PATH%"
title Local Blog - do not close this window

echo ==================================================
echo.
echo    Local blog preview
echo.
echo    URL : http://localhost:4321
echo    Stop: close this window
echo.
echo ==================================================
echo.
echo Starting dev server, browser will open in 6 seconds...
echo.

start "" cmd /c "timeout /t 6 >nul & start http://localhost:4321"

call npm run dev -- --port 4321 --force

echo.
echo Server stopped. Press any key to close.
pause >nul
