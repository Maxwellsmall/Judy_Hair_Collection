# ============================================================================
# Project Context Generator for Judy Hair Collection
# PowerShell version - Generates comprehensive project summary
# ============================================================================

param(
    [string]$OutputFile = "project_context.txt"
)

$ErrorActionPreference = "Stop"
$TempFile = "temp_context.txt"

Write-Host "Generating project context..." -ForegroundColor Cyan

# Clear/create temp file
Clear-Content $TempFile -ErrorAction SilentlyContinue
New-Item $TempFile -ItemType File -Force | Out-Null

# ============================================================================
# SECTION 1: PROJECT INFO
# ============================================================================
"--- PROJECT INFO ---" | Add-Content $TempFile
"Judy Hair Collection - Frontend Catalog" | Add-Content $TempFile
"Generated: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" | Add-Content $TempFile
"" | Add-Content $TempFile

# ============================================================================
# SECTION 2: PACKAGE.JSON DEPENDENCIES
# ============================================================================
"--- PACKAGE.JSON DEPENDENCIES ---" | Add-Content $TempFile
if (Test-Path "package.json") {
    $packageJson = Get-Content "package.json" -Raw | ConvertFrom-Json
    "Main dependencies:" | Add-Content $TempFile
    $packageJson.dependencies.PSObject.Properties | ForEach-Object {
        "  $($_.Name): $($_.Value)" | Add-Content $TempFile
    }
    "" | Add-Content $TempFile
    "Dev dependencies:" | Add-Content $TempFile
    $packageJson.devDependencies.PSObject.Properties | ForEach-Object {
        "  $($_.Name): $($_.Value)" | Add-Content $TempFile
    }
}
"" | Add-Content $TempFile

# ============================================================================
# SECTION 3: REACT ROUTES SUMMARY
# ============================================================================
"--- REACT ROUTES SUMMARY ---" | Add-Content $TempFile
$routeFiles = Get-ChildItem -Path "src/routes" -Filter "*.tsx" -Recurse -ErrorAction SilentlyContinue
if ($routeFiles) {
    foreach ($file in $routeFiles) {
        "" | Add-Content $TempFile
        "File: $($file.FullName)" | Add-Content $TempFile
        $content = Get-Content $file.FullName -Raw
        $matches = [regex]::Matches($content, '(?i)(Route|route|path\s*=|element\s*=)')
        foreach ($match in $matches) {
            "  $($match.Value)" | Add-Content $TempFile
        }
    }
} else {
    "No route files found in src/routes" | Add-Content $TempFile
}
"" | Add-Content $TempFile

# ============================================================================
# SECTION 4: COMPONENT INVENTORY
# ============================================================================
"--- COMPONENT INVENTORY ---" | Add-Content $TempFile
if (Test-Path "src/components") {
    $components = Get-ChildItem -Path "src/components" -Filter "*.tsx" -ErrorAction SilentlyContinue | Where-Object { $_.Name -notlike "*.test.*" }
    "Components found ($($components.Count)):" | Add-Content $TempFile
    $components | ForEach-Object { "  - $($_.Name)" | Add-Content $TempFile }
}
"" | Add-Content $TempFile

# ============================================================================
# SECTION 5: PAGE INVENTORY
# ============================================================================
"--- PAGE INVENTORY ---" | Add-Content $TempFile
if (Test-Path "src/pages") {
    $pages = Get-ChildItem -Path "src/pages" -Filter "*.tsx" -Recurse -ErrorAction SilentlyContinue | Where-Object { $_.Name -notlike "*.test.*" }
    "Pages found ($($pages.Count)):" | Add-Content $TempFile
    $pages | ForEach-Object { "  - $($_.FullName.Replace($PWD.Path + '\', ''))" | Add-Content $TempFile }
}
"" | Add-Content $TempFile

# ============================================================================
# SECTION 6: PROJECT STRUCTURE
# ============================================================================
"--- PROJECT STRUCTURE ---" | Add-Content $TempFile
"Directories (excluding node_modules, .git, dist):" | Add-Content $TempFile
Get-ChildItem -Directory | Where-Object { $_.Name -notin @('node_modules', '.git', 'dist', '.qwen') } | ForEach-Object {
    "  $($_.Name)/" | Add-Content $TempFile
}
"" | Add-Content $TempFile

"Source folders:" | Add-Content $TempFile
if (Test-Path "src") {
    Get-ChildItem -Path "src" -Directory | ForEach-Object {
        "  $($_.Name)/" | Add-Content $TempFile
    }
}
"" | Add-Content $TempFile

# ============================================================================
# SECTION 7: ALL SOURCE FILES CONTENT
# ============================================================================
"--- SOURCE FILES CONTENT ---" | Add-Content $TempFile

# Process TypeScript/TSX files
Write-Host "Processing TypeScript files..." -ForegroundColor Gray
$tsFiles = Get-ChildItem -Path "src" -Include "*.tsx", "*.ts" -Recurse | Where-Object {
    $_.FullName -notmatch 'node_modules|dist'
}
foreach ($file in $tsFiles) {
    "" | Add-Content $TempFile
    "================================================" | Add-Content $TempFile
    "FILE: $($file.FullName.Replace($PWD.Path + '\', ''))" | Add-Content $TempFile
    "================================================" | Add-Content $TempFile
    Get-Content $file.FullName | Add-Content $TempFile
}

# Process CSS files
Write-Host "Processing CSS files..." -ForegroundColor Gray
$cssFiles = Get-ChildItem -Path "src" -Include "*.css" -Recurse | Where-Object {
    $_.FullName -notmatch 'node_modules|dist'
}
foreach ($file in $cssFiles) {
    "" | Add-Content $TempFile
    "================================================" | Add-Content $TempFile
    "FILE: $($file.FullName.Replace($PWD.Path + '\', ''))" | Add-Content $TempFile
    "================================================" | Add-Content $TempFile
    Get-Content $file.FullName | Add-Content $TempFile
}

# Process config files
Write-Host "Processing config files..." -ForegroundColor Gray
$configFiles = @('vite.config.ts', 'tsconfig.json', 'tsconfig.app.json', 'tsconfig.node.json', 'package.json', 'tailwind.config.js', '.eslintrc.cjs', 'components.json')
foreach ($fileName in $configFiles) {
    if (Test-Path $fileName) {
        "" | Add-Content $TempFile
        "================================================" | Add-Content $TempFile
        "FILE: $fileName" | Add-Content $TempFile
        "================================================" | Add-Content $TempFile
        Get-Content $fileName | Add-Content $TempFile
    }
}

# Process README
if (Test-Path "README.md") {
    "" | Add-Content $TempFile
    "================================================" | Add-Content $TempFile
    "FILE: README.md" | Add-Content $TempFile
    "================================================" | Add-Content $TempFile
    Get-Content "README.md" | Add-Content $TempFile
}

# ============================================================================
# FINALIZE
# ============================================================================
Move-Item -Path $TempFile -Destination $OutputFile -Force

Write-Host ""
Write-Host "================================================" -ForegroundColor Green
Write-Host "Project context generated successfully!" -ForegroundColor Green
Write-Host "Output: $OutputFile" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Green
Write-Host ""
Write-Host "File statistics:" -ForegroundColor Cyan
Write-Host "  TypeScript files: $($tsFiles.Count)" -ForegroundColor White
Write-Host "  CSS files: $($cssFiles.Count)" -ForegroundColor White
$lineCount = (Get-Content $OutputFile | Measure-Object -Line).Lines
Write-Host "  Total lines in output: $lineCount" -ForegroundColor White
