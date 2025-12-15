export default function Modal({ open, onClose, title, children }) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-lg shadow-lg w-11/12 md:w-2/3 lg:w-1/2 p-6">

                {title && (
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold">{title}</h3>
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-800 font-bold text-lg"
                        >
                            &times;
                        </button>
                    </div>
                )}


                <div>{children}</div>
            </div>
        </div>
    );
}
