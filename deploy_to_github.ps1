$ErrorActionPreference = "Stop"

$git = "C:\Users\sriram\AppData\Local\MinGit\cmd\git.exe"
if (-not (Test-Path $git)) { $git = "git" }

$gh = "C:\Users\sriram\AppData\Local\gh\bin\gh.exe"
if (-not (Test-Path $gh)) { $gh = "gh" }

$repoName = "chellakutty"
$user = "janark07"

Write-Host "==========================================================" -ForegroundColor Magenta
Write-Host "   💖 Deploying Birthday Website to GitHub Pages 💖" -ForegroundColor Cyan
Write-Host "   Target Account: https://github.com/$user" -ForegroundColor Yellow
Write-Host "==========================================================" -ForegroundColor Magenta
Write-Host ""

# Step 1: Ensure git repo is committed
Set-Location -Path $PSScriptRoot
Write-Host "[1/4] Checking local Git repository..." -ForegroundColor Green
& $git add .
try {
    & $git commit -m "Update birthday website" 2>$null
} catch {}

# Step 2: Check GitHub CLI authentication
Write-Host "[2/4] Checking GitHub authorization..." -ForegroundColor Green
$authStatus = & $gh auth status 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host ">>> Opening browser to sign in to GitHub account ($user)..." -ForegroundColor Yellow
    Write-Host ">>> Please click 'Authorize' in your browser to continue." -ForegroundColor Yellow
    Write-Host ""
    & $gh auth login --web -h github.com -p https
}

# Step 3: Create GitHub repository if it doesn't exist, and push
Write-Host ""
Write-Host "[3/4] Creating repository and pushing to GitHub ($user/$repoName)..." -ForegroundColor Green

$repoExists = $false
try {
    & $gh repo view "$user/$repoName" 2>$null
    if ($LASTEXITCODE -eq 0) { $repoExists = $true }
} catch {}

if ($repoExists) {
    Write-Host "Repository $user/$repoName already exists. Setting remote and pushing..." -ForegroundColor Cyan
    & $git remote remove origin 2>$null
    & $git remote add origin "https://github.com/$user/$repoName.git"
    & $git branch -M main
    & $git push -u origin main --force
} else {
    Write-Host "Creating new public repository $user/$repoName on GitHub..." -ForegroundColor Cyan
    & $gh repo create "$user/$repoName" --public --source="." --remote=origin --push
}

# Step 4: Enable GitHub Pages
Write-Host ""
Write-Host "[4/4] Activating GitHub Pages for live mobile access..." -ForegroundColor Green
try {
    & $gh api -X POST "repos/$user/$repoName/pages" -f "source[branch]=main" -f "source[path]=/" 2>$null
    Write-Host "GitHub Pages activated successfully!" -ForegroundColor Green
} catch {
    Write-Host "GitHub Pages may already be active or queued for building." -ForegroundColor Yellow
}

$liveUrl = "https://$user.github.io/$repoName/"
Write-Host ""
Write-Host "==========================================================" -ForegroundColor Magenta
Write-Host " 🎉 SUCCESS! Your website is live at:" -ForegroundColor Green
Write-Host " 👉 $liveUrl" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Magenta
Write-Host ""
Write-Host "Opening live link in browser..." -ForegroundColor Yellow
Start-Process $liveUrl
Write-Host "Press any key to exit..."
[Console]::ReadKey() | Out-Null
