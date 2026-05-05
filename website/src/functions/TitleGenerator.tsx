export const titleGenerator = async (user_message: string, ai_answer:string) => {
    const API_URL = "http://127.0.0.1:5000/title/";
    try{
        const response = await fetch(
          API_URL, {
            method: "POST",
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            mode: "cors",
            body: JSON.stringify({
              "user_message": user_message,
              "ai_answer": ai_answer
            }),
          }
        )
        if(!response.ok) return null;
        const res = await response.json();
        return res;
    }
    catch(e){
        console.log(e);
    }
}