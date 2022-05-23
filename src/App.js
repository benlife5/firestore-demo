import './App.css';
import Response from "./Response.js"
import {initializeApp} from "firebase/app"
import { getFirestore, collection, addDoc, doc, getDocs, updateDoc, increment } from "firebase/firestore";
import {useState, useEffect, useRef, useCallback} from "react"

function App() {
  const firebaseConfig = {
    apiKey: process.env.REACT_APP_apiKey,
    authDomain: process.env.REACT_APP_authDomain,
    projectId: process.env.REACT_APP_projectId,
    storageBucket: process.env.REACT_APP_storageBucket,
    messagingSenderId: process.env.REACT_APP_messagingSenderId,
    appId: process.env.REACT_APP_appId
  };
  const firebaseApp = initializeApp(firebaseConfig);
  const db = getFirestore(firebaseApp)
  
  const textFieldRef = useRef(null);

  const upvote = (responseID) => {
    updateDoc(doc(db, "responses", responseID), {
      upvotes: increment(1)
    })
    .then((docRef) => {
      const updatedResponses = [...responses]
      updatedResponses.forEach((response) =>  {
        console.log(response.id)
        if (response.id === responseID) {
          response.upvotes++
        }
      })
      updatedResponses.sort((a, b) => (a.upvotes < b.upvotes) ? 1 : -1)
      setResponses(updatedResponses)
    })
    .catch((e) => console.error(e))
  }

  const [responses, setResponses] = useState([])

  const loadResponses = useCallback(() => {
    const responses = []
    getDocs(collection(db, "responses"))
    .then((allResponses) => {
      allResponses.forEach((response) => responses.push({ id: response.id, ...response.data() }))
      responses.sort((a, b) => (a.upvotes < b.upvotes) ? 1 : -1)
      setResponses(responses)
    })
  }, [db])

  useEffect(() => {
    loadResponses()
  }, [loadResponses])

  const addResponse = (e) => {
    e.preventDefault();
    const newResponse = {
      responseText: textFieldRef.current.value,
      upvotes: 0
    }
    addDoc(collection(db, "responses"), newResponse)
    .then((docRef) => {
      setResponses([...responses, {id: docRef.id, ...newResponse}])
    })
    .catch((e) => console.error(e))    
  }

  return (
    <div className="App">
      <h1>Favorite Ice Cream Flavor?</h1>
      <form onSubmit={addResponse} >
        <input type="text" ref={textFieldRef} />
        <input type="submit" />
      </form>
      
      {responses.map((response) => <Response key={response.id} id={response.id} responseText={response.responseText} upvotes={response.upvotes} upvote={upvote}/> )}
    </div>
  );
}

export default App;
