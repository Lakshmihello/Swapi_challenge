const router = require('express').Router();

router.use('/starWars', require('./starWars'));
router.get('/*', render404);

module.exports = router;

function render404(req, res) {
  res.status(404).json({ error: 'not found' });
}