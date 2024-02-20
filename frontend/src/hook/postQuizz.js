const env = import.meta.env


const postQuizz = async (data) => {
    try {
        const result = await fetch(`http://${env.VITE_URL}:3000/quizz`, {
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