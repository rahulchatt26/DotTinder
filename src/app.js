const express = require('express');

const app = express();

app.use('/hello',(req, res)=>{
    res.send("Hey Hello Route!!");
}); 

app.use('/test',(req, res)=>{
    res.send("Hey Test Route!!");
});

app.use('/',(req, res)=>{
    res.send("Hello from DotTinder!!");
});



app.listen(2604, ()=>{
    console.log("Server is listenting on port 2604");
});