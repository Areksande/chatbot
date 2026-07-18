const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

// Store processed message IDs (prevents duplicate replies)
const processedMessages = new Set();

export default async function handler(req, res) {

  // ============================================
  // Facebook Webhook Verification
  // ============================================
  if (req.method === "GET") {

    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      console.log("Webhook verified successfully.");
      return res.status(200).send(challenge);
    }

    return res.status(403).send("Forbidden");
  }

  // ============================================
  // Receive Messages
  // ============================================
  if (req.method === "POST") {

    const body = req.body;

    console.log("Incoming Webhook:");
    console.log(JSON.stringify(body, null, 2));

    if (body.object !== "page") {
      return res.sendStatus(404);
    }

    for (const entry of body.entry) {

      for (const event of entry.messaging) {

        // Ignore delivery events
        if (event.delivery) continue;

        // Ignore read events
        if (event.read) continue;

        // Ignore bot's own messages
        if (event.message?.is_echo) continue;

        // Ignore non-text messages
        if (!event.message?.text) continue;

        const messageId = event.message.mid;

        // Prevent duplicate replies
        if (processedMessages.has(messageId)) {
          console.log("Duplicate message ignored.");
          continue;
        }

        processedMessages.add(messageId);

        const senderId = event.sender.id;
        const userMessage = event.message.text;

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
`Hello! 👋

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
`🕒 Office Hours

Monday to Friday
8:30 AM - 4:30 PM

We are closed on weekends and holidays.`
  },

  {
    keywords: [
      "notary",
      "fee",
      "price",
      "cost",
      "attorney",
      "magkano",
      "bayad",
    ],
    reply:
`💼 Notary Fee
Basic Affidavit of Loss Ranging from ₱200 to ₱500.
Real Estate, Title Loss Ranging from ₱500 to ₱1,000.`
  },

  {
    keywords: [
      "location",
      "address",
      "where",
      "office",
      "nasaan",
      "saan",
      "map"
    ],
    reply:
`📍 Office Location
Trajano-Reyes & Santos Law Office
Malolos City, Bulacan

Main Office: 2nd Floor, Trajano Reyes and Santos Law, No. 1, 1 T Alonzo, Santo Rosario, Street, Malolos, Bulacan
Google Map: https://maps.app.goo.gl/6QNd7YWNEnpVcXDk7
Extension Office: McArthur Highway,Front of City Hall, Bulihan, Malolos, Bulacan
Google Map: https://maps.app.goo.gl/U6CT6va1QSY8saW57
`

  },

  {
    keywords: [
      "contact",
      "phone",
      "telephone",
      "number",
      "mobile",
      "call",
      "email",
      "gmail",
      "reach"
    ],
    reply:
`📞 Contact Information

Main Office:
0991-742-0621

Extension Office:
09764-072-824

Email:
legal@trslawoffice.com`
  }

];

// ============================================
// Find Matching Reply
// ============================================

function getReply(message) {

  message = message.toLowerCase().trim();

  for (const item of responses) {

    if (item.keywords.some(keyword => message.includes(keyword))) {
      return item.reply;
    }

  }

  return `Sorry, I couldn't understand your question.

You can ask me about:

• Office hours
• Consultation fee
• Office location
• Contact information`;
}

// ============================================
// Send Message to Facebook
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

    console.log("Facebook Response:");
    console.log(result);

    if (!response.ok) {
      console.error("Facebook API Error:", result);
    }

  } catch (error) {

    console.error("Send Message Error:", error);

  }

}