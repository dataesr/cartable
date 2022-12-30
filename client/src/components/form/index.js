export default function Form({ method, action, body, children }) {
  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(event);
  };

  return (
    <form onSubmit={handleSubmit}>
      {children}
    </form>
  );
}
