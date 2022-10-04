import UserModel from "../Models/userModel.js";
import bcrypt from 'bcrypt';


//register a new user
export const registerUser = async (req, res) => {
    const { username, password, firstName, lastName } = req.body;

    const salt = await bcrypt.genSalt(10)

    const hashedPassword = await bcrypt.hash(password, salt)

    const newUser = new UserModel({ username, password: hashedPassword, firstName, lastName })
    
    try {
        await newUser.save();
        res.status(200).json(newUser);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

//login user

export const loginUser = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await UserModel.findOne({ username : username });
        if (user) {
            const validity = await bcrypt.compare(password, user.password)
            validity ? res.status(200).json(user) : res.status(400).json("Wrong Password")
        } else {
            res.status(404).json("User does not exist")
        }
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}