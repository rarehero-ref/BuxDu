document.addEventListener('DOMContentLoaded', () => {

    // --- MA'LUMOTLAR BAZASI ---
    // BU YERGA YANGI YO'NALISHLAR VA BALLARNI QO'SHISHINGIZ MUMKIN
    // 2024-2025 uchun hozircha 2023-2024 ma'lumotlari nusxalandi.
    const majorsData = [
        {
            name: "Dasturiy injiniring",
            scores: {
                '2023-2024': { kunduzgi: 140.7, sirtqi: 121.8, masofaviy: null, kechki: null },
                '2024-2025': { kunduzgi: 140.7, sirtqi: 121.8, masofaviy: null, kechki: null }
            }
        },
        {
            name: "Kompyuter injiniringi",
            scores: {
                '2023-2024': { kunduzgi: 135.5, sirtqi: null, masofaviy: null, kechki: null },
                '2024-2025': { kunduzgi: 135.5, sirtqi: null, masofaviy: null, kechki: null }
            }
        },
        {
            name: "Axborot xavfsizligi",
            scores: {
                '2023-2024': { kunduzgi: 130.2, sirtqi: null, masofaviy: null, kechki: null },
                '2024-2025': { kunduzgi: 130.2, sirtqi: null, masofaviy: null, kechki: null }
            }
        },
        {
            name: "Iqtisodiyot",
            scores: {
                '2023-2024': { kunduzgi: 138.6, sirtqi: 105.1, masofaviy: 98.7, kechki: null },
                '2024-2025': { kunduzgi: 138.6, sirtqi: 105.1, masofaviy: 98.7, kechki: null }
            }
        },
        {
            name: "Moliya va moliyaviy texnologiyalar",
            scores: {
                '2023-2024': { kunduzgi: 133.4, sirtqi: 90.3, masofaviy: null, kechki: null },
                '2024-2025': { kunduzgi: 133.4, sirtqi: 90.3, masofaviy: null, kechki: null }
            }
        },
        {
            name: "Ingliz tili va adabiyoti",
            scores: {
                '2023-2024': { kunduzgi: 155.4, sirtqi: null, masofaviy: null, kechki: 126.0 },
                '2024-2025': { kunduzgi: 155.4, sirtqi: null, masofaviy: null, kechki: 126.0 }
            }
        },
        {
            name: "Yurisprudensiya",
            scores: {
                '2023-2024': { kunduzgi: 165.9, sirtqi: 151.2, masofaviy: null, kechki: null },
                '2024-2025': { kunduzgi: 165.9, sirtqi: 151.2, masofaviy: null, kechki: null }
            }
        },
        {
            name: "Tarix",
            scores: {
                '2023-2024': { kunduzgi: 144.9, sirtqi: 110.3, masofaviy: null, kechki: null },
                '2024-2025': { kunduzgi: 144.9, sirtqi: 110.3, masofaviy: null, kechki: null }
            }
        },
        {
            name: "Boshlang'ich ta'lim",
            scores: {
                '2023-2024': { kunduzgi: 130.3, sirtqi: 100.8, masofaviy: 75.6, kechki: null },
                '2024-2025': { kunduzgi: 130.3, sirtqi: 100.8, masofaviy: 75.6, kechki: null }
            }
        },
         {
            name: "Maktabgacha ta'lim",
            scores: {
                '2023-2024': { kunduzgi: 115.5, sirtqi: 85.1, masofaviy: 65.2, kechki: null },
                '2024-2025': { kunduzgi: 115.5, sirtqi: 85.1, masofaviy: 65.2, kechki: null }
            }
        }
        // ... Boshqa barcha yo'nalishlarni shu formatda qo'shib boring
    ];

    // Elementlarni topib olish
    const menuToggle = document.getElementById('menu-toggle');
    const sideNav = document.getElementById('side-nav');
    const majorsListContainer = document.getElementById('majors-list');
    const checkByScoreBtn = document.getElementById('check-by-score-btn');
    const scoreOptions = document.getElementById('score-options');
    const formBtns = document.querySelectorAll('.form-btn');
    const scoreInputContainer = document.getElementById('score-input-container');
    const userScoreInput = document.getElementById('user-score');
    const findMajorBtn = document.getElementById('find-major-btn');
    const resultsSection = document.getElementById('results-section');
    const resultsContainer = document.getElementById('results-container');
    const resultsTitle = document.getElementById('results-title');

    // --- 1. Yon menyuni ochish va yopish ---
    menuToggle.addEventListener('click', () => {
        sideNav.classList.toggle('active');
    });

    // --- 2. Yon menyuni yo'nalishlar bilan to'ldirish ---
    function populateMajorsList() {
        majorsListContainer.innerHTML = ''; // Eski ma'lumotlarni tozalash
        majorsData.forEach(major => {
            const item = document.createElement('div');
            item.className = 'major-item';

            let scoresHTML = '<div class="major-scores">';
            for (const year in major.scores) {
                scoresHTML += `<strong>${year}:</strong><br>`;
                let hasScore = false;
                for (const form in major.scores[year]) {
                    if (major.scores[year][form]) {
                        hasScore = true;
                        scoresHTML += `&nbsp;&nbsp;- ${form}: ${major.scores[year][form]}<br>`;
                    }
                }
                if (!hasScore) {
                    scoresHTML += `&nbsp;&nbsp;- Ma'lumot yo'q<br>`;
                }
            }
            scoresHTML += '</div>';
            
            item.innerHTML = `
                <div class="major-title">${major.name}</div>
                ${scoresHTML}
            `;
            majorsListContainer.appendChild(item);
        });
    }

    // --- 3. Ball orqali yo'nalish topish logikasi ---
    let selectedForm = null;

    // Asosiy tugma bosilganda variantlarni ko'rsatish/yashirish
    checkByScoreBtn.addEventListener('click', () => {
        scoreOptions.classList.toggle('active');
    });

    // Ta'lim shakli tugmalari bosilganda
    formBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Boshqa tugmalardagi 'selected' klassini olib tashlash
            formBtns.forEach(b => b.classList.remove('selected'));
            // Bosilgan tugmaga 'selected' klassini qo'shish
            btn.classList.add('selected');
            
            selectedForm = btn.dataset.form;
            scoreInputContainer.classList.add('active'); // Ball kiritish maydonini ko'rsatish
        });
    });

    // "Qidirish" tugmasi bosilganda
    findMajorBtn.addEventListener('click', () => {
        const userScore = parseFloat(userScoreInput.value);

        if (!selectedForm) {
            alert("Iltimos, avval ta'lim shaklini tanlang!");
            return;
        }
        if (isNaN(userScore) || userScore <= 0) {
            alert("Iltimos, to'g'ri ball kiriting!");
            return;
        }

        // Joriy o'quv yilini olamiz (masalan 2024-2025)
        const currentYear = '2024-2025';

        const suitableMajors = majorsData.filter(major => {
            const yearData = major.scores[currentYear];
            if (yearData && yearData[selectedForm]) {
                return userScore >= yearData[selectedForm];
            }
            return false;
        });

        displayResults(suitableMajors, userScore);
    });

    // Natijalarni ekranga chiqarish funksiyasi
    function displayResults(majors, userScore) {
        resultsSection.style.display = 'block';
        resultsContainer.innerHTML = '';

        resultsTitle.textContent = `Sizning balingiz (${userScore}) bilan "${selectedForm}" ta'lim shakli bo'yicha tavsiya etiladigan yo'nalishlar:`;

        if (majors.length === 0) {
            resultsContainer.innerHTML = `<p class="no-results">Afsuski, sizning balingiz bilan mos yo'nalish topilmadi. Keyingi yil omadingizni bersin!</p>`;
        } else {
            majors.forEach(major => {
                const passingScore = major.scores['2024-2025'][selectedForm];
                const card = document.createElement('div');
                card.className = 'result-card';
                card.innerHTML = `
                    <h4>${major.name}</h4>
                    <p>Kirish bali: <span>${passingScore}</span></p>
                `;
                resultsContainer.appendChild(card);
            });
        }
        
        // Natijalar bo'limiga silliq o'tish
        resultsSection.scrollIntoView({ behavior: 'smooth' });
        scoreOptions.classList.remove('active'); // Oynani yopish
    }

    // Sahifa yuklanganda yon menyuni to'ldirish
    populateMajorsList();
});
