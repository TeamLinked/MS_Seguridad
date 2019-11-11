const express= require('express');
const bodyParser=require('body-parser');
const cors = require('cors');
const ldap = require('ldapjs');
const morgan= require('morgan');
const router = express.Router();
const jwt = require('jsonwebtoken')

const jwtKey = 'my_secret_key'
const jwtExpirySeconds = 60 * 60 * 24


const app = express()
const client = ldap.createClient({url: 'ldap://localhost:389'});


const run = async() => 
    await client.bind('cn=admin,dc=arqsoft,dc=unal,dc=edu,dc=co','admin',()=>{
    console.log("Conectado a ldap");
});


app.use(morgan('dev'));
app.use(bodyParser.json())
app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));
const port = process.env.PORT || 8086;

app.listen(port, async() => {
  console.log(`Listening on port ${port}`)
  await run();
});

app.delete('/delete',async(req,res)=> {
  await run();
  await client.del(`cn=${req.body.user},ou=academy,dc=arqsoft,dc=unal,dc=edu,dc=co`,(err) => {
    if(err){
      res.send({
        answer:"Unsuccessfully"
      });
    }else{
      res.send('Successfully');
    }
  })
});

app.post('/add',async(req,res) => {
  await run();
  await client.add(`cn=${req.body.cn},ou=academy,dc=arqsoft,dc=unal,dc=edu,dc=co`,req.body, (err) => { 
       if(err){
        res.send({
          answer:"Unsuccessfully"
          // answer: err
        });
       }else {
        res.send({
          answer:"Successfully"
        });
       }
  })
});

  app.post('/log', (req, res) => {

    var username = req.body.username
    var password = req.body.password

    client.bind(`cn=${username},ou=academy,dc=arqsoft,dc=unal,dc=edu,dc=co`, password, (err) => {
      if(err) {
        res.send({
          // answer: "Unsuccessfully"
          answer: err
        });
      } else {
          var token = jwt.sign({ username }, jwtKey, {
            algorithm: 'HS256',
            expiresIn: jwtExpirySeconds
          })
          // console.log('token:', token)
          // res.cookie('token', token, { maxAge: jwtExpirySeconds * 1000 })
          // res.end()

          res.send({ 
            token,
            // answer:"Successfully"
          });
        }      
    })
  })