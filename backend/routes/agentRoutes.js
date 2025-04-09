const express = require("express");
const router = express.Router();
const Agent = require("../models/AgentModel");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, "../public/images/agents");
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, "agent-" + uniqueSuffix + ext);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: function (req, file, cb) {
    // Check file types
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(
      new Error(
        "Error: File upload only supports the following filetypes - " +
          filetypes
      )
    );
  },
});

// Get all agents
router.get("/", async (req, res) => {
  try {
    const agents = await Agent.find();
    res.json(agents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a single agent
router.get("/:id", async (req, res) => {
  try {
    const agent = await Agent.findById(req.params.id);
    if (!agent) {
      return res.status(404).json({ message: "Agent not found" });
    }
    res.json(agent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new agent
router.post("/", upload.single("picture"), async (req, res) => {
  try {
    const agentData = req.body;
    
    // If there's a picture, save its path
    if (req.file) {
      const relativePath = `/images/agents/${req.file.filename}`;
      agentData.picture = relativePath;
    }

    const agent = new Agent(agentData);
    const newAgent = await agent.save();
    res.status(201).json(newAgent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update an agent
router.put("/:id", upload.single("picture"), async (req, res) => {
  try {
    const agentData = req.body;
    
    // If there's a new picture, update the path
    if (req.file) {
      const relativePath = `/images/agents/${req.file.filename}`;
      agentData.picture = relativePath;
      
      // Delete old picture if it exists and is not the default
      const oldAgent = await Agent.findById(req.params.id);
      if (oldAgent && oldAgent.picture && !oldAgent.picture.includes("default-agent")) {
        const oldPath = path.join(__dirname, "../public", oldAgent.picture);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }
    }

    const updatedAgent = await Agent.findByIdAndUpdate(
      req.params.id,
      agentData,
      { new: true }
    );
    
    if (!updatedAgent) {
      return res.status(404).json({ message: "Agent not found" });
    }
    
    res.json(updatedAgent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete an agent
router.delete("/:id", async (req, res) => {
  try {
    const agent = await Agent.findById(req.params.id);
    
    if (!agent) {
      return res.status(404).json({ message: "Agent not found" });
    }
    
    // Delete the agent's picture if it's not the default
    if (agent.picture && !agent.picture.includes("default-agent")) {
      const picturePath = path.join(__dirname, "../public", agent.picture);
      if (fs.existsSync(picturePath)) {
        fs.unlinkSync(picturePath);
      }
    }
    
    await Agent.findByIdAndDelete(req.params.id);
    res.json({ message: "Agent deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;