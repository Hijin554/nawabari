const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const ctrl = require('../controllers/recordController');

router.get('/', auth, ctrl.getRecords);
router.get('/my', auth, ctrl.getMyRecords);
router.get('/favorites', auth, ctrl.getFavorites);
router.get('/map', auth, ctrl.getMapRecords);
router.get('/:id', auth, ctrl.getRecord);
router.post('/', auth, ctrl.createRecord);
router.put('/:id', auth, ctrl.updateRecord);
router.delete('/:id', auth, ctrl.deleteRecord);
router.post('/:id/favorite', auth, ctrl.toggleFavorite);

module.exports = router;
