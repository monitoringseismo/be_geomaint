@echo off

:: Pindah ke folder project
cd /d C:\be_seismo\

echo Pulling latest code...
git pull

echo Installing dependencies...
npm install

echo Restarting PM2 process...
pm2 restart 2

echo Deploy done!
pause
