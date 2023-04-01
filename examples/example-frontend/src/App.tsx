import React from 'react';
import './App.css';
import axios from 'axios'
import {QRCodeSVG} from 'qrcode.react';


const getCallbackUrl = process.env.REACT_APP_BACKEND_BASE_URL + '/home'
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
    console.log(username)
    const response = await axios.get(getCallbackUrl + '/' + username)
    console.log(response);
    setCallbackId(response.data.callbackId)
    setCallbackUrl(response.data.url);
    setLoading(true)
    //window.location.replace(response.data.url)
    setAppUrl(response.data.url);

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

        <h2>Fill up this form</h2>
        <p>In the next step, prove that you are a real person owning a google account</p>



        {!callbackUrl && <div className='actions'>

          <input
          onChange={(e) => setUsername(e.target.value)}
          placeholder="What is your pet's name?"
          value={username}
          className="username-input"
        />
        
        <button
          className="button"
          disabled={(!!callbackUrl) || (!username)}
          onClick={proveIt}
        >
          Prove you have a google account!
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
            <QRCodeSVG value={appUrl} />
            <p>or, Copy the link and send to your phone</p>
            <input readOnly value={appUrl} />
          </>:null} 
        </> : <></>)}
      </header>
    </div>
  );
}

export default App;
