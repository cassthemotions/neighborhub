'use strict';
var AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB({ apiVersion: '2012-10-08' });
AWS.config.update({ region: 'us-west-2' });
let methods = {};

/**
 * This function creates a new erc20 swap record
 * @param {string} id the contract id
 * @param {Object} contract the contract object
 */
methods.create = async (id, contract) => {

  var params = {
    TableName: 'erc20-swap',
    Item: {
      'id': { S: id },
      'makerToken': { S: contract.makerToken },
      'makerTokenQuantity': { N: contract.makerTokenQuantity },
      'takerToken': { S: contract.takerToken },
      'takerTokenQuantity': { N: contract.takerTokenQuantity },
      'expirationDate': { N: hex }
    }
  };

  return new Promise((resolve, reject) => {
    ddb.putItem(params, (err, data) => {
      if (err)
        reject(err);
      resolve(id);
    });
  });
}

/**
 * This function saves a contract and generates a unique id
 * to access the contract data. The data is stored in hex format.
 * @param {string} data the hex contract
 * @returns {Promise} the contract id wrapped in a promise
 */
methods.get = async (id) => {

  var params = {
    TableName: 'contract',
    Key: {
      "id": {
        S: id
      }
    }
  };

  return new Promise((resolve, reject) => {
    ddb.getItem(params, (err, data) => {
      if (err)
        reject(err);

      let contract = {};
      for (var key in data.Item) {
        const item = data.Item[key];
        const firstKey = Object.keys(item)[0];
        const firstValue = item[firstKey];
        contract[key] = firstValue;
      }

      resolve(contract);
    });
  });
}

/**
 * This function updates a record in the Contracts table after
 * the taker signs it
 * @param {string} id the contract id
 * @param {string} takerTx the signed tx
 * @param {string} taker the eth address of the taker
 * @param {Object} txHashes { makerTxHash, takerTxHash }
 * @param {Boolean} signed contract signed by taker or not
 * @param {Boolean} swapped contract swapped or not
 */
methods.update = async (id, takerTx, taker, txHashes, signed, swapped) => {

  console.log(txHashes)
  var params = {
    TableName: 'contract',
    Key: {
      "id": {
        S: id
      }
    },
    UpdateExpression: "set takerTx = :takerTx, taker=:taker, takerTxHash = :takerTxHash, makerTxHash = :makerTxHash, signed=:signed, swapped=:swapped",
    ExpressionAttributeValues: {
      ":takerTx": { S: takerTx },
      ":taker": { S: taker },
      ":takerTxHash": { S: txHashes.takerTxHash },
      ":makerTxHash": { S: txHashes.makerTxHash },
      ":signed": { BOOL: signed },
      ":swapped": { BOOL: swapped },
    }
  };

  return new Promise((resolve, reject) => {
    ddb.updateItem(params, (err, data) => {
      if (err)
        reject(err);
      resolve(data);
    });
  });
}

exports.data = methods;
