import { Router } from 'express';
const router = Router();
import { createClient } from 'redis';
const client = createClient();
import axios  from 'axios';
import md5 from 'blueimp-md5';
const publickey = 'e6dd7014958739373b52f45c6db035b1';
const privatekey = '49ab01f5157ed4488265003c8d64ee4c7895ca0a';
client.connect().then(() => {});
let myfinal=[]

router
  .route('/characters/history') 
  .get(async (req, res) => { 
      //console.log("in") 
      try{
      let final = await client.lRange('mylist', 0, 19);
      //console.log(final)
      const ts = new Date().getTime();
      const stringToHash = ts + privatekey + publickey;
      const hash = md5(stringToHash);
      const baseUrl = 'https://gateway.marvel.com:443/v1/public/characters';
      const url = baseUrl + '?ts=' + ts + '&apikey=' + publickey + '&hash=' + hash;
      //console.log(url)
      let {data} = await axios.get(url)
      let findv=data.data.results;
      for(let j of final){
      for(let i of findv){
        if(i.id.toString()===j){  
          //console.log(typeof(j))
          //console.log(typeof(i.id))
          //console.log(i.id,j);
          let ans=await client.get(i.id.toString());
          //console.log(ans)
          let ans1=JSON.parse(ans)
          //console.log("//")
          //onsole.log(ans1)

          myfinal.push(ans1)  
          
        }
  
      }}
      return res.status(200).json(myfinal);
    }
    catch(e){
      return res.status(404).json({error :"Resource not found"})
    }
      
    });

router
.route('/characters/:id')
.get(async (req, res) => {
  let jey=0  
  try{
    const ts = new Date().getTime();
    const stringToHash = ts + privatekey + publickey;
    const hash = md5(stringToHash);
    const baseUrl = 'https://gateway.marvel.com:443/v1/public/characters';
    const url = baseUrl + '?ts=' + ts + '&apikey=' + publickey + '&hash=' + hash;
    //console.log(url)
    let {data} = await axios.get(url)
    let findv=data.data.results;
    for(let i of findv){
      if(i.id.toString()===req.params.id){
        const jsonstr = JSON.stringify(i);
        await client.set(req.params.id, jsonstr);
        const jsonredis=await client.get(req.params.id);
        await client.lPush('mylist', req.params.id);
        const redisJson = JSON.parse(jsonredis)
        jey++
        return res.status(200).json(redisJson);  
        
      }

    }
    if(jey===0){
      throw 'error'
    }
  }
  catch(e){
    return res.status(404).json({error :"Resource not found"})
  }
  });


router
.route('/comics/:id')
.get(async (req, res) => {  
    let jey=0;
    try{
    const ts = new Date().getTime();
    const stringToHash = ts + privatekey + publickey;
    const hash = md5(stringToHash);
    const baseUrl = 'https://gateway.marvel.com:443/v1/public/comics';
    const url = baseUrl + '?ts=' + ts + '&apikey=' + publickey + '&hash=' + hash;
    console.log(url)
    let {data} = await axios.get(url)
    let findv=data.data.results;
    for(let i of findv){
      if(i.id.toString()===req.params.id){
        const jsonstr = JSON.stringify(i);
        await client.set('c'+req.params.id, jsonstr);
        const jsonredis=await client.get('c'+req.params.id);
        const redisJson = JSON.parse(jsonredis)
        jey++
        return res.status(200).json(redisJson);  
        
      }

    }
    if(jey===0){
      throw 'error'
    }
  }
    catch(e){
      return res.status(404).json({error :"Resource not found"})
    } 
  })

router
.route('/stories/:id')
.get(async (req, res) => {  
  console.log("ll") 
  let jey=0
  try{ 
    const ts = new Date().getTime();
    const stringToHash = ts + privatekey + publickey;
    const hash = md5(stringToHash);
    const baseUrl = 'https://gateway.marvel.com:443/v1/public/stories';
    const url = baseUrl + '?ts=' + ts + '&apikey=' + publickey + '&hash=' + hash;
    //console.log(url)
    let {data} = await axios.get(url)
    let findv=data.data.results;
    for(let i of findv){
      if(i.id.toString()===req.params.id){
        const jsonstr = JSON.stringify(i);
        await client.set('s'+req.params.id, jsonstr);
        const jsonredis=await client.get('s'+req.params.id);
        const redisJson = JSON.parse(jsonredis)
        jey++
        return res.status(200).json(redisJson);  
        
      }

    }
    if(jey===0){
      throw 'error'
    }
  }
  catch(e){
    
    return res.status(404).json({error :"Resource not found"})
  }
  })


export default router;
