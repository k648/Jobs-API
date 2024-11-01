
const User = require('../model/User')

const authorizeUser = (...requiredRoles) => {

  return async (req, res, next) => {

    try {
      // Assuming `req.user` is populated by previous middleware (e.g., authentication)
      const userId = req.user.userId;
      
      if (!userId) {
        
        return res.status(401).send('Unauthorized: User ID is missing');
      }

      // Fetch the user's role from the database
      const user = await User.findById(userId).select('role'); // Assuming the role field is in the user model

      if (!user) {
        return res.status(404).send('User not found');
      }

      const userRole = user.role; // The role retrieved from the database

      // Check if the user's role is included in the list of required roles
      if (!requiredRoles.includes(userRole)) {
        return res.status(403).send('Access Denied: Insufficient permission ');
      }

      // If role is authorized, proceed to the route
      next();

    } catch (error) {
      // Handle errors (e.g., database errors)
      console.error('Authorization error:', error);
      res.status(500).send('Internal Server Error');
    }
  };
};




module.exports  =  authorizeUser