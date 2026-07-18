const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

// Prevent duplicate replies
const processedMessages = new Set();

export default async function handler(req, res) {

  // ============================================
  // Facebook Webhook Verification (GET)
  // ============================================
  if (req.method === "GET") {

    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    if (
      mode === "subscribe" &&
      token === VERIFY_TOKEN
    ) {
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

          // Keep only the latest 1000 IDs
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
    keywords: [
      "hello",
      "hi",
      "hey",
      "good morning",
      "good afternoon",
      "good evening",
      "kamusta",
      "kumusta"
    ],
    reply:
      `👋 Hello!

Welcome to Trajano-Reyes & Santos Law Office.

📞 Main Office: 0991-742-0621
📞 Extension Office: 09764-072-824
📧 Email: legal@trslawoffice.com

How may we assist you today?`
  },

  {
    keywords: [
      "office hours",
      "hours",
      "open",
      "schedule",
      "working hours",
      "business hours",
      "oras",
      "bukas",
      "what time",
      "when are you open"
    ],
    reply:
      `🕒 OFFICE HOURS

Monday - Friday
8:30 AM - 4:30 PM

Closed during weekends and holidays.`
  },

  {
    keywords: [
      "consultation",
      "consult",
      "consultation fee",
      "lawyer",
      "attorney",
      "legal advice",
      "magkano consultation",
      "consult fee"
    ],
    reply:
      `⚖️ CONSULTATION

Our consultation fee starts at ₱500.

For complex legal matters, the fee may vary depending on the case.`
  },

  {
    keywords: [
      "notary",
      "notarize",
      "notaryo",
      "affidavit",
      "document",
      "notarial",
      "notary fee"
    ],
    reply:
      `📝 NOTARY FEES

• Basic Affidavit
₱200 - ₱500

• Real Estate Documents
₱500 - ₱1,000

Fees may vary depending on the document.`
  },

  {
    keywords: [
      "location",
      "address",
      "office",
      "where",
      "map",
      "nasaan",
      "saan"
    ],
    reply:
      `📍 OFFICE LOCATION

Trajano-Reyes & Santos Law Office

Main Office:
2nd Floor, No. 1 T. Alonzo St.,
Sto. Rosario,
Malolos City, Bulacan

Google Maps:
https://maps.app.goo.gl/6QNd7YWNEnpVcXDk7

Extension Office:
McArthur Highway,
Front of Malolos City Hall,
Bulihan, Malolos City

Google Maps:
https://maps.app.goo.gl/U6CT6va1QSY8saW57`
  },

  {
    keywords: [
      "contact",
      "phone",
      "telephone",
      "mobile",
      "number",
      "call",
      "email",
      "gmail",
      "reach"
    ],
    reply:
      `📞 CONTACT INFORMATION

Main Office
0991-742-0621

Extension Office
09764-072-824

Email
legal@trslawoffice.com`
  },

  {
    keywords: [
      "services",
      "service",
      "offer",
      "cases",
      "legal services"
    ],
    reply:
      `⚖️ OUR LEGAL SERVICES

• Legal Consultation
• Notarial Services
• Civil Cases
• Criminal Cases
• Family Law
• Property & Land Cases
• Contracts & Agreements

Please send us your concern for more information.`
  }

];

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
• Legal services`;
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

// Normalize user message
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