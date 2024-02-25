const env = import.meta.env

const updateScores = async (userId, score) => {
    try {
        const result = await fetch(`${env.VITE_URL_BACK}/user/${userId}/setScore`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            credentials : 'include',
            body: JSON.stringify({
                "score": score
            })
        });

        return await result;
    } catch (error) {
        console.error("Erreur lors de la recherche :", error);
        throw error;
    }
}

export default updateScores;