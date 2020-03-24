importScripts("https://www.gstatic.com/firebasejs/7.6.2/firebase-app.js")
importScripts("https://www.gstatic.com/firebasejs/7.6.2/firebase-messaging.js")

const firebaseConfig = {
  apiKey: "AIzaSyD2stxpjMUHTE8n-e7tHIjOlGi4w1ivzXg",
  authDomain: "gestionpropiedades-3bca6.firebaseapp.com",
  databaseURL: "https://gestionpropiedades-3bca6.firebaseio.com",
  projectId: "gestionpropiedades-3bca6",
  storageBucket: "gestionpropiedades-3bca6.appspot.com",
  messagingSenderId: "364779489391",
  appId: "1:364779489391:web:259d980651dffc9f2e659a",
  measurementId: "G-NVE582M3VL"
};

firebase.initializeApp(firebaseConfig)
const messagin = firebase.messaging()