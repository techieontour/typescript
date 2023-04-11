import express from 'express';
import controller from '../controllers/Book';
import { Schemas, validateSchema } from '../middleware/ValidateSchema';

const router = express.Router();

router.post('/create', validateSchema(Schemas.book.create), controller.createBook);
router.get('/get/:bookId', controller.readBook);
router.get('/get/', controller.readAll);
router.patch('/update/:bookId', validateSchema(Schemas.book.create), controller.updateBook);
router.delete('/delete/:bookId', controller.deleteBook);

export = router;
