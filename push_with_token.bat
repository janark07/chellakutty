@echo off
title Push Chellakutty Birthday Website to GitHub
cd /d "%~dp0"
echo =======================================================
echo   💖 Chellakutty Birthday Website GitHub Publisher 💖
echo =======================================================
echo.
echo Target Repo: https://github.com/janark07/chellakutty.git
echo.
set /p TOKEN="Please paste your GitHub Personal Access Token: "

if "%TOKEN%"=="" (
    echo Error: Token cannot be empty.
    pause
    exit /b
)

echo.
echo [1/3] Pushing files, photos and music to GitHub...
"C:\Users\sriram\AppData\Local\MinGit\cmd\git.exe" push https://janark07:%TOKEN%@github.com/janark07/chellakutty.git main --force

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo Push failed. Please make sure the token has 'repo' permission.
    pause
    exit /b
)

echo.
echo [2/3] Activating GitHub Pages...
curl.exe -s -X POST -H "Authorization: token %TOKEN%" -H "Accept: application/vnd.github.v3+json" https://api.github.com/repos/janark07/chellakutty/pages -d "{\"source\":{\"branch\":\"main\",\"path\":\"/\"}}" > nul

echo.
echo [3/3] DONE! Your birthday website is now live at:
echo.
echo    👉 https://janark07.github.io/chellakutty/
echo.
echo (It takes about 30-60 seconds for GitHub to finish the first build)
echo Opening link in browser...
start https://janark07.github.io/chellakutty/
echo.
pause
