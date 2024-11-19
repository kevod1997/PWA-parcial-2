export const API_URL = 'https://67029e2fbd7c8c1ccd3f5e49.mockapi.io/api/create-task';

export const fetchTasks = async () => {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("Error al cargar las tareas");
    return response.json();
};

export const fetchTaskById = async (taskId) => {
    const response = await fetch(`${API_URL}/${taskId}`);
    if (!response.ok) throw new Error("Error al obtener la tarea");
    return response.json();
};

export const createTask = async (taskData) => {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData)
    });
    if (!response.ok) throw new Error("Error al crear la tarea");
    return response.json();
};

export const updateTask = async (taskId, updateData) => {
    const response = await fetch(`${API_URL}/${taskId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData)
    });
    if (!response.ok) throw new Error("Error al actualizar la tarea");
    return response.json();
};

export const deleteTask = async (taskId) => {
    const response = await fetch(`${API_URL}/${taskId}`, {
        method: 'DELETE',
    });
    if (!response.ok) throw new Error("Error al eliminar la tarea");
    return response;
};