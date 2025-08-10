const express = require('express');
const router = express.Router();
const {
  createRecord,
  getRecords,
  getRecordById,
  updateRecord,
  deleteRecord
} = require('../controllers/recordController');

router.get('/', getRecords);
router.post('/', createRecord);
router.get('/:id', getRecordById);
router.put('/:id', updateRecord);
router.delete('/:id', deleteRecord);

module.exports = router;
