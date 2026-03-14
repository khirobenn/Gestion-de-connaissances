const API_URL = "http://127.0.0.1:5000/chat/";

const response = await fetch(API_URL, {
method: "POST",
headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
},
mode: "cors",
body: JSON.stringify({
    "question": "Real Madrid against Benfica",
}),
});

if (!response.ok) {
throw new Error(`Request failed with status ${response.status}`);
}

const data = await response.json();

const assistantText = data.response

console.log(assistantText)