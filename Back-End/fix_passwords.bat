@echo off
echo ========================================
echo   Password Fix Script
echo ========================================
echo.

cd /d "%~dp0"

if not exist "venv\Scripts\activate.bat" (
    echo ERROR: Virtual environment not found!
    echo Please create it first:
    echo   python -m venv venv
    echo   venv\Scripts\activate
    echo   pip install -r requirements.txt
    pause
    exit /b 1
)

echo Activating virtual environment...
call venv\Scripts\activate.bat

echo.
echo Running password fix script...
echo.
python fix_passwords.py

echo.
echo ========================================
echo   Done!
echo ========================================
pause
