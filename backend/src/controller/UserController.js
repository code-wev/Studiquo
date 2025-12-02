import bcrypt from "bcrypt";
import User from "../models/user.model.js";

export const saveUser = async (req, res) => {
  try {
    const data = req.body;
    const email = data.email;

    const isExist = await User.findOne({ email: email });
    if (isExist) {
      res.status(401).json({ message: "User Already Exist" });
    }
    const hashPassword = await bcrypt.hash(data.password, 10);
    data.password = hashPassword;
    const newUser = new User(data);
    const saved = await newUser.save();

    res.status(200).json({
      data: saved,
      message: "Success",
    });
  } catch (error) {
    console.log(error, "sawa");
    res.status(500).json({
      error,
      message: error?.message,
    });
  }
};




export const login = async (req, res)=>{
    try {
        const data = req.body;
        const email = data.email;
        const password = data.password;
        const isExist = await User.findOne({email:email});
        if(!isExist){
            res.status(401).json({
                
                message: "User Not Found!"
            })
        };

        const compare = await bcrypt.compare(password, isExist.password);
        if(!compare){
            res.status(401).json({
                message:"Incorrect Password"
            })
        };

        res.status(200).json({
            message:"success",
            data: isExist
        })
        
    } catch (error) {
        res.status(500).json({
            error,
            message:error?.message
        })
    }
}