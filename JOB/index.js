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

const CosmosClient = require("@azure/cosmos").CosmosClient;
require("dotenv").config();
const key = process.env.DB_PRIMARY_KEY;
const endpoint = process.env.DB_ENDPOINT;
const databaseName = process.env.DB_NAME;
const PatrolStatusTypeEnum = {
  INCIDENT_CREATE: "INCIDENT_CREATED",
  JOB_CREATED: "JOB_CREATED",
  JOB_DISPATCHED: "JOB_DISPATCHED",
  JOB_ACK: "JOB_ACK",
  JOB_ETA: "JOB_ETA",
  JOB_ENROUTE: "JOB_ENROUTE",
  JOB_ARRIVED: "JOB_ARRIVED",
  JOB_COMPLETE: "JOB_COMPLETE",
  JOB_CANCELLED: "JOB_CANCELLED",
  JOB_ACTIVE: "JOB_ACTIVE",
  JOB_WAITING_FOR_SURVEY: "JOB_WAITING_FOR_SURVEY",
  JOB_DONE: "JOB_DONE",
  JOB_END: "JOB_END",
};
const OPEnum = {
  ADD: "add",
  REPLACE: "replace",
  REMOVE: "remove",
  SET: "set",
  INCREASE: "incr",
};
const {WebPubSubServiceClient} = require("@azure/web-pubsub");
const axios = require("axios");
module.exports = async function (context) {
  const data = context.bindingData.name;
  const cosmosClient = new CosmosClient({endpoint, key});

  const dbResponse = await cosmosClient.databases.createIfNotExists({
    id: databaseName,
  });
  const database = dbResponse.database;
  const coResponse = await database.containers.createIfNotExists({
    id: "sessions",
  });
  this.container = coResponse.container;

  const sessionId = data.sessionId;
  return new Promise((res, rej) => {
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
    const operations = [
      {
        op: OPEnum.SET,
        path: "/patrolStatus",
        value:
          response.patrolStatus === PatrolStatusTypeEnum.JOB_END
            ? PatrolStatusTypeEnum.JOB_WAITING_FOR_SURVEY
            : response.patrolStatus,
      },
      {
        op: OPEnum.SET,
        path: "/rSAStatus/roadsideAssistanceStatus/location/latitude",
        value: response.latitude,
      },
      {
        op: OPEnum.SET,
        path: "/rSAStatus/roadsideAssistanceStatus/location/longitude",
        value: response.longitude,
      },
    ];
    this.container.item(sessionId).patch(operations);
    axios.post(`https://trackmypatrol.azurewebsites.net/api/create-sugar-era`, {
      case_id: sessionId,
      location_latitude: response.latitude,
      location_longitude: response.longitude,
    });
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
