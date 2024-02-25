import { useEffect, useState } from 'react';
import getHistory from "../../hook/getHistory.js";
import {accountService} from "../../services/account.service.js";

export default function HistoryPage({ isLogged }) {
    const [history, setHistory] = useState([]);

    useEffect(() => {
        if (isLogged) {
            const user = accountService.getValuesToken();
            getHistory(user.userId)
                .then((res) => {
                    setHistory(res);
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    }, []);
    return (
        <>
            {
                isLogged ? (
                    <>
                        {
                            history.length === 0 ? (
                                <h1 className="text-center mt-4">Aucun historique</h1>
                            ) : <div className="flex flex-col items-center gap-2 p-4">
                                <h1>Historique des scores</h1>
                                <table className="table w-3/4">
                                    <thead>
                                    <tr>
                                        <th>Quizz</th>
                                        <th>Score</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {
                                        history.map((item, index) => {
                                            return (
                                                <tr key={index}>
                                                    <td>{item.quizzName}</td>
                                                    <td>{item.score}</td>
                                                </tr>
                                            )
                                        })
                                    }
                                    </tbody>
                                </table>
                            </div>
                        }
                    </>
                ) : null
            }
        </>
    )
}