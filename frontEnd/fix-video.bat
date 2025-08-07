@echo off
echo Fixing video component issues...

echo Clearing Expo cache...
npx expo r -c

echo Clearing npm cache...
npm cache clean --force

echo Removing node_modules...
rmdir /s /q node_modules

echo Removing package-lock.json...
del package-lock.json

echo Reinstalling dependencies...
npm install

echo Done! Now restart your development server.
pause