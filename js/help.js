const fs = require('fs');
const {settings} = require('./settings');
const action = require('./actions');
const file = require('./file')

module.exports.makeid = function (len) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < len; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

module.exports.createUsername = function(){
  return settings._.startwith.concat("-").concat(this.makeid(5));
}

module.exports.createPassword = function(){
  return this.makeid(8);
}

module.exports.delay = async function(delay){
   return new Promise((resolve) => {
        setTimeout(function(){
            resolve(1); 
        },delay)
   });
}

module.exports.delaySec = async function(delay){
  return this.delay(delay * 1000);
}

module.exports.getAccounts = function(){
  
  const accountsData = fs.readFileSync('accounts.txt', 'utf-8');


  const accounts = accountsData.split('\n')
  .filter(data => data != "")
  .map(data =>{
      const f = data.split('\t');
      return {
          username:f[1],
          password:f[2],
          mail:f[3]
      }
  });

  return accounts;
}

module.exports.getAccountsCount = () => {
  const accouts = this.getAccounts();

  return accouts.length;
}

module.exports.cookieParse = function(set_cookies = []){
  if( ! (set_cookies instanceof Array)){
    return '';
  }
  let cookie = set_cookies.map(cookie => {
      const list = cookie.split(';');
      return list[0];
  }).filter((key,index,l)=>{
     return l.indexOf(key) == index
  })
  return cookie.join(';');
}


module.exports.getAccountCookie = async (username, password, login = false) => {
  let path = 'cookies/'+username+'.txt';
  if (fs.existsSync(path)) {
      let data =  fs.readFileSync(path, 'utf-8');

      if(data){
        const list = data.split(';');
        if(list[1]) return list[1];
      }

      return '';
  }else if(login){

     const result = await action.login(username,password);

     if(result.confirm){
         await file.saveCookie(username, result.cookies);
         return this.getAccountCookie(username, password);
     }
  }
  return '';
}

module.exports.isNumeric = (value) => {
  return /^-?\d+$/.test(value);
}