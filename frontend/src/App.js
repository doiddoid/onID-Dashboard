import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [userId, setUserId] = useState(null);
  const [sites, setSites] = useState([]);
  const [siteName, setSiteName] = useState('');
  const [siteUrl, setSiteUrl] = useState('');

  useEffect(() => {
    if (userId) fetchSites();
  }, [userId]);

  // Recupera i siti dal server
  const fetchSites = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/sites/get-sites/${userId}`);
      setSites(response.data.sites);
    } catch (error) {
      console.error('Errore nel recupero dei siti:', error);
    }
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    const url = isLogin ? 'http://localhost:5000/login' : 'http://localhost:5000/register';
  
    try {
      console.log("🔄 Invio richiesta di login a:", url, { email, password });
      const response = await axios.post(url, { email, password });
  
      console.log("✅ Risposta ricevuta dal server:", response.data);
      setMessage(response.data.message);
      
      if (response.data.userId) {
        setUserId(response.data.userId);
        console.log("🔑 Login riuscito! userId:", response.data.userId);
      } else {
        console.warn("⚠️ Login fallito: Nessun userId restituito.");
      }
  
    } catch (error) {
      console.error("❌ Errore durante il login:", error.response?.data || error);
      setMessage(`Errore: ${error.response?.data?.error || "Impossibile completare l'operazione"}`);
    }
  };

  // Aggiunge un sito
  const handleAddSite = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/sites/add-site', {
        user_id: userId,
        site_name: siteName,
        site_url: siteUrl,
      });
      setSites([...sites, response.data.site]);
      setSiteName('');
      setSiteUrl('');
    } catch (error) {
      setMessage('Errore nell’aggiungere il sito');
    }
  };

  // Elimina un sito
  const handleDeleteSite = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/sites/delete-site/${id}`);
      setSites(sites.filter((site) => site.id !== id));
    } catch (error) {
      console.error('Errore nella cancellazione del sito:', error);
    }
  };

  return (
    <div>
      <h1>{isLogin ? 'Login' : 'Registrazione'}</h1>
      <form>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">{isLogin ? 'Login' : 'Registrati'}</button>
      </form>
      <button onClick={() => setIsLogin(!isLogin)}>
        {isLogin ? 'Registrati' : 'Vai al Login'}
      </button>

      {userId && (
        <div>
          <h2>Gestione Siti</h2>
          <form onSubmit={handleAddSite}>
            <input type="text" placeholder="Nome del sito" value={siteName} onChange={(e) => setSiteName(e.target.value)} required />
            <input type="text" placeholder="URL del sito" value={siteUrl} onChange={(e) => setSiteUrl(e.target.value)} required />
            <button type="submit">Aggiungi Sito</button>
          </form>
          <ul>
            {sites.map((site) => (
              <li key={site.id}>
                {site.site_name} - {site.site_url}
                <button onClick={() => handleDeleteSite(site.id)}>Elimina</button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
