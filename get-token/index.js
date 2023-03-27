const {WebPubSubServiceClient} = require("@azure/web-pubsub");
module.exports = async function (context, req) {
  const hub = context.req.query.vin ? "VIN" + context.req.query.vin : "VIN";
  const serviceClient = new WebPubSubServiceClient(
    "Endpoint=https://dera-dev-pubsub.webpubsub.azure.com;AccessKey=Mu5xwlXBoDZWfnOCo7DOrbkgkSUB4oTrmTGphNTPTT4=;Version=1.0;",
    hub
  );
  const token = (await serviceClient.getClientAccessToken()).url;
  context.res = {body: {token}};
};
