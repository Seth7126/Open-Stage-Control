convert logo.png -define icon:auto-resize="256,128,96,64,48,32,16" logo.ico
convert logo.png -resize 128x128 logo-mac.png
png2icns logo.icns logo-mac.png
rm logo-mac.png
