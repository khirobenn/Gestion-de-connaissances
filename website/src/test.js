const API_URL = "http://127.0.0.1:5000/stream/";
let assistantText = ""
fetch(API_URL, {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        mode: "cors",
        body: JSON.stringify({
          "question": "Hello",
        }),
      }).then(response => {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        function read() {
            reader.read().then(({ done, value }) => {
            if (done) {
                console.log("Stream complete");
                console.log("Final:", assistantText);
                return;
            }

            const chunk = decoder.decode(value, { stream: true });
            assistantText += chunk;
            console.log("Chunk:", chunk);
            // console.log("So far:", assistantText);

            read();
            });
        }

        read();
    });