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
  JOB_END: "JOB_END",
};
module.exports = async function (context, req) {
  const hub = context.req.query.vin ? "VIN" + context.req.query.vin : "VIN";
  const sessionId = context.req.query.sessionId;
  const client = df.getClient(context);

  const dataAddress = [
    {
      latitude: -33.8398304,
      longitude: 151.0590862,
      patrolStatus: PatrolStatusTypeEnum.JOB_CREATED,
      eta: "20 minutes",
    },
    {
      latitude: -33.833949,
      longitude: 151.067626,
      patrolStatus: PatrolStatusTypeEnum.JOB_ENROUTE,
      eta: "19 minutes",
    },
    {
      latitude: -33.832523,
      longitude: 151.069686,
      patrolStatus: PatrolStatusTypeEnum.JOB_ENROUTE,
      eta: "18 minutes",
    },
    {
      latitude: -33.830885,
      longitude: 151.071153,
      patrolStatus: PatrolStatusTypeEnum.JOB_ENROUTE,
      eta: "17 minutes",
    },
    {
      latitude: -33.831152,
      longitude: 151.071679,
      patrolStatus: PatrolStatusTypeEnum.JOB_ENROUTE,
      eta: "16 minutes",
    },
    {
      latitude: -33.832418,
      longitude: 151.072784,
      patrolStatus: PatrolStatusTypeEnum.JOB_ENROUTE,
      eta: "15 minutes",
    },
    {
      latitude: -33.832774,
      longitude: 151.073342,
      patrolStatus: PatrolStatusTypeEnum.JOB_ENROUTE,
      eta: "14 minutes",
    },
    {
      latitude: -37.80778,
      longitude: 144.96994,
      patrolStatus: PatrolStatusTypeEnum.JOB_ENROUTE,
      eta: "13 minutes",
    },
    {
      latitude: -37.80867,
      longitude: 144.96676,
      patrolStatus: PatrolStatusTypeEnum.JOB_ENROUTE,
      eta: "12 minutes",
    },
    {
      latitude: -33.834326,
      longitude: 151.075373,
      patrolStatus: PatrolStatusTypeEnum.JOB_ENROUTE,
      eta: "11 minutes",
    },
    {
      latitude: -33.835216,
      longitude: 151.07625,
      patrolStatus: PatrolStatusTypeEnum.JOB_ENROUTE,
      eta: "10 minutes",
    },
    {
      latitude: -33.836332,
      longitude: 151.076834,
      patrolStatus: PatrolStatusTypeEnum.JOB_ENROUTE,
      eta: "9 minutes",
    },
    {
      latitude: -33.837124,
      longitude: 151.076775,
      patrolStatus: PatrolStatusTypeEnum.JOB_ENROUTE,
      eta: "8 minutes",
    },
    {
      latitude: -33.838435,
      longitude: 151.075646,
      patrolStatus: PatrolStatusTypeEnum.JOB_ENROUTE,
      eta: "7 minutes",
    },
    {
      latitude: -33.840262,
      longitude: 151.07588,
      patrolStatus: PatrolStatusTypeEnum.JOB_ENROUTE,
      eta: "6 minutes",
    },
    {
      latitude: -33.842219,
      longitude: 151.076191,
      patrolStatus: PatrolStatusTypeEnum.JOB_ENROUTE,
      eta: "5 minutes",
    },
    {
      latitude: -33.843853,
      longitude: 151.076016,
      patrolStatus: PatrolStatusTypeEnum.JOB_ENROUTE,
      eta: "4 minutes",
    },
    {
      latitude: -33.846748,
      longitude: 151.075159,
      patrolStatus: PatrolStatusTypeEnum.JOB_ENROUTE,
      eta: "3 minutes",
    },
    {
      latitude: -33.84995,
      longitude: 151.073796,
      patrolStatus: PatrolStatusTypeEnum.JOB_ENROUTE,
      eta: "2 minutes",
    },
    {
      latitude: -33.846543,
      longitude: 151.070431,
      patrolStatus: PatrolStatusTypeEnum.JOB_ENROUTE,
      eta: "1 minutes",
    },
    {
      latitude: -33.8352896,
      longitude: 151.0654771,
      patrolStatus: PatrolStatusTypeEnum.JOB_ETA,
      eta: "0 minutes",
    },
    {
      latitude: -33.8352896,
      longitude: 151.0654771,
      patrolStatus: PatrolStatusTypeEnum.JOB_ETA,
      eta: "0 minutes",
    },
    {
      latitude: -33.8352896,
      longitude: 151.0654771,
      patrolStatus: PatrolStatusTypeEnum.JOB_COMPLETE,
      eta: "0 minutes",
    },
    {
      latitude: -33.8352896,
      longitude: 151.0654771,
      patrolStatus: PatrolStatusTypeEnum.JOB_COMPLETE,
      eta: "0 minutes",
    },
    {
      latitude: -33.8352896,
      longitude: 151.0654771,
      patrolStatus: PatrolStatusTypeEnum.JOB_END,
      eta: "0 minutes",
    },
  ];
  const instanceId = await client.startNew(
    "test",
    undefined,
    JSON.stringify({
      dataAddress,
      hub,
      sessionId,
    })
  );
  //   context.log(`Started orchestration with ID = '${instanceId}'.`);

  return client.createCheckStatusResponse(context.bindingData.req, instanceId);
};
