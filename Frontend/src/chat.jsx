import { React, useState, useEffect, useRef } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './components/ui/card'
import { Label } from "./components/ui/label"
import { Input } from "./components/ui/input"
import { Button } from "./components/ui/button"
import { ScrollArea } from "./components/ui/scroll-area"
import people from "./assets/people.png"
import { Send, Users } from 'lucide-react'
import { Separator } from './components/ui/separator'
import { Avatar, AvatarImage, AvatarFallback } from './components/ui/avatar'


export default function chat({ socket, username, room }) {

    const [currentMessage, setCurrentMessage] = useState('')
    const [messageList, setMessageList] = useState([])
    const [users, setUsers] = useState([]);


    const messagesEndRef = useRef(null);


    useEffect(() => {
        scrollToBottom();
    }, [messageList]);


    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const sendMessage = async () => {
        if (username && currentMessage) {
            const info = {
                message: currentMessage,
                room,
                author: username,
                time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes(),
            }
            await socket.emit("send_message", info)
            setMessageList((list) => [...list, info])

        }
        setCurrentMessage('');
    }


    useEffect(() => {
        socket.on("update_users", (users) => {
            console.log("Updated user list:", users);
            setUsers(users);
        });

        return () => socket.off("update_users");
    }, [socket]);



    useEffect(() => {
        const messageHandle = (data) => {
            console.log(data)
            setMessageList((list) => [...list, data])
        }

        socket.on("recieve_message", messageHandle)
        return () => socket.off("recieve_message", messageHandle)


    }, [socket])

    return (
        <div className='flex  h-[80vh] bg-gray-100 p-4 rounded-lg '>
            <Card className="flex flex-col w-64 mr-4 ">
                <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-t-lg">
                    <CardTitle className="text-white flex items-center ">
                        <Users className="mr-2" />
                        Users
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex-grow overflow-hidden p-0">

                    <ScrollArea className="h-full">
                        {users.map((user) => (
                            <div key={user.id} className="flex items-center space-x-2 p-2 hover:bg-gray-100">
                                <Avatar className="w-8 h-8">
                                    <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${user.username}`} />
                                    <AvatarFallback>{user.username[0]}</AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col">
                                    <span className="text-sm font-medium">{user.username}</span>
                                    <span className={`text-xs ${user.status === 'online' ? 'text-green-500' : user.status === 'away' ? 'text-yellow-500' : 'text-gray-500'}`}>
                                        {user.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </ScrollArea>

                </CardContent>
            </Card>
            <Card className="flex-grow flex flex-col">
                <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-t-lg">
                    <CardTitle className="text-white">Chat Room</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow overflow-hidden p-0">
                    <ScrollArea className="h-full p-4">
                        {messageList.map((item, i) => {
                            const isUserMessage = item.author === username;
                            const alignmentClass = isUserMessage ? 'justify-end' : 'justify-start';

                            return (
                                <div
                                    key={i}
                                    className={`flex ${alignmentClass} mb-4`}
                                >
                                    {!isUserMessage && (
                                        <Avatar className="w-8 h-8 mr-2">
                                            <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${item.author}`} />
                                            <AvatarFallback>{item.author[0]}</AvatarFallback>
                                        </Avatar>
                                    )}

                                    <div className="flex flex-col max-w-xs">
                                        <div className={`flex items-baseline space-x-2 ${isUserMessage ? 'justify-end' : ''}`}>
                                            <span className="font-semibold text-sm">{item.author}</span>
                                            <span className="text-xs text-gray-500">{item.time}</span>
                                        </div>
                                        <p className={`text-sm mt-1 rounded-lg p-2 inline-block shadow-sm ${isUserMessage ? 'bg-blue-500 text-white' : 'bg-gray-100'} break-words`}>
                                            {item.message}
                                        </p>
                                    </div>

                                    {isUserMessage && (
                                        <Avatar className="w-8 h-8 ml-2">
                                            <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${item.author}`} />
                                            <AvatarFallback>{item.author[0]}</AvatarFallback>
                                        </Avatar>
                                    )}
                                </div>
                            );
                        })}
                        <div ref={messagesEndRef} />

                    </ScrollArea>
                </CardContent>
                <Separator />
                <CardFooter className="p-4">
                    <form className="flex w-full space-x-2"

                        onSubmit={(e) => {
                            e.preventDefault();
                            sendMessage();
                        }}>
                        <Input
                            type="text"
                            placeholder="Escribe un mensaje..."
                            className="flex-grow"
                            value={currentMessage}
                            onChange={e => setCurrentMessage(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();

                                    sendMessage()
                                    setCurrentMessage('')
                                }
                            }}
                        />
                        <Button
                            className="bg-indigo-500 hover:bg-indigo-600 text-white"
                            type="button"
                            onClick={sendMessage}>

                            <Send
                                className="h-4 w-4 mr-2" />
                            Enviar
                        </Button>
                    </form>
                </CardFooter>
            </Card>
        </div>
    )
}
