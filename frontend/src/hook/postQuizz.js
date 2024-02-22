const env = import.meta.env


const postQuizz = async (data) => {
    try {
        const result = await fetch(`${env.VITE_URL_BACK}/quizz`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials : 'include',
            body: JSON.stringify({
                "quizz":data
              })
        });

        return await result.json();
    } catch (error) {
        console.error("Erreur lors de la recherche :", error);
        throw error;
    }
}


export default postQuizz;