'use strict'

const functions = require('firebase-functions');
const gcs = require("@google-cloud/storage")();
const admin = require('firebase-admin');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });


/*
    add a new Cap provider to the section
    required post body:
        {
            caps: 'Eduscho'
        }
*/
exports.addCaps = functions.https.onRequest((request, response) => {
    if(!(request.method === 'POST')){
        console.log("Wrong request method: "+ request.method);
        response.status(405).send(request.method);
        return; 
    }

    if (!request.body.caps) {
        console.log("Please provide more information.")
		response.status(400).send("Please provide more information.");
        return;
	}

    if (!(typeof request.body.caps === 'string')){
        console.log("Type missmatch - please provide a string value" + typeof request.body.caps);
        response.status(400).send("Type missmatch, please provide other type for CAPS");
        return;
    }

    let oCaps = request.body;

    admin.database().ref('coffee/caps').child(oCaps.caps).set('true');

});
