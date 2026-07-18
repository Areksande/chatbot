export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message } = req.body;

  const text = message.toLowerCase();

  let reply = "Sorry, I don't understand your question.";

  if (text.includes('hello') || text.includes('hi')) {
    reply = 'Hello! How can I help you today?';
  } else if (text.includes('price') || text.includes('fee')) {
    reply = 'Our consultation fee starts at ₱500.';
  } else if (text.includes('location') || text.includes('address')) {
    reply = 'We are located in Malolos, Bulacan.';
  } else if (text.includes('contact') || text.includes('phone')) {
    reply = 'You may contact us at 0912-345-6789.';
  } else if (text.includes('hours') || text.includes('office')) {
    reply = 'Office hours are Monday to Friday, 8:00 AM to 5:00 PM.';
  }

  res.status(200).json({ reply });
}