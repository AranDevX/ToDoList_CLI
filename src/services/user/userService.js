const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

// Hash the password before saving the user
const hashPassword = async (password) => {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
};

// Check if a user exists by username
const userExists = async (username) => {
    const existingUser = await prisma.users.findUnique({
        where: { username }
    });

    return !!existingUser; // Returns true if user exists, otherwise false
};

// Create a user with a hashed password
const createUser = async (username, password) => {
    const userAlreadyExists = await userExists(username);

    if (userAlreadyExists) {
        throw new Error('Username is already taken.');
    }

    const hashedPassword = await hashPassword(password);
    return await prisma.users.create({
        data: {
            username,
            password: hashedPassword
        }
    });
};

module.exports = {
    createUser,
    userExists
};
