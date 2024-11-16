
import express from 'express'
import {unlockBox,setupOrLoginBox,  setTemporaryPassword, setUserPassword} from '../controllers/boxController.js'
const createRoute=express.Router();

createRoute.post('/login',setupOrLoginBox)
createRoute.post('/setpassword', setUserPassword)
createRoute.post('/temporarypassword',setTemporaryPassword)
createRoute.post('/unlockbox',unlockBox)



export default createRoute;
