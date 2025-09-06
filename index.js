require('dotenv').config()
const express = require("express");
const body_parser = require("body-parser");
const axios = require("axios");
const { type } = require('express/lib/response');
const whatsapp_access_token =
    "EAAPwZBrcX8t4BPSNxTZBbatagarGbsEivgXqQIWBCkZBxdjUZBBVZCRZCdtfOKZBWIRCMEst5r8nHuXlZALAxBUNcTZCXpBFqn72OUB2eSVsLZANZBinPSvJQj4u3HzuBJsYb7mG2KKbb8rstrHtZBn5UWdJZCFe3Jiwsk9JlCmW0vw2oAhbVxl7lPbsEXV1ZBhxLAiFW5oKACvqtrAsvgehZB8BBVHrnPWPa2YLQZA4csZCuGNR1ElkZD"
//const webhook_verify_token = "my-verify-token";
const webhook_verify_token ='wa_webhook';
//const port = 3000;
const port=process.env.port|| 3000;
const whatsappApiUrl = 'https://www.solwet.com/'; // Replace with your actual API URL


//const app=express().use(body_parser.json());
const app = express();
app.use(express.json());

app.get('/', (req, res) => {
    res.send("hello this is webhook setup ");
});
app.get("/webhook", (req, res) => {
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    if (mode && token === webhook_verify_token) {
        res.status(200).send(challenge);
    } else {
        res.sendStatus(403);
    }
});

app.post("/webhook", (req, res) => {
    const { entry } = req.body;
    if (!entry || entry.lenght === 0) {
        return res.status(400).send("invalid request");
    }
    const changes = entry[0].changes;
    if (!changes || changes.lenght === 0) {
        return res.status(400).send("invalid request");
    }
    const statuses = changes[0].value.statuses
        ? changes[0].value.statuses[0]
        : null;
    const messages = changes[0].value.messages
        ? changes[0].value.messages[0]
        : null;

    if (statuses) {
        //handle msg status
        console.log(`
        message status updated
        id: ${statuses.id},
        status:${statuses.status},
        `);
    }

    if (messages) {
        //handle msg

        if (messages.type === "template") {
            if (messages.text.body === "hello") {
                replymessage(
                    messages.from,
                    "hello welcome to solwet marketing pvt ltd",
                    messages.id,
                );
            }
            if (messages.text.body === "") {
                sendlist(messages.from);
            }
        }

        console.log(JSON.stringify(messages, null, 2));
    }
    res.status(200).send("webhook proceed");
});

async function sendmessage(to, body) {
    await axios({
        url: " https://graph.facebook.com/v22.0/701512646381458/messages ",
        method: "post",
        Headers: {
            authorization: `Bearer ${whatsapp_access_token}`,
            "Content-Type": "application/json",
        },
        /* data:{
          messaging_product:"whatsapp",
          to:from,
          text:{
              body:"hello, welcome to solwet marketing pvt ltd"
          }
      },*/
        data: JSON.stringify({
            messaging_product: "whatsapp",
            to,
            type: "text",
            text: {
                body,
            },
        }),
    });
}

async function replymessage(to, body, messageId) {
    await axios({
        url: " https://graph.facebook.com/v22.0/701512646381458/messages ",
        method: "post",
        Headers: {
            authorization: "bearer ${whatsapp_access_token}",
            "Content-Type": "application/json",
        },

        data: JSON.stringify({
            messaging_product: "whatsapp",
            to,
            type: "text",
            text: {
                body,
            },
            context: {
                message_id: messageId,
            },
        }),
    });
}

async function sendlist(to) {
    await axios({
        url: " https://graph.facebook.com/v22.0/701512646381458/messages ",
        method: "post",
        Headers: {
            authorization: `bearer ${whatsapp_access_token}`,
            "Content-Type": "application/json",
        },
        /* data:{
          messaging_product:"whatsapp",
          to:from,
          text:{
              body:"hello, welcome to solwet marketing pvt ltd"
          }
      },*/
        data: JSON.stringify({
            messaging_product: "whatsapp",
            to,
            type: "interactive",
            interactive: {
                type: "list",
                body: {
                    text: "what do you want to do",
                },
                actions: {
                    button: "select one",
                    section: [
                        {
                            title: "",
                            rows: [
                                {
                                    id: "1",
                                    title: "get started",
                                    description:
                                        "get started with solwet marketing pvt ltd",
                                },
                            ],
                        },
                    ],
                },
            },
        }),
    });
}
/*async function sendtemplatemessage() {
    const response = await axios({
        url: 'https://graph.facebook.com/v22.0/701512646381458/messages',
        method:'post',
        headers:{
            authorization: `bearer ${whatsapp_access_token}`,
            "Content-Type": "application/json",
        },
 data: JSON.stringify({
            messaging_product: "whatsapp",
            to:'9717593776'
            //type: "template",
           template:{
            Name: 'hello_world',
            language:{
                code:'en_us'
            }
           }
           
        }),
    })
     console.log(response.data)
    
}*/

      //sendtemplatemessage() 
app.listen(port, () => {
    console.log("webhook is listening");

});