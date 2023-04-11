import express from 'express';
import controller from '../controllers/Author';
import { Schemas, validateSchema } from '../middleware/ValidateSchema';

const router = express.Router();

router.post('/create', validateSchema(Schemas.author.create), controller.createAuthor);
router.get('/get/:authorId', controller.readAuthor);
router.get('/get/', controller.readAll);
router.patch('/update/:authorId', validateSchema(Schemas.author.update), controller.updateAuthor);
router.delete('/delete/:authorId', controller.deleteAuthor);

export = router;
