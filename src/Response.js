function Response(props) {
  return (
    <div className="response">
      <h3>{props.responseText}</h3>
      <p>{props.upvotes} upvotes</p>
      <input type="submit" onClick={() => props.upvote(props.id)} value="Upvote" />
    </div>
  );
}

export default Response;