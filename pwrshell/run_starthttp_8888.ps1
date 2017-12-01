if (!([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")) { Start-Process powershell.exe "-NoProfile -ExecutionPolicy Bypass -File `"$PSCommandPath`"" -Verb RunAs; exit }

Import-Module "C:\PROJETS_VV\VVRESTPOWERSHELL\vvengine\MyHttpListener\HttpListener.psd1" -Force
Start-HttpListener -Auth "Basic"