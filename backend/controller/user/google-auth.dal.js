const User = require("../../models/userModel");
const bcrypt = require('bcrypt');

const googleAuthDal = {
  registerWithGoogle: async (oauthUser) => {
    try {
      const isUserExists = await User.findOne({ email: oauthUser.emails[0].value });
      if (isUserExists) {
        return {
          failure: { message: 'User already registered.' },
        };
      }
      const placeholderPassword = await bcrypt.hash('GoogleOAuthPlaceholder', 10);

      const user = new User({
        name: oauthUser.displayName, 
        email: oauthUser.emails[0].value,
        password: placeholderPassword, 
        role: 'GENERAL', 
      });

      await user.save();
      return {
        success: { message: 'User registered successfully.' },
      };
    } catch (error) {
      return {
        failure: { message: error.message || 'Error during registration.' },
      };
    }
  },

  
  loginUser: async (oauthUser) => {
    try {
      const userExists = await User.findOne({ email: oauthUser.emails[0].value });
      if (userExists) {
        return {
          success: { message: 'User successfully logged in.' },
        };
      }

      return {
        failure: { message: 'Email not registered. You need to sign up first.' },
      };
    } catch (error) {
      return {
        failure: { message: error.message || 'Error during login.' },
      };
    }
  },
};

module.exports = googleAuthDal;