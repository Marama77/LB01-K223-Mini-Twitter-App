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

  if (!name || !password) {
    alert("Bitte Benutzernamen und Passwort eingeben!");
    return;
  }

  try {
    const res = await fetch("http://localhost:4200/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name, 
        password
      })
    });

    if (res.ok) {
      const data = await res.json();
      currentUserId = data.user_id;

      (document.getElementById("loginBox") as HTMLElement).style.display = "none";
      (document.getElementById("tweetBox") as HTMLElement).style.display = "block";
    } else {
      const errorData = await res.json();
      alert(errorData.error || "Login fehlgeschlagen!");
    }
  } catch (error) {
    console.error("Login error:", error);
    alert("Verbindung zum Server fehlgeschlagen!");
  }
}

//Formular-Wechsel-Funktionen
function showRegister(): void {
  (document.getElementById("loginBox") as HTMLElement).style.display = "none";
  (document.getElementById("registerBox") as HTMLElement).style.display = "block";
}

function showLogin(): void {
  (document.getElementById("registerBox") as HTMLElement).style.display = "none";
  (document.getElementById("loginBox") as HTMLElement).style.display = "block";
}

//Registrierungsfunktion
async function registerUser(): Promise<void> {
  const nameInput = document.getElementById("regName") as HTMLInputElement;
  const passwordInput = document.getElementById("regPassword") as HTMLInputElement;
  const passwordConfirmInput = document.getElementById("regPasswordConfirm") as HTMLInputElement;

  const name = nameInput.value;
  const password = passwordInput.value;
  const passwordConfirm = passwordConfirmInput.value;

  if (!name || !password || !passwordConfirm) {
    alert("Bitte alle Felder ausfüllen!");
    return;
  }

  if (password !== passwordConfirm) {
    alert("Passwörter stimmen nicht überein!");
    return;
  }

  try {
    const res = await fetch("http://localhost:4200/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name, 
        password
      })
    });

    if (res.ok) {
      const data = await res.json();
      currentUserId = data.user_id;

      // Leere die Registrierungsfelder
      nameInput.value = "";
      passwordInput.value = "";
      passwordConfirmInput.value = "";

      alert("Registrierung erfolgreich! Sie sind jetzt eingeloggt.");
      
      (document.getElementById("registerBox") as HTMLElement).style.display = "none";
      (document.getElementById("tweetBox") as HTMLElement).style.display = "block";
    } else {
      const errorData = await res.json();
      alert(errorData.error || "Registrierung fehlgeschlagen!");
    }
  } catch (error) {
    console.error("Registration error:", error);
    alert("Verbindung zum Server fehlgeschlagen!");
  }
}

//Tweet aus HTML holen & an BE schicken


async function sendTweet(): Promise<void> {
  const contentInput = document.getElementById("content") as HTMLInputElement;

  if (!currentUserId) {
    alert("Bitte zuerst Usernamen & Passwort eingeben!");
  }

  const content = contentInput.value;

  await fetch("http://localhost:4200/tweets", {
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
