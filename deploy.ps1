# Server details
$SERVER = "104.251.216.17"
$SERVER_USER = "root"
$APP_PATH = "/var/www/formicary-app"

Write-Host "Starting deployment process..." -ForegroundColor Green

# Step 1: Build client locally
Write-Host "Building client..." -ForegroundColor Yellow
Set-Location -Path "client"
npm run build
Set-Location -Path ".."

# Step 2: Deploy server
Write-Host "Deploying server..." -ForegroundColor Yellow
ssh ${SERVER_USER}@${SERVER} "cd ${APP_PATH} && ./scripts/deploy.sh"

# Step 3: Deploy client build
Write-Host "Deploying client build..." -ForegroundColor Yellow
scp -r client/dist/* ${SERVER_USER}@${SERVER}:${APP_PATH}/client/build/

Write-Host "Deployment complete! The application should be running at http://${SERVER}" -ForegroundColor Green
