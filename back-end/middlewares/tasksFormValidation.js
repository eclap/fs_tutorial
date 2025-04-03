const { body, matchedData, validationResult } = require('express-validator');
const TaskStatus = require('../db/TaskStatus');

const restructureErrorResponseBody = (req, res, next) => {
  const errors = validationResult(req)

  if (errors.isEmpty()) {
    return next();
  }
  
  const errorsObject = {};

  errors.errors.forEach(error => {
    errorsObject[error.path] = errorsObject[error.path] ? 
      [...errorsObject[error.path], error.msg] : 
      [error.msg];
  });

  return res.status(422).json({ errors: errorsObject });
};

const tasksFormValidation = [
  body('status')
    .notEmpty()
    .withMessage('Status must exists.')
    .isIn(TaskStatus.getAll())
    .withMessage('Status is invalid.'),
  body('title')
    .notEmpty()
    .withMessage('Title must exists.'),
  restructureErrorResponseBody
];

module.exports = tasksFormValidation;
