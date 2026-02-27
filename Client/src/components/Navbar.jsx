import socket from "../sockets";
function Navbar({ user }) {
  socket.emit("send_message", {
  receiverId: "",
  text: "Hello bro"
});
socket.on("receive_message", (data) => {
  console.log("New message:", data);
});
  return (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <h2>MCOEgram</h2>
      <div>
        <span>{user.name}</span>
      </div>
    </div>
  );
}

export default Navbar;