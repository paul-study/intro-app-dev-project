import userRepository from "../repositories/user.js"

const createUser = async (req, res) => {
    try {
        const {firstName, lastName, emailAddress} = req.body;
        await userRepository.create({firstName, lastName, emailAddress});
        const users = await userRepository.findAll();
        return res.status(201).json({
            message: "User successfully created",
            data: users,
        })
    } catch (err) {
        return res.status(500).json({message: err.message})
    }
};

const getUsers = async (req, res) => {
    try {
        const users =  await userRepository.findAll();
        if (users.length === 0) {
            return res.status(404).json({ message: "No users found"});
        }
        return res.status(200).json({data: users});
    } catch (err) {
        return res.status(500).json({ message: err.message})
    }
}

const getUser = async (req, res) => {
    try {
        const {id} = req.params;
        const user = await userRepository.findById(id);
        if (!user) {
            return res.status(404).json({
                message: `No user with the id: ${id} found`
            })
        }
        return res.status(200).json({ data: user});
    } catch (err) {
        return res.status(500).json({message: err.message})
    }
}

const updateUser = async (req,res) => {
    try {
        const {id} = req.params;
        const {firstName, lastName, emailAddress} = req.body;
        let user = await userRepository.findById(id);
        if (!user) {
            return res.status(404).json({
                message: `No user with the id: ${id} found`
            })
        }
        user = await userRepository.update(id, {
            firstName,
            lastName,
            emailAddress
        });
        return res.status(200).json({
            message: `User with id: ${id} successsfully updated`,
            data: user,
        });
    } catch (err) {
        return res.status(500).json({message: err.message})
    }
}

const deleteUser = async (req,res) => {
    try {
        const {id} = req.params;
        const user =  await userRepository.findById(id);
        if (!user) {
            return res.status(404).json({
                message: `No user with the id: ${id} found`
            })
        }
        await userRepository.delete(id);
        return res.status(200).json({
            message: `User with id: ${id} successsfully deleted`,
        });
    } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

export {
    createUser,
    getUsers,
    getUser,
    updateUser,
    deleteUser
}