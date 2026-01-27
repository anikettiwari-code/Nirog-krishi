@echo off
echo ========================================================================
echo SETUP WINDOWS ENVIRONMENT
echo ========================================================================

echo 1. Creating Virtual Environment (tf_gpu_env)...
python -m venv tf_gpu_env

echo 2. Activating Environment...
call tf_gpu_env\Scripts\activate.bat

echo 3. Installing Dependencies...
python -m pip install --upgrade pip
pip install -r requirements_gpu.txt

echo.
echo ========================================================================
echo SETUP COMPLETE!
echo You can now run TEST_GPU.bat or RUN_TRAINING.bat
echo ========================================================================
pause
