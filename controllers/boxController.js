import boxModel from '../model/boxModel.js'; 
import userModel from '../model/userModel.js';
import bcrypt from 'bcrypt'
import { v4 as uuidv4 } from 'uuid'

// export const setupBox= async (req, res) => {
//   const { email, password } = req.body; 

//   try {
//       // Find the user by email
//       const User = await userModel.findOne({ email });
//       if (!User) {
//           return res.json({ success: false, message: "User doesn't exist" });
//       }

//       // Check if password matches
//       const isMatch = await bcrypt.compare(password, User.password);
//       if (!isMatch) {
//           return res.json({ success: false, message: "Invalid credentials" });
//       }

//       // let boxresponce=boxId.findOne(email)
//       // if(boxresponce){
//       //   return res.json({ success: false, message: "Box already exist" });
//       // }
//     // else{

      
//       // Generate a unique boxId
//       const boxId = uuidv4();

//       // Update the user's record with the new boxId
//       User.boxId = boxId;
//       await User.save();

//       // Save the box data to the boxModel
//       await boxModel.create({
//           email: email,
//           boxId: boxId
//       });

//       res.json({
//           success: true,
//           message: "Login successful",
//           userdata: {
//               email: User.email,
//               boxId: User.boxId,
//           },
//       });
//     // }
//   } catch (err) {
//       console.error(err);
//       res.json({ success: false, message: "An error occurred" });
//   }
// };

// export const loginBox=async(req,res)=>{

//   const { email, password } = req.body; 

//   try {
//       // Find the user by email
//       const User = await userModel.findOne({ email });
//       if (!User) {
//           return res.json({ success: false, message: "User doesn't exist" });
//       }

//       // Check if password matches
//       const isMatch = await bcrypt.compare(password, User.password);
//       if (!isMatch) {
//           return res.json({ success: false, message: "Invalid credentials" });
//       }

//       res.json({
//         success: true,
//         message: "Login successful",
//         userdata: {
//             email: User.email,
//             boxId: User.boxId,
//         },
//     });
//   }
//   catch(err){
//     console.error(err);
//   }


// }


export const setupOrLoginBox = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const User = await userModel.findOne({ email });
    if (!User) {
      return res.json({ success: false, message: "User doesn't exist" });
    }

    // Check if password matches
    const isMatch = await bcrypt.compare(password, User.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    // Check if the user has a boxId
    if (!User.boxId) {
      // Generate a unique boxId
      const boxId = uuidv4();
      
      // Update the user's record with the new boxId
      User.boxId = boxId;
      await User.save();

      // Save the box data to the boxModel
      await boxModel.create({
        email: email,
        boxId: boxId,
      });

      return res.json({
        success: true,
        message: "User setup successful, boxId generated",
        userdata: {
          email: User.email,
          boxId: User.boxId,
        },
      });
    } else {
      // Ensure the box entry exists in boxModel
      const existingBox = await boxModel.findOne({ email });
      if (!existingBox) {
        await boxModel.create({
          email: email,
          boxId: User.boxId, // Use the existing boxId from the user
        });
      }

      // If the user already has a boxId, proceed with login
      return res.json({
        success: true,
        message: "Login successful",
        userdata: {
          email: User.email,
          boxId: User.boxId,
        },
      });
    }

  } catch (err) {
    console.error(err);
    return res.json({ success: false, message: "An error occurred" });
  }
};



// 1. Set User Password
export const setUserPassword = async (req, res) => {
  const { boxId, password } = req.body;
  console.log("hiiiiii");
  
  

  try {
    // Find the box using the boxId
    const box = await boxModel.findOne({ boxId });
    if (!box) {
      // If no box is found, send a 404 response with an error message
      return res.status(404).json({ error: 'Box not found' });
    }
    console.log(box);

    // Set the new password
    box.userPassWord = password;

    // Save the updated box
    await box.save();

    // Send a success message back to the client
    return res.status(200).json({ message: 'User password set successfully' });
  } catch (error) {
    // If there is an error, send a 500 response with the error message
    console.error(error); // Log the error for debugging
    return res.status(500).json({ error: error.message });
  }
};

// export const delateBoxUser=async(req,res)=>{
//   const {email}=req.body.email;
//   try {
//     const boxUser = await boxModel.findOne({ email });
//     if(!boxUser){
//       return res.status(400).json({ success: false, message: "User doesn't exist" });
//     }
//     else{
//       await boxUser.remove();
//       return res.status(200).json({ success: true, message: "BoxUser Remove SuccessFully" });
//     }
//   }
//   catch(err){
//     console.error(err);
//   }

// }

// 2. Set Temporary Password
export const setTemporaryPassword = async (req, res) => {
  const { boxId, tempPassword } = req.body;  // Destructure from request body
  console.log(boxId);

  try {
    // Find the box using the boxId
    const box = await boxModel.findOne({ boxId });
    if (!box) {
      // If no box is found, send a 404 response with an error message
      return res.status(404).json({ error: 'Box not found' });
    }

    console.log(box);

    // Clear the existing temporary password before setting the new one
    box.temporaryPassword = null;  // Or set it to an empty string ''
    
    // Set the new temporary password
    box.temporaryPassword = tempPassword;

    // Save the updated box
    await box.save();

    // Send a success message back to the client
    return res.status(200).json({ message: 'Temporary password set successfully' });
  } catch (error) {
    // If there is an error, send a 500 response with the error message
    console.error(error); // Log the error for debugging
    return res.status(500).json({ error: error.message });
  }
};



// 3. Get User Password
export const unlockBox = async (req, res) => {
  const { boxId, code } = req.body;  // Get the boxId and password from the request body

  console.log(boxId, code);  // Debugging log
  
  try {
    // Find the box using the boxId
    const box = await boxModel.findOne({ boxId });
    console.log(box);  // Debugging log
    
    if (!box) {
      // If no box is found, send a 404 response with an error message
      return res.status(404).json({ error: 'Box not found' });
    }

    // Check if the provided password matches the user password or temporary password
    const isUserPasswordMatch = box.userPassWord && box.userPassWord === code;
    const isTempPasswordMatch = box.temporaryPassword && box.temporaryPassword === code;

    if (isUserPasswordMatch || isTempPasswordMatch) {
      // If the passwords match, open the box
      // Clear temporary password if it was used for unlocking
      if (isTempPasswordMatch) {
        box.temporaryPassword = null; // Clear the temporary password
        await box.save(); // Save the updated box
      }

      // Return a success response with a message that the box is unlocked
      return res.status(200).json({ success: true, message: 'Box opened successfully' });
    } else {
      // If neither password matches, return an error response
      return res.status(400).json({ error: 'Incorrect password' });
    }
  } catch (error) {
    // If there is an error, send a 500 response with the error message
    console.error('Error unlocking box:', error);  // Log the error for debugging
    return res.status(500).json({ error: error.message });
  }
};
