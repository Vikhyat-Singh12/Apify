import express from 'express';
import {
    getActors,
    getActorSchema,
    runActor
} from '../controllers/apify.controller.js';

const router = express.Router();

router.post('/actors', getActors);           
router.post('/schema', getActorSchema);       
router.post('/run', runActor);                


export default router;