@echo off
REM ============================================================================
REM Crop Disease Detection - Quick Run Script for Windows
REM Use this after running SETUP_WINDOWS.bat
REM ============================================================================

echo.
echo ========================================================================
echo CROP DISEASE DETECTION - TRAINING SYSTEM
echo ========================================================================
echo.

REM Check if virtual environment exists
if not exist tf_gpu_env (
    echo [ERROR] Virtual environment not found!
    echo Please run SETUP_WINDOWS.bat first
    pause
    exit /b 1
)

REM Activate virtual environment
echo Activating virtual environment...
call tf_gpu_env\Scripts\activate.bat

REM Check GPU
echo.
echo Checking GPU status...
nvidia-smi --query-gpu=name,memory.total,driver_version --format=csv,noheader
echo.

REM Run main script
echo Starting training system...
echo.
python main.py

REM Keep window open
pause
