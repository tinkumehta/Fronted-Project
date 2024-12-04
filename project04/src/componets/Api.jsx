import React, { useEffect, useState } from "react";

function Api() {
  const [joke, setJoke] = useState(null); // State for a single joke
  const [loading, setLoading] = useState(true); // State for loading
  const [error, setError] = useState(null); // State for errors
  const [data , setData] = useState('');

  const fetchJoke = async () => {
    try {
      setLoading(true); // Set loading before fetching
      const response = await fetch(
        "https://api.freeapi.app/api/v1/public/randomjokes"
      );
      const result = await response.json();
      if (result.success) {
        // Pick a random joke from the array
        const randomJoke = result.data.data[
          Math.floor(Math.random() * result.data.data.length)
        ];
        setJoke(randomJoke); // Set the random joke
        setData(result.data);
      } else {
        setError(result.message || "Failed to fetch joke");
      }
    } catch (error) {
      setError("An error occurred while fetching joke");
    } finally {
      setLoading(false); // Set loading to false after fetching
    }
  };

  useEffect(() => {
    fetchJoke(); // Fetch a joke when the component mounts
  }, []);

  if (loading) return <div>Loading...</div>; // Show loading state
  if (error) return <div>Error: {error}</div>; // Show error state

  return (
    <div>
      <h1>Random Joke</h1>
      {joke && (
        <div>
          <p>{joke.categories || "Muskan"}</p>
          <p>{joke.id}</p>
          <p>{joke.content}</p>
          
        </div>
      )}
      <div>
      <p>{data.page}</p>
      <p>{data.currentPageItems}</p>
      </div>
      <button onClick={fetchJoke}>Show New Joke</button> {/* Button to fetch new joke */}
    </div>
  );
}

export default Api;
