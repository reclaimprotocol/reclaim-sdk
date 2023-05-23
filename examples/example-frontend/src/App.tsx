import React from 'react';
import './App.css';
import axios from 'axios'
import QRCode from 'react-qr-code';


const backendBaseUrl = process.env.REACT_APP_BACKEND_BASE_URL
const getStatusUrl = process.env.REACT_APP_BACKEND_BASE_URL + '/status'

function App() {

  const [callbackUrl, setCallbackUrl] = React.useState<string | null>(null)
  const [callbackId, setCallbackId] = React.useState<string | null>(null)
  const [status, setStatus] = React.useState<string | null>(null)
  const [loading, setLoading] = React.useState<boolean>(false)
  const [username, setUsername] = React.useState<string>()
  const [appUrl, setAppUrl] = React.useState<string | null>(null)

  const getStatus = async (callbackId: string) => {
    const response = await axios.get(getStatusUrl + `/${callbackId}`);
    setStatus(response.data.status);
  }

  const proveIt = async (e: any) => {
    e.preventDefault();
    console.log('prove it')
    const response = await axios.get(backendBaseUrl + '/request')
    console.log(response);
    setCallbackId(response.data.callbackId)
    setCallbackUrl(response.data.reclaimUrl);
    setLoading(true)
    //window.location.replace(response.data.url)
    setAppUrl(response.data.reclaimUrl);
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

        <h2>DEMO</h2>
        <h3>Prove that you are a real person owning a Google and Reddit account</h3>
        <p>[This demo uses HttpsProvider and CustomProvider]</p>



        {!callbackUrl && <div className='actions'>
        
        <button
          className="button"
          disabled={(!!callbackUrl)}
          onClick={proveIt}
        >
          Prove it!
        </button>
        </div>
          
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
        (loading ? <>
          <div className='loader'></div>
          {appUrl?<>
            <h3>On mobile device?</h3>
            <a href={appUrl} target="_blank" rel="noreferrer" className="App-link" >Click here to open on Reclaim Wallet App</a>
            <h3>On laptop/desktop?</h3>
            <QRCode value={appUrl} />
            <p>or, Copy the link and send to your phone</p>
            <input readOnly value={appUrl} />
          </>:null} 
        </> : <></>)}
      </header>
    </div>
  );
}

export default App;
