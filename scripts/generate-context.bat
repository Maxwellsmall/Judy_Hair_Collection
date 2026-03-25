@echo off
REM ============================================================================
REM Project Context Generator for Judy Hair Collection
REM Generates a comprehensive summary of the React/Vite frontend project
REM ============================================================================

setlocal enabledelayedexpansion

echo Generating project context...

REM Create temp file
set TEMP_FILE=temp_context.txt
set OUTPUT_FILE=project_context.txt

REM Clear/create output file
type nul > %TEMP_FILE%

REM ============================================================================
REM SECTION 1: PROJECT INFO
REM ============================================================================
echo --- PROJECT INFO --- >> %TEMP_FILE%
echo Judy Hair Collection - Frontend Catalog >> %TEMP_FILE%
echo Generated: %DATE% %TIME% >> %TEMP_FILE%
echo. >> %TEMP_FILE%

REM ============================================================================
REM SECTION 2: PACKAGE.JSON DEPENDENCIES
REM ============================================================================
echo --- PACKAGE.JSON DEPENDENCIES --- >> %TEMP_FILE%
if exist package.json (
    echo Main dependencies: >> %TEMP_FILE%
    findstr /R "\"react\" \"vite\" \"tailwind\" \"react-router\"" package.json >> %TEMP_FILE% 2>nul
    echo. >> %TEMP_FILE%
)

REM ============================================================================
REM SECTION 3: REACT ROUTES SUMMARY
REM ============================================================================
echo --- REACT ROUTES SUMMARY --- >> %TEMP_FILE%
echo Searching for route definitions in src/routes... >> %TEMP_FILE%
if exist src\routes (
    for /r src\routes %%f in (*.tsx *.ts) do (
        echo. >> %TEMP_FILE%
        echo File: %%f >> %TEMP_FILE%
        findstr /R "Route|route|path=" %%f >> %TEMP_FILE% 2>nul
    )
) else (
    echo No routes folder found >> %TEMP_FILE%
)
echo. >> %TEMP_FILE%

REM ============================================================================
REM SECTION 4: COMPONENT INVENTORY
REM ============================================================================
echo --- COMPONENT INVENTORY --- >> %TEMP_FILE%
if exist src\components (
    echo Components found: >> %TEMP_FILE%
    dir /b src\components\*.tsx src\components\*.ts 2>nul | findstr /v ".test." >> %TEMP_FILE%
)
echo. >> %TEMP_FILE%

REM ============================================================================
REM SECTION 5: PAGE INVENTORY
REM ============================================================================
echo --- PAGE INVENTORY --- >> %TEMP_FILE%
if exist src\pages (
    echo Pages found: >> %TEMP_FILE%
    dir /b /s src\pages\*.tsx src\pages\*.ts 2>nul | findstr /v ".test." >> %TEMP_FILE%
)
echo. >> %TEMP_FILE%

REM ============================================================================
REM SECTION 6: PROJECT STRUCTURE (excluding node_modules, .git, dist)
REM ============================================================================
echo --- PROJECT STRUCTURE --- >> %TEMP_FILE%
echo Directories: >> %TEMP_FILE%
dir /b /ad 2>nul | findstr /v "node_modules .git dist .qwen" >> %TEMP_FILE%
echo. >> %TEMP_FILE%
echo Source folders: >> %TEMP_FILE%
if exist src (
    dir /b /ad src 2>nul >> %TEMP_FILE%
)
echo. >> %TEMP_FILE%

REM ============================================================================
REM SECTION 7: ALL SOURCE FILES CONTENT
REM ============================================================================
echo --- SOURCE FILES CONTENT --- >> %TEMP_FILE%

REM Process TypeScript/TSX files
echo Processing TypeScript files... >> %TEMP_FILE%
for /r src %%f in (*.tsx *.ts) do (
    if not "%%~dpf" == "%CD%\node_modules\" (
        if not "%%~dpf" == "%CD%\dist\" (
            echo. >> %TEMP_FILE%
            echo ================================================ >> %TEMP_FILE%
            echo FILE: %%f >> %TEMP_FILE%
            echo ================================================ >> %TEMP_FILE%
            type "%%f" >> %TEMP_FILE% 2>nul
        )
    )
)

REM Process CSS files
echo Processing CSS files... >> %TEMP_FILE%
for /r src %%f in (*.css) do (
    echo. >> %TEMP_FILE%
    echo ================================================ >> %TEMP_FILE%
    echo FILE: %%f >> %TEMP_FILE%
    echo ================================================ >> %TEMP_FILE%
    type "%%f" >> %TEMP_FILE% 2>nul
)

REM Process config files
echo Processing config files... >> %TEMP_FILE%
for %%f in (vite.config.ts tsconfig.json tsconfig.app.json tsconfig.node.json package.json tailwind.config.js .eslintrc.cjs) do (
    if exist "%%f" (
        echo. >> %TEMP_FILE%
        echo ================================================ >> %TEMP_FILE%
        echo FILE: %%f >> %TEMP_FILE%
        echo ================================================ >> %TEMP_FILE%
        type "%%f" >> %TEMP_FILE% 2>nul
    )
)

REM Process README
if exist README.md (
    echo. >> %TEMP_FILE%
    echo ================================================ >> %TEMP_FILE%
    echo FILE: README.md >> %TEMP_FILE%
    echo ================================================ >> %TEMP_FILE%
    type README.md >> %TEMP_FILE% 2>nul
)

REM ============================================================================
REM FINALIZE
REM ============================================================================
move /y %TEMP_FILE% %OUTPUT_FILE%

echo.
echo ================================================
echo Project context generated successfully!
echo Output: %OUTPUT_FILE%
echo ================================================
echo.
echo File count: 
dir /b src\*.tsx src\*.ts src\**\*.tsx src\**\*.ts 2>nul | find /c /v ""

endlocal
