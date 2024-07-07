const { Organisation, User } = require('../models');
const { validationResult } = require('express-validator');

const getUserOrganisations = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.userId, {
            include: Organisation,
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({
            status: 'success',
            message: 'Organisations fetched successfully',
            data: {
                organisations: user.Organisations,
            },
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

const getOrganisation = async (req, res) => {
    try {
        const organisation = await Organisation.findByPk(req.params.orgId, {
            include: User,
        });

        if (!organisation) {
            return res.status(404).json({ message: 'Organisation not found' });
        }

        res.status(200).json({
            status: 'success',
            message: 'Organisation fetched successfully',
            data: organisation,
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

const createOrganisation = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    const { name, description } = req.body;

    try {
        const organisation = await Organisation.create({
            name,
            description,
        });

        await organisation.addUser(req.user.userId);

        res.status(201).json({
            status: 'success',
            message: 'Organisation created successfully',
            data: organisation,
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

const addUserToOrganisation = async (req, res) => {
    const { userId } = req.body;

    try {
        const organisation = await Organisation.findByPk(req.params.orgId);
        const user = await User.findByPk(userId);

        if (!organisation || !user) {
            return res.status(404).json({ message: 'Organisation or User not found' });
        }

        await organisation.addUser(user);

        res.status(200).json({
            status: 'success',
            message: 'User added to organisation successfully',
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

module.exports = {
    getUserOrganisations,
    getOrganisation,
    createOrganisation,
    addUserToOrganisation,
};
