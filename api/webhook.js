const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

// Prevent duplicate replies
const processedMessages = new Set();

// ============================================
// Set Persistent Menu on Startup
// ============================================
async function setupPersistentMenu() {
  console.log("📋 Setting up Persistent Menu...");
  
  try {
    const response = await fetch(
      `https://graph.facebook.com/v23.0/me/messenger_profile?access_token=${PAGE_ACCESS_TOKEN}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          persistent_menu: [
            {
              locale: "default",
              composer_input_disabled: false,
              call_to_actions: [
                {
                  type: "postback",
                  title: "📞 Contact Us",
                  payload: "CONTACT_INFO"
                },
                {
                  type: "postback",
                  title: "📍 Location",
                  payload: "LOCATION"
                },
                {
                  type: "postback",
                  title: "⚖️ Services",
                  payload: "SERVICES"
                },
                {
                  type: "postback",
                  title: "🕒 Office Hours",
                  payload: "OFFICE_HOURS"
                },
                {
                  type: "postback",
                  title: "💬 Consultation",
                  payload: "CONSULTATION"
                },
                {
                  type: "postback",
                  title: "📝 Notary Fees",
                  payload: "NOTARY_FEES"
                }
              ]
            }
          ]
        })
      }
    );

    const result = await response.json();
    
    if (response.ok) {
      console.log("✅ Persistent Menu Setup Success:", JSON.stringify(result, null, 2));
    } else {
      console.error("❌ Persistent Menu Setup Failed:", JSON.stringify(result, null, 2));
      
      // Check for specific error types
      if (result.error) {
        console.error("Error Code:", result.error.code);
        console.error("Error Message:", result.error.message);
        console.error("Error Type:", result.error.type);
      }
    }
    
    return result;
  } catch (error) {
    console.error("❌ Error setting up persistent menu:", error);
    throw error;
  }
}

// ============================================
// Greeting Message on Chat Open
// ============================================
async function setupGreeting() {
  console.log("👋 Setting up Greeting...");
  
  try {
    const response = await fetch(
      `https://graph.facebook.com/v23.0/me/messenger_profile?access_token=${PAGE_ACCESS_TOKEN}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          greeting: [
            {
              locale: "default",
              text: "Welcome to Trajano-Reyes & Santos Law Office! 👋\n\nHow may we assist you today? Please choose from the menu below or type your question."
            }
          ]
        })
      }
    );

    const result = await response.json();
    
    if (response.ok) {
      console.log("✅ Greeting Setup Success:", JSON.stringify(result, null, 2));
    } else {
      console.error("❌ Greeting Setup Failed:", JSON.stringify(result, null, 2));
    }
    
    return result;
  } catch (error) {
    console.error("❌ Error setting up greeting:", error);
    throw error;
  }
}

// ============================================
// Get Started Button
// ============================================
async function setupGetStarted() {
  console.log("🚀 Setting up Get Started Button...");
  
  try {
    const response = await fetch(
      `https://graph.facebook.com/v23.0/me/messenger_profile?access_token=${PAGE_ACCESS_TOKEN}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          get_started: {
            payload: "GET_STARTED"
          }
        })
      }
    );

    const result = await response.json();
    
    if (response.ok) {
      console.log("✅ Get Started Setup Success:", JSON.stringify(result, null, 2));
    } else {
      console.error("❌ Get Started Setup Failed:", JSON.stringify(result, null, 2));
    }
    
    return result;
  } catch (error) {
    console.error("❌ Error setting up get started:", error);
    throw error;
  }
}

// ============================================
// Check Current Profile Settings
// ============================================
async function checkCurrentSettings() {
  console.log("🔍 Checking current Messenger Profile settings...");
  
  try {
    const response = await fetch(
      `https://graph.facebook.com/v23.0/me/messenger_profile?access_token=${PAGE_ACCESS_TOKEN}&fields=persistent_menu,greeting,get_started`
    );
    
    const result = await response.json();
    
    if (response.ok) {
      console.log("📊 Current Settings:", JSON.stringify(result, null, 2));
    } else {
      console.error("❌ Failed to get settings:", JSON.stringify(result, null, 2));
    }
    
    return result;
  } catch (error) {
    console.error("❌ Error checking settings:", error);
  }
}

