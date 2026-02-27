function Navbar({ user }) {
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