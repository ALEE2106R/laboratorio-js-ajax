@echo off
cd /d "%~dp0"
echo Abre http://localhost:8000 en tu navegador.
echo Para detener el servidor, pulsa Ctrl+C.
py -m http.server 8000 --bind 127.0.0.1
pause
