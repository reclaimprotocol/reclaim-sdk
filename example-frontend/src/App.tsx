import React from 'react';
import './App.css';
import axios from 'axios'

const getCallbackUrl = process.env.REACT_APP_BACKEND_BASE_URL + '/home'
const getStatusUrl = process.env.REACT_APP_BACKEND_BASE_URL + '/status'

function App() {

  const [callbackUrl, setCallbackUrl] = React.useState<string | null>(null)
  const [status, setStatus] = React.useState<string | null>(null)

  const getStatus = async (callbackId: string) => {
    const response = await axios.get(getStatusUrl + `/${callbackId}`);
    setStatus(response.data.status);
  }

  const proveIt = async (e: any) => {
    e.preventDefault();

    const response = await axios.get(getCallbackUrl);

    setCallbackUrl(response.data.url);

  }

  React.useEffect(() => {
    if (!callbackUrl) return;

    const interval = setInterval(() => {
      getStatus(callbackUrl)
    }, 1000);

    return () => clearInterval(interval);
  }, [callbackUrl]);

  return (
    <div className="App">
      <header className="App-header">
        {/* <img src={logo} className="App-logo" alt="logo" /> */}

        <h2>Are you a questbook employee?</h2>
        {status === null ?
          <>
            <button
              onClick={proveIt}
            >
              PROVE IT!
            </button>
            <br></br>
            {callbackUrl && <a href={callbackUrl}>Open App</a>}
          </> : (status !== 'pending' ? <h3>Thanks for submitting your link!</h3> : <div></div>)
        }
      </header>
    </div>
  );
}

export default App;
