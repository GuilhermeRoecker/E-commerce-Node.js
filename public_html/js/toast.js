class ToastNotification {
    constructor(options = {}) {
        // Opções padrão
        this.options = {
            position: options.position || 'top-right',
            duration: options.duration || 5000,
            maxToasts: options.maxToasts || 5
        };

        // Container principal para as notificações
        this.container = null;

        // Inicializar o sistema de notificações
        this.init();
    }

    init() {
        // Criar container principal se ele não existir
        if (!this.container) {
            this.container = document.createElement('div');
            this.container.id = 'toast-container';

            // Definir posição das notificações
            const positionClass = this.getPositionClass();
            this.container.className = `toast-container ${positionClass}`;

            // Estilização do container
            Object.assign(this.container.style, {
                position: 'fixed',
                zIndex: '9999',
                display: 'flex',
                flexDirection: 'column',
                maxWidth: '300px'
            });

            // Adicionar o container ao corpo do documento
            document.body.appendChild(this.container);
        }

        // Adicionar estilos globais ao documento
        this.addStyles();
    }

    getPositionClass() {
        // Definir as propriedades CSS baseadas na posição escolhida
        switch (this.options.position) {
            case 'top-left':
                Object.assign(this.container.style, {
                    top: '20px',
                    left: '20px'
                });
                return 'top-left';
            case 'top-center':
                Object.assign(this.container.style, {
                    top: '20px',
                    left: '50%',
                    transform: 'translateX(-50%)'
                });
                return 'top-center';
            case 'bottom-left':
                Object.assign(this.container.style, {
                    bottom: '20px',
                    left: '20px'
                });
                return 'bottom-left';
            case 'bottom-center':
                Object.assign(this.container.style, {
                    bottom: '20px',
                    left: '50%',
                    transform: 'translateX(-50%)'
                });
                return 'bottom-center';
            case 'bottom-right':
                Object.assign(this.container.style, {
                    bottom: '20px',
                    right: '20px'
                });
                return 'bottom-right';
            case 'top-right':
            default:
                Object.assign(this.container.style, {
                    top: '20px',
                    right: '20px'
                });
                return 'top-right';
        }
    }

    addStyles() {
        // Verificar se os estilos já existem
        if (document.getElementById('toast-styles')) {
            return;
        }

        // Criar estilos CSS para as notificações
        const style = document.createElement('style');
        style.id = 'toast-styles';
        style.textContent = `
      .toast {
        padding: 12px 16px;
        margin-bottom: 10px;
        border-radius: 4px;
        color: #fff;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        display: flex;
        align-items: center;
        justify-content: space-between;
        transition: all 0.3s ease;
        opacity: 0;
        transform: translateY(-20px);
      }
      
      .toast-content {
        flex-grow: 1;
        margin-right: 8px;
      }
      
      .toast-close {
        background: none;
        border: none;
        color: #fff;
        font-size: 16px;
        cursor: pointer;
        opacity: 0.7;
        transition: opacity 0.2s;
      }
      
      .toast-close:hover {
        opacity: 1;
      }
      
      .toast-success {
        background-color: #4caf50;
      }
      
      .toast-error {
        background-color: #f44336;
      }
      
      .toast-info {
        background-color: #2196f3;
      }
      
      .toast-warning {
        background-color: #ff9800;
      }
      
      .toast-show {
        opacity: 1;
        transform: translateY(0);
      }
      
      .toast-hide {
        opacity: 0;
        transform: translateY(-20px);
      }
    `;

        document.head.appendChild(style);
    }

    show(message, type = 'info') {
        // Verificar se o container existe
        if (!this.container) {
            this.init();
        }

        // Garantir que não ultrapasse o número máximo de toasts
        const existingToasts = this.container.querySelectorAll('.toast');
        if (existingToasts.length >= this.options.maxToasts) {
            this.container.removeChild(existingToasts[0]);
        }

        // Criar o elemento toast
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;

        // Criar o conteúdo do toast
        const content = document.createElement('div');
        content.className = 'toast-content';
        content.textContent = message;
        toast.appendChild(content);

        // Adicionar botão de fechar
        const closeBtn = document.createElement('button');
        closeBtn.className = 'toast-close';
        closeBtn.innerHTML = '&times;';
        closeBtn.addEventListener('click', () => this.close(toast));
        toast.appendChild(closeBtn);

        // Adicionar o toast ao container
        this.container.appendChild(toast);

        // Mostrar o toast com uma pequena animação
        setTimeout(() => {
            toast.classList.add('toast-show');
        }, 10);

        // Configurar a remoção automática após o tempo definido
        const duration = this.options.duration;
        if (duration > 0) {
            setTimeout(() => {
                this.close(toast);
            }, duration);
        }

        return toast;
    }

    close(toast) {
        // Adicionar classe para animar a saída
        toast.classList.add('toast-hide');
        toast.classList.remove('toast-show');

        // Remover o elemento após a animação de saída
        setTimeout(() => {
            if (toast.parentNode === this.container) {
                this.container.removeChild(toast);
            }
        }, 300);
    }

    // Métodos de conveniência para diferentes tipos de notificações
    success(message) {
        return this.show(message, 'success');
    }

    error(message) {
        return this.show(message, 'error');
    }

    info(message) {
        return this.show(message, 'info');
    }

    warning(message) {
        return this.show(message, 'warning');
    }
}

// Exportar a classe para uso
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ToastNotification;
}