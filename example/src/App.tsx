import { useState } from 'react';
import './App.css';
import { Reclaim } from '@questbook/template-client-sdk';

const templateName = "Questbook-Allum"

const googleTemplateClaim = {
  provider: "google-login",
  params: {
    email: '@gmail.com'
  }
}

const githubTemplateClaim = {
  provider: 'github-repo',
  params: {
    repo: 'questbook/grants-frontend'
  }
}

const templateClaims = [
  googleTemplateClaim,
  githubTemplateClaim
]

function App() {

  const [templateLink, setTemplateLink] = useState('')

  const createTemplateLink = async (e: any) => {
    e.preventDefault()

    const reclaim = new Reclaim()

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
