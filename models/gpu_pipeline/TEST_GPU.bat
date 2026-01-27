@echo off
REM ============================================================================
REM Quick GPU Test for Windows
REM Run this to verify your GPU setup is working
REM ============================================================================

echo.
echo ========================================================================
echo QUICK GPU TEST
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
call tf_gpu_env\Scripts\activate.bat

REM Run quick start test
python quick_start.py

echo.
echo ========================================================================
echo Test complete!
echo ========================================================================
echo.
echo If GPU was detected, you're ready to train!
echo Next step: RUN_TRAINING.bat
echo.
pause
