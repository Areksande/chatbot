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
    console.log("Step 1: Cleaning up old settings...");
    await deleteMessengerProfile();
    await delay(2000);
    
    console.log("Step 2: Setting up new settings...");
    await setupPersistentMenu();
    await delay(1000);
    await setupGreeting();
    await delay(1000);
    await setupGetStarted();
    await delay(2000);
    
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
  // MANUAL UPDATE ENDPOINT
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
          
          // Handle menu postbacks with detailed responses
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

        // Ignore message echoes
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

// ============================================
// Chatbot Responses
// ============================================

const responses = [
  {
    keywords: ["hello", "hi", "hey", "good morning", "good afternoon", "good evening", "kamusta", "kumusta"],
    reply: `👋 Hello!

Welcome to Trajano-Reyes & Santos Law Office.

📞 Main Office: 0991-742-0621
📞 Extension Office: 09764-072-824
📧 Email: legal@trslawoffice.com

How may we assist you today?`
  },
  {
    keywords: ["office hours", "hours", "open", "schedule", "working hours", "business hours", "oras", "bukas", "what time", "when are you open"],
    reply: `🕒 OFFICE HOURS

Monday - Friday
8:30 AM - 4:30 PM

Closed during weekends and holidays.

📞 For urgent concerns outside office hours, please contact:
Main Office: 0991-742-0621`
  },
  {
    keywords: ["consultation", "consult", "consultation fee", "lawyer", "attorney", "legal advice", "magkano consultation", "consult fee"],
    reply: `⚖️ CONSULTATION SERVICES

Our consultation fee starts at ₱500.

For complex legal matters, the fee may vary depending on the case.

📋 To schedule a consultation:
1. Contact us at 0991-742-0621
2. Email: legal@trslawoffice.com
3. Visit our office during business hours

Please prepare any relevant documents before your consultation.`
  },
  {
    keywords: ["notary", "notarize", "notaryo", "affidavit", "document", "notarial", "magkano", "price", "presyo", "how much", "notary fee"],
    reply: `📝 NOTARY FEES

• Basic Affidavit: ₱200 - ₱500
• Real Estate Documents: ₱500 - ₱1,000
• Special Power of Attorney: ₱500 - ₱800
• Deed of Sale: ₱800 - ₱1,500
• Contract/Agreement: ₱500 - ₱1,000

Fees may vary depending on the document complexity.

📋 Requirements:
1. Valid ID (Government-issued)
2. Original documents to be notarized
3. Photocopies of documents

📍 Visit our office during business hours for notary services.`
  },
  {
    keywords: ["location", "address", "office", "where", "map", "nasaan", "saan"],
    reply: `📍 OFFICE LOCATION

🏢 Trajano-Reyes & Santos Law Office

MAIN OFFICE:
2nd Floor, No. 1 T. Alonzo St.,
Sto. Rosario,
Malolos City, Bulacan

🗺️ Google Maps:
https://maps.app.goo.gl/6QNd7YWNEnpVcXDk7

📍 EXTENSION OFFICE:
McArthur Highway,
Front of Malolos City Hall,
Bulihan, Malolos City

🗺️ Google Maps:
https://maps.app.goo.gl/U6CT6va1QSY8saW57

🅿️ Parking available at both locations.`
  },
  {
    keywords: ["contact", "phone", "telephone", "mobile", "number", "call", "email", "gmail", "reach"],
    reply: `📞 CONTACT INFORMATION

📱 MAIN OFFICE:
0991-742-0621

📱 EXTENSION OFFICE:
09764-072-824

📧 EMAIL:
legal@trslawoffice.com

🌐 WEBSITE:
www.trslawoffice.com

💬 FACEBOOK:
facebook.com/trslawoffice

📍 Visit our office during business hours for personal consultation.`
  },
  {
    keywords: ["services", "service", "offer", "cases", "legal services"],
    reply: `⚖️ OUR LEGAL SERVICES

• Legal Consultation
• Notarial Services
• Civil Cases
• Criminal Cases
• Family Law
  - Annulment
  - Legal Separation
  - Child Custody
  - Support
• Property & Land Cases
• Contracts & Agreements
• Corporate Law
• Labor Law
• Estate Planning
• Tax Law

📞 For specific legal concerns, please contact us at 0991-742-0621 or visit our office.

We are committed to providing quality legal services to our clients.`
  }
];

