// ✅ Firebase config (Replace these values with your own)
const firebaseConfig = {
  apiKey: "AIzaSyCDYianIs_dLAI2bpBNRPRXVamHDYOhIcE",
  authDomain: "housingfreeop.firebaseapp.com",
  databaseURL: "https://housingfreeop-default-rtdb.firebaseio.com",
  projectId: "housingfreeop",
  storageBucket: "housingfreeop.appspot.com",
  messagingSenderId: "369472820914",
  appId: "1:369472820914:web:3f189fe62e034bb1a91bab",
  measurementId: "G-E6H9E9DLCP"
};

// ✅ Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const logsContainer = document.getElementById('logs');

// ✅ Utility: Format timestamp
function formatTimestamp(ts) {
  try {
    return ts.toDate().toLocaleString();
  } catch (err) {
    return '—';
  }
}

// ✅ Utility: Get main message text
function getMessageText(message = {}, interactive = {}) {
  if (message?.text?.body) return message.text.body;
  if (interactive?.list_reply?.title) return interactive.list_reply.title;
  return '[No message content]';
}

// ✅ Get user metadata by phone
function getUserMeta(from) {
  return db.collection('users').doc(from).get().then(doc => {
    return doc.exists ? doc.data() : {};
  });
}

// ✅ Real-time listener
db.collection("whatsapp_logs")
  .orderBy("timestamp", "desc")
  .limit(50)
  .onSnapshot(async (snapshot) => {
    logsContainer.innerHTML = ''; // Clear UI
    const promises = [];

    snapshot.forEach(doc => {
      const log = doc.data();
      const from = log.from;
      const msg = log.message || {};
      const interactive = log.interactive || {};
      const type = log.type || 'text';

      const promise = getUserMeta(from).then(user => {
        const div = document.createElement('div');
        div.className = `log-entry ${user?.closed ? 'red' : ''}`;

        div.innerHTML = `
          <div class="title">${from} — ${user?.agentName || 'Unassigned'}</div>
          <div>${getMessageText(msg, interactive)}</div>
          <div class="meta">
            Type: ${type} | Time: ${formatTimestamp(log.timestamp)}
          </div>
          <div class="status">
            Status: ${user?.status || 'unknown'} | Last Msg: ${user?.lastMessage || '-'}</div>
        `;
        logsContainer.appendChild(div);
      });

      promises.push(promise);
    });

    await Promise.all(promises);
  });
