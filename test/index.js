/*
 * This function is not intended to be invoked directly. Instead it will be
 * triggered by an HTTP starter function.
 *
 * Before running this sample, please:
 * - create a Durable activity function (default name is "Hello")
 * - create a Durable HTTP starter function
 * - run 'npm install durable-functions' from the wwwroot folder of your
 *    function app in Kudu
 */
const df = require("durable-functions");
const {DateTime} = require("luxon");
module.exports = df.orchestrator(function* (context) {
  let data = context.df.getInput();
  data = JSON.parse(data);

  let {dataAddress, hub, sessionId} = data;
  while (dataAddress.length) {
    const deadline = DateTime.fromJSDate(context.df.currentUtcDateTime, {
      zone: "utc",
    }).plus({seconds: 5});
    yield context.df.createTimer(deadline.toJSDate());
    let trigger = yield context.df.callActivity("JOB", {
      dataAddress,
      hub,
      sessionId,
    });
    dataAddress = trigger.dataAddress;
    if (trigger.status === "JOB_DONE") break;
  }
});
