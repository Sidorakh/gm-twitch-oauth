// server.js

const express = require('express');
const body_parser =  require('body-parser');
const axios = require('axios').default;
const uuid = require('uuid');
const Database = require('better-sqlite3');

const db = new Database('twitch.db');
db.run(`CREATE TABLE IF NOT EXISTS LoginSessions`)
const app = express();
const REDIRECT_URI='https://gm-twitch-oauth.glitch.me/callback'
app.use(body_parser.json());
app.use(body_parser.urlencoded({extended:false}));

app.get('/', (req, res) => {
  res.type('text').send(`https://id.twitch.tv/oauth2/authorize?client_id=${process.env.CLIENT_ID}&redirect_uri=https://gm-twitch-oauth.glitch.me/callback&response_type=code&scope=user:read:email`);
});
app.get('/login',(req,res)=>{
  const stmt = db.prepare(`INSERT INTO`)
});

app.get('/callback',async (req,res)=>{
  const result = await axios.post(  `https://id.twitch.tv/oauth2/token?client_id=${process.env.CLIENT_ID}`
                                  + `&client_secret=${process.env.SECRET_ID}&code=${req.query.code}&grant_type=authorization_code&redirect_uri=${REDIRECT_URI}`,
{},{validateStatus:false});
  res.json(result.data)
})


app.listen(process.env.PORT);