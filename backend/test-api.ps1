$headers = @{
    'Content-Type' = 'application/json'
}

# Test 1: Health Check
Write-Host "=== Testing Health Check ===" -ForegroundColor Green
$health = Invoke-WebRequest -Uri 'http://localhost:5000/api/health' -UseBasicParsing
Write-Host "Status: $($health.StatusCode)" -ForegroundColor Cyan
Write-Host "Response: $($health.Content)" -ForegroundColor Yellow
Write-Host ""

# Test 2: Login (will fail without admin in DB, but shows endpoint works)
Write-Host "=== Testing Login Endpoint ===" -ForegroundColor Green
$loginBody = @{
    email = "admin@portfolio.com"
    password = "admin123"
} | ConvertTo-Json

try {
    $login = Invoke-WebRequest -Uri 'http://localhost:5000/api/auth/login' -Method POST -Headers $headers -Body $loginBody -UseBasicParsing
    Write-Host "Status: $($login.StatusCode)" -ForegroundColor Cyan
    Write-Host "Response: $($login.Content)" -ForegroundColor Yellow
} catch {
    Write-Host "Status: $($_.Exception.Response.StatusCode.Value)" -ForegroundColor Red
    Write-Host "Response: $($_.ErrorDetails.Message)" -ForegroundColor Yellow
}
Write-Host ""

# Test 3: Get Skills (public endpoint)
Write-Host "=== Testing Get Skills (Public) ===" -ForegroundColor Green
try {
    $skills = Invoke-WebRequest -Uri 'http://localhost:5000/api/skills' -UseBasicParsing
    Write-Host "Status: $($skills.StatusCode)" -ForegroundColor Cyan
    $skillsData = $skills.Content | ConvertFrom-Json
    Write-Host "Skills returned: $($skillsData.Count)" -ForegroundColor Yellow
    if ($skillsData.Count -gt 0) {
        Write-Host "First skill: $($skillsData[0])" -ForegroundColor Cyan
    }
} catch {
    Write-Host "Status: $($_.Exception.Response.StatusCode.Value)" -ForegroundColor Red
}
Write-Host ""

# Test 4: Get Experience (public endpoint)
Write-Host "=== Testing Get Experience (Public) ===" -ForegroundColor Green
try {
    $exp = Invoke-WebRequest -Uri 'http://localhost:5000/api/experience' -UseBasicParsing
    Write-Host "Status: $($exp.StatusCode)" -ForegroundColor Cyan
    $expData = $exp.Content | ConvertFrom-Json
    Write-Host "Experience entries returned: $($expData.Count)" -ForegroundColor Yellow
} catch {
    Write-Host "Status: $($_.Exception.Response.StatusCode.Value)" -ForegroundColor Red
}
Write-Host ""

# Test 5: Get Education (public endpoint)
Write-Host "=== Testing Get Education (Public) ===" -ForegroundColor Green
try {
    $edu = Invoke-WebRequest -Uri 'http://localhost:5000/api/education' -UseBasicParsing
    Write-Host "Status: $($edu.StatusCode)" -ForegroundColor Cyan
    $eduData = $edu.Content | ConvertFrom-Json
    Write-Host "Education entries returned: $($eduData.Count)" -ForegroundColor Yellow
} catch {
    Write-Host "Status: $($_.Exception.Response.StatusCode.Value)" -ForegroundColor Red
}
Write-Host ""

# Test 6: Get Projects (public endpoint)
Write-Host "=== Testing Get Projects (Public) ===" -ForegroundColor Green
try {
    $proj = Invoke-WebRequest -Uri 'http://localhost:5000/api/projects' -UseBasicParsing
    Write-Host "Status: $($proj.StatusCode)" -ForegroundColor Cyan
    $projData = $proj.Content | ConvertFrom-Json
    Write-Host "Projects returned: $($projData.Count)" -ForegroundColor Yellow
} catch {
    Write-Host "Status: $($_.Exception.Response.StatusCode.Value)" -ForegroundColor Red
}
Write-Host ""

Write-Host "=== API Tests Complete ===" -ForegroundColor Green
