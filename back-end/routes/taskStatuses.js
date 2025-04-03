const express = require('express');
const moment = require('moment');
const TaskStatus = require('../db/TaskStatus');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    return res.status(200).json({ 
      items: TaskStatus.getAll(),
    });
  } catch (error) {
    console.error("Error:", error);
    return res
      .status(500)
      .json({
        error: error.message
      });
  }
});

module.exports = router;
