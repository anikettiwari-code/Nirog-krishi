const functions = require("firebase-functions");
const admin = require("firebase-admin");
const axios = require("axios");

const db = admin.firestore();

// --- Configuration ---
// ideally store these in functions.config()
const OPENWEATHER_API_KEY = "YOUR_OPENWEATHER_API_KEY"; // Placeholder
const AGMARKNET_API_URL = "YOUR_AGMARKNET_API_ENDPOINT"; // Placeholder

// --- Weather Aggregator (Hourly) ---
exports.weatherAggregator = functions.pubsub.schedule("every 60 minutes").onRun(async (context) => {
  console.log("Running Weather Aggregator...");
  
  // In a real app, you might batch this or only update active users
  // For simplicity, we query a 'active_subscriptions' or similar
  const usersSnapshot = await db.collection("users").get();
  
  const updates = [];

  for (const doc of usersSnapshot.docs) {
    const userData = doc.data();
    if (!userData.lat || !userData.lng) continue;

    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${userData.lat}&lon=${userData.lng}&appid=${OPENWEATHER_API_KEY}&units=metric`;
      const res = await axios.get(url);
      const weatherData = res.data;

      // Save mini-forecast to user's local context in Firestore
      // "weather_context" could be a subcollection or field
      const updatePromise = doc.ref.update({
        weather_context: {
          temp: weatherData.main.temp,
          humidity: weatherData.main.humidity,
          condition: weatherData.weather[0].main,
          updatedAt: admin.firestore.Timestamp.now()
        }
      });
      updates.push(updatePromise);
      
    } catch (error) {
      console.error(`Failed to fetch weather for user ${doc.id}:`, error.message);
    }
  }

  await Promise.all(updates);
  console.log(`Updated weather for ${updates.length} users.`);
  return null;
});

// --- Market Price Scraper (Daily) ---
exports.marketPriceScraper = functions.pubsub.schedule("every 24 hours").onRun(async (context) => {
  console.log("Running Market Price Scraper...");

  try {
    // 1. Fetch from Agmarknet/eNAM
    // Note: Official API usually requires key or specific headers.
    // Using a placeholder implementation.
    const response = await axios.get(AGMARKNET_API_URL); 
    const rawData = response.data;

    // 2. Process Data
    // Simplify into a standard JSON format: { commodity: "Wheat", price: 2100, trend: "up" }
    const processedTrends = rawData.records.map(record => ({
      commodity: record.commodity,
      min_price: record.min_price,
      max_price: record.max_price,
      modal_price: record.modal_price,
      market: record.market,
      date: new Date().toISOString().split('T')[0]
    }));

    // 3. Store in Firestore for easy client access
    await db.collection("market_trends").doc("latest").set({
      updatedAt: admin.firestore.Timestamp.now(),
      data: processedTrends
    });
    
    // Also store historical for graphing?
    await db.collection("market_trends").doc("history").collection("daily").add({
        date: admin.firestore.Timestamp.now(),
        data: processedTrends
    });

    console.log("Market prices updated.");

  } catch (error) {
    console.error("Market scraper failed:", error.message);
  }
  return null;
});
