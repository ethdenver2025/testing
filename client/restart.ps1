# Kill any running Node processes
taskkill /F /FI "PID ne 0" /IM node.exe

# Clear cache
Write-Host "Clearing cache..."
Remove-Item -Recurse -Force -ErrorAction SilentlyContinue .\node_modules\.cache

# Start the application
Write-Host "Starting application..."
npm start
