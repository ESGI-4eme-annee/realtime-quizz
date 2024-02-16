const { User } = require("../db");

module.exports = function UserService() {
  return {
    update: async (filters, newData) => {
      if (newData.length !== 2 && newData.email == undefined && newData.website == undefined) 
        return res.status(400).json({ error: "Mauvaise requête" });

      try {
        
        const [nbUpdated, users] = await User.update(newData, {
          where: filters,
          returning: true,
          individualHooks: true,
        });

        return users;
      } catch (e) {
        throw e;
      }
    },
    delete: async (filters) => {
      return User.destroy({ where: filters });
    },
    login: async (email, password) => {
      const user = await User.findOne({ where: { email } });
      if (!user) {
        throw new Error("Invalid credentials");
      }
      const isPasswordValid = await user.isPasswordValid(password);
      if (!isPasswordValid) {
        throw new Error("Invalid credentials");
      }

      return user;
    },
  };
};
