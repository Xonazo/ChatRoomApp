const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();
const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: process.env.HOST,
        methods: ['GET', 'POST']
    }
})


const rooms = {};

io.on('connection', (socket) => {
    console.log("User connected , socket id : ", socket.id);


    socket.on("join_room", (data) => {
        const { room, username } = data;
        console.log(`User: ${username} intentando unirse a la sala: ${room}`); // Mensaje de depuración

        if (rooms[room] && rooms[room].some(user => user.username === username)) {
            socket.emit("username_taken", { message: "Username is already taken in this room." });
            return;
        }

        socket.join(room);
        socket.username = username;
        io.emit("new_room_created", { room });

        if (!rooms[room]) {
            rooms[room] = [];
        }

        rooms[room].push({ id: socket.id, username });
        console.log(`User with socket id: ${socket.id} joined room: ${room} as username: ${username}`);
        io.to(room).emit("update_users", rooms[room]);

    });

    socket.on("send_message", (data) => {
        socket.to(data.room).emit("recieve_message", data)
    })


    socket.on("get_rooms", () => {
        const roomList = Object.keys(rooms).map(room => ({
            name: room,
            users: rooms[room].length
        }));
        
        socket.emit("rooms_list", roomList);
        console.log(roomList)
    });


    socket.on("disconnect", () => {
        console.log("User disconnected, socket id : ", socket.id);

        for (let room in rooms) {
            rooms[room] = rooms[room].filter(user => user.id !== socket.id);
            io.to(room).emit("update_users", rooms[room]);
        }

        console.log("User disconnected, socket id:", socket.id);
    })



})


server.listen(process.env.PORT, () => {
    console.log(`Server is running on port  ${process.env.PORT}`);
}
);



app.get('/api', (req, res) => {
    res.json({ message: 'Hello from server!' });
});

