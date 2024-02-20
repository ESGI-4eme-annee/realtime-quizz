require("dotenv").config({ path: ".env", override: true });

async function createRoom(req, res) {
  try {
    if (!req.body?.name) {
      return res.status(400).json({ error: "Missing parameters" });
    }

    io.emmit("roomCreated", { name: req.body.name, id: uuidv4() });

   


    res.status(201).json({
      message: "Room created !",
      email: user.email,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  signup,


};
