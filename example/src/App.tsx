import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { Reclaim } from '@questbook/template-client-sdk';

const templateName = "Meta-Allum"

const facebookTemplateClaim = {
  provider: "facebook",
  params: {
    email: '@facebook.com',
    occupation: 'software-engineer'
  }
}

const metaTemplateClaim = {
  provider: 'meta',
  params: {
    email: '@meta.com'
  }
}

const templateClaims = [
  facebookTemplateClaim,
  metaTemplateClaim
]

function App() {

  const [templateLink, setTemplateLink] = useState('')
  const [walletAddress, setWalletAddress] = useState('')

  const createTemplateLink = async (e: any) => {
    e.preventDefault()

    const reclaim = new Reclaim(walletAddress)

    const connection = await reclaim.getConsent(
      templateName,
      templateClaims
    )

    setTemplateLink(connection.link);

    connection.onSubmit((data) => {
      console.log("zon", data);
    })

  }

  return (
    <div className="App">
      <header className="App-header">

        <h3>Template <span style={{fontStyle:'italic'}}>{templateName}</span></h3>

        <div style={{flexDirection:'row'}}>
          <label>
            Your Wallet Address: {' '}
          </label>
          <input
            name='wallet-address'
            onChange={(e) => setWalletAddress(e.target.value)}
            value={walletAddress}
          />
        </div>
        
        <br></br>
        

        <h3>Required Claims:</h3>
          
        {templateClaims.map((templateClaim, index) => <div key={index}>
            <br></br>
            <span>provider: {templateClaim.provider}</span>
            <br></br>
            <span>params: {JSON.stringify(templateClaim.params)}</span>
            <br></br>
            ------------
            <br></br>
        </div>)}

        <br></br>

        <button 
          disabled={!walletAddress}
          onClick={createTemplateLink}
        >
          Create Template Link
        </button>
        <br></br>
        {templateLink && 
          <div>
            Link: 
            {' '}
            <a
              href={templateLink}
              style={{
                color: "#61dafb"
              }}
            >
              {templateLink.substring(0, 30)}...
            </a>
          </div>
        }

      </header>
    </div>
  );
}

export default App;
