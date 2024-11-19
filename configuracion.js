import { showToast } from "./utils/toast.js";

class ConfigManager {
    constructor() {
        this.voices = [];
        this.initializeEventListeners();
        this.loadVoices();
        this.loadSavedConfig();
    }

    loadVoices() {
        this.voices = speechSynthesis.getVoices();
        if (this.voices.length === 0) {
            speechSynthesis.addEventListener('voiceschanged', () => {
                this.voices = speechSynthesis.getVoices();
                this.populateVoiceSelect();
            });
        } else {
            this.populateVoiceSelect();
        }
    }

    populateVoiceSelect() {
        const voiceSelect = document.getElementById('voiceSelect');
        voiceSelect.innerHTML = '';
        
        this.voices.forEach(voice => {
            const option = document.createElement('option');
            option.value = voice.name;
            option.textContent = `${voice.name} (${voice.lang})`;
            voiceSelect.appendChild(option);
        });
    }

    loadSavedConfig() {
        const savedConfig = localStorage.getItem('speechConfig');
        if (savedConfig) {
            const config = JSON.parse(savedConfig);
            document.getElementById('voiceSelect').value = config.voice || '';
            document.getElementById('rateRange').value = config.rate || 1;
            document.getElementById('currentRate').textContent = config.rate || 1;
        }
    }

    initializeEventListeners() {
        document.getElementById('backButton').addEventListener('click', () => {
            window.location.href = 'index.html';
        });

        document.getElementById('cancelButton').addEventListener('click', () => {
            window.location.href = 'index.html';
        });

        // Control de velocidad
        const rateRange = document.getElementById('rateRange');
        const currentRate = document.getElementById('currentRate');
        
        rateRange.addEventListener('input', (e) => {
            currentRate.textContent = e.target.value;
        });

        document.getElementById('saveButton').addEventListener('click', () => {
            const config = {
                voice: document.getElementById('voiceSelect').value,
                rate: parseFloat(document.getElementById('rateRange').value)
            };

            localStorage.setItem('speechConfig', JSON.stringify(config));
            showToast('Configuración guardada exitosamente');
            
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 500);
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ConfigManager();
});