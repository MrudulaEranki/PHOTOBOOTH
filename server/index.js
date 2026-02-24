import express from 'express';
import http, { get } from 'http';
import { Server } from 'socket.io';
import { ExpressPeerServer } from 'peer';
import cors from 'cors';
import dotenv from 'dotenv';
import { nanoid } from 'nanoid';
import {
    createRoom,
    getRoom,
    addParticipant,
    removeParticipant,
    getRoomCount
} from './room.js';
import path from 'path';
import { rootCertificates } from 'tls';
import { error } from 'console';
import { Socket } from 'socket.io';

dotenv.config();

const app = express();
const server = http.createServer(app);

// cors allow vercel forntenc
app.use(cors({
    origin:process.env.CLIENT_URL, credentials:true
}));
app.use(express.json());

// socket.io
const io = new Server(
    server,{
        cors:{origin:process.env.CLIENT_URL, credentials:true}
    }
);

// peerjs server @ /peerjs

const peerServer =  ExpressPeerServer(server,
    {
        path:'/peerjs',
        allow_discovery:true,
    }
);

app.use('/peerjs',peerServer);

// create room
app.post(
    '/room/create', (req,res)=>{
        const {location} = req.body;
        const id = nanoid(8);
        createRoom(id, location);
        res.json({roomId:id});
    }
);

// validate room b4 joining
app.get( '/room/:id', (req,res)=>{
    const room = getRoom(req.params.id);
    if(!room) return res.status(404).json({error:'Room not found'});
    const count = getRoomCount(req.params.id);
    if(count>=2) return res.status(403).json({error:'room is full'});
    res.json({room});
});

//  scoket.io signalling ///////////////////////////////////////////////\

io.on('connection',(socket)=>{
    let currentRoom = null;
    let currentPeerId = null;

    socket.on("join-room", ({roomId, peerId})=>{
        const room = getRoom(roomId);
        if(!room) return socket.emit('error',{error:'Room not found'});
        const count = getRoomCount(roomId);
        if(count>=2) return socket.emit('error',{error:'room is full'});

        currentRoom = roomId;
        currentPeerId = peerId;

        socket.join(roomId);
        addParticipant(roomId,peerId);

        socket.to(roomId).emit('pee-joined',{peerId});

        const room2 = getRoom(roomId);
        socket.emit('room-joined',{
            participants:room2.participants.filter(p => p!== peerId)
        });
    });

    socket.on('photo-taken', ({roomId, photoData, index})=>{
        socket.to(roomId).emit('photo-taken', {photoData, index});
    });

    socket.on('retake', ({roomId, index})=>
    {
        socket.to(roomId).emit('retake', {index});
    }
    );

    socket.on('disconnect', ()=>{
        if(currentRoom && currentPeerId){
            removeParticipant(currentRoom, currentPeerId);
            socket.to(currentRoom).emit('peer-left', {peerId:currentPeerId});
        }
    });
});


// __________________________________________________________________
// start
// ******************************************************************

const PORT = process.env.PORT || 3001;

server.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
});