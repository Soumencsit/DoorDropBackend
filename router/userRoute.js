
import express from 'express'
import {loginUser,signUpUser,verifyOTP,sendOTPVerificationEmail} from '../controllers/UserController.js'
const createRoute=express.Router();

createRoute.post('/login',loginUser)
createRoute.post('/signup',signUpUser)
createRoute.post('/verifyotp',verifyOTP)
createRoute.post('/sendotp',sendOTPVerificationEmail)



export default createRoute;
