"use strict";
if (location.host.includes('localhost')) {
    // Load livereload script if we are on localhost
    const host = (location.host || 'localhost').split(':')[0];
    document.write(`<script src="http://${host}:35729/livereload.js?snipver=1"></script>`);
}
console.log('This is a Test');


//User aus HTML-Dokument holen und an BE schicken
let currentUserId = null;
async function createUser() {
    const nameInput = document.getElementById("name");
    const passwordInput = document.getElementById("password");
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
    alert("User erfolgreich erstellt! ID: " + currentUserId);
}
//Tweet aus HTML holen & an BE schicken
async function sendTweet() {
    const contentInput = document.getElementById("content");
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
