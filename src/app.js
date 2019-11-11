const express= require('express');
const bodyParser=require('body-parser');
const passport=require('passport');
const cors = require('cors');
const ldapstrategy=require('passport-ldapauth');
const ldap = require('ldapjs');
const morgan= require('morgan');
const router = express.Router();

const app = express()

var client = ldap.createClient({
    url: 'ldap://localhost:389'
});

const run = async() => 
    await client.bind('cn=admin,dc=arqsoft,dc=unal,dc=edu,dc=co','admin',()=>{
    console.log("Conectado a ldap");
});


app.use(morgan('dev'));
app.use(bodyParser.json())
app.use(passport.initialize());
app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));
const port = process.env.PORT || 8086;

app.listen(port, async() => {
  console.log(`Listening on port ${port}`)
  await run();
});
run();



app.delete('/delete',async(req,res)=>{
  await run();
  await client.del(`cn=${req.body.user},ou=academy,dc=arqsoft,dc=unal,dc=edu,dc=co`,(err)=>{
    if(err){
      res.send({
        answer:"Unsuccessfully"
      });
    }else{
      res.send('successfully');
    }
  })
});

app.post('/add',async(req,res)=>{
  await run();
  await client.add(`cn=${req.body.cn},ou=academy,dc=arqsoft,dc=unal,dc=edu,dc=co`,req.body, (err)=>{
       if(err){
        res.send({
          answer:"Unsuccessfully"
        });
       }else{
        res.send({
          answer:"Successfully"
        });
       }
  })
});

  app.post('/log', (req,res) =>{
    client.bind(`cn=${req.body.username},ou=academy,dc=arqsoft,dc=unal,dc=edu,dc=co`,req.body.password, (err)=>{
      if(err){
        res.send({
          answer:"Unsuccessfully"
        });
      }else
      res.send({
        answer:"Successfully"
      });
    })
  })