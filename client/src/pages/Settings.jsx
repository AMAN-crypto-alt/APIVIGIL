import { useState } from "react";

function Settings() {
  const [alertThreshold, setAlertThreshold] = useState(80);
  const [emailNotification, setEmailNotification] = useState(true);
  const [telegramNotification, setTelegramNotification] = useState(false);
  const [slackNotification, setSlackNotification] = useState(false);
  const [refreshTime, setRefreshTime] = useState(5);
  const [riskLevel, setRiskLevel] = useState("Medium");

  const handleSave = () => {
    alert("Settings Saved Successfully 🚀");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">

      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8">

        <h1 className="text-4xl font-bold mb-8 text-gray-800">
          Admin Settings ⚙️
        </h1>

        {/* Alert Threshold */}
        <div className="mb-6">
          <label className="block text-lg font-semibold mb-2">
            Alert Threshold (%)
          </label>

          <input
            type="number"
            value={alertThreshold}
            onChange={(e) => setAlertThreshold(e.target.value)}
            className="w-full p-4 border rounded-xl"
            placeholder="Enter threshold"
          />
        </div>

        {/* Auto Refresh Time */}
        <div className="mb-6">
          <label className="block text-lg font-semibold mb-2">
            Auto Refresh Time (seconds)
          </label>

          <input
            type="number"
            value={refreshTime}
            onChange={(e) => setRefreshTime(e.target.value)}
            className="w-full p-4 border rounded-xl"
            placeholder="Enter refresh time"
          />
        </div>

        {/* Email Notification */}
        <div className="mb-6 flex justify-between items-center">
          <label className="text-lg font-semibold">
            Email Notification
          </label>

          <button
            onClick={() =>
              setEmailNotification(!emailNotification)
            }
            className={`px-6 py-2 rounded-xl text-white ${
              emailNotification ? "bg-green-500" : "bg-gray-400"
            }`}
          >
            {emailNotification ? "ON" : "OFF"}
          </button>
        </div>

        {/* Telegram Notification */}
        <div className="mb-6 flex justify-between items-center">
          <label className="text-lg font-semibold">
            Telegram Notification
          </label>

          <button
            onClick={() =>
              setTelegramNotification(!telegramNotification)
            }
            className={`px-6 py-2 rounded-xl text-white ${
              telegramNotification ? "bg-green-500" : "bg-gray-400"
            }`}
          >
            {telegramNotification ? "ON" : "OFF"}
          </button>
        </div>

        {/* Slack Notification */}
        <div className="mb-6 flex justify-between items-center">
          <label className="text-lg font-semibold">
            Slack Notification
          </label>

          <button
            onClick={() =>
              setSlackNotification(!slackNotification)
            }
            className={`px-6 py-2 rounded-xl text-white ${
              slackNotification ? "bg-green-500" : "bg-gray-400"
            }`}
          >
            {slackNotification ? "ON" : "OFF"}
          </button>
        </div>

        {/* AI Risk Sensitivity */}
        <div className="mb-8">
          <label className="block text-lg font-semibold mb-2">
            AI Risk Sensitivity
          </label>

          <select
            value={riskLevel}
            onChange={(e) => setRiskLevel(e.target.value)}
            className="w-full p-4 border rounded-xl"
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          className="w-full bg-black hover:bg-gray-800 text-white p-4 rounded-xl text-lg font-semibold transition duration-300"
        >
          Save Settings
        </button>

      </div>
    </div>
  );
}

export default Settings;