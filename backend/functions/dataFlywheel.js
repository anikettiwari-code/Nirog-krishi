const functions = require("firebase-functions");
const admin = require("firebase-admin");

const db = admin.firestore();

// Trigger: When a new scan result is created in Firestore
// Assumes mobile app uploads image to Storage, gets URL, then writes metadata to 'scan_results'
exports.activeLearningTrigger = functions.firestore
  .document("users/{userId}/farm_logs/{logId}")
  .onCreate(async (snap, context) => {
    const scanData = snap.data();
    
    // Check if it has AI confidence data
    if (!scanData.ai_diagnosis) return null;

    const confidence = scanData.ai_diagnosis.confidence; // e.g., 0.55
    const confidenceThreshold = 0.60;

    // Logic: Identify "Low Confidence" scans
    if (confidence < confidenceThreshold) {
      console.log(`Low confidence scan detected (${confidence}). Flagging for review.`);
      
      // Add to a global "Review Queue" for agronomists/admins
      await db.collection("admin_review_queue").add({
        original_log_path: snap.ref.path,
        userId: context.params.userId,
        imageUrl: scanData.imageUrl,
        suggestedLabel: scanData.ai_diagnosis.label,
        confidence: confidence,
        status: "pending_review",
        flaggedAt: admin.firestore.Timestamp.now()
      });
      
      // Optional: Mark the original user log as "Under Review" via a flag?
      await snap.ref.update({
         "ai_diagnosis.needs_expert_review": true
      });
    }

    return null;
  });
