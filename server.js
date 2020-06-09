// server.js

const express = require('express');
const body_parser =  require('body-parser');
const axios = require('axios').default;
const app = express();
const REDIRECT_URI='https://gm-twitch-oauth.me/callback'
app.use(body_parser.json());
app.use(body_parser.urlencoded({extended:false}));

app.get("/", (req, res) => {
  res.redirect(`https://id.twitch.tv/oauth2/authorize?client_id=${process.env.CLIENT_ID}&redirect_uri=http://localhost:3000/callback&response_type=code&scope=user:read:email`);
});

app.get('/callback',async (req,res)=>{
  const result = await axios.post(`https://id.twitch.tv/oauth2/token?client_id=${process.env.CLIENT_ID}&client_secre=${process.env.CLIENT_SECRET}&code=${req.query.code}&grant_type=authorization_code&redirect_uri=${REDIRECT_URI}`);
  res.json(result.data)
})


app.listen(process.env.PORT);