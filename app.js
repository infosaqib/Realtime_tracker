//? Modules
const express = require("express"),
    app = express(),
    port = process.env.PORT || 3000,
    path = require("path"),
    socketio = require("socket.io"),
    http = require("http"),
    server = http.createServer(app),
    io = socketio(server);

io.on(
    "connection",
    function (socket) {
        socket.on("send-location", function (data) {
            io.emit("recieve-location", { id: socket.id, ...data });
        });
        socket.on("disconnect", () => {
            io.emit("user-disconnected", socket.id)
        })
    },
    (error) => {
        console.error(error);
    }
);

//? Routes

app.get("/", (req, res) => {
    res.render("index");
});

//? Static files setup
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

server.listen(port, () => {
    console.log(`App is running on http://localhost:${port}`);
});


module.exports = app;