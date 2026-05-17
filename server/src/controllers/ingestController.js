// const {
//   saveMetric,
//   enqueueMetricJob,
// } = require("../services/metrics/metricIngestionService");

// const ingestMetrics = async (req, res) => {
//   try {
//     const metricPayload = req.body;
//     const metric = await saveMetric(metricPayload);

//     await enqueueMetricJob(metric);

//     const io = req.app.get("io");
//     if (io) {
//       io.emit("metrics:update", metric);
//     }

//     return res.status(200).json({
//       success: true,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: "Metric ingestion failed",
//       error: error.message,
//     });
//   }
// };

// module.exports = { ingestMetrics };



const { saveMetric, enqueueMetricJob } = require("../services/metrics/metricIngestionService");

/**
 * POST /api/ingest
 * Accepts full metric payload from ObserveAI SDK v2.0
 * Handles both new schema (nested cpu/memory/requests objects)
 * and legacy schema (flat fields) for backward compatibility.
 */
const ingestMetrics = async (req, res) => {
  try {
    const body = req.body;

    // ── Normalize payload to match Metric model schema ──────────────────────
    const payload = {
      serviceName:  body.serviceName  || "unknown-service",
      instanceId:   body.instanceId   || "default",
      healthStatus: body.healthStatus || "unknown",
      timestamp:    body.timestamp    ? new Date(body.timestamp) : new Date(),
      tags:         body.tags         || {},

      // ── CPU ─────────────────────────────────────────────────────────────
      cpu: {
        usagePercent: body.cpu?.usagePercent ?? body.cpuUsage          ?? 0,
        loadAverage:  body.cpu?.loadAverage  ?? body.cpuLoad           ?? 0,
        cores:        body.cpu?.cores        ?? body.cpuCores          ?? 4,
      },

      // ── Memory ──────────────────────────────────────────────────────────
      memory: {
        usedMb:       body.memory?.usedMb       ?? body.memoryUsage    ?? 0,
        totalMb:      body.memory?.totalMb       ?? body.totalMemory   ?? 2048,
        usagePercent: body.memory?.usagePercent  ?? 0,
      },

      // ── Disk ────────────────────────────────────────────────────────────
      disk: {
        usedMb:           body.disk?.usedMb           ?? 0,
        totalMb:          body.disk?.totalMb           ?? 0,
        usagePercent:     body.disk?.usagePercent      ?? 0,
        readBytesPerSec:  body.disk?.readBytesPerSec   ?? 0,
        writeBytesPerSec: body.disk?.writeBytesPerSec  ?? 0,
      },

      // ── Network ─────────────────────────────────────────────────────────
      network: {
        inboundBytesPerSec:  body.network?.inboundBytesPerSec  ?? 0,
        outboundBytesPerSec: body.network?.outboundBytesPerSec ?? 0,
        activeConnections:   body.network?.activeConnections   ?? 0,
      },

      // ── Request ─────────────────────────────────────────────────────────
      requests: {
        endpoint:       body.requests?.endpoint       ?? body.endpoint       ?? "/",
        method:         (body.requests?.method        ?? body.method         ?? "GET").toUpperCase(),
        statusCode:     body.requests?.statusCode     ?? body.statusCode     ?? 200,
        responseTimeMs: body.requests?.responseTimeMs ?? body.responseTime   ?? 0,
        total:          body.requests?.total          ?? 1,
        success:        body.requests?.success        ?? body.success        ?? true,
        errorCount:     body.requests?.errorCount     ?? (body.success === false ? 1 : 0),
      },
    };

    // ── Auto-compute healthStatus if not provided ────────────────────────────
    if (!payload.healthStatus || payload.healthStatus === "unknown") {
      const errRate    = payload.requests.errorCount > 0 ? 100 : 0;
      const latency    = payload.requests.responseTimeMs;
      const cpuLoad    = payload.cpu.loadAverage;
      if (errRate > 20 || cpuLoad > 3 || latency > 1000) {
        payload.healthStatus = "critical";
      } else if (errRate > 5 || cpuLoad > 1.5 || latency > 500) {
        payload.healthStatus = "warning";
      } else {
        payload.healthStatus = "healthy";
      }
    }

    // ── Save to DB ───────────────────────────────────────────────────────────
    const metric = await saveMetric(payload);

    // ── Enqueue background job ───────────────────────────────────────────────
    await enqueueMetricJob(metric);

    // ── Emit live update via socket ──────────────────────────────────────────
    const io = req.app.get("io");
    if (io) {
      io.emit("metrics:update", {
        serviceName:  metric.serviceName,
        healthStatus: metric.healthStatus,
        cpu:          metric.cpu,
        memory:       metric.memory,
        requests:     metric.requests,
        timestamp:    metric.timestamp,
      });
    }

    return res.status(200).json({ success: true });

  } catch (error) {
    console.error("[ingestMetrics] Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Metric ingestion failed",
      error:   error.message,
    });
  }
};

module.exports = { ingestMetrics };