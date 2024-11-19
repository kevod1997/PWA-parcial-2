export const showToast = (message, isError = false) => {
    const existingToast = document.querySelector(".toast");
    if (existingToast) {
        existingToast.remove();
    }

    const toast = document.createElement("div");
    toast.className = `toast fixed bottom-4 right-4 px-6 py-3 rounded-md shadow-lg text-white ${
        isError ? "bg-red-500" : "bg-green-500"
    } z-50`;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3000);
};