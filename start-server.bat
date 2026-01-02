@echo off
echo Iniciando servidor web local para Dashboard...
echo.
echo Abre tu navegador y visita: http://localhost:8080
echo.
echo Presiona Ctrl+C para detener el servidor
echo.
python -m http.server 8080
pause