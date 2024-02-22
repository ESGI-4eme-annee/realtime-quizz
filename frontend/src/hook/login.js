const env = import.meta.env


const register = async (data) => {
    try {
        const result = await fetch(`${env.VITE_URL_BACK}/user/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
                email: data.email,
                password: data.password,
            })
        });

        return await result.json();
    } catch (error) {
        console.error("Erreur lors de la recherche :", error);
        throw error;
    }
}


export default register;