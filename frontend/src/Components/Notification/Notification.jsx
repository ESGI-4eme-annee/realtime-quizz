export default function Notification({isVisible = false, notification}) {
    return (
        <>
            {
                isVisible && <div role="alert" className="alert shadow-lg fixed bottom-4 left-4 w-96">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                         className="stroke-info shrink-0 w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <div>
                        <h3 className="font-bold">{notification.title}</h3>
                        <div className="text-xs">{notification.message}</div>
                    </div>
                </div>
            }
        </>
    )
}