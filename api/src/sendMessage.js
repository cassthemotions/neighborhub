'use strict';
var AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB({ apiVersion: '2012-10-08' });
AWS.config.update({ region: 'us-west-2' });



module.exports.handler = async (event) => {

  const body = event.body;
  const from = body.from;
  const to = body.to;
  const id = module.getId(body);
  const message = body.message;

  var params = {
    TableName: 'message',
    Item: {
      'id': { S: id },
      'message': { S: message },
      'from': { S: from },
      'timestamp': { N: new Date().getTime().toString() }
    }
  };

  const result = await module.insert(params);

  return {
    statusCode: 200,
    body: result
  };
};

module.insert = async (params) => {

  return new Promise((resolve, reject) => {
    ddb.putItem(params, (err, data) => {
      if (err)
        reject(err);
      resolve(data);
    });
  });
}

module.getId = (body) => {
  const all = body.to;
  all.push(body.from);
  all.sort((a, b) => {
    if (a < b) return -1;
    else return 1;
  });
  let id = '';
  for (let e in all) {
    id += all[e] + ";";
  }

  return id;
}
