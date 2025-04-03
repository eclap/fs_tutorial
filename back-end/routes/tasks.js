const express = require('express');
const moment = require('moment');
const tasksFormValidation = require('../middlewares/tasksFormValidation');
const tasksIdExists = require('../middlewares/tasksIdExists');
const tasksFilterSanitize = require('../middlewares/tasksFilterSanitize');
const TaskClient = require('../db/TaskClient');

const router = express.Router();

/**
 * /tasks:
 *  get:
 *    summary: Fetch paginated list of tasks.
 *    parameters:
 *      - in: query
 *        name: start_date
 *        schema:
 *          type: number 
 *        description: Start date of the range query in unix timestamp.
 *        required: false
 *      - in: query
 *        name: end_date
 *        schema:
 *          type: number 
 *        description: End date of the range query in unix timestamp.
 *        required: false
 *      - in: query
 *        name: page
 *        schema:
 *          type: number
 *        description: Pagination value for page to fetch.
 *        required: false
 *    responses:
 *      "200":
 *        description: OK
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                current_page:
 *                  type: number
 *                  description: Current page of the pagianted list.
 *                total:
 *                  type: number
 *                  description: Total number of tasks.
 *                page_count:
 *                  type: number
 *                  description: Number of pages.
 *                per_page:
 *                  type: number
 *                  description: Number of tasks per page.
 *                items:
 *                  type: array
 *                  description: Array of tasks
 *                  items:
 *                    type: object
 *                    properties:
 *                      id:
 *                        type: string
 *                        description: Unique identifier.
 *                      title:
 *                        type: string
 *                        description: Title of task.
 *                      description:
 *                        type: string
 *                        description: Description of task.
 *                      created_at:
 *                        type: number
 *                        description: Unix date timestamp of task creation.
 */
router.get('/', [tasksFilterSanitize], async (req, res, next) => {
  try {
    const taskClient = new TaskClient();
    const response = await taskClient.paginated(req.query);
    return res.status(200).json(response);
  } catch (error) {
    console.error("Error:", error);
    return res
      .status(500)
      .json({
        error: error.message
      });
  }
});

/**
 * /tasks/{id}:
 * put:
 *  summary: Update a task resource.
 *  parameters:
 *    - in: path
 *      name: id
 *      schema:
 *        type: string
 *      required: true
 *      description: Unique task id.
 *    - in: body
 *      name: title
 *      schema:
 *        type: string
 *      required: true
 *      description: Title of task.
 *    - in: body
 *      name: description
 *      schema:
 *        type: string
 *      required: false
 *      description: Description of task.
 *    - in: body
 *      name: status 
 *      schema:
 *        type: string
 *      required: true
 *      description: Status of task. "To Do", "In Progress", "Completed".
 *  responses:
 *    "201":
 *      description: OK
 *        content:
 *          application/json:
 *            schema:
 *              id:
 *                type: string
 *                description: Unique identifier.
 *              title:
 *                type: string
 *                description: Title of task.
 *              description:
 *                type: string
 *                description: Description of task.
 *              created_at:
 *                type: number
 *              description: Unix date timestamp of task creation.
 *    "404":
 *      description: Resource not found
 *    "422":
 *        description: Invalid body value. 
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                title:
 *                  type: array
 *                  description: List of descriptions of errors.
 *                description:
 *                  type: array
 *                  description: List of descriptions of errors.
 *                status:
 *                  type: array
 *                  description: List of descriptions of errors.
 */
router.get('/:id', async (req, res, next) => {
  try {
    const taskClient = new TaskClient();
    const task = await taskClient.getOne({
      id: req.params.id
    });
    return res.status(200).json(task.Item);
  } catch (error) {
    console.error("Error:", error);
    return res
      .status(500)
      .json({
        error: error.message
      });
  }
});

/**
 * /tasks:
 * post:
 *  summary: Create a task.
 *  parameters:
 *    - in: body
 *      name: title
 *      schema:
 *        type: string
 *      required: true
 *      description: Title of task.
 *    - in: body
 *      name: description
 *      schema:
 *        type: string
 *      required: false
 *      description: Description of task.
 *    - in: body
 *      name: status 
 *      schema:
 *        type: string
 *      required: true
 *      description: Status of task. "To Do", "In Progress", "Completed".
 *  responses:
 *    "201":
 *      description: OK
 *      content:
 *        application/json:
 *          schema:
 *            id:
 *              type: string
 *              description: Unique identifier.
 *            title:
 *              type: string
 *              description: Title of task.
 *            description:
 *              type: string
 *              description: Description of task.
 *            created_at:
 *              type: number
 *              description: Unix date timestamp of task creation.
 *      "422":
 *        description: Invalid body value. 
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                title:
 *                  type: array
 *                  description: List of descriptions of errors.
 *                description:
 *                  type: array
 *                  description: List of descriptions of errors.
 *                status:
 *                  type: array
 *                  description: List of descriptions of errors.
 */
router.post('/', [tasksFormValidation], async (req, res, next) => {
  try {
    const taskClient = new TaskClient();
    const task = await taskClient.create({
      status: req.body.status,
      title: req.body.title,
      description: req.body.description
    });
    return res.status(200).json(task.Item);
  } catch (error) {
    console.error("Error:", error);
    return res
      .status(500)
      .json({
        error: error.message
      });
  }
});

/**
 * /tasks:
 * post:
 *  summary: Create a task.
 *  parameters:
 *    - in: body
 *      name: title
 *      schema:
 *        type: string
 *      required: true
 *      description: Title of task.
 *    - in: body
 *      name: description
 *      schema:
 *        type: string
 *      required: false
 *      description: Description of task.
 *    - in: body
 *      name: status 
 *      schema:
 *        type: string
 *      required: true
 *      description: Status of task. "To Do", "In Progress", "Completed".
 *  responses:
 *    "201":
 *      description: OK
 *      content:
 *        application/json:
 *          schema:
 *            id:
 *              type: string
 *              description: Unique identifier.
 *            title:
 *              type: string
 *              description: Title of task.
 *            description:
 *              type: string
 *              description: Description of task.
 *            created_at:
 *              type: number
 *              description: Unix date timestamp of task creation.
 *      "422":
 *        description: Invalid body value. 
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                title:
 *                  type: array
 *                  description: List of descriptions of errors.
 *                description:
 *                  type: array
 *                  description: List of descriptions of errors.
 *                status:
 *                  type: array
 *                  description: List of descriptions of errors.
 */
router.put('/:id', [tasksFormValidation], async (req, res, next) => {
  try {
    const taskClient = new TaskClient();
    const task = await taskClient.update(req.params.id, {
      status: req.body.status,
      description: req.body.description,
      title: req.body.title,
    });
    return res.status(200).json(task.Item);
  } catch (error) {
    console.error("Error:", error);
    return res
      .status(500)
      .json({
        error: error.message
      });
  }
});

/**
 * /tasks/{id}:
 * delete:
 *  summary: Delete a task resource.
 *  parameters:
 *    - in: path
 *      name: id
 *      schema:
 *        type: string
 *      required: true
 *      description: Unique task id.
 *  responses:
 *    "201":
 *      description: OK
 *    "404":
 *      description: Resource not found
 */
router.delete('/:id', async (req, res, next) => {
  try {
    const taskClient = new TaskClient();
    await taskClient.delete(req.params.id);
    return res.status(200).json({delete: 'ok'});
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
