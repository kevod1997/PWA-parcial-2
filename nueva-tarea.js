import { createTask } from "./utils/api.js";
import { showToast } from "./utils/toast.js";

const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
        titulo: document.getElementById('titulo').value,
        descripcion: document.getElementById('descripcion').value,
        estado: document.getElementById('estado').value,
        fechacreacion: new Date().toISOString(),
        fechaconclusion: ''
    };

    try {
        await createTask(formData);
        showToast('Tarea creada exitosamente');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 500);
    } catch {
        showToast('Error al crear la tarea', true);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('taskForm');
    const cancelButton = document.getElementById('cancelButton');

    form.addEventListener('submit', handleSubmit);
    cancelButton.addEventListener('click', () => {
        window.location.href = 'index.html';
    });
});