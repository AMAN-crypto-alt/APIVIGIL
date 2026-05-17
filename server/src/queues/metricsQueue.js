const Queue = require("bull");

const metricsQueue = new Queue("metrics-processing");

const addMetricJob = async ({ metricId, serviceName, timestamp }) => {
  return metricsQueue.add(
    {
      metricId,
      serviceName,
      timestamp,
    },
    {
      attempts: 3,
      backoff: {
        type: "exponential",
        delay: 2000,
      },
    }
  );
};

module.exports = {
  metricsQueue,
  addMetricJob,
};
