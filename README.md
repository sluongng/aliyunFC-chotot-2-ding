# aliyunFC-chotot-2-ding

A simple nodejs8 serverless function to fetch ChoTot gateway api for rental information in district 1

## Requirement

- NodeJS 8.0 and NPM
- AliCloud (AliYun) account with Function Compute(Alicloud serverless service) enabled
- [fcli](https://github.com/aliyun/fcli) to configure Function Compute from cli.

- (Not required) AliCloud SLS for log collection

## How to use

```bash
git clone https://github.com/sluongng/aliyunFC-chotot-2-ding

cd aliyunFC-chotot-2-ding

npm install

npm test
```

- You should be able to run and debug `index.js` locally.
- Setup `fcli` with correct `~/.fcli/config.yaml`
- Run the following to init your function

```bash
fcli service create --service-name housing

fcli service function --service-name housing \
                      --function-name chotot \
                      --handler index.handler \
                      --runtime nodejs8 \
                      --code-dir .
```

- Go to Alicloud console for logging and environment variable setups
- There are 3 `npm run` commands: `deploy`, `invoke`, `log` for local development purposes
- Run `npm run live-test` to execute all 3 commands sequentially for a live test run.