// ============================================
// Get Reply by Payload (for menu clicks) - DETAILED VERSION
// ============================================

function getReplyByPayload(payload) {
  switch(payload) {
    case "CONTACT_INFO":
      return `📞 CONTACT INFORMATION

📱 MAIN OFFICE:
0991-742-0621

📱 EXTENSION OFFICE:
09764-072-824

📧 EMAIL:
legal@trslawoffice.com

🌐 WEBSITE:
www.trslawoffice.com

💬 FACEBOOK:
facebook.com/trslawoffice

📍 OFFICE HOURS:
Monday - Friday
8:30 AM - 4:30 PM

We look forward to serving you! 🙏`;
      
    case "LOCATION":
      return `📍 OFFICE LOCATION

🏢 Trajano-Reyes & Santos Law Office

━━━━━━━━━━━━━━━━━━
📍 MAIN OFFICE:
2nd Floor, No. 1 T. Alonzo St.,
Sto. Rosario,
Malolos City, Bulacan

🗺️ Google Maps:
https://maps.app.goo.gl/6QNd7YWNEnpVcXDk7

━━━━━━━━━━━━━━━━━━
📍 EXTENSION OFFICE:
McArthur Highway,
Front of Malolos City Hall,
Bulihan, Malolos City

🗺️ Google Maps:
https://maps.app.goo.gl/U6CT6va1QSY8saW57

━━━━━━━━━━━━━━━━━━
🅿️ Free parking available at both locations
🚗 Accessible by public transportation

🕒 Office Hours:
Monday - Friday, 8:30 AM - 4:30 PM

We're excited to serve you! 🌟`;
      
    case "SERVICES":
      return `⚖️ OUR LEGAL SERVICES

━━━━━━━━━━━━━━━━━━
📋 GENERAL SERVICES:
• Legal Consultation
• Notarial Services
• Document Review
• Contract Drafting

━━━━━━━━━━━━━━━━━━
🏛️ CIVIL & CRIMINAL CASES:
• Civil Litigation
• Criminal Defense
• Administrative Cases
• Labor Cases

━━━━━━━━━━━━━━━━━━
👨‍👩‍👧 FAMILY LAW:
• Annulment
• Legal Separation
• Child Custody
• Support / Alimony
• Adoption
• Property Settlement

━━━━━━━━━━━━━━━━━━
🏢 BUSINESS & PROPERTY:
• Corporate Law
• Property & Land Cases
• Contractual Disputes
• Tax Law
• Estate Planning
• Wills and Succession

━━━━━━━━━━━━━━━━━━
📞 For inquiries or to schedule a consultation:
Call: 0991-742-0621
Email: legal@trslawoffice.com

We are committed to providing professional and quality legal services. ⚖️`;
      
    case "OFFICE_HOURS":
      return `🕒 OFFICE HOURS

━━━━━━━━━━━━━━━━━━
📅 REGULAR SCHEDULE:
Monday - Friday
8:30 AM - 4:30 PM

━━━━━━━━━━━━━━━━━━
❌ CLOSED:
• Weekends (Saturday & Sunday)
• Public Holidays
• Special Non-Working Holidays

━━━━━━━━━━━━━━━━━━
📞 For urgent matters outside office hours:
Contact: 0991-742-0621
Email: legal@trslawoffice.com

━━━━━━━━━━━━━━━━━━
📍 Both offices follow the same schedule:
• Main Office - Malolos City
• Extension Office - Bulihan, Malolos City

We look forward to serving you! 🙏`;
      
    case "CONSULTATION":
      return `⚖️ LEGAL CONSULTATION

━━━━━━━━━━━━━━━━━━
💰 CONSULTATION FEE:
Starts at ₱500.00

*Fee may vary depending on case complexity

━━━━━━━━━━━━━━━━━━
📋 TO SCHEDULE A CONSULTATION:

📞 Call us:
Main Office: 0991-742-0621
Extension: 09764-072-824

📧 Email:
legal@trslawoffice.com

🏢 Visit us:
Monday - Friday, 8:30 AM - 4:30 PM

━━━━━━━━━━━━━━━━━━
📄 WHAT TO BRING:
• Valid government-issued ID
• All relevant documents
• Timeline of events (if applicable)
• List of questions or concerns

━━━━━━━━━━━━━━━━━━
💡 IMPORTANT NOTE:
For complex legal matters, an initial consultation helps us understand your case and provide appropriate guidance.

We are here to help you! ⚖️`;
      
    case "NOTARY_FEES":
      return `📝 NOTARY FEES & SERVICES

━━━━━━━━━━━━━━━━━━
📄 BASIC DOCUMENTS:
• Affidavit: ₱200 - ₱500
• Special Power of Attorney: ₱500 - ₱800
• Deed of Sale: ₱800 - ₱1,500
• Contract/Agreement: ₱500 - ₱1,000
• Deed of Donation: ₱500 - ₱1,000
• Jurat/Acknowledgment: ₱200 - ₱300

━━━━━━━━━━━━━━━━━━
🏠 REAL ESTATE:
• Deed of Absolute Sale: ₱1,000 - ₱2,000
• Deed of Conditional Sale: ₱1,000 - ₱2,000
• Mortgage Documents: ₱800 - ₱1,500
• Lease Agreements: ₱500 - ₱1,000

━━━━━━━━━━━━━━━━━━
📋 REQUIREMENTS:
1. Valid Government-Issued ID
2. Original Documents
3. Photocopies of Documents
4. For Real Estate: Tax Declaration, Title

━━━━━━━━━━━━━━━━━━
💡 IMPORTANT:
• Fees are per document
• Additional charges for extra pages
• Rates may vary based on document complexity

━━━━━━━━━━━━━━━━━━
📍 Visit us during office hours:
Monday - Friday, 8:30 AM - 4:30 PM

📞 For inquiries: 0991-742-0621

We provide fast and reliable notary services! 📝`;
      
    default:
      return null;
  }
}

