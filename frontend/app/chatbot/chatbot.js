function toggleChat() {
  const chatbot = document.getElementById("chatbot-container");
  const toggle = document.getElementById("chat-toggle");

  if (chatbot.classList.contains("show")) {
    chatbot.classList.remove("show");
    setTimeout(() => chatbot.classList.add("hidden"), 300);
  } else {
    chatbot.classList.remove("hidden");
    setTimeout(() => {
      chatbot.classList.add("show");

      // ✅ focus when opened
      document.getElementById("chat-input")?.focus();

    }, 20);
  }

  toggle.style.transform = "scale(0.9)";
  setTimeout(() => (toggle.style.transform = "scale(1)"), 200);
}

async function sendMessage() {
  const input = document.getElementById("chat-input");
  const chatBody = document.getElementById("chat-body");
  const btn = document.getElementById("send-btn");

  const message = input.value.trim();
  if (!message) {
  input.focus();
  return;
}

  btn.disabled = true; // ✅ disable while sending

  appendMessage("user", message);
  input.value = "";
  chatBody.scrollTop = chatBody.scrollHeight;

  const typing = document.createElement("div");
  typing.className = "bot-message typing-indicator";
  typing.innerHTML = "<span></span><span></span><span></span>";
  chatBody.appendChild(typing);

try {
  const res = await fetch("https://portfolio-backend-hdqj.onrender.com/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message })
  });

  if (!res.ok) throw new Error("Server error");

  const data = await res.json();
  typing.remove();

  appendMessage("bot", data.reply);
} catch (error) {
  typing.remove();
  appendMessage("bot", "⚠️ Sorry boss, I’ve run out of tokens and without premium powers, I can’t do proper detective work on him right now 🕵️‍♂️");
}

  btn.disabled = false; // ✅ re-enable
  chatBody.scrollTop = chatBody.scrollHeight;
}

// Append message bubbles
function appendMessage(sender, text) {
  const chatBody = document.getElementById("chat-body");
  const messageEl = document.createElement("div");
  messageEl.className = sender === "user" ? "user-message" : "bot-message";

  // Simulate "typing" delay for bot
  if (sender === "bot") {
    setTimeout(() => {
      messageEl.textContent = text;
      chatBody.appendChild(messageEl);
      chatBody.scrollTop = chatBody.scrollHeight;
    }, 300);
  } else {
    messageEl.textContent = text;
    chatBody.appendChild(messageEl);
  }
}

// Typing animation bubbles
const style = document.createElement("style");
style.innerHTML = `
.typing-indicator {
  display: inline-block;
  background: var(--chat-bubble-bot);
  border-radius: 12px;
  padding: 8px 14px;
  margin-top: 4px;
  align-self: flex-start;
}
.typing-indicator span {
  width: 6px;
  height: 6px;
  background: #ccc;
  display: inline-block;
  border-radius: 50%;
  margin-right: 4px;
  animation: blink 1.4s infinite both;
}
.typing-indicator span:nth-child(2) { animation-delay: 0.2s; }
.typing-indicator span:nth-child(3) { animation-delay: 0.4s; }
@keyframes blink {
  0%, 80%, 100% { opacity: 0; }
  40% { opacity: 1; }
}
`;
document.head.appendChild(style);

function initChatbot() {
  const input = document.getElementById("chat-input");
  if (!input) return;

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  });
}

setTimeout(initChatbot, 100);