/*
import { setupSdk } from "dissonity";


window.addEventListener('DOMContentLoaded', () => {

  setupSdk({
    clientId: process.env.PUBLIC_CLIENT_ID!,
    scope: ["identify"],
    tokenRoute: "/api/token"
  });
});
*/

import { useSdk, DiscordSDK, DataPromise } from "dissonity";

window.addEventListener("DOMContentLoaded", async () => {
	
	var clientid = process.env.PUBLIC_CLIENT_ID!
	console.log(`NS: DiscordSDK ${clientid}`)

    const discordSdk = new DiscordSDK(clientid);

    const promise: DataPromise = new Promise(async resolve => {
    
	await discordSdk.ready();

	console.log('NS: discordSdk.ready')

	// Pop open the OAuth permission modal and request for access to scopes listed in scope array below
	const {code} = await discordSdk.commands.authorize({
		client_id:  process.env.PUBLIC_CLIENT_ID!,
		response_type: 'code',
		state: '',
		prompt: 'none',
		scope: ['identify'],
	});

	console.log('NS: authorize')

	// Retrieve an access_token from your application's server
	const response = await fetch('/.proxy/api/token', {
		method: 'POST',
		headers: {
		  'Content-Type': 'application/json',
		},
		body: JSON.stringify({
		  code,
		}),
	});
	const {access_token} = await response.json();

	console.log(`NS: access_token ${access_token}`)
	
	// Authenticate with Discord client (using the access_token)
	//auth = await discordSdk.commands.authenticate({
	//	access_token,
	//  });


	const { user } = await discordSdk.commands.authenticate({
		access_token: access_token,
	});

        resolve({ discordSdk, user });
    });

    useSdk(promise);
});