// ============================================
// Find Best Reply
// ============================================

function getReply(message) {
  message = message
    .toLowerCase()
    .trim()
    .replace(/[.,!?]/g, "");

  let bestMatch = null;
  let highestScore = 0;

  for (const item of responses) {
    let score = 0;
    for (const keyword of item.keywords) {
      if (message.includes(keyword.toLowerCase())) {
        score++;
      }
    }
    if (score > highestScore) {
      highestScore = score;
      bestMatch = item.reply;
    }
  }

  if (bestMatch) {
    return bestMatch;
  }

  return `❓ Sorry, I couldn't understand your question.

You can ask me about:

• Office hours
• Consultation
• Notary fees
• Office location
• Contact information
• Legal services

Or choose from the menu below.`;
}

// ============================================
// Send Reply to Facebook
// ============================================

async function sendMessage(senderId, text) {
  try {
    const response = await fetch(
      `https://graph.facebook.com/v23.0/me/messages?access_token=${PAGE_ACCESS_TOKEN}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          messaging_type: "RESPONSE",
          recipient: {
            id: senderId
          },
          message: {
            text: text
          }
        })
      }
    );

    const result = await response.json();

    console.log("Facebook API Response:");
    console.log(JSON.stringify(result, null, 2));

    if (!response.ok) {
      console.error("Facebook API Error:");
      console.error(result);
    }
  } catch (error) {
    console.error("Send Message Error:");
    console.error(error);
  }
}

// ============================================
// Helper Functions
// ============================================

function normalizeMessage(message) {
  return message
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ")
    .replace(/[.,!?]/g, "");
}

// Remove old processed message IDs every hour
setInterval(() => {
  processedMessages.clear();
  console.log("Processed message cache cleared.");
}, 60 * 60 * 1000);