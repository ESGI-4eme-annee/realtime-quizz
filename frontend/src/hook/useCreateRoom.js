import { useSocketContext } from "../context/SocketContext";

const useCreateRoom = () => {
    console.log("useCreateRoom");

    const { socket } = useSocketContext();

    const createRoom = (name, id) => {
        socket.emit('createRoom', {
            roomName: name,
            roomId: id,
        });
    };

    return createRoom;
};

export default useCreateRoom;