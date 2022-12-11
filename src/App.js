import React, {useState, useRef} from 'react';
import './App.css';

import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { getAuth } from 'firebase/auth';

firebase.initializeApp({
  apiKey: "AIzaSyAXmA7-NgR2w1z4nRK0KeHHt5kihLGjNNk",
  authDomain: "aqwuah-chat.firebaseapp.com",
  projectId: "aqwuah-chat",
  storageBucket: "aqwuah-chat.appspot.com",
  messagingSenderId: "270573740969",
  appId: "1:270573740969:web:03d1286237622dfb54dab8",
  measurementId: "G-4LSQRZV2M3"
})

const auth = firebase.auth();
const firestore = firebase.firestore();



function App() {

  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <header>
        <h1>Aquoochat</h1>
        <SignOut/>
      </header>

      <section>
        {user ? <ChatRoom /> : <SignIn />}
      </section>
    </div>
  );
}

function SignIn() {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }

  return (
    <button class="sign-in" onClick={signInWithGoogle}>Sign in with Google</button>
  )
}

function SignOut() {
  return auth.currentUser && (

    <button class="sign-out" onClick={() => auth.signOut()}>Sign Out</button>
  )
}

function ChatRoom() {

  const dummy = useRef()

  const messagesRef = firestore.collection("messages");
  const query = messagesRef.orderBy("createdAt").limit(100);

  const [messages] = useCollectionData(query, {idField: "id"});

  const [formValue, setFormValue] = useState("");

  const sendMessage = async(e) => {

    e.preventDefault();

    const { uid, photoURL } = auth.currentUser;

    if (formValue.trim() !== "")
    {
      await messagesRef.add({
        text: formValue, 
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        uid,
        photoURL
      });
    }

    setFormValue("");

    dummy.current.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <>
    <main>
      {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}

      <div ref={dummy}></div>

    </main>

      <form onSubmit={sendMessage}>
        <input value={formValue} placeholder="Message" onChange={(e) => setFormValue(e.target.value)}/>

        <button type="submit">Send</button>
        
      </form>
    </>
  )

}

function ChatMessage(props) {
  const { text, uid, photoURL } = props.message;

  const messageClass = uid === auth.currentUser.uid ? "sent" : "received";


  return (
    <div className={`message ${messageClass}`}>
      <img src={photoURL} alt=""/>
      <p>{text.trim()}</p>
    </div>
    )

}

export default App;
