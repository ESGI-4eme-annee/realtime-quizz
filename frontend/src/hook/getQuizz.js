const env = import.meta.env


const getQuizz = async (id) => {
    try {
        const result = await fetch(`http://${env.VITE_URL}:3000/quizz/info/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials : 'include',
           
        });

        let data = await result.json();
        console.log("data", data);

        return data;
    } catch (error) {
        console.error("Erreur lors de la recherche :", error);
        throw error;
    }
}


export default getQuizz;