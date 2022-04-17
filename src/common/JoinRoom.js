import React, { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import getPageData from './getPageData';

function JoinRoom({ pageData, socket, userJoined, roomInfo }) {
    const { subdirectory, roomTitle } = getPageData(pageData);

    const [username, setUsername] = useState("");
    const { roomId } = useParams();

    const history = useHistory();

    const joinStoryPointsRoom = async () => {
        if (username === "" && roomId === "") {
            return;
        }

        const userData = {
            id: uuidv4(),
            name: username,
            point: null
        }
        await socket.emit("join_room", { roomId, userData });
    }

    useEffect(() => {
        if (userJoined.status) {
            history.push(`/${subdirectory}/${roomId}/${userJoined.userId}`);
        }
    }, [userJoined.userId]);

    return (
        <div>
            <h3>{roomTitle} created by {roomInfo.createdBy}</h3>
            <div>
                Joined as: <input type="text" placeholder="Your name" onChange={(event) => {
                    setUsername(event.target.value);
                }} />
            </div>
            <div>
                Room ID: <input readOnly type='text' value={roomId} />
            </div>
            <button onClick={joinStoryPointsRoom}>Join {roomTitle} Room</button>
        </div>
    )
}

export default JoinRoom
