const df = require("durable-functions");
const {WebPubSubServiceClient} = require("@azure/web-pubsub");
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
};
module.exports = async function (context, req) {
  const hub = context.req.query.vin ? "VIN" + context.req.query.vin : "VIN";

  const client = df.getClient(context);

  const dataAddress = [
    // {
    //   latitude: -37.8029,
    //   longitude: 144.98676,
    //   patrolStatus: PatrolStatusTypeEnum.JOB_CREATED,
    //   eta: "20 minutes",
    // },
    // {
    //   latitude: -37.80555,
    //   longitude: 144.98625,
    //   patrolStatus: PatrolStatusTypeEnum.JOB_ENROUTE,
    //   eta: "19 minutes",
    // },
    // {
    //   latitude: -37.80819,
    //   longitude: 144.98578,
    //   patrolStatus: PatrolStatusTypeEnum.JOB_ENROUTE,
    //   eta: "18 minutes",
    // },
    // {
    //   latitude: -37.80911,
    //   longitude: 144.9832,
    //   patrolStatus: PatrolStatusTypeEnum.JOB_ENROUTE,
    //   eta: "17 minutes",
    // },
    // {
    //   latitude: -37.80877,
    //   longitude: 144.98011,
    //   patrolStatus: PatrolStatusTypeEnum.JOB_ENROUTE,
    //   eta: "16 minutes",
    // },
    // {
    //   latitude: -37.80846,
    //   longitude: 144.97642,
    //   patrolStatus: PatrolStatusTypeEnum.JOB_ENROUTE,
    //   eta: "15 minutes",
    // },
    // {
    //   latitude: -37.80809,
    //   longitude: 144.97303,
    //   patrolStatus: PatrolStatusTypeEnum.JOB_ENROUTE,
    //   eta: "14 minutes",
    // },
    // {
    //   latitude: -37.80778,
    //   longitude: 144.96994,
    //   patrolStatus: PatrolStatusTypeEnum.JOB_ENROUTE,
    //   eta: "13 minutes",
    // },
    // {
    //   latitude: -37.80867,
    //   longitude: 144.96676,
    //   patrolStatus: PatrolStatusTypeEnum.JOB_ENROUTE,
    //   eta: "12 minutes",
    // },
    // {
    //   latitude: -37.80972,
    //   longitude: 144.96351,
    //   patrolStatus: PatrolStatusTypeEnum.JOB_ENROUTE,
    //   eta: "9 minutes",
    // },
    // {
    //   latitude: -37.81052,
    //   longitude: 144.96063,
    //   patrolStatus: PatrolStatusTypeEnum.JOB_ENROUTE,
    //   eta: "6 minutes",
    // },
    // {
    //   latitude: -37.81299,
    //   longitude: 144.95997,
    //   patrolStatus: PatrolStatusTypeEnum.JOB_ENROUTE,
    //   eta: "4 minutes",
    // },
    // {
    //   latitude: -37.81517,
    //   longitude: 144.96081,
    //   patrolStatus: PatrolStatusTypeEnum.JOB_ENROUTE,
    //   eta: "2 minutes",
    // },
    // {
    //   latitude: -37.8164,
    //   longitude: 144.95932,
    //   patrolStatus: PatrolStatusTypeEnum.JOB_ETA,
    //   eta: "0 minutes",
    // },
    // {
    //   latitude: -37.8164,
    //   longitude: 144.95932,
    //   patrolStatus: PatrolStatusTypeEnum.JOB_ETA,
    //   eta: "0 minutes",
    // },
    // {
    //   latitude: -37.8164,
    //   longitude: 144.95932,
    //   patrolStatus: PatrolStatusTypeEnum.JOB_ETA,
    //   eta: "0 minutes",
    // },
    {
      latitude: -37.8165009,
      longitude: 144.9573283,
      patrolStatus: PatrolStatusTypeEnum.JOB_COMPLETE,
      eta: "0 minutes",
    },
  ];
  const instanceId = await client.startNew(
    "test",
    undefined,
    JSON.stringify({
      dataAddress,
      hub,
    })
  );
  //   context.log(`Started orchestration with ID = '${instanceId}'.`);

  return client.createCheckStatusResponse(context.bindingData.req, instanceId);
};
