const User = require('./User');
const Organisation = require('./Organisation');

// Associations
User.belongsToMany(Organisation, { through: 'UserOrganisations' });
Organisation.belongsToMany(User, { through: 'UserOrganisations' });

module.exports = { User, Organisation };
