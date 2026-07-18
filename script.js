async function sendMessage() {
  const input = document.getElementById('messageInput');
  const text = input.value.trim();

  if (!text) return;

  addMessage(text, 'user');
  input.value = '';

  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ message: text })
  });

  const data = await response.json();

  addMessage(data.reply, 'bot');
}

function addMessage(text, type) {
  const messages = document.getElementById('messages');

  const div = document.createElement('div');
  div.className = `message ${type}`;
  div.textContent = text;

  messages.appendChild(div);

  messages.scrollTop = messages.scrollHeight;
}

document.getElementById('messageInput')
  .addEventListener('keypress', function(e){
    if(e.key === 'Enter'){
      sendMessage();
    }
  });