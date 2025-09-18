
const apiKeyInput = document.getElementById('api-key');

const chatDiv = document.getElementById('chat');
const inputField = document.getElementById('input');
const sendButton = document.getElementById('send');

// Load saved key on page load
window.addEventListener('DOMContentLoaded', () => {
    const savedKey = localStorage.getItem('openai-api-key');
    if (savedKey) {
        apiKeyInput.value = savedKey;
    }
});

// Save key when changed
apiKeyInput.addEventListener('change', () => {
    localStorage.setItem('openai-api-key', apiKeyInput.value.trim());
});

const messages = [{ role: 'system', content: 'You are a helpful assistant.' }];

async function sendMessage() {
    const userInput = inputField.value;
    if (!userInput) return;

    // Display user message
    chatDiv.innerHTML += `<p><strong>You:</strong> ${userInput}</p>`;
    messages.push({ role: 'user', content: userInput });
    inputField.value = '';

    try {
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: 'gpt-4.1-mini',
            messages: messages,
            max_tokens: 200
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKeyInput.value.trim()}`
            }
        });

        const reply = response.data.choices[0].message.content.trim();
        chatDiv.innerHTML += `<p><strong>Assistant:</strong> ${reply}</p>`;
        messages.push({ role: 'assistant', content: reply });
        chatDiv.scrollTop = chatDiv.scrollHeight; // Scroll to bottom
    } catch (error) {
        console.error('Error:', error);
        chatDiv.innerHTML += `<p><strong>Error:</strong> ${error.message}</p>`;
    }
}

sendButton.addEventListener('click', sendMessage);
inputField.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') sendMessage();
});