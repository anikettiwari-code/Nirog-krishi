const functions = require("firebase-functions");
const admin = require("firebase-admin");
const geofire = require("geofire-common");

const db = admin.firestore();

exports.onOutbreakDetected = functions.firestore
  .document("artifacts/{appId}/public/data/outbreaks/{outbreakId}")
  .onCreate(async (snap, context) => {
    const outbreakData = snap.data();
    const center = [outbreakData.lat, outbreakData.lng];
    const radiusInKm = 10; // 10km radius
    const diseaseType = outbreakData.diseaseType || "Unknown Disease";

    // 1. Calculate the geohash query bounds
    const bounds = geofire.geohashQueryBounds(center, radiusInKm * 1000);
    const promises = [];

    // 2. Query for users within bounds
    // Note: This assumes users are essentially storing their location in a queryable way
    // For this implementation, we assume a 'user_locations' collection for efficiency
    for (const b of bounds) {
      const q = db.collection("user_locations")
        .orderBy("geohash")
        .startAt(b[0])
        .endAt(b[1]);

      promises.push(q.get());
    }

    const snapshots = await Promise.all(promises);
    const nearbyUserTokens = [];

    // 3. Filter matches using distance
    for (const snap of snapshots) {
      for (const doc of snap.docs) {
        const lat = doc.get("lat");
        const lng = doc.get("lng");
        const fcmToken = doc.get("fcmToken");

        if (lat && lng && fcmToken) {
          const distanceInKm = geofire.distanceBetween([lat, lng], center);
          if (distanceInKm <= radiusInKm) {
            nearbyUserTokens.push(fcmToken);
          }
        }
      }
    }

    if (nearbyUserTokens.length === 0) {
      console.log("No nearby users found for outbreak.");
      return null;
    }

    // 4. Send Notifications
    // FCM supports sending to up to 500 tokens at once
    const payload = {
      notification: {
        title: "⚠️ Outbreak Alert Nearby!",
        body: `${diseaseType} detected within 10km of your farm. Inspect your crops now.`,
      },
      data: {
        outbreakId: context.params.outbreakId,
        type: "outbreak_alert",
      }
    };

    // Batch send in chunks of 500 if needed (simplified here for < 500)
    const response = await admin.messaging().sendToDevice(nearbyUserTokens, payload);
    console.log("Notifications sent:", response.successCount);

    return null;
  });
