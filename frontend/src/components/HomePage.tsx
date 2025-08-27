import { useState } from "react";
import reactLogo from "/src/assets/react.svg";
import viteLogo from "/vite.svg";

function HomePage() {
  const [count, setCount] = useState(0);
  const [hello, setHello] = useState("");

  const url = "http://127.0.0.1:5000/hello";   // Use consistent hostname

  const getHello = async () => {
    try {
      const response = await fetch(url);
      const json = await response.json();
      return json;
    } catch (error) {
      console.error(error);
    }
  };

  const handleGetHello = async () => {
    const result = await getHello();
    setHello(result?.message || JSON.stringify(result));
  };

  const handleSpotifyLogin = () => {
    window.location.href = "http://127.0.0.1:5000/auth/login"; // Consistent hostname
  };

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank" rel="noreferrer">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank" rel="noreferrer">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>PlaylistRoulette</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>count is {count}</button>
        <button onClick={handleGetHello}>Get Hello</button>
        <button
          onClick={handleSpotifyLogin}
          style={{ backgroundColor: "#1db954", color: "white", margin: "10px" }}
        >
          🎵 Login with Spotify
        </button>
        {hello && <p>API says: {hello}</p>}
        <p>Edit <code>src/App.tsx</code> and save to test HMR</p>
      </div>
    </>
  );
}

export default HomePage;