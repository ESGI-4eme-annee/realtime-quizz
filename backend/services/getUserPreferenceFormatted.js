const { FoodPreference } = require("../db/index");
const { getConnectedUser } = require("../services/userToken");

const getUserPreferenceFormatted = async (token) => {
    const userId = await getConnectedUser(token);
    
    if (userId) {
        const foodPreference = await FoodPreference.findAll({
            where: {
                user_id: userId,
            },
        });
        const arrayOffoodPreference = foodPreference.map((food) => food.name);

        let foodPreferenceFormatted = arrayOffoodPreference.join(", ");

        return `Voici mes restrictions alimentaires : ${foodPreferenceFormatted}. 
            C'est pourquoi si des recettes comportent un des ingrédients tu devras ABSOLUMENT éviter de prendre la recette.
        `;
    }

    return "";
}

module.exports = { getUserPreferenceFormatted };