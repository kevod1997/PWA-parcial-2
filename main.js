import { fetchTasks, deleteTask } from './utils/api.js';
import { showToast } from './utils/toast.js';

// Función para crear una card individual
const createTaskCard = (task) => {
  const card = document.createElement("div");
  card.className = `bg-white rounded-lg shadow-md p-4 flex justify-between items-center 
                       ${task.estado === "finalizado" ? "opacity-60" : ""}`;

  const textContent = document.createElement("div");
  textContent.className = "flex-1";

  const title = document.createElement("h3");
  title.className = `text-lg font-semibold mb-1 
                        ${
                          task.estado === "finalizado"
                            ? "text-gray-500"
                            : "text-gray-800"
                        }`;
  title.textContent = task.titulo;

  const description = document.createElement("p");
  description.className = `text-sm text-gray-600 mb-2
                              ${
                                task.estado === "finalizado"
                                  ? "line-through"
                                  : ""
                              }`;
  description.textContent = task.descripcion;

  const date = document.createElement("p");
  date.className = "text-sm text-gray-600";
  const taskDate = new Date(task.fechacreacion);
  date.textContent = taskDate.toLocaleString();

  // Agregar los elementos al textContent en el orden correcto
  textContent.appendChild(title);
  textContent.appendChild(description);
  textContent.appendChild(date);

  // Contenedor para los botones de acción
  const actionsContainer = document.createElement("div");
  actionsContainer.className = "flex items-center space-x-3";

  // Botón de editar estado
  const editButton = document.createElement("button");
  editButton.className =
    "p-2 text-gray-500 hover:text-gray-700 transition-colors";
  editButton.innerHTML = `
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z">
            </path>
        </svg>`;
  editButton.addEventListener("click", () => {
    window.location.href = `cambiar-estado.html?id=${task.id}`;
  });

  // Botón de eliminar
  const deleteButton = document.createElement("button");
  deleteButton.className =
    "p-2 text-gray-500 hover:text-red-700 transition-colors";
  deleteButton.innerHTML = `
    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16">
        </path>
    </svg>`;
  deleteButton.addEventListener("click", () => {
    showDeleteModal(task);
  });

  // Contenedor para el ícono de estado/botón play
  if (task.estado === "finalizado") {
    const checkIcon = document.createElement("div");
    checkIcon.innerHTML = `
            <svg class="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>`;
    // Agregar botones en orden
    actionsContainer.appendChild(editButton);
    actionsContainer.appendChild(deleteButton);
    actionsContainer.appendChild(checkIcon);
  } else {
    const playButton = document.createElement("button");
    playButton.className =
      "play-button w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors";
    playButton.innerHTML = `
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z">
              </path>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z">
              </path>
          </svg>`;
    playButton.addEventListener("click", (e) => {
      e.stopPropagation();
      speakTask(task);
    });
    // Agregar botones en orden
    actionsContainer.appendChild(editButton);
    actionsContainer.appendChild(deleteButton);
    actionsContainer.appendChild(playButton);
  }

  card.appendChild(textContent);
  card.appendChild(actionsContainer);

  return card;
};

// Función para reproducir el audio
const speakTask = (task) => {
  const savedConfig = localStorage.getItem("speechConfig");
  let config = { voice: "", rate: 1 };

  if (savedConfig) {
    config = JSON.parse(savedConfig);
  }

  const message = new SpeechSynthesisUtterance();
  message.text = `${task.titulo}. ${task.descripcion}`;
  message.rate = config.rate;

  const voices = speechSynthesis.getVoices();
  const selectedVoice = voices.find((voice) => voice.name === config.voice);
  if (selectedVoice) {
    message.voice = selectedVoice;
  }

  speechSynthesis.speak(message);
};

// Función para mostrar el modal de eliminación
const showDeleteModal = (task) => {
  const modal = document.getElementById("deleteModal");
  const taskTitle = document.getElementById("deleteTaskTitle");
  const confirmButton = document.getElementById("confirmDelete");
  const cancelButton = document.getElementById("cancelDelete");

  taskTitle.textContent = task.titulo;
  modal.classList.remove("hidden");

  const closeModal = () => {
    modal.classList.add("hidden");
  };

  const handleModalClick = (e) => {
    if (e.target === modal) {
      closeModal();
    }
  };

  // Agregar event listeners
  modal.addEventListener("click", handleModalClick);

  // Manejar el clic en cancelar
  cancelButton.onclick = () => {
    closeModal();
    cleanup();
  };

  // Manejar el clic en confirmar
  confirmButton.onclick = async () => {
    await deleteTaskHandler(task.id);
    closeModal();
    cleanup();
  };

  // Función para limpiar event listeners
  const cleanup = () => {
    modal.removeEventListener("click", handleModalClick);
    document.removeEventListener("keydown", handleEscapeKey);
  };
};

// Función para eliminar la tarea
const deleteTaskHandler = async (taskId) => {
    try {
        await deleteTask(taskId);
        showToast("Tarea eliminada exitosamente");
        loadTasks();
    } catch (error) {
        showToast("Error al eliminar la tarea", true);
    }
};

// Función para ordenar las tareas
const sortTasks = (tasks) => {
  const pendientes = tasks.filter((task) => task.estado !== "finalizado");
  const finalizadas = tasks.filter((task) => task.estado === "finalizado");

  const sortByDate = (a, b) =>
    new Date(b.fechacreacion) - new Date(a.fechacreacion);

  return [...pendientes.sort(sortByDate), ...finalizadas.sort(sortByDate)];
};

// Función para cargar y mostrar las tareas
const loadTasks = async () => {
    try {
        const tasks = await fetchTasks();
        const sortedTasks = sortTasks(tasks);
  
        const container = document.getElementById("tasks-container");
        container.innerHTML = ""; 
  
        sortedTasks.forEach((task) => {
            const cardElement = createTaskCard(task);
            container.appendChild(cardElement);
        });
    } catch (error) {
        showToast("Error al cargar las tareas", true);
    }
};

  
  // Manejar el menú hamburguesa
  const initMobileMenu = () => {
    const btn = document.querySelector("button.mobile-menu-button");
    const menu = document.querySelector(".mobile-menu");
  
    if (btn && menu) {
      btn.addEventListener("click", () => {
        menu.classList.toggle("hidden");
      });
  
      document.addEventListener("click", (e) => {
        if (!btn.contains(e.target) && !menu.contains(e.target) && !menu.classList.contains("hidden")) {
          menu.classList.add("hidden");
        }
      });
    }
  };
  
  document.addEventListener("DOMContentLoaded", () => {
    loadTasks();
    initMobileMenu();
  });