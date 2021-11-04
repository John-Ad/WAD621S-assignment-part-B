cd ./front-end/
npm install
npm run build
rm -rf ../back-end/public
cp -r ./dist/ ../back-end/public
cd ..
cd ./back-end/
npm install
npm run start
