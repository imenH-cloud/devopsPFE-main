@echo off
REM Copy backend services (excluding node_modules)
for %%D in (parent student classroom activity teacher auth user gateway) do (
    echo Copying %%D...
    robocopy "D:\project\devopsPFE\backend\%%D" "D:\project\devopsPFE-main\backend\%%D" /S /E /XD node_modules dist build
)

REM Copy frontend (excluding node_modules)
echo Copying frontend...
robocopy "D:\project\devopsPFE\frontend" "D:\project\devopsPFE-main\frontend" /S /E /XD node_modules dist build

REM Copy docker-compose files
echo Copying docker-compose files...
robocopy "D:\project\devopsPFE\docker-compose" "D:\project\devopsPFE-main\docker-compose" /S /E

echo Done!
