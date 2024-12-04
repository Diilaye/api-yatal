
const routes = new require('express').Router();

// Add routes
routes.get('/', require('../controllers/file').all);
routes.get('/:id', require('../controllers/file').one);
routes.post('/', require('../controllers/file').store);
routes.delete('/:id', require('../controllers/file').delete);

module.exports = routes;
