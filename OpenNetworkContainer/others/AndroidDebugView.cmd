
@echo off
mode con:cols=140 lines=9999
"%ANDROID_HOME%\platform-tools\adb" logcat CordovaLog:D *:S
