import './App.css';
import Response from "./Response.js"
import {initializeApp} from "firebase/app"
import { getFirestore, collection, addDoc, doc, getDocs, updateDoc, increment } from "firebase/firestore";
import {useState, useEffect, useRef, useCallback} from "react"

function App() {

  // Firebase config stuff. Use a .ENV file!
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
  
  // React initialization stuff
  const textFieldRef = useRef(null);
  const [responses, setResponses] = useState([])

  // Get all previous responses
  // useCallback needed bc it is called in useEffect
  const loadResponses = useCallback(() => {
    const responses = []
    getDocs(collection(db, "responses"))  // get the collection
    .then((allResponses) => {  // format each response into an array as we want it
      allResponses.forEach((response) => responses.push({ id: response.id, ...response.data() }))
      responses.sort((a, b) => (a.upvotes < b.upvotes) ? 1 : -1)  // sort by an object property
      setResponses(responses)
    })
  }, [db])

  // Get responses on page load
  useEffect(() => {
    loadResponses()
  }, [loadResponses])

  // upvote a previous response 
  const upvote = (responseID) => {
    updateDoc(doc(db, "responses", responseID), {
      upvotes: increment(1)  // increment is a built-in firestore function that increments by the number specified
    })
    .then((docRef) => {
      // update the state variable. This is not a very efficient way to do it but just keeping it simple for now
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

  // Add a new response
  const addResponse = (e) => {
    e.preventDefault();  // no reloading the page

    const newResponse = {
      responseText: textFieldRef.current.value,
      upvotes: 0
    }
    addDoc(collection(db, "responses"), newResponse) // add the new response 
    .then((docRef) => {
      setResponses([...responses, {id: docRef.id, ...newResponse}])  // update the state variable
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
