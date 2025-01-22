
const router = new require('express').Router();

const orangeSmsMidlle = require('../middleweare/orangeSms');

router.post('/', require('../controllers/admin').store);
router.post('/auth', require('../controllers/admin').auth);
router.get('/tel', require('../controllers/admin').getAllTell);
router.get('/concurants', require('../controllers/admin').allConcurant);
router.post('/sms',  orangeSmsMidlle ,require('../controllers/admin').sendSms);
router.post('/mail' ,require('../controllers/admin').sendMailContact);



module.exports = router;