const {Router} = require('express');
const SlotController = require('../controller/slot');
const router = Router(); 

router.post('/slot/create',SlotController.create);
router.get('/slot/getall',SlotController.getAll);
router.get('/slot/getById',SlotController.getById);
router.post('/slot/book',SlotController.book);
router.post('/slot/cancel',SlotController.cancel);

module.exports = router ; 