// ============================================
// Delete Existing Profile (to reset)
// ============================================
async function deleteMessengerProfile() {
  console.log("🗑️ Deleting existing Messenger Profile...");
  
  try {
    const response = await fetch(
      `https://graph.facebook.com/v23.0/me/messenger_profile?access_token=${PAGE_ACCESS_TOKEN}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          fields: ["persistent_menu", "greeting", "get_started"]
        })
      }
    );

    const result = await response.json();
    
    if (response.ok) {
      console.log("✅ Delete Success:", JSON.stringify(result, null, 2));
    } else {
      console.error("❌ Delete Failed:", JSON.stringify(result, null, 2));
    }
    
    return result;
  } catch (error) {
    console.error("❌ Error deleting profile:", error);
  }
}

// ============================================
// Initialize Messenger Profile
// ============================================
async function initializeMessengerProfile() {
  console.log("🚀 Starting Messenger Profile Initialization...");
  console.log("📌 PAGE_ACCESS_TOKEN exists:", !!PAGE_ACCESS_TOKEN);
  
  if (!PAGE_ACCESS_TOKEN) {
    console.error("❌ PAGE_ACCESS_TOKEN is missing! Please set it in your environment variables.");
    return;
  }

  try {
    // Step 1: Delete existing settings (optional but helps with caching)
    console.log("Step 1: Cleaning up old settings...");
    await deleteMessengerProfile();
    await delay(2000);
    
    // Step 2: Setup new settings
    console.log("Step 2: Setting up new settings...");
    await setupPersistentMenu();
    await delay(1000);
    await setupGreeting();
    await delay(1000);
    await setupGetStarted();
    await delay(2000);
    
    // Step 3: Verify settings
    console.log("Step 3: Verifying settings...");
    await checkCurrentSettings();
    
    console.log("✅ Messenger Profile Initialization Complete!");
    console.log("⏳ Wait 2-5 minutes for Facebook to update the cache.");
  } catch (error) {
    console.error("❌ Failed to initialize Messenger Profile:", error);
  }
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ============================================
// CALL INITIALIZATION
// ============================================
if (PAGE_ACCESS_TOKEN) {
  console.log("🔄 Initializing Messenger Profile on startup...");
  initializeMessengerProfile();
} else {
  console.warn("⚠️ PAGE_ACCESS_TOKEN not found. Profile setup skipped.");
}

// ============================================
// VERCEL SERVERLESS FUNCTION
// ============================================
export default async function handler(req, res) {

  // ============================================
  // MANUAL UPDATE ENDPOINT - Call this to force update
  // ============================================
  if (req.method === "POST" && req.url === "/api/update-menu") {
    console.log("🔄 Manual menu update requested...");
    
    try {
      await initializeMessengerProfile();
      return res.status(200).json({ 
        success: true, 
        message: "Messenger Profile updated! Check server logs for details.",
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      return res.status(500).json({ 
        success: false, 
        error: error.message 
      });
    }
  }

  // ============================================
  // CHECK CURRENT SETTINGS ENDPOINT
  // ============================================
  if (req.method === "GET" && req.url === "/api/check-menu") {
    console.log("🔍 Checking current menu settings...");
    
    try {
      const settings = await checkCurrentSettings();
      return res.status(200).json({
        success: true,
        settings: settings
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // ============================================
  // Facebook Webhook Verification (GET)
  // ============================================
  if (req.method === "GET") {
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      console.log("✅ Webhook Verified");
      return res.status(200).send(challenge);
    }

    console.log("❌ Invalid Verify Token");
    return res.status(403).send("Forbidden");
  }

  // ============================================
  // Receive Facebook Messages (POST)
  // ============================================
  if (req.method === "POST") {
    const body = req.body;

    console.log("Incoming Webhook:");
    console.log(JSON.stringify(body, null, 2));

    if (body.object !== "page") {
      return res.sendStatus(404);
    }

    for (const entry of body.entry) {
      if (!entry.messaging) continue;

      for (const event of entry.messaging) {
        // Handle postback events (menu clicks)
        if (event.postback) {
          console.log("Postback received:", event.postback);
          
          const senderId = event.sender.id;
          const payload = event.postback.payload;
          
          // Handle Get Started button
          if (payload === "GET_STARTED") {
            const reply = `👋 Welcome to Trajano-Reyes & Santos Law Office!

Please choose an option from the menu below or type your question.

📞 Contact Us
📍 Location
⚖️ Services
🕒 Office Hours
💬 Consultation
📝 Notary Fees

We're here to help!`;
            await sendMessage(senderId, reply);
            return res.sendStatus(200);
          }
          
          // Handle menu postbacks
          const reply = getReplyByPayload(payload);
          if (reply) {
            await sendMessage(senderId, reply);
          }
          
          continue;
        }

        // Ignore delivery events
        if (event.delivery) {
          console.log("Ignored delivery event");
          continue;
        }

        // Ignore read events
        if (event.read) {
          console.log("Ignored read event");
          continue;
        }

        // Ignore message echoes (messages sent by your Page)
        if (event.message?.is_echo) {
          console.log("Ignored echo message");
          continue;
        }

        // Ignore non-text messages
        if (!event.message?.text) {
          console.log("Ignored non-text message");
          continue;
        }

        const messageId = event.message.mid;

        // Prevent duplicate processing
        if (messageId && processedMessages.has(messageId)) {
          console.log("Duplicate message ignored");
          continue;
        }

        if (messageId) {
          processedMessages.add(messageId);
          if (processedMessages.size > 1000) {
            processedMessages.clear();
          }
        }

        const senderId = event.sender.id;
        const userMessage = event.message.text.trim();

        console.log("User:", userMessage);

        const reply = getReply(userMessage);

        console.log("Bot:", reply);

        await sendMessage(senderId, reply);
      }
    }

    return res.sendStatus(200);
  }

  return res.sendStatus(405);
}

// ... (rest of your code - responses, getReplyByPayload, getReply, sendMessage, etc.)
// Keep all your existing helper functions below