const bodyParser = require('body-parser');
const express = require('express');
const http = require('http');
const cors = require('cors');
const axios = require('axios');
const { Dictionary } = require("dictionaryjs");
const { Broker } = require("./rmq/broker");
var broker = Broker.getInstance();
const amqp = require("amqplib/callback_api");

const app = express();

//port  assignment
const microserviceUrl= `http://localhost:3002`;
const port = 3005;

//tokeninfoEndpoint
const tokenInfoEndPoint = 'https://accounts.google.com/gsi/client';

// Middlewares 
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// Running app http server
const server = http.createServer(app);
const io = require("socket.io")(server, { cors: { origin: "*" } });
//Dictionary
let activeDictionary = new Dictionary();
let authenticatedDict = new Dictionary();

 //Authentication Middleware
// const AuthenticationMiddleware = async (req, res, next) => {
    
//     try {
//         const token =  req.headers.authorization;
//         console.log(token);
//         const socketId = req.params.socketId;
//         if (token ) {
//             let config = {
//                 headers: {
//                     "authorization": `Bearer ${token}`,
//                     "Content-Type": "application/json"
//                 }
//             };
//             const response= await axios(tokenInfoEndPoint, config).then()
//             authenticatedDict.set(socketId, response.data);
//             console.log(response);
//             next();
//         } else {
//             console.log("Authentication Failed");
//             res.status(400);
//         }
//     } catch (error) {
//         console.log("Authentication Failed");
//         res.status(400);
//     }
// }

// // // Authorisation Middlewaree
// const AuthorisationMidleware = async (req, res, next) => {
//     try {
//         const token = req.headers.authorization?.toString()?.slice(1);
//         console.log(req.get("Authorisation"));
//         const socketId = req.params.socketId;
//         if (token ) {
//             console.log(authenticatedDict.getKeys(), socketId);
//             if (!authenticatedDict.getKeys().includes(socketId)) {
//                 throw Error("Not Authenticated");
//             }
//             next();
//         } else {
//             console.log("Auth Called Fail");
//             res.status(400);

//         }
//     } catch (error) {
//         console.log("Authorisation Failed");
//         res.status(400);
//     }
// }

var sockets = []

// socket connection
io.on("connection", (socket) => {
    console.log(`client with id : ${socket.id} connected to apigateway`);
    //add socket to var sockets
    sockets.push(socket.id);
    //add to dictionary
    activeDictionary.set(socket.id, socket);
    console.log("Number of clients Connected: ", activeDictionary.length);
    //sending Message to client
    socket.emit("generateID", socket.id);
    socket.on("disconnect", () => {
        console.log("Client Disconnected with id: ", socket.id);
        //remove disconnected client from dictionary
        activeDictionary.remove(socket.id);
        authenticatedDict.remove(socket.id);
        console.log("Number of clients connected: ", activeDictionary.length);
         socket.disconnect(true);
    });
});

//routes for further actions to be performed
//route to Authenticate the user
// app.get('/dashboard', async(req,res)=>{
//     const socketId = req.params.socketId;
//     console.log("Connected to socket " , socketId);
//     const response =  new ResponseModel(200,'SUCCESS','GET',`Authentication Successfull for ${socketId}`);
//     res.status(200).json(response);
// })

 //route to get all object
app.get('/home/:tablename/:socketId', async(req,res)=>{
    const url = microserviceUrl + "/"+req.params.tablename;
    try {
        const result = await axios.get(url);
        res.status(200).json(result.data);
    } catch (error) {
        //const response = new ResponseModel(400,'FAILED','GET',`Unsuccessful`,{});
        res.status(400);
    }
})

//route to post the data into the service
app.post('/:socketId/:serviceName', async(req,res)=>{
    const body = req.body;
    const topicName = req.params.serviceName + "_ADD" 
    const response = broker.PublicMessageToTopic(topicName,body)
    res.send("Success");
})

 //route to edit a particular object
app.patch('/:socketId/update/:service/:id', async(req,res)=>{
    const id = parseInt(req.params.id);
    const body = {
        id1: id,
        data: req.body};
    const topicName = req.params.service + "_UPDATE"
    const response = broker.PublicMessageToTopic(topicName,body)
    res.send("Success");
})

//route to delete a particular object 
app.delete('/:socketId/:service/:id', async(req,res)=>{
    const id = parseInt(req.params.id);
    const topicName = req.params.service + "_DELETE";
    const response = broker.PublicMessageToTopic(topicName,id)
    res.send("Success");
})


server.listen(port, ()=>{
    console.log("Gateway Running at port " ,port);
    //listening to the API service to check if the required action is successfully performed 
    broker.listenToServices("API_GATEWAY_SERVICE", (result) => {
        const { message } = result;
        console.log(message);
    });
});

