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

        if (
            mode === "subscribe" &&
            token === VERIFY_TOKEN
        ) {
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
                if (event.delivery) {
                    console.log("Ignored delivery event");
                    continue;
                }

                // Ignore read events
                if (event.read) {
                    console.log("Ignored read event");
                    continue;
                }

                // Ignore bot's own messages
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
                if (processedMessages.has(messageId)) {
                    console.log("Duplicate message ignored");
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
// Keyword Replies
// ============================================
function getReply(message) {

    message = message.trim().toLowerCase();

    if (message.includes("hello") || message.includes("hi")) {
        return "Hello! Welcome to Trajano-Reyes & Santos Law Office. Here is our contact information: Main office: 0991-742-0621 | Extension Office: 09764-072-824.";
    }

    if (message.includes("consultation")) {
        return "Our consultation fee starts at ₱500.";
    }

    if (message.includes("location")) {
        return "We are located in Malolos, Bulacan.";
    }

    if (message.includes("contact")) {
        return "You may contact us at 09123456789.";
    }

    return "Sorry, I don't understand your question.";
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