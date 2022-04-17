import "./App.css";
import io from "socket.io-client";
import { useEffect, useState } from "react";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import CreateRoom from "./common/CreateRoom";
import JoinRoom from "./common/JoinRoom";
import ScrumRoom from "./storyPoint/ScrumRoom";
import Retro from "./retrospective/Retro";

function App() {
  const baseURL =
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : "https://mypokerboard.azurewebsites.net";
  const serverURL =
    process.env.NODE_ENV === "development"
      ? "ws://localhost:3001"
      : "wss://storypointapp.herokuapp.com/";

  const [socket, setSocket] = useState(null);
  const [roomClosed, setRoomClosed] = useState(null);
  const [userJoined, setUserJoined] = useState({ userId: "", status: false });
  const [username, setUsername] = useState("");
  const [attendeeID, setAttendeeID] = useState("");
  const [roomInfo, setRoomInfo] = useState({});
  const [resultCount, setResultCount] = useState({});
  const [message, setMessage] = useState("");

  const pageData = {
    storyPointPage: {
      subdirectory: "storypoint",
      roomTitle: "Story-Point",
    },
    retroPage: {
      subdirectory: "retro",
      roomTitle: "Retrospective",
    },
  };

  useEffect(() => {
    setSocket(io.connect(serverURL, { transports: ["websocket"] })); // where the server run
  }, []);

  function storyPointSocket() {
    socket.on("joined_attendee", ({ room, userId }) => {
      setRoomInfo(room);
      setUserJoined({ userId: userId, status: true });
    });

    socket.on("join_info", ({ username, userId }) => {
      setUsername(username);
      setAttendeeID(userId);
    });

    socket.on("attendee_disconnected", (data) => {
      setRoomInfo(data);
    });

    socket.on("message", (message) => {
      setMessage(message);
    });

    socket.on("user_disconnected", (roomId) => {
      setUserJoined({ userId: attendeeID, status: false });
    });

    socket.on("room_closed", (message) => {
      setRoomClosed(true);
      setMessage(message);
      setUserJoined({ userId: attendeeID, status: false });
    });
  }

  useEffect(() => {
    if (!socket) return;
    storyPointSocket();
  }, [socket]);

  return (
    <div className="App">
      {message && <div className="disconnectMessage">{message}</div>}
      <BrowserRouter>
        <Switch>
          <Route exact path="/">
            <Redirect to="/storypoint" />
          </Route>
          <Route exact path="/storypoint">
            <CreateRoom
              pageData={pageData}
              socket={socket}
              setRoomInfo={setRoomInfo}
              baseURL={baseURL}
              userJoined={userJoined}
            />
          </Route>
          <Route exact path="/storypoint/:roomId">
            <JoinRoom
              pageData={pageData}
              socket={socket}
              userJoined={userJoined}
              roomInfo={roomInfo}
            />
          </Route>
          <Route exact path="/storypoint/:roomId/:userId">
            {!userJoined.status || roomClosed ? (
              <Redirect to="/storypoint" />
            ) : (
              <ScrumRoom
                socket={socket}
                roomInfo={roomInfo}
                username={username}
                resultCount={resultCount}
                userID={attendeeID}
                setRoomInfo={setRoomInfo}
                setResultCount={setResultCount}
              />
            )}
          </Route>
          <Route exact path="/retro">
            <CreateRoom
              pageData={pageData}
              socket={socket}
              setRoomInfo={setRoomInfo}
              baseURL={baseURL}
              userJoined={userJoined}
            />
          </Route>
          <Route exact path="/retro/:roomId">
            <JoinRoom
              pageData={pageData}
              socket={socket}
              userJoined={userJoined}
              roomInfo={roomInfo}
            />
          </Route>
          <Route exact path="/retro/:roomId/:userId">
            {!userJoined.status || roomClosed ? (
              <Redirect to="/retro" />
            ) : (
              <Retro
                pageData={pageData}
                socket={socket}
                username={username}
                userID={attendeeID}
                roomInfo={roomInfo}
                setRoomInfo={setRoomInfo}
              />
            )}
          </Route>
          <Redirect to="/" />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
