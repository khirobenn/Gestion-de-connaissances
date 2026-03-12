const model = "gemma3:27b-cloud"

// fetch('http://localhost:11434/api/chat', {
//   method: 'POST',
//   headers: { 'Content-Type': 'application/json' },
//   body: JSON.stringify({ model: model, messages: [{
//     role: "user", content:"Why the sky is blue ?"
//   }],
//   stream: false})
// })
// .then(response => response.json())
// .then(data => console.log(data.message.content));

import ollama from 'ollama'

const message = { role: 'user', content: 'Quelle est la recette du cake au kiwi ?' }
const response = await ollama.chat({ model: model, messages: [message], stream: true })
for await (const part of response) {
  process.stdout.write(part.message.content)
}