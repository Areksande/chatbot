const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

export default async function handler(req, res) {

  // Verification request from Meta
  if (req.method === "GET") {

    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    if (
      mode === "subscribe" &&
      token === VERIFY_TOKEN
    ) {
      return res.status(200).send(challenge);
    }

    return res.status(403).send("Forbidden");
  }

  // Incoming messages from Facebook
  if (req.method === "POST") {

    const body = req.body;

    if (body.object === "page") {

      for (const entry of body.entry) {

        for (const event of entry.messaging) {

          if (event.message && event.message.text) {

            const senderId = event.sender.id;
            const userMessage = event.message.text;

            const reply = getReply(userMessage);

            await sendMessage(senderId, reply);

          }

        }

      }

      return res.sendStatus(200);
    }

    return res.sendStatus(404);
  }

  return res.sendStatus(405);

}

// Keyword chatbot
function getReply(message){

    message = message.toLowerCase();

    if(message.includes("hello") || message.includes("hi")){
        return "Hello! Welcome to Trajano-Reyes & Santos Law Office.";
    }

    if(message.includes("consultation")){
        return "Our consultation fee starts at ₱500.";
    }

    if(message.includes("location")){
        return "We are located in Malolos, Bulacan.";
    }

    if(message.includes("contact")){
        return "You may contact us at 09123456789.";
    }

    return "Sorry, I don't understand your question.";
}

// Send reply to Facebook
async function sendMessage(senderId, text){

    await fetch(
        `https://graph.facebook.com/v23.0/me/messages?access_token=${PAGE_ACCESS_TOKEN}`,
        {
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                recipient:{
                    id:senderId
                },
                message:{
                    text:text
                }
            })
        }
    );

}