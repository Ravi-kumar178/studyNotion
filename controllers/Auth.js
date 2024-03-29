const User = require("../models/User");
const OTP = require("../models/OTP");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const Profile = require("../models/Profile");
const jwt = require("jsonwebtoken");

//otp generate
exports.sendOTP = async(req,res) => {
    try{
        
        //fetch email from req body
        const{email} = req.body;
        //check if email is inserted 
        if(!email){
            return res.status(401).json({
                success: false,
                message: "Please enter the email for validation purpose"
            })
        };
        //check if the user is already registered
        const alreadyExisting = await User.findOne({email});
        if(alreadyExisting){
            return res.status(401).json({
                success:false,
                message:"User is already registered"
            })
        };
        //generate otp
        const otpGenerated = otpGenerator.generate(6,{
             upperCaseAlphabets: false,
             lowerCaseAlphabets: false,
             specialChars: false
        });
        //check if the otp generated is same as previous
        const result = await OTP.findOne({otp : otpGenerated });
        while(result){
            otpGenerated = otpGenerator.generate(6,{
                upperCaseAlphabets: false,
                lowerCaseAlphabets: false,
                specialChars: false
            });
            result = await OTP.findOne({otp : otpGenerated});
        }
        //save the email and otp in db
        const otpSave = await OTP.create({email,otp:otpGenerated});
        console.log("OTP document: ", otpSave);
        //return success
        return res.status(200).json({
            success: true,
            message: "OTP generated for verification"
        });
    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            success: false,
            message : "Server Error while sending otp"
        })
    }
}

//signup
exports.signUp = async(req,res) => {
    try{

        //extract data from request body
        const{firstName, lastName, email , password, confirmPassword, contactNumber, accountType , otp} = req.body;
        //check if all the data is inserted properly
        if(!firstName || !lastName || !email || !password || !confirmPassword || !contactNumber){
            return res.status(401).json({
                success: false,
                message: "Please enter all the blanks carefully"
            })
        };
        //check the create password and confirm password

        if(password !== confirmPassword){
            return res.status(401).json({
                success: false,
                message: "Error!! Please keep the create password and confirm password same"
            })
        }

        //check if the user already exist

        const alreadyExisting = await User.findOne({email});
        if(alreadyExisting){
            return res.status(402).json({
                success:false,
                message:"User already Exists"
            })
        };

        //find the latest sent otp

        const recentOtp = await OTP.find({email}).sort({createdAt:-1}).limit(1);
        console.log("Recent otp: ",recentOtp);

        //validate otp -> if latest sent otp length == 0 || recentOtp.otp !== otp

        if(recentOtp.length == 0){
            return res.status(401).json({
                success: false,
                message:"No OTP is present in the document"
            });
        }
        if(recentOtp.otp !== otp){
            return res.status(402).json({
                success: false,
                message:"Enter the valid otp"
            })
        }
        //hash password
        let hashPassword = await bcrypt.hash(password,10);
        //profile details
        const profileDetails = await Profile.create({
            profession: null,
            gender: null,
            dateOfBirth: null,
            about:null,
            phoneNumber:null
        });
        //save the data in db
        const userSave = await User.create({
            firstName,
            lastName,
            email,
            phoneNumber:contactNumber,
            password:hashPassword,
            accountType,
            additionalDetails: profileDetails,
            image:`https://api.dicebear.com/5.x/initials/svg?seed=${firstName}${lastName}`
        })
        //return res
        return res.status(200).json({
            success: true,
            message:"User registered successfully",
            userSave
        })
    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Server Error while registering the account"
        })
    }
}

//login

exports.logIn = async(req,res) => {
    try{
        //fetch data

        const {email, password} = req.body;

        //check if all the data is inserted properly

        if(!email || !password){
            return res.status(402).json({
                success: false,
                message:"Please enter all the blanks carefully"
            })
        };

        //check if user already exist

        const user = await User.findOne({email});
        if(!user){
            return res.status(402).json({
                success: false,
                message:"Please Register the account"
            })
        }

        //check if password matching bcrypt.compare(password,user.password) and create payload and jwt

        if(await bcrypt.compare(password, user.password)){
            const payload = {
                email,
                id: user._id,
                accountType : user.accountType
            };

            const token = jwt.sign(payload,
                                   process.env.JWT_SECRET,
                                   {
                                    expiresIn: Date.now()+3*24*60*60*1000
                                   }
                                  );

            user = user.toObject;
            user.token = token;
            
            //create a cookie and send response
            const options = {
                expiresIn: Date.now() + 3*24*60*60*1000,
                httpOnly: true
            }
            return res.cookie("token",token,options).status(200).json({
                success: true,
                message:"User Login Successfully",
                token,
                user
            });
        }
        else{
            return res.status(402).json({
                success: false,
                message:"Please enter a valid password"
            })
        }

        //return res
    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            success: false,
            message:"Error on server side while login"
        })
    }
}