const express = require('express');
const { body } = require('express-validator');
const {
    getUserOrganisations,
    getOrganisation,
    createOrganisation,
    addUserToOrganisation,
} = require('../controllers/organisationControllers');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.get('/', getUserOrganisations);
router.get('/:orgId', getOrganisation);
router.post(
    '/',
    [
        body('name').notEmpty().withMessage('Name is required'),
    ],
    createOrganisation
);
router.post('/:orgId/users', addUserToOrganisation);

module.exports = router;
