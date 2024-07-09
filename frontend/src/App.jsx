import { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [jokes, setJokes] = useState([]);

  useEffect(() => {
    axios.get('/api/jokes') // Fix the URL (add ://)
      .then(response => {
        setJokes(response.data);
      })
      .catch(error => {
        console.error('Error fetching jokes:', error); // Add error handling
      });
  }, [jokes]); 

  return (
    <div>
      <h1>Hello Jokes</h1>
      <p>Jokes: {jokes.length}</p>
      <ul> {/* Use a list for better semantics */}
        {jokes.map(joke => (
          <li key={joke.setup}> {/* Use setup as the key, it's more unique */}
            {joke.setup} - {joke.punchline}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
