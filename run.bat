@echo off
cd client

start cmd /k "cd /d c:\Users\clare\OneDrive\Desktop\Bookeeper\client && npx tailwindcss -i ./src/_App.css -o ./src/css/App.css --watch"
start cmd /k "cd /d c:\Users\clare\OneDrive\Desktop\Bookeeper\client && npm start"
start cmd /k "cd c:\Users\clare\OneDrive\Desktop\Bookeeper\server && python ./app.py"