'use strict'

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cors = require('cors')({origin: true});

admin.initializeApp(functions.config().firebase);

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });


// ----- Add Functions ----- 

/*
    add a new Cap provider to the section
    required post body:
        {
            caps: 'Eduscho'
        }
*/
exports.addCaps = functions.https.onRequest((request, response) => {
     cors(request, response, () => {
        if(!(request.method === 'PUT')){
            console.log("Wrong request method: "+ request.method);
            response.status(405).send(request.method);
            return; 
        }

        if (!request.body) {
            console.log("Please provide more information.")
            response.status(400).send("Please provide more information.");
            return;
        }

        /*if (!(typeof request.body === 'string')){
            console.log("Type missmatch - please provide a string value" + typeof request.body.caps);
            response.status(400).send("Type missmatch, please provide other type for CAPS");
            return;
        }*/

        let oCaps = request.body;

        admin.database().ref('coffee').child('caps').push(oCaps).then(snapshot => {
            console.log("Status 201 - Entry created");
            response.status(201).send("Entry created");
            return;
        },
        error => {
            console.error("Status 400 - missing Entry creation" + error);
            response.status(400).send("Missing Entry creation" + error);
            return;
        });
     });
   
});

exports.addPads = functions.https.onRequest((request, response) => {
    if(!(request.method === 'POST')){
        console.log("Wrong request method: "+ request.method);
        response.status(405).send(request.method);
        return; 
    }

    if (!request.body.pads) {
        console.log("Please provide more information.")
		response.status(400).send("Please provide more information.");
        return;
	}

    if (!(typeof request.body.pads === 'string')){
        console.log("Type missmatch - please provide a string value" + typeof request.body.pads);
        response.status(400).send("Type missmatch, please provide other type for PADS");
        return;
    }

    let oPads = request.body;

    admin.database().ref('coffee/pads').child(oPads.pads).set('true').then(snapshot => {
        console.log("Status 201 - Entry created");
        response.status(201).send("Entry created");
        return;
    },
    error => {
        console.error("Status 400 - missing Entry creation" + error);
        response.status(400).send("Missing Entry creation" + error);
        return;
    });
   
});

exports.addCoffee = functions.https.onRequest((request, response) => {
    if(!(request.method === 'POST')){
        console.log("Wrong request method: "+ request.method);
        response.status(405).send(request.method);
        return; 
    }

    if (!request.body.coffee) {
        console.log("Please provide more information.")
		response.status(400).send("Please provide more information.");
        return;
	}

    if (!(typeof request.body.coffee === 'string')){
        console.log("Type missmatch - please provide a string value" + typeof request.body.coffee);
        response.status(400).send("Type missmatch, please provide other type for COFFEE");
        return;
    }

    let oCoffee = request.body;

    admin.database().ref('coffee/coffee').child(oCoffee.coffee).set('true').then(snapshot => {
        console.log("Status 201 - Entry created");
        response.status(201).send("Entry created");
        return;
    },
    error => {
        console.error("Status 400 - missing Entry creation" + error);
        response.status(400).send("Missing Entry creation" + error);
        return;
    });
   
});


/*
    {
        ID: "xYz125",
        name: "Mustermann",
        prename: "Max",
        zipCode: "66459",
        city: "Kirkel",
        street: "Burgstr.",
        number: "40",
    }

    {
        ID: "xyfr4",
        points: "12"
    }
*/
exports.addUser = functions.https.onRequest((request, response) => {
    if(!(request.method === 'POST')){
        console.log("Wrong request method: "+ request.method);
        response.status(405).send(request.method);
        return; 
    }

    if (!request.body.name) {
        console.log("Please provide more information.")
		response.status(400).send("Please provide more information.");
        return;
	}

    if (!(typeof request.body.name === 'string') ||
        !(typeof request.body.prename === 'string') ||
        !(typeof request.body.zipCode === 'number') ||
        !(typeof request.body.city === 'string') ||
        !(typeof request.body.street === 'string') ||
        !(typeof request.body.number === 'number')){
        console.log("Type missmatch - please provide a correct value");
        response.status(400).send("Type missmatch, please provide other type for USERS");
        return;
    }

    let oUser = request.body;
    let sId = makeid();
    let ref = admin.database();

    ref.ref('users').child(sId).set(oUser).then(snapshot => {
        console.log("Status 201 - Entry created - " + oUser.name);
        //response.status(201).send("Entry created");
        //return;
    },
    error => {
        console.error("Status 400 - missing Entry creation" + error);
        response.status(400).send("Missing Entry creation" + error);
        return;
    });

    console.log('geht!!!');
    ref.ref('points').child(sId).set({
            points : 0
        }).then(snapshot => {
            console.log("Status 201 - Entry created - Points initialized");
            response.status(201).send("Entry created - Points");
            return;
        },
        error => {
            console.log("Status 400 - missing Entry creation" + error);
            response.status(400).send("Missing Entry creation " + error);
            return;
        });

    // generate a new ID
    function makeid() {
			var text = "";
			var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

			for( var i=0; i < 5; i++ ) {
				text += possible.charAt(Math.floor(Math.random() * possible.length));
			}	
			return text;
		}
   
});

// ----- Getter ----- 

exports.getCaps = functions.https.onRequest((request, response) => {
     cors(request, response, () => {
        if(!(request.method === 'GET')){
            console.log("Wrong request method: "+ request.method);
            response.status(405).send(request.method);
            return; 
        }

        admin.database().ref('/coffee/caps/').once('value').then(function(snapshot){
            let array = [];
            let json_data = snapshot.val();
            
            for(var i in json_data)
                array.push(json_data [i]);

            response.status(200).send(array);
        });
     })
});

exports.getCapsFull = functions.https.onRequest((request, response) => {
    cors(request, response, () => {
        if(!(request.method === 'GET')){
            console.log("Wrong request method: "+ request.method);
            response.status(405).send(request.method);
            return;
        }

        admin.database().ref('/coffee/caps/').once('value').then(function(snapshot){
            response.status(200).send(snapshot.val());
        });
    })
});

exports.getPads = functions.https.onRequest((request, response) => {
    if(!(request.method === 'GET')){
        console.log("Wrong request method: "+ request.method);
        response.status(405).send(request.method);
        return; 
    }

    admin.database().ref('/coffee/pads/').once('value').then(function(snapshot){
        response.status(200).send(snapshot.val());
    });
});

// ----- Delete Functions ----- 
exports.deleteCaps = functions.https.onRequest((request, response) => {
    cors(request, response, () =>{
        if(!(request.method === 'DELETE')){
            console.log("Wrong request method: "+ request.method);
            response.status(405).send(request.method);
            return;
        }
        let id = request.body.id;

        admin.database().ref('/coffee/caps/' + id).remove()
        .then(function(success) {
                response.send({ status: 'ok' });
            })
        .catch(function(error) {
                console.log('Error deleting data:', error);
                response.send({ status: 'error', error: error });
        });
    })
});