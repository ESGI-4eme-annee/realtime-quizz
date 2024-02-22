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

        let data = await result.json();

        return data;
    } catch (error) {
        console.error("Erreur lors de la recherche :", error);
        throw error;
    }
}


export default getQuizz;