const rooms = new Map();

export function createRoom(id, location)
{
    rooms.set(id, {
        id, 
        createdAt: new Date().toISOString(),
        endedAt:null,
        location: location||null,
        participants:[],
    });
}

export function getRoom(id)
{
    return rooms.get(id);
}

export function addParticipant(roomId, peerId)
{
    const room = rooms.get(roomId);
    if (room) room.participants.push(peerId);
}

export function removeParticipant(roomId, peerId)
{
    const room = rooms.get(roomId);

    if(room)
    {
        room.participants =  room.participants.filter(p=> p!=peerId);
        if(room.participants.length == 0){
            room.endedAt = new Date().toISOString();
        }
    }
}

export function getRoomCount(roomId){
    const room = rooms.get(roomId);

    return room? room.participants.length : 0 ;

}

export function getAllRooms(){
    return Array.from(rooms.values());
}