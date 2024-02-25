const env = import.meta.env

const getHistory = async (id) => {
    try {
        const result = await fetch(`${env.VITE_URL_BACK}/user/history/${id}`, {
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


export default getHistory;