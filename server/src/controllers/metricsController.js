const Metric = require("../models/Metric");
const mongoose = require("mongoose");
const { redisClient } = require("../config/redis");

/*
========================================
1. Get All Stored Metrics
GET /api/metrics
========================================
*/

const getAllMetrics = async (req, res) => {
  try {
    const metrics = await Metric.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: metrics.length,
      data: metrics,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
========================================
2. Get Live MongoDB Metrics
GET /api/metrics/mongodb
========================================
*/

const getMongoMetrics = async (req, res) => {
  try {
    const db = mongoose.connection.db;

    const admin = db.admin();
    const serverStatus = await admin.serverStatus();

    const collections = await db.listCollections().toArray();

    res.status(200).json({
      success: true,
      database: db.databaseName,
      collectionsCount: collections.length,
      uptime: serverStatus.uptime,
      connections: serverStatus.connections,
      mongodbVersion: serverStatus.version,
      host: serverStatus.host,
      status: "healthy",
      timestamp: new Date(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      status: "failed",
    });
  }
};

/*
========================================
3. Get Live Redis Metrics
GET /api/metrics/redis
========================================
*/

const getRedisMetrics = async (req, res) => {
  try {
    const info = await redisClient.info();

    res.status(200).json({
      success: true,
      status: "connected",
      redisInfo: info,
      timestamp: new Date(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      status: "failed",
    });
  }
};

module.exports = {
  getAllMetrics,
  getMongoMetrics,
  getRedisMetrics,
};