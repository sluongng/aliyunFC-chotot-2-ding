# aliyunFC-chotot-2-ding

A simple nodejs8 serverless function to fetch ChoTot gateway api for rental information in district 1

## Requirements

- NodeJS 8.0 and NPM
- AliCloud (AliYun) account with Function Compute(Alicloud serverless service) enabled
- [fcli](https://github.com/aliyun/fcli) to configure Function Compute from cli.

- (Not required) AliCloud SLS for log collection

## What is this

- A Serverless function that i setup as a cronjob on Alicloud.
- The cron is set to run hourly
- The logic is as follow:

    1. Fetch a pre-created JsonBin array.
    
    2. Fetch data from ChoTot Gateway with pre-defined parameters for location i picked.
    In this case its District 1, Hochiminh city, VietNam.

    3. Using the JSONBIN array, filter through all the old listing that we have encountered in the past using `list_id` of the ads.
    
    4. Filter through all the ads listing with a `MAX_PRICE` hardcoded at 7 Millions VND.
    (this could be move to env variable now that i think of it)
    
    5. Send all the remainding posts information to DingTalk which I use at work everyday.
    Together with a link which i can click to go to the website orignal post.

    6. Append all the newly found `list_id` to the previous old posts list.
    Update the new list to JsonBin for next run.

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

- Timing trigger is not easy to setup via `fcli` so I suggest using web console for now.