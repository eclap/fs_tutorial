const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient } = require("@aws-sdk/lib-dynamodb");
const dotenv = require('dotenv').config();

class Db {
  constructor() {
    const client = new DynamoDBClient({
      region: dotenv.parsed.AWS_REGION,
    });
    this.docClient = DynamoDBDocumentClient.from(client);
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new Db();
    }
    return this.instance;
  }
}

module.exports = Db;
