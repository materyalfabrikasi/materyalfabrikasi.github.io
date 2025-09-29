@echo off
setlocal enabledelayedexpansion

REM ====== BURAYI KENDİ URL'İNLE DÜZENLE ======
set "BASE_URL=https://materyalfabrikasi.github.io/"

REM ====== ÇIKTI DOSYASI ======
set "OUTPUT=dosyalar.txt"

REM Eski dosyayı sil
if exist "%OUTPUT%" del "%OUTPUT%"

echo Dosyalar listeleniyor...

REM Geçerli klasör ve altındaki tüm dosyaları tara
for /r %%F in (*) do (
    REM Dosyanın klasör yolunu, geçerli dizinden itibaren al
    set "REL_PATH=%%F"
    set "REL_PATH=!REL_PATH:%cd%\=!"
    
    REM \ işaretlerini / işaretine çevir (URL formatı için)
    set "REL_PATH=!REL_PATH:\=/!"
    
    REM URL'yi yaz
    echo %BASE_URL%!REL_PATH!>>"%OUTPUT%"
)

echo.
echo Islem tamamlandi: %OUTPUT%
pause
