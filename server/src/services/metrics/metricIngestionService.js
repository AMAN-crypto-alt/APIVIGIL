const Metric = require("../../models/Metric");
const { addMetricJob } = require("../../queues/metricsQueue");

const saveMetric = async (payload) => {
  return Metric.create(payload);
};

const enqueueMetricJob = async (metric) => {
  return addMetricJob({
    metricId: metric._id.toString(),
    serviceName: metric.serviceName,
    timestamp: metric.timestamp,
  });
};

module.exports = {
  saveMetric,
  enqueueMetricJob,
};
