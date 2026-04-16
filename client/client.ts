if (location.host.includes('localhost')) {
  // Load livereload script if we are on localhost

  const host: string = (location.host || 'localhost').split(':')[0]

  document.write(
    `<script src="http://${host}:35729/livereload.js?snipver=1"></script>`
  )
}

console.log('This is a Test')


//User aus HTML-Dokument holen und an BE schicken

let currentUserId: number | null = null;

async function createUser(): Promise<void> {
  const nameInput = document.getElementById("name") as HTMLInputElement;
  const passwordInput = document.getElementById("password") as HTMLInputElement;

  const name = nameInput.value;
  const password = passwordInput.value;

  const res = await fetch("http://localhost:3000/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      name, 
      password
    })
  });

  const data = await res.json();
  currentUserId = data.user_id;

  (document.getElementById("loginBox") as HTMLElement).style.display = "none";
  (document.getElementById("tweetBox") as HTMLElement).style.display = "block";
}


//Tweet aus HTML holen & an BE schicken


async function sendTweet(): Promise<void> {
  const contentInput = document.getElementById("content") as HTMLInputElement;

  if (!currentUserId) {
    alert("Bitte zuerst Usernamen & Passwort eingeben!");
  }

  const content = contentInput.value;

  await fetch("http://localhost:3000/tweets", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      user_id: currentUserId,
      content
    })
  });

  alert("Tweet gespeichert 🚀");
}
