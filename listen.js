import WhatsApp from "whatsapp";

const senderNumber = +919211396439;
const wa = new WhatsApp();

function custom_callback ( statusCode, headers, body, resp, err )
{
    console.log(
        `Incoming webhook status code: ${ statusCode }\n\nHeaders:
        ${ JSON.stringify( headers ) }\n\nBody: ${ JSON.stringify( body ) }`
    );

    if( resp )
    {
        resp.writeHead(200, { "Content-Type": "text/plain" });
        resp.end();
    }

    if( err )
    {
        console.log( `ERROR: ${ err }` );
    }
}

wa.webhooks.start( custom_callback );