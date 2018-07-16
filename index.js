const axios = require('axios');
const sprintf = require("sprintf-js").sprintf;

const DING_WEBHOOK = process.env.DING_WEBHOOK || '';

const JSONBIN_URL =  process.env.JSONBIN_URL || '';

const CHOTOT_HOST = 'https://gateway.chotot.com/v1/public/ad-listing';
const QUERY_OPTIONS = {
  region: 13,
  area: 96,
  cg: 1010,
  page: 1,
  limit: 20,
  o: 40
};
const MAX_PRICE = 7000000;
const MSG_TEMPLATE = `

![](%s)

**URL**: [LINK](%s)

**Subject**: %s

**Price**: %d`;

send2ding = (md_msg) => {
  return axios.post(DING_WEBHOOK, {
    msgtype: 'markdown',
    markdown: {
      title: 'HCM Q1 Rental Listing',
      text: md_msg
    },
    at: {
      atMobiles: [],
      isAtAll: false
    }
  }).catch((err) => {
    console.log('Error sending to dingtalk: ' + err);
  });
};

getOldPosts = () => {
  return axios.get(JSONBIN_URL + '/latest')
    .catch((err) => {
      console.log('Error getting JSONBIN: ' + err);
    });
};

getRentalPosts = () => {
  return axios.get(CHOTOT_HOST, { params: QUERY_OPTIONS })
    .catch((err) => {
      console.log('Error getting CHOTOT: ' + err);
    });
};

exports.handler = (event, context, callback) => {
  if (DING_WEBHOOK === '') {
    callback('DING_WEBHOOK need to be set');
  }

  if (JSONBIN_URL === '') {
    callback('JSONBIN_URL need to be set');
  }

  axios.all([
    getOldPosts(),
    getRentalPosts()
  ]).then(([oldPostResp, rentalResp]) => {
    let oldPostList = oldPostResp.data;

    if (rentalResp && rentalResp.data && rentalResp.data.ads) {

      let promises = rentalResp.data.ads
        .filter(adItem => !(oldPostList.includes(adItem.list_id)))
        .filter(adItem => adItem.price < MAX_PRICE)
        .map(adItem => {

          let image = adItem.image;
          let price = adItem.price;
          let subject = adItem.subject;
          let link = sprintf('https://nha.chotot.com/%d.htm', adItem.list_id);

          oldPostList.push(adItem.list_id);

          console.log('sending ' + link);

          return send2ding(sprintf(MSG_TEMPLATE, image, link, subject, price));
        });

      promises.push(
        axios.put(JSONBIN_URL, oldPostList)
          .catch((err) => {
            consoler.log('Error updating JSONBIN: ' + err);
          })
      );

      Promise.all(promises);

    } else {
      console.log('Invalid response data from ChoTot');
    }
  }).then(() => {
    console.log('All done');
    callback(null, 'All done');
  });
};

if (require.main == module) {
  console.log('Invoked from commandline');
  this.handler();
}
