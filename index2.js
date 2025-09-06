require('dotenv').config()
const express = require("express");
const body_parser = require("body-parser");
const axios=require('axios'); 
const port = 3000;
const whatsappApiUrl = 'https://www.solwet.com/'; // Replace with your actual API URL
const accessToken = 'EAADcF3tgq0YBO9n7pxxWzxbjMOHlBJB7R3gd7S9ZBsIEOvp5fvb4JgZC3JarWs9IVwid3PBJRkflMkMRSqolzkWdYgjpnDKLCevIf4kWKoQfJOOlKJlfKef85wyaMf9MUukBAgH7g8b541o7JGUb4n7OZCY9F09X1EXRyGYHDmEE4j8s5AIzzzaISmz8GvOm9acd5KjGXzARZBHLUO3Ly32ULqlNsNJi';
require('dotenv').config()

const app=express().use(body_parser.json());

const token=process.env.TOKEN;
const mytoken=process.env.MYTOKEN;

app.listen(8000||process.env.PORT,()=>{
    console.log("webhook is listening");
   // send("919211396439","hello");
});

app.get("/webhook",(req,res)=>{
    let mode=req.query["hub.mode"];
    let challange=req.query["hub.challenge"];
    let token=req.query["hub.verify_token"];

    const mytoken="wa_webhook";

    if(mode && token){

        if(mode==="subscribe" && token===mytoken){
            res.status(200).send(challange);
        }else{
            res.status(403);
        }

    }

});

app.post("/webhook",(req,res)=>{

    let body_param=req.body;

    console.log(JSON.stringify(body_param,null,2));

    if(body_param.object){
        if(body_param.entry &&
            body_param.entry[0].changes &&
            body_param.entry[0].changes[0].value.message &&
            body_param.entry[0].changes[0].value.message[0]
        ){
            let phon_no_id=body_param.entry[0].changes[0].value.metadata.phone_number_id;
            let from = body_param.entry[0].changes[0].value.message[0].from;
            let msg_body = body_param.entry[0].changes[0].value.message[0].text.body;

        async function sendmessage() {
            
         await  axios({

                method:"post",
                url:"https://graph.facebook.com/v22.0/"+phon_no_id+"/messages?access_token="+token,
                data:{
                    messaging_product:"whatsapp",
                    to:9770220336,
                    text:{
                        body:"hello, welcome to solwet marketing pvt ltd"
                    }
                },
                headers:{
                  "authorization":`bearer ${process.env.WHATSAPP_TOKEN}`,
                    "Content-Type":"application/json"
                
                }
               
            });
            
        }   

        }
        
         
          

            res.sendStatus(200);
        }else{
            res.sendStatus(404);
        }
    }
);
