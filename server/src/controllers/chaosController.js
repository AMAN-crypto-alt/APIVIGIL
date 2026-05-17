let chaosMode = false;
let chaosType = "none";

const enableChaos = (req, res) => {
  const { type } = req.body;

  chaosMode = true;
  chaosType = type || "cpu";

  res.json({
    success: true,
    message: `Chaos mode enabled: ${chaosType}`,
  });
};

const disableChaos = (req, res) => {
  chaosMode = false;
  chaosType = "none";

  res.json({
    success: true,
    message: "Chaos mode disabled",
  });
};

const getChaosState = (req, res) => {
  res.json({
    success: true,
    chaosMode,
    chaosType,
  });
};

// 🔥 Export getter for other files
const getChaosConfig = () => ({ chaosMode, chaosType });

module.exports = {
  enableChaos,
  disableChaos,
  getChaosState,
  getChaosConfig,
};