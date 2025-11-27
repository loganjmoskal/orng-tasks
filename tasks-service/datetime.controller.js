const zmq = require('zeromq');

// helper function to send a message to the microservice
const requestTimeFromPython = async (params) => {
    const sock = new zmq.Request();

    sock.connect("tcp://127.0.0.1:5556");

    await sock.send(JSON.stringify(params));

    const [result] = await sock.receive();

    return result.toString();
};

exports.getCurrentTime = async (req, res) => {
    try {
        const params = {
            timeZone: "pst",
            textDate: true,
            militaryTime: false
        };

        console.log("Requesting time from Date/Time service...");
        const timeString = await requestTimeFromPython(params);
        console.log("Received time:", timeString);

        res.json({ time: timeString });
    } catch (err) {
        console.error("Microservice Error:", err);
        res.status(500).json({ error: "Failed to get time from microservice" });
    }
};