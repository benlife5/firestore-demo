import './App.css';
import Response from "./Response.js"

function App() {

  const responses = [
    {id: 1, responseText: "Text", upvotes: 10},
    {id: 2, responseText: "Text2", upvotes: 20}
  ]

  const upvote = (responseID) => {

  }

  return (
    <div className="App">
      <h1>Favorite Ice Cream Flavor?</h1>
      <input type="text" />
      <input type="submit" />
      {responses.map((response) => <Response id={response.id} responseText={response.responseText} upvotes={response.upvotes} upvote={upvote}/> )}
    </div>
  );
}

export default App;
