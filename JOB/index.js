/*
 * This function is not intended to be invoked directly. Instead it will be
 * triggered by an orchestrator function.
 *
 * Before running this sample, please:
 * - create a Durable orchestration function
 * - create a Durable HTTP starter function
 * - run 'npm install durable-functions' from the wwwroot folder of your
 *   function app in Kudu
 */

const {WebPubSubServiceClient} = require("@azure/web-pubsub");
module.exports = async function (context) {
  return new Promise((res, rej) => {
    const data = context.bindingData.name;

    // context.log(1212, data);
    let response = data.dataAddress.shift();
    const hub = data.hub;
    const serviceClient = new WebPubSubServiceClient(
      "Endpoint=https://dera-dev-pubsub.webpubsub.azure.com;AccessKey=Mu5xwlXBoDZWfnOCo7DOrbkgkSUB4oTrmTGphNTPTT4=;Version=1.0;",
      hub
    );
    const responseV1 = {
      ...response,
      assistanceId: "2a3b0e96-f02d-499f-aec4-3fe0ad18c406",
    };

    serviceClient.sendToAll(responseV1);
    if (response.patrolStatus === "JOB_DONE") {
      serviceClient.closeAllConnections();
    }
    res({
      dataAddress: data.dataAddress,
      status: response.patrolStatus,
    });
  });
};
