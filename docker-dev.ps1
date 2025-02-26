Write-Host "Starting Docker development environment..." -ForegroundColor Green

# Check if Docker is running
try {
    docker info | Out-Null
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Docker is not running. Please start Docker Desktop and try again." -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "Docker is not installed or not in PATH. Please install Docker Desktop and try again." -ForegroundColor Red
    exit 1
}

# Build and start containers
Write-Host "Building and starting containers..." -ForegroundColor Cyan
docker-compose up --build

# The script will wait here while the containers are running
# When user presses Ctrl+C, we'll shut down gracefully
Write-Host "Docker environment is running. Press Ctrl+C to stop..." -ForegroundColor Green

# Wait for Ctrl+C
try {
    Wait-Event -Timeout ([int]::MaxValue)
} finally {
    # Clean up
    Write-Host "Stopping Docker containers..." -ForegroundColor Yellow
    docker-compose down
    Write-Host "Docker environment stopped." -ForegroundColor Green
}
