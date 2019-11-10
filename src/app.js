const express= require('express');
const bodyParser=require('body-parser');
const passport=require('passport');
const ldapstrategy=require('passport-ldapauth');
const ldap = require('ldapjs');
const morgan= require('morgan');
var client = ldap.createClient({
    url: 'ldap://localhost:389'
});
client.bind('cn=admin,dc=arqsoft,dc=unal,dc=edu,dc=co','admin',()=>{
    console.log("Conectado a ldap");
});

const OPTS = {
    server: {
      url: "ldap://localhost:389",
      bindDN: "cn=read-only-admin,dc=example,dc=com",
      bindCredentials: 'password',
      searchBase: "dc=example,dc=com",
      searchFilter: "(uid={{username}})"
    }
  }
  
/*
var entry={
    cn:'pedro sanchez',
    sn:'Sanchez',
    givenName:'Pedro',
    objectclass:'inetOrgPerson',
    userPassword:'asudh2ud2asksow',
    gidNumber:500,
    UserName:'pdsanchez@unal.edu.co',
};

const run=async()=>{
   await client.add('cn=jpaez@unal.edu.co,ou=academy,dc=arqsoft,dc=unal,dc=edu,dc=co',entry,()=>{
        console.log("sdsassssssssssssd")
   });
}
run();
*/

//PRUEBA PARA AUTENTICAR, NO SIRVIO


passport.use(new ldapstrategy(OPTS))

// instantiate the server
const app = express()
app.use(morgan('dev'));
// parse the request data automatically
app.use(bodyParser.json())
// allow cross origin resource sharing
// inject LDAP connection to express server
app.use(passport.initialize())

app.use(bodyParser.urlencoded({extended: false}));

// listen to port defined
const port = process.env.PORT || 8086;
app.listen(port, () => {
  console.log(`Listening on port ${port}`)
});

app.post('/login', passport.authenticate('ldapauth', {session: false}), function(req, res) {
    res.send({status: 'ok'});
  });