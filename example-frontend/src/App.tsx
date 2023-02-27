import React from 'react';
import './App.css';
import axios from 'axios'

const getCallbackUrl = process.env.REACT_APP_BACKEND_BASE_URL + '/home'
const getStatusUrl = process.env.REACT_APP_BACKEND_BASE_URL + '/status'

function App() {

  const [callbackUrl, setCallbackUrl] = React.useState<string | null>(null)
  const [callbackId, setCallbackId] = React.useState<string | null>(null)
  const [status, setStatus] = React.useState<string | null>(null)
  const [loading, setLoading] = React.useState<boolean>(false)

  const getStatus = async (callbackId: string) => {
    const response = await axios.get(getStatusUrl + `/${callbackId}`);
    setStatus(response.data.status);
  }

  const proveIt = async (e: any) => {
    e.preventDefault();
    const response = await axios.get(getCallbackUrl)

    setCallbackId(response.data.callbackId)
    setCallbackUrl(response.data.url);
    setLoading(true)
    window.location.replace(response.data.url)

  }

  React.useEffect(() => {
    if (!callbackId) return;

    const interval = setInterval(() => {
      getStatus(callbackId)
    }, 1000);

    return () => clearInterval(interval);
  }, [callbackId]);

  return (
    <div className="App">
      <header className="App-header">

        <h2>Claim that you have a google account!</h2>

        {!callbackUrl &&
        <button
          className="button"
          disabled={!!callbackUrl}
          onClick={proveIt}
        >
          Claim it!
        </button>
          
        }
        {callbackUrl && 
        <div className='links'>
            
            <div>If you don't have our app installed, check the installation steps {' '}
              <a 
                target="_blank"    
                rel="noreferrer"
                className="App-link" 
                href="https://questbook.gitbook.io/reclaim-protocol/installing-reclaim-wallet"
              >
                 here
              </a>
            </div>
          </div>}
        {status === 'verified' ? <h3>Thanks for submitting your link!</h3> : 
        (loading ? <div className='loader'></div> : <></>)}
      </header>
    </div>
  );
}

export default App;
