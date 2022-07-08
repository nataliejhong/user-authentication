const User = require('../model/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const jwtSecret = 'e83569abfff49a75cdc80f17546beb765bec613fb7f9eb88b9377e432c708b1f6250e2'

exports.register = async (req, res, next) => {
    const { username, password } = req.body;
    if (password.length < 6) {
        return res.status(400).json({ message: "Password less than 6 characters" });
    }
    bcrypt.hash(password, 10).then(async (hash) => {
        await User.create({
        username,
        password: hash,
    })
        .then((user) => {
            const maxAge = 3 * 60 * 60;
            const token = jwt.sign(
            { 
                id: user._id, 
                username, 
                role: user.role },
            jwtSecret,
            {
              expiresIn: maxAge, // 3hrs
            }
        );
            res.cookie("jwt", token, {
                httpOnly: true,
                maxAge: maxAge * 1000,
        });
            res.status(201).json({
                message: "User successfully created",
                user: user._id,
                role: user.role,
            });
        })
        .catch((error) =>
            res.status(400).json({
                message: "User not successfully created",
                error: error.message,
            })
        );
    });
};

exports.login = async (req, res, next) => {
    const { username, password } = req.body;

    // Check if username and password is provided
    if (!username || !password) {
        return res.status(400).json({
            message: "Username or Password is empty",
        });
    }

    try {
        const user = await User.findOne({ username });

        if (!user) {
            res.status(400).json({
            message: "Login not successful",
            error: "User not found",
        });
    } else {
        // comparing given password with hashed password
        bcrypt.compare(password, user.password).then(function (result) {
            if (result) {
                const maxAge = 3 * 60 * 60;
                const token = jwt.sign(
                {   id: user._id, 
                    username,
                    role: user.role 
                },
                    jwtSecret,
                {
                    expiresIn: maxAge, // 3hrs in sec
                }
            );
            res.cookie("jwt", token, {
                httpOnly: true,
                maxAge: maxAge * 1000, // 3hrs in ms
            });
            res.status(201).json({
                message: "User successfully Logged in",
                user: user._id,
                role: user.role,
            });
        } else {
            res.status(400).json({ message: "Invalid Login" });
        }
        });
    }
    } catch (error) {
        res.status(400).json({
        message: "An error occurred? I dunno",
        error: error.message,
        });
    }
};

exports.update = async (req, res, next) => {
    const { role, id } = req.body;
    // Verifying if role and id is presnt
    if (role && id) {
      // Verifying if the value of role is admin
    if (role === "admin") {
        // Finds the user with the id
        await User.findById(id)
        .then((user) => {
            // Verifies the user is not an admin
            if (user.role !== "admin") {
                user.role = role;
                user.save((err) => {
                //Monogodb error checker
                if (err) {
                    return res
                    .status("400")
                    .json({ message: "An error occurred", error: err.message });
                process.exit(1);
                }
                res.status("201").json({ message: "update successful", user });
            });
            } else {
            res.status(400).json({ message: "User is already an Admin" });
            }
        })
        .catch((error) => {
            res
            .status(400)
            .json({ message: "An error occurred", error: error.message });
        });
    } else {
        res.status(400).json({
        message: "Role is not admin",
        });
    }
    } else {
    res.status(400).json({ message: "Role or ID is missing" });
    }
};

exports.deleteUser = async (req, res, next) => {
    const {id} = req.body
    await User.findById(id)
        .then(user => user.remove())
        .then(user => 
            res.status(201).json({message: "user deleted", user})
        )
        .catch(error =>
            res
                .status(400)
                .json({message: "an error occurred", error: error.message})
            )
}

exports.getUsers = async (req, res, next) => {
    await User.find({})
        .then(user => {
            const userFunction = users.map(user => {
                const container = {}
                container.username = user.username
                container.role = user.role
                container.id = user._id
                return container
            })
            res.status(200).json({user: userFunction})
        })
        .catch(err => {
            res.status(401).json({ message: "Not successful", error: err.message })
        })
}