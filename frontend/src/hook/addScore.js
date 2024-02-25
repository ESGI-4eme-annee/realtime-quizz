const env = import.meta.env

const addScore = async (userId, quizzId, quizzName, score) => {
    try {
        const result = await fetch(`${env.VITE_URL_BACK}/user/${userId}/addScore`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials : 'include',
            body: JSON.stringify({
                quizzId: quizzId,
                quizzName: quizzName,
                score: score
            })
        });

        return await result.json();
    } catch (error) {
        console.error("Une erreur est survenue lors de l'ajout du score", error);
        throw error;
    }
}

export default addScore;