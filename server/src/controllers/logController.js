const getLogs = (req, res) => {
  const logs = [
    {
      type: "info",
      message: "MongoDB Connected Successfully",
      time: new Date(),
    },
    {
      type: "info",
      message: "Redis Connected Successfully",
      time: new Date(),
    },
    {
      type: "healthy",
      message: "System running normally",
      time: new Date(),
    },
  ];

  res.status(200).json({
    success: true,
    logs,
  });
};

module.exports = {
  getLogs,
};