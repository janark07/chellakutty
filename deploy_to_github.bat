@echo off
title Deploy Chellakutty Birthday Website to GitHub
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0deploy_to_github.ps1"
pause
