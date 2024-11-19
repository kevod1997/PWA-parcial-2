import { fetchTaskById, updateTask } from './utils/api.js';
import { showToast } from './utils/toast.js';

class TaskStatusManager {
    constructor() {
        this.taskId = new URLSearchParams(window.location.search).get('id');
        this.currentStatus = null; 
        this.initializeEventListeners();
        this.loadTaskData();
    }

    async loadTaskData() {
        try {
            const task = await fetchTaskById(this.taskId);
            
            document.getElementById('taskTitle').textContent = task.titulo;
            document.getElementById('taskDescription').textContent = task.descripcion;
            document.getElementById('taskDate').textContent = new Date(task.fechacreacion).toLocaleString();
            
            this.currentStatus = task.estado;
            const statusSelect = document.getElementById('taskStatus');
            statusSelect.value = task.estado;
            
            document.getElementById('saveButton').disabled = true;
            document.getElementById('saveButton').classList.add('opacity-50', 'cursor-not-allowed');

        } catch (error) {
            showToast('Error al cargar la tarea', true);
        }
    }

    initializeEventListeners() {
        document.getElementById('backButton').addEventListener('click', () => {
            window.location.href = 'index.html';
        });

        document.getElementById('cancelButton').addEventListener('click', () => {
            window.location.href = 'index.html';
        });

        document.getElementById('saveButton').addEventListener('click', () => this.saveTaskStatus());

        // Agregar listener para el cambio de estado
        document.getElementById('taskStatus').addEventListener('change', (e) => {
            const saveButton = document.getElementById('saveButton');
            const hasChanged = e.target.value !== this.currentStatus;
            
            // Habilitar/deshabilitar botón según si hubo cambios
            saveButton.disabled = !hasChanged;
            if (hasChanged) {
                saveButton.classList.remove('opacity-50', 'cursor-not-allowed');
            } else {
                saveButton.classList.add('opacity-50', 'cursor-not-allowed');
            }
        });
    }

    async saveTaskStatus() {
        const newStatus = document.getElementById('taskStatus').value;
        
        if (newStatus === this.currentStatus) {
            showToast('No hay cambios para guardar', true);
            return;
        }

        const updateData = {
            estado: newStatus,
            fechaconclusion: newStatus === 'finalizado' ? new Date().toISOString() : ''
        };

        try {
            await updateTask(this.taskId, updateData);
            showToast('Estado actualizado exitosamente');
            
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 500);
        } catch (error) {
            showToast('Error al actualizar el estado', true);
        }
    }
}

// Inicializar cuando el documento esté listo
document.addEventListener('DOMContentLoaded', () => {
    new TaskStatusManager();
});