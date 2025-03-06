const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

dotenv.config();

// Usa lo stesso client Supabase del server
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// Aggiungere un nuovo sito
router.post('/add-site', async (req, res) => {
  const { user_id, site_name, site_url } = req.body;

  const { data, error } = await supabase
    .from('sites')
    .insert([{ user_id, site_name, site_url }]);

  if (error) return res.status(400).json({ error: error.message });

  res.json({ message: 'Sito aggiunto con successo', site: data[0] });
});

// Recuperare tutti i siti di un utente
router.get('/get-sites/:user_id', async (req, res) => {
  const { user_id } = req.params;

  const { data, error } = await supabase
    .from('sites')
    .select('*')
    .eq('user_id', user_id);

  if (error) return res.status(400).json({ error: error.message });

  res.json({ sites: data });
});

module.exports = router;
