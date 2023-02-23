import React from 'react';
import './App.css';
import axios from 'axios'

const getCallbackUrl = process.env.REACT_APP_BACKEND_BASE_URL + '/reclaim-url'

function App() {

  const [callbackUrl, setCallbackUrl] = React.useState<string | null>(null)

  const proveIt = async (e: any) => {
    e.preventDefault();

    const response = await axios.get(getCallbackUrl);

    setCallbackUrl(response.data.url);

  }
  return (
    <div className="App">
      <header className="App-header">
        {/* <img src={logo} className="App-logo" alt="logo" /> */}

        <h2>Are you a questbook employee?</h2>
        
        <button
          onClick={proveIt}
        >
          PROVE IT!
        </button>
        <br></br>
        {callbackUrl && <a href={callbackUrl}>Open App</a>}
      </header>
    </div>
  );
}

export default App;
