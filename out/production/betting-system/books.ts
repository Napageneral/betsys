import express from 'express';

import {createAccount, endSession, init, login, placeBet, scrapeLines} from '../controllers/books.js';

const router = express.Router();

router.post('/init', init);
router.post('/login', login);
router.post('/scrapeLines', scrapeLines);
router.post('/placeBet', placeBet);
router.post('/createAccount', createAccount);
router.post('/endSession', endSession);

export default router;