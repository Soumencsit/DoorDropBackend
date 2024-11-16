import userModel from "../model/userModel.js";
import userOTPVerification from '../model/userOTPVerification.js'
import 'dotenv/config';
import bcrypt from 'bcrypt'
import validator from 'validator'
import nodemailer from "nodemailer";


let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    secure:true,
    auth: {
        user: process.env.USER,
        pass: process.env.PASSWORD

    }
});



//teating success
transporter.verify((error, success) => {
    if (error) {
        console.error("Error connecting to the email service:", error); // Improved logging
    } else {
        ("Ready for message:", success);
    }
});

// Login
const loginUser=async(req,res)=>{
    const{email,password}=req.body;
    try{
        const User=await userModel.findOne({email})
            if(!User){
                return res.json({success:false,massage:"User Doesn't exist"})
            }    
        const isMatch=await bcrypt.compare(password,User.password)
        if(!isMatch){
            return res.json({success:false,massage:"Invalid credential"})
        }      
        res.json({success:true,massage:"User login successful",data:User})
    }   
    catch(err){
        res.json({success:false,massage:"ERROR"})
    }
}




const verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;
   
        
        // Validate input
        if (!email|| !otp) {
            return res.json({success:false, message: "Empty OTP details are not allowed" });
        }

        // Fetch the OTP verification record
        const userOTPVerificationRecord = await userOTPVerification.findOne({ email });
        
        

        if (!userOTPVerificationRecord) {
         
            
            return res.json({
                success:false,
                message: "Account record doesn't exist or has been verified already. Please sign up or log in ooooooooo"
            });
        }

        const { expiresAt, otp: hashedOTP } = userOTPVerificationRecord;

        // Check if OTP has expired
        if (expiresAt < Date.now()) {
            await userOTPVerification.deleteMany({ userId });
            return res.json({ success:false, message: "Code has expired. Please request again" });
        }

        // Verify the OTP
        const validOTP = await bcrypt.compare(otp, hashedOTP);
        if (!validOTP) {
            return res.json({ success:false, message: "Invalid code passed. Check your inbox" });
        }

     


        // Delete OTP record after successful verification
        await userOTPVerification.deleteMany({ email });

        // Send success response
        res.json({
            success:true,
            message: "User email verified successfully",
            

        });
    } catch (error) {
        
        res.json({
            success:false,
            message: "Error in verifyOTP",
            
        });
    }
};







//resend verification
const resendOTPVerificationCode= async (req, res) => {
    try{
        let { UserId, email } = req.body;
        
        if( !UserId || !email) {
            throw Error("empty User details are not allowed");
        } else {
            //deleting existing records and re-send
            await userOTPVerification.deleteMany({ UserId });
            sendOTPVerificationEmail({_id: UserId, email }, res);
        }

    }catch (error) {
        res.json({
            status: "failed",
            message: error.message,
        });
    }
};







const sendOTPVerificationEmail = async (req, res) => {
    const { email } = req.body;

    try {
        const otp = `${Math.floor(100000 + Math.random() * 900000)}`; // Generate 6-digit OTP

        // Email options
        const mailOptions = {
            from: "sp01csit@gmail.com",
            to: email,
            subject: "Verify Your Email",
            html: `<p>Enter ${otp} in the app to verify your email address and complete the sign-up process.</p><p>This code <b>expires in 1 hour</b>.</p>`,
        };

        // Hash the OTP
        const saltRounds = 10;
        const hashedOTP = await bcrypt.hash(otp, saltRounds);

        // Create and save a new OTP verification record
        const newOTPVerification = new userOTPVerification({
            email: email,
            otp: hashedOTP,
            createdAt: Date.now(),
            expiresAt: Date.now() + 3600000, // OTP expires in 1 hour
        });

        // Save OTP record to the database
        await newOTPVerification.save();

        // Send the OTP email
        await transporter.sendMail(mailOptions);

        // Send response back to the client
        return res.status(200).json({
            success:true,
            message: "Verification OTP email sent",
            data: {
                email:email
            }
        });

    } catch (error) {
     
        return res.status(500).json({
            success:false,
            message: error.message,
        });
    }
};






const signUpUser = async (req, res) => {
    const { name, password, email, phone, address, boxId } = req.body;

    try {
        // Check if the user already exists
        const exist = await userModel.findOne({ email });
        if (exist) {
            return res.status(400).json({ Success: false, message: "User already exists" });
        }

        // Validate email
        if (!validator.isEmail(email)) {
            return res.status(400).json({ Success: false, message: "Please enter a valid email." });
        }

        // Validate password strength
        if (password.length < 8) {
            return res.status(400).json({ Success: false, message: "Password must be at least 8 characters long." });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        // Create a new user object
        const newUser = new userModel({
            name: name,
            email: email,
            phone: phone,
            address: address,
            password: hashPassword,
            boxId: boxId || "" 
        });

        // Save the user to the database
        await newUser.save();

        // Respond with success
        return res.status(201).json({
            Success: true,
            message: "User created successfully.",
            userId: newUser 
        });
    } 
    catch (error) {
        console.error(error);
        res.status(500).json({ Success: false, message: "Error occurred while creating user." });
    }
};





export {loginUser,signUpUser,verifyOTP,resendOTPVerificationCode,sendOTPVerificationEmail};
