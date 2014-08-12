@echo off
rem Creation de la structure
mkdir dist
mkdir dist\scripts
mkdir dist\styles

rem Copie de la structure 
xcopy ..\scripts\vendor\onc .\dist\scripts /r /e /I /y
xcopy ..\styles\vendor\onc .\dist\styles /r /e /I /y
rem Tagging de la version
echo Krux/OpenNetworkContainer > .\dist\version.md
echo Build Date : >> .\dist\version.md
date /t >> .\dist\version.md
time /t  >> .\dist\version.md



