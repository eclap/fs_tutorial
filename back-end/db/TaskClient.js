const { 
  PutCommand,
  GetCommand,
  QueryCommand,
  DeleteCommand,
  UpdateCommand
} = require("@aws-sdk/lib-dynamodb");
const moment = require('moment');
const crypto = require("crypto");
const dotenv = require('dotenv').config();
const Db = require('./Db');

// STUB: Hard code user_id for now but this is expected
// to have its own separate db once user is a requirement.
const USER_ID = 'randomuserid';

class TaskClient {
  constructor() {
    this.TABLE_NAME = 'tasks';
    this.db = Db.getInstance();
  }

  async create(params) {
    const uuid = crypto.randomUUID();
    await this.db.docClient.send(new PutCommand({
      TableName: this.TABLE_NAME,
      Item: {
        'id': uuid,
        'user_id': USER_ID,
        'status': params.status,
        'title': params.title,
        'description': params.description,
        'created_at': moment().unix(),
      }
    }));
    const task = await this.getOne({ id: uuid });
    return task;
  }

  async getMany(query) {
    let KeyConditionExpression = "user_id = :userId";
    const ExpressionAttributeValues = {
      ':userId': USER_ID,
    };

    if (query.start_date && query.end_date) {
      KeyConditionExpression += " AND created_at BETWEEN :startDate AND :endDate";
      ExpressionAttributeValues[':startDate'] = query.start_date;
      ExpressionAttributeValues[':endDate'] = query.end_date;
    }

    const params = {
      TableName: this.TABLE_NAME,
      IndexName: 'user_id-created_at-index',
      KeyConditionExpression,
      ExpressionAttributeValues,
      ScanIndexForward: false
    };
    const tasks = await this.db.docClient.send(new QueryCommand(params));
    return tasks;
  }

  async paginated(query) {
    let total = 0;
    let pageCount = 0;
    let lastEvaluatedKey = undefined;
    const perPage = 5;
    const tasks = [];

    let KeyConditionExpression = "user_id = :userId";
    const ExpressionAttributeValues = {
      ':userId': USER_ID,
    };

    if (query.start_date && query.end_date) {
      KeyConditionExpression += " AND created_at BETWEEN :startDate AND :endDate";
      ExpressionAttributeValues[':startDate'] = query.start_date;
      ExpressionAttributeValues[':endDate'] = query.end_date;
    }

    do {
      const params = {
        Limit: perPage,
        TableName: this.TABLE_NAME,
        IndexName: 'user_id-created_at-index',
        KeyConditionExpression,
        ExpressionAttributeValues,
        ScanIndexForward: false
      };
      if (lastEvaluatedKey) {
        params.ExclusiveStartKey = lastEvaluatedKey;
      }

      const response = await this
        .db
        .docClient.send(new QueryCommand(params));
      pageCount++; 

      if (response.Items && response.Items.length > 0) {
        console.log(response.Items);
        total += response.Items.length;
        tasks.push(response.Items);
      }

      lastEvaluatedKey = response.LastEvaluatedKey;
      
    } while (lastEvaluatedKey);

    return {
      page_count: pageCount,
      items: tasks.length > 0 ? tasks[query.page - 1] : [],
      current_page: query.page,
      per_page: perPage,
      total: total,
    };
  }

  async getOne(query) {
    const task = await this.db.docClient.send(new GetCommand({
      TableName: this.TABLE_NAME,
      Key: query,
    }));
    return task;
  }

  async update(id, params) {
    const task = await this.db.docClient.send(new UpdateCommand({
      TableName: this.TABLE_NAME,
      Key: { id },
      UpdateExpression: "SET #status = :status, description = :description, title = :title",
      ExpressionAttributeNames: {
        "#status": "status"
      },
      ExpressionAttributeValues: {
        ":status": params.status,
        ":description": params.description,
        ":title": params.title,
      }
    }));
    return task;
  }

  async delete(id) {
    await this.db.docClient.send(new DeleteCommand({
      TableName: this.TABLE_NAME,
      Key: { id },
    }));
  }
};

module.exports = TaskClient;
