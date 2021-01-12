cd ..
sam build

cat ./env.json
sam local start-api --env-vars ./env.json