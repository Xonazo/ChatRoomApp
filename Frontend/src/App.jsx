import io from 'socket.io-client'
import './App.css'
import people from "./assets/people.png"
import { useState, useEffect } from 'react'
import Chat from './chat'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './components/ui/card'
import { Label } from "./components/ui/label"
import { Input } from "./components/ui/input"
import { Button } from "./components/ui/button"
import { ScrollArea } from "./components/ui/scroll-area"

const socket = io.connect(import.meta.env.VITE_BACKEND_HOST)


function App() {
  const [room, setRoom] = useState('')
  const [showChat, setShowChat] = useState(false)
  const [username, setUsername] = useState('')



  //Obtener Salas
  const [rooms, setRooms] = useState([]);
  useEffect(() => {
    socket.emit("get_rooms");
    socket.on("rooms_list", (rooms) => {
        setRooms(rooms);
    });

    socket.on("new_room_created", (data) => {
        setRooms((prevRooms) => [...prevRooms, { name: data.room, users: 0 }]); 
    });

    return () => {
        socket.off("rooms_list");
        socket.off("new_room_created"); 
    };
}, []);



  const handleJoinRoom = (roomId) => {
    const username = prompt("Enter your username:");
    if (username) {
      console.log("ESTE ES EL USERNAME", username)
      socket.emit("join_room", { room: roomId, username });
      setShowChat(true);
      setUsername(username);
      setRoom(roomId);


    }
  };



  const joinRoom = () => {
    if (username !== "" && room !== "") {
      socket.emit("join_room", { room, username });
      setShowChat(true);
    }


  }

  return (

    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 p-4">

      <Card className="w-full max-w-4xl bg-white/90 backdrop-blur-sm shadow-lg">
        {!showChat ? (
          <div>

            <CardHeader className="text-center">
              <div className="mx-auto bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-full p-3 w-16 h-16 flex items-center justify-center mb-4 shadow-lg">
                <img src={people} />
              </div>
              <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">Unirse a una sala de chat</CardTitle>
              <CardDescription>¡Ingresa tu apodo y elige una sala para unirte a la conversación!</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-2">
              {/* FORMULARIO DEN NICKNAME Y ROOMID*/}
              <div>
                <form className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="nickname" className="text-indigo-700">Nickname</Label>
                    <Input
                      id="nickname"
                      placeholder="Ingresa tu nickname"
                      required
                      onChange={(e) => setUsername(e.target.value)}
                      className="border-indigo-300 focus:ring-indigo-500"
                      maxLength={15}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="roomId" className="text-indigo-700">Room ID (opcional)</Label>
                    <Input
                      id="roomId"
                      required
                      onChange={(e) => setRoom(e.target.value)}
                      placeholder="Ingresa un room ID"
                      className="border-indigo-300 focus:ring-indigo-500"
                      maxLength={10}
                    />
                  </div>
                  <Button
                    className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold py-2 px-4 rounded-full transition-all duration-300 transform hover:scale-105"
                    type="submit"
                    onClick={joinRoom}
                  >
                    Crear/Unirse
                  </Button>
                </form>
              </div>


              {/* PARTE DE LA LISTA DE GRUPOS*/}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-indigo-700">Salas Disponibles</h3>
                <ScrollArea className="h-[200px] rounded-md border border-indigo-200 p-4">
                  {rooms.length > 0 ? (
                    rooms.map((room, index) => (
                      <div key={index} className="flex items-center justify-between py-2 border-b border-indigo-100 last:border-b-0">
                        <div>
                          <h4 className="font-medium text-indigo-900">{room.name}</h4>
                          <p className="text-sm text-indigo-600">{room.users} users</p>
                        </div>
                        <Button
                          onClick={() => handleJoinRoom(room.name)}
                          variant="outline"
                          size="sm"
                          className="flex items-center space-x-1 text-indigo-700 hover:text-white hover:bg-indigo-600"
                        >
                          <span>Entrar</span>
                        </Button>
                      </div>
                    ))
                  ) : (
                    <p className="text-indigo-600">No hay salas disponibles.</p>
                  )}
                </ScrollArea>
              </div>
            </CardContent>

          </div>
        ) : (
          <Chat socket={socket} username={username} room={room} />

        )}
      </Card>

    </div >
  )
}

export default App
