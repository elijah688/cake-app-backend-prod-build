const express = require("express");
const router = express.Router();
const extractFile = require('../middleware/file');
const guard = require("../middleware/guard");
const cakeController = require('../controllers/cake');

router.post('', guard, extractFile, cakeController.addCake)



router.get('', cakeController.getCakes)

router.put('/:id', guard, extractFile, cakeController.editCake)

router.delete('/:id', guard, cakeController.deleteCake)

router.get('/:id', cakeController.getCake)


module.exports = router;