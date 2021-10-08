

# PASSBASE WEBHOOK on Vercel

[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

This directory is an example of creating serverless APIs in TypeScript and deploy on Vercel platform.

## Features
- [x] Serverless functions written in `TypeScript`  
- [x] Deployment on Vercel for main branch and pull requests    
- [x] Tests support using `Jest`  
- [x] CI setup using GitHub Actions to run tests on every push to GitHub (on every branch)  
- [x] CI setup to run tests against Vercel Preview URLs and add them as check before PR could merge. [See GitHub Action](https://github.com/hhimanshu/typescript-serverless-api-vercel/actions/workflows/preview-ci.yml)    
- [x] CI Setup to create a new release using `semantic-release`
- [x] Ability to compute function (`/address`) and also to make API calls (`/currency`) 

## Available APIs
### Local
```shell
http://localhost:3000/api/hello?name=<string>
```

- The value of `number` must be between `1` and `50`(inclusive)  
- The valid values for `addressTypes` are `city`, `zipCode`  

Some examples are  
```shell
http://localhost:3000/api/hello?name=harit
```

### Production


## Start Developing
- Clone this repository (or better fork it so that you can make changes in your repo)  
- Run `yarn start`. This will kick-off `vercel dev` so that you can start developing your features  
- Run `yarn test` to run tests
