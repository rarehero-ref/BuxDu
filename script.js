document.addEventListener('DOMContentLoaded', () => {

    // --- MA'LUMOTLAR BAZASI (FAKULTETLAR BO'YICHA GURUHLANGAN) ---
    const universityData = [
        {
            facultyName: "Axborot texnologiyalari fakulteti",
            description: "Dasturlash, kompyuter injiniringi va axborot xavfsizligi bo'yicha zamonaviy mutaxassislar tayyorlaydi.",
            majors: [
                { name: "Dasturiy injiniring", scores: { '2024-2025': { kunduzgi: { grant: 180.1, kontrakt: 140.7 }, sirtqi: { grant: null, kontrakt: 121.8 } } } },
                { name: "Kompyuter injiniringi", scores: { '2024-2025': { kunduzgi: { grant: 177.3, kontrakt: 135.5 } } } },
                { name: "Axborot xavfsizligi", scores: { '2024-2025': { kunduzgi: { grant: 175.0, kontrakt: 130.2 } } } }
            ]
        },
        {
            facultyName: "Iqtisodiyot va turizm fakulteti",
            description: "Moliya, bank ishi, buxgalteriya hisobi va turizm sohalari uchun yetuk kadrlar yetishtiradi.",
            majors: [
                { name: "Iqtisodiyot", scores: { '2024-2025': { kunduzgi: { grant: 175.4, kontrakt: 138.6 }, sirtqi: { grant: null, kontrakt: 105.1 }, masofaviy: { grant: null, kontrakt: 98.7 } } } },
                { name: "Moliya va moliyaviy texnologiyalar", scores: { '2024-2025': { kunduzgi: { grant: 172.1, kontrakt: 133.4 }, sirtqi: { grant: null, kontrakt: 90.3 } } } }
            ]
        },
        {
            facultyName: "Huquq fakulteti",
            description: "Yurisprudensiya sohasida raqobatbardosh, adolat va qonun ustuvorligini ta'minlaydigan mutaxassislar tayyorlaydi.",
            majors: [
                { name: "Yurisprudensiya", scores: { '2024-2025': { kunduzgi: { grant: 181.7, kontrakt: 165.9 }, sirtqi: { grant: null, kontrakt: 151.2 } } } }
            ]
        },
        {
            facultyName: "Filologiya fakulteti",
            description: "O'zbek, rus, ingliz va boshqa tillar filologiyasi, adabiyotshunoslik bo'yicha chuqur bilim beradi.",
             majors: [
                { name: "Ingliz tili va adabiyoti", scores: { '2024-2025': { kunduzgi: { grant: 178.5, kontrakt: 155.4 }, kechki: { grant: null, kontrakt: 126.0 } } } }
            ]
        }
        // ... BOSHQA BARCHA FAKULTETLAR VA YO'NALISHLARNI SHU YERGA QO'SHIB BORING ...
    ];

    // --- BARCHA ELEMENTLARNI TOPISH ---
    const sideNav = document.getElementById('side-nav');
    const majorsListContainer = document.getElementById('majors-list');
    const findMajorBtn = document.getElementById('find-major-btn');
    const resultsSection = document.getElementById('results-section');
    const resultsContainer = document.getElementById('results-container');
    const facultiesListContainer = document.getElementById('faculties-list');
    
    // --- YON MENYU VA FAKULTETLAR BLOKINI TO'LDIRISH ---
    function populateLists() {
        majorsListContainer.innerHTML = '';
        facultiesListContainer.innerHTML = '';

        universityData.forEach(faculty => {
            // Yon menyu uchun
            const facultyTitle = document.createElement('h4');
            facultyTitle.textContent = faculty.facultyName;
            majorsListContainer.appendChild(facultyTitle);

            // Asosiy sahifadagi fakultetlar bloki uchun
            const facultyItem = document.createElement('div');
            facultyItem.className = 'faculty-item';
            let majorsHTML = '<ul class="faculty-majors-list">';

            faculty.majors.forEach(major => {
                const majorDiv = document.createElement('div');
                majorDiv.className = 'major-item';
                majorDiv.textContent = major.name;
                majorsListContainer.appendChild(majorDiv);
                majorsHTML += `<li>${major.name}</li>`;
            });
            majorsHTML += '</ul>';

            facultyItem.innerHTML = `
                <div class="faculty-header">
                    <h3>${faculty.facultyName}</h3>
                    <span class="icon fas fa-chevron-down"></span>
                </div>
                <div class="faculty-content">
                    <p>${faculty.description}</p>
                    ${majorsHTML}
                </div>
            `;
            facultiesListContainer.appendChild(facultyItem);
        });

        // Fakultetlar uchun akkordeon funksiyasi
        document.querySelectorAll('.faculty-header').forEach(header => {
            header.addEventListener('click', () => {
                header.parentElement.classList.toggle('active');
            });
        });
    }

    // --- BALL ORQALI QIDIRISH (YANGI TUZILMAGA MOSLASHGAN) ---
    findMajorBtn.addEventListener('click', () => {
        let selectedForm = document.querySelector('.form-btn.selected')?.dataset.form;
        const userScore = parseFloat(document.getElementById('user-score').value);

        if (!selectedForm || isNaN(userScore) || userScore <= 0) {
            alert("Iltimos, ta'lim shaklini tanlab, to'g'ri ball kiriting!");
            return;
        }

        const currentYear = '2024-2025';
        let suitableMajors = [];

        universityData.forEach(faculty => {
            faculty.majors.forEach(major => {
                const scores = major.scores[currentYear]?.[selectedForm];
                if (scores) {
                    const { grant, kontrakt } = scores;
                    if (grant && userScore >= grant) {
                        suitableMajors.push({ ...major, faculty: faculty.facultyName, type: 'grant', requiredScore: grant });
                    } else if (kontrakt && userScore >= kontrakt) {
                        suitableMajors.push({ ...major, faculty: faculty.facultyName, type: 'kontrakt', requiredScore: kontrakt, grantScore: grant });
                    }
                }
            });
        });

        displayResults(suitableMajors, userScore, selectedForm);
    });

    // --- NATIJALARNI KO'RSATISH (YANGILANGAN) ---
    function displayResults(majors, userScore, form) {
        resultsSection.style.display = 'block';
        resultsContainer.innerHTML = '';
        document.getElementById('results-title').textContent = `Sizning balingiz (${userScore}) bilan "${form}" ta'lim shakli bo'yicha natijalar:`;
        
        if (majors.length === 0) {
             resultsContainer.innerHTML = `<p class="no-results">Afsuski, sizning balingiz bilan mos yo'nalish topilmadi.</p>`;
        } else {
            majors.sort((a, b) => b.requiredScore - a.requiredScore); // Saralash
            majors.forEach(major => {
                const card = document.createElement('div');
                card.className = 'result-card';
                // ... (qolgan natija chiqarish logikasi avvalgi kod bilan bir xil) ...
            });
        }
        resultsSection.scrollIntoView({ behavior: 'smooth' });
        // ... (boshqa kodlar avvalgidek)
    }

    // --- BOSHQA FUNKSIYALAR (MAVZU O'ZGARTIRISH, MENYUNI OCHISH VA H.K.) ---
    // Bu qismdagi kodlar o'zgarishsiz qoladi, shuning uchun ularni avvalgi javobdan ko'chirib olishingiz mumkin.
    // Men eng muhimlarini shu yerga qayta joylayman:
    
    // Mavzu (Theme)
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'dark') { body.classList.add('dark-mode'); themeToggle.textContent = '☀️'; } else { themeToggle.textContent = '🌙'; }
    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        if (body.classList.contains('dark-mode')) { themeToggle.textContent = '☀️'; localStorage.setItem('theme', 'dark'); } else { themeToggle.textContent = '🌙'; localStorage.setItem('theme', 'light'); }
    });

    // Menyuni ochish
    document.getElementById('menu-toggle').addEventListener('click', () => sideNav.classList.toggle('active'));

    // Ball tekshirish oynasini ochish
    document.getElementById('check-by-score-btn').addEventListener('click', () => document.getElementById('score-options').classList.toggle('active'));

    // Ta'lim shaklini tanlash
    document.querySelectorAll('.form-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.form-btn').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            document.getElementById('score-input-container').classList.add('active');
        });
    });

    // Sahifa yuklanganda barcha ro'yxatlarni to'ldirish
    populateLists();
});
