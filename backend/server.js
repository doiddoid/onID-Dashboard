const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const sitesRoutes = require('./routes/sites');


require('dotenv').config({ path: '.env' });


console.log("🔍 Verifica ENV:");
console.log("SUPABASE_URL:", process.env.SUPABASE_URL || "❌ NON TROVATA");
console.log("SUPABASE_KEY:", process.env.SUPABASE_KEY ? "✅ KEY TROVATA" : "❌ KEY NON TROVATA");

const app = express();
const port = 5000;

// Connessione a Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY 
);

// Middleware
app.use(express.json());

// Endpoint di login
app.post('/login', async (req, res) => {
  console.log("🔍 Richiesta login ricevuta:", req.body); // DEBUG

  const { email, password } = req.body;
  console.log("🔍 Login ricevuto:", email);

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    console.error("❌ Errore login:", error.message);
    return res.status(400).json({ error: error.message });
  }

  console.log("✅ Login avvenuto con successo, user:", data.user);
  res.json({ message: "Login riuscito!", userId: data.user.id });
});

// Endpoint di registrazione
app.post('/register', async (req, res) => {
  const { email, password } = req.body;

  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) {
    console.error("❌ Errore registrazione:", error.message);
    return res.status(400).json({ error: error.message });
  }

  res.json({ message: 'Registrazione completata con successo', user: data.user });
});

// Aggiungere un nuovo sito
app.post('/add-site', async (req, res) => {
  const { user_id, site_name, site_url } = req.body;

  const { data, error } = await supabase
    .from('sites')
    .insert([{ user_id, site_name, site_url }]);

  if (error) return res.status(400).json({ error: error.message });

  res.json({ message: 'Sito aggiunto con successo', site: data[0] });
});

// Recuperare tutti i siti di un utente
app.get('/get-sites/:user_id', async (req, res) => {
  const { user_id } = req.params;

  const { data, error } = await supabase
    .from('sites')
    .select('*')
    .eq('user_id', user_id);

  if (error) return res.status(400).json({ error: error.message });

  res.json({ sites: data });
});

// Rotte dei siti
app.use('/api/sites', sitesRoutes);

// Avvio server
app.listen(port, () => {
  console.log(`🚀 Server in esecuzione su http://localhost:${port}`);
});
