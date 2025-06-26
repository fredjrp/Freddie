// Firebase setup
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

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const logsContainer = document.getElementById('logs');

function formatTimestamp(ts) {
  try {
    const date = ts.toDate();
    return date.toLocaleString();
  } catch {
    return '—';
  }
}

function getMessageText(msg) {
  if (msg?.text?.body) return msg.text.body;
  if (msg?.interactive?.list_reply?.title) return msg.interactive.list_reply.title;
  return '[unknown message type]';
}

function getUserMeta(from) {
  return db.collection('users').doc(from).get().then(doc => {
    if (!doc.exists) return {};
    return doc.data();
  });
}

db.collection("whatsapp_logs")
  .orderBy("timestamp", "desc")
  .limit(50)
  .onSnapshot(async (snapshot) => {
    logsContainer.innerHTML = '';
    const promises = [];

    snapshot.forEach(doc => {
      const log = doc.data();
      const from = log.from;
      const message = log.message || {};
      const type = log.type || 'text';

      const promise = getUserMeta(from).then(user => {
        const div = document.createElement('div');
        div.className = `log-entry ${user?.status === 'closed' || user?.closed ? 'red' : ''}`;

        div.innerHTML = `
          <div class="title">${from} — ${user?.agentName || 'Unassigned'}</div>
          <div>${getMessageText(message)}</div>
          <div class="meta">
            Type: ${type} | Time: ${formatTimestamp(log.timestamp)}
          </div>
          <div class="status">
            Status: ${user?.status || 'unknown'} | Last Msg: ${user?.lastMessage || '-'}
          </div>
        `;
        logsContainer.appendChild(div);
      });

      promises.push(promise);
    });

    await Promise.all(promises);
  });
