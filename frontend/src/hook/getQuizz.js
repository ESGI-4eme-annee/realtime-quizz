const env = import.meta.env


const getQuizz = async (id) => {
    try {
        const result = await fetch(`${env.VITE_URL_BACK}/quizz/info/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials : 'include',
        });

        return await result.json();
    } catch (error) {
        console.error("Erreur lors de la recherche :", error);
        throw error;
    }
}


export default getQuizz;