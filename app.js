import express, { json, urlencoded } from 'express';
const app = express();
import configRoutes from './routes/index.js';
import { createClient } from 'redis';
const client = createClient();
client.connect().then(() => {});

app.use(json());
app.use(urlencoded({extended: true}));
const mylist=[]
app.use('/api/characters/:id', async (req, res, next) => {
  if (
    req.originalUrl !== '/api/characters/history' 
  ) {
    let exists = await client.exists(req.params.id);
    if (exists) { 
      let showPage = await client.get(req.params.id);
      let mylist=await client.lPush('mylist', req.params.id);
      let jk=JSON.parse(showPage)
      console.log('Show in Cache')  
      
      return res.status(200).json(jk)
      
    } 
    next();
  }
  else{
    next();
  }
  
}),
app.use('/api/comics/:id', async (req, res, next) => {
  if (
    req.originalUrl !== '/api/characters/history' &&
    req.originalUrl !== '/api/stories/:id' &&
    req.originalUrl!=='/api/characters/:id'

  ) {
    let exists = await client.exists('c'+req.params.id);
    if (exists) { 
      let showPage = await client.get('c'+req.params.id);
      let jk=JSON.parse(showPage)
      console.log('Show in Cache')
      
      return res.status(200).json(jk)
      
    } 
    next();}
  
}),
app.use('/api/stories/:id', async (req, res, next) => {
  if (
    req.originalUrl !== '/api/characters/history' &&
    req.originalUrl !== '/api/comics/:id' &&
    req.originalUrl!=='/api/characters/:id'

  ) {
  
  let exists = await client.exists('s'+req.params.id);
  if (exists) { 
    let showPage = await client.get('s'+req.params.id);
    let jk=JSON.parse(showPage)
    console.log('Show in Cache!')
    
    return res.status(200).json(jk)
    
  } 
  next();
  }


}),

configRoutes(app);
app.listen(3000, async () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:3000');
});
