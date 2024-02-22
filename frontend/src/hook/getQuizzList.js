const env = import.meta.env


const getQuizzList = async () => {
    try {
        const result = await fetch(`${env.VITE_URL_BACK}/quizz/list`, {
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


export default getQuizzList;