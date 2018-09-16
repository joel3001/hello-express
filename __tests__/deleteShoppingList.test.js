const fs = require('fs');
const path = require('path');
const httpMocks = require('node-mocks-http');
const deleteShoppingList = require('../controllers/deleteShoppingList');

it('updates an existing shopping list', (done) => {
  expect.assertions(1);

  const filename = JSON.stringify(Date.now());

  const filePath = path.join(__dirname, '../controllers/shoppingLists', filename);

  fs.writeFile(filePath, '12345', err => {
    if (err) throw err;
  });

  const request = httpMocks.createRequest({
    method: 'DELETE',
    url: '/shopping-lists/:filename',
    params: {
      filename: filename,
    },
  });

  const response = httpMocks.createResponse({
    eventEmitter: require('events').EventEmitter,
  });

  deleteShoppingList(request, response);

  response.on('end', () => {
    fs.stat(filePath, (err, stats) => {
      expect(err.code).toBe('ENOENT');
      done();
    });
  });
});
