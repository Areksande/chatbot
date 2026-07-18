export function getReply(message) {

    message = message.toLowerCase();

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
        return "Call us at 09123456789.";
    }

    return "Sorry, I don't understand. Please contact our office for assistance.";
}