// server.js

const express = require('express');
const body_parser =  require('body-parser');
const axios = require('axios').default;
const uuid = require('uuid');
//const Database = require('better-sqlite3');

//const db = new Database('twitch.db');
//db.prepare(`CREATE TABLE IF NOT EXISTS LoginSessions(Token TEXT PRIMARY KEY)`).run();
const sessions = {};
const app = express();
const REDIRECT_URI='https://gm-twitch-oauth.glitch.me/callback'
app.use(body_parser.json());
app.use(body_parser.urlencoded({extended:false}));

app.get('/', (req, res) => {
  res.send(`https://id.twitch.tv/oauth2/authorize?client_id=${process.env.CLIENT_ID}&redirect_uri=https://gm-twitch-oauth.glitch.me/callback&response_type=code&scope=user:read:email`);
});
app.get('/login',(req,res)=>{
  let session_id = uuid.v4();
  sessions[session_id] = {
    expiry: setTimeout(()=>{
      delete sessions[session_id];
    },1000*240),  // 4 min timeout
    status:'processing'
  };
  res.json({
    token:session_id,
    client_id:'8frcw33ljvyab3t32ep2mwr7bc2bb0',
    url:`https://id.twitch.tv/oauth2/authorize?client_id=${process.env.CLIENT_ID}&redirect_uri=https://gm-twitch-oauth.glitch.me/callback&response_type=code&scope=user:read:email&state=${session_id}`
  });
});

app.get('/callback',async (req,res)=>{
  const result = await axios.post(  `https://id.twitch.tv/oauth2/token?client_id=${process.env.CLIENT_ID}`
                                  + `&client_secret=${process.env.SECRET_ID}&code=${req.query.code}&grant_type=authorization_code&redirect_uri=${REDIRECT_URI}`,
{},{validateStatus:false});
  clearTimeout(sessions[req.query.state].expiry);
  if (result.status == 200) {
    sessions[req.query.state] = {status:'success',data:result.data};
  } else {
    sessions[req.query.state] = {status:'error',data:result.data,reason:'oauth error'};
  }
  res.json(result.data)
})

app.get('/poll/:id',(req,res)=>{
  if (sessions[req.params.id]) {
    const user_data = sessions[req.params.id];
    console.log(user_data);
    if (user_data.status == 'processing') {
      return res.json({status:'processing'});
    } else {
      delete sessions[req.params.id];
      return res.json(user_data);
    }
  } else {
    res.json({status:'error',reason:`not found`});
  }
  
})

app.post('/refresh',async (req,res)=>{
  const refresh_token = req.body.refresh_token;
  const result = await axios.post('https://id.twitch.tv/oauth2/token?grant_type=refresh_token&client_id=${process.env.CLIENT_ID}')
});


app.listen(process.env.PORT,()=>{console.log(`Live on port ${process.env.PORT}`)});