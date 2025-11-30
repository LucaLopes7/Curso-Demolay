document.addEventListener('DOMContentLoaded', () => {
    // 1. SCROLL SUAVE PARA LINKS DE NAVEGAÇÃO
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // 2. EFEITO NA HEADER (OPCIONAL: Mudar cor/sombra ao rolar)
    const header = document.getElementById('main-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            // Adiciona uma classe para dar mais destaque/sombra à header ao rolar para baixo
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    // Adicione a regra CSS para a classe .scrolled (Ex: box-shadow: 0 2px 10px rgba(0,0,0,0.5);)
});