import React from 'react';
import './App.css';
import axios from 'axios'
import QRCode from 'react-qr-code';
import {CopyToClipboard} from 'react-copy-to-clipboard';

const backendBaseUrl = process.env.REACT_APP_BACKEND_BASE_URL

function App() {

  const [callbackId, setCallbackId] = React.useState<string | null>(null)
  const [reclaimUrl, setReclaimUrl] = React.useState<string | null>(null)

  const notify = () => alert('Link copied to clipboard!');

  const proveIt = async (e: any) => {
    e.preventDefault();
    console.log('prove it')
    const response = await axios.get(backendBaseUrl + '/request')
    console.log(response);
    setCallbackId(response.data.callbackId)
    //window.location.replace(response.data.url)
    setReclaimUrl(response.data.reclaimUrl);
  }


  return (
    <div className="App">
      <header className="App-header">

        {!reclaimUrl && 
        <div>
          <h2>DEMO</h2>
          <h3>Prove that you are a real person owning a Google and Reddit account</h3>
          <p>[This demo uses HttpsProvider and CustomProvider]</p>

          <div className='actions'>

            <button
              className="button"
              disabled={(!!reclaimUrl)}
              onClick={proveIt}
            >
              Prove it!
            </button>
          </div>
        </div>
        }
        {reclaimUrl &&
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
            {reclaimUrl ? <>
              <h3>On mobile device?</h3>
              <a href={reclaimUrl} target="_blank" rel="noreferrer" className="App-link" >Click here to open on Reclaim Wallet App</a>
              <h3>On laptop/desktop?</h3>
              <QRCode value={reclaimUrl} />
              <p>or, Copy the link and send to your phone</p>
              <CopyToClipboard text={reclaimUrl}>
              <button onClick={notify}  className="button">Copy</button>
              </CopyToClipboard>
            </> : null}
      </header>
    </div>
  );
}

export default App;
