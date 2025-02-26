Write-Host "Installing dependencies..." -ForegroundColor Green
Set-Location client
npm install
Set-Location ..\server
npm install
Set-Location ..

Write-Host "Starting development servers..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location client; npm run dev"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location server; npm run dev"
