class FlyingTokens {
    constructor() {
        this.tokens = [
            {
                name: '',
                image: 'images/MauerseglerEvolution.jpeg',
                url: 'MauerseglerPage.html',
                publishDate: '2022-09-26',
                textLength: 52259,
                assignedText: "Mauersegler"
            },
            {
                name: '',
                image: 'images/NotSanktMartinCrop.jpeg',
                url: 'SanktMartinLOLPage.html',
                publishDate: '2022-11-13',
                textLength: 2836,
                assignedText: "Sankt Martin LOL"
            },
            {
                name: '',
                image: 'images/Zungen.jpg',
                url: 'TrinkWeiterPage.html',
                publishDate: '2023-04-21',
                textLength: 3237,
                assignedText: "Trink weiter!"
            },
            {
                name: '',
                image: 'images/KWRPool.jpeg',
                url: 'DeutschunterrichtPage.html',
                publishDate: '2023-12-09',
                textLength: 1027,
                assignedText: "Deutschunterricht"
            },
            {
                name: '',
                image: 'images/WienAusblick.jpg',
                url: 'MDRPage.html',
                publishDate: '2023-09-29',
                textLength: 3517,
                assignedText: "MDR"
            },
            {
                name: '',
                image: 'images/canalDuMidi.png',
                url: 'Zwiegespräch.html',
                publishDate: '2022-08-01',
                textLength: 281,
                assignedText: "Zwiegespraech"
            },
            {
                name: '',
                image: 'images/BluesBild.jpg',
                url: 'ThüringerBluesPage.html',
                publishDate: '2025-08-27',
                textLength: 332,
                assignedText: "Thueringer Blues"
            },
            {
                name: '',
                image: 'images/KircheFarchant.jpeg',
                url: 'DorfinterludePage.html',
                publishDate: '2024-05-26',
                textLength: 5847,
                assignedText: "Dorfinterlude"
            }
        ];

        this.container = document.getElementById('token-container');
        this.tokenElements = [];

        this.velocityMode = "date"; // default mode
        this.createTokens();
        this.animate();
        this.setupControls();
    }

    setupControls() {
        const controls = document.querySelectorAll('input[name="velocityMode"]');
        controls.forEach(control => {
            control.addEventListener('change', e => {
                this.velocityMode = e.target.value;
                this.updateVelocities();
            });
        });
    }

    calculateVelocity(tokenData) {
        if (this.velocityMode === "length") {
            const minLen = 281, maxLen = 52000;
            const norm = (tokenData.textLength - minLen) / (maxLen - minLen);
            const p = 2.5; // adjust curve strength
            return Math.max(0.2, 5 - Math.pow(norm, p) * 5);
        } else {
            const daysOld = (Date.now() - new Date(tokenData.publishDate)) / (1000 * 60 * 60 * 24);
            const norm = Math.min(1, daysOld / (365 * 4));
            const p = 2.5;
            return Math.max(0, 5 - Math.pow(norm, p) * 5);
        }
    }


    createTokens() {
        this.tokens.forEach(tokenData => {
            const token = document.createElement('div');
            token.className = 'token';
            token.textContent = tokenData.name;
            token.style.backgroundImage = `url(${tokenData.image})`;

            // random start position
            let x = Math.random() * (this.container.clientWidth - 50);
            let y = Math.random() * (this.container.clientHeight - 50);

            // velocity magnitude depending on chosen mode
            const speed = this.calculateVelocity(tokenData);
            const angle = Math.random() * Math.PI * 2;
            let vx = Math.cos(angle) * speed;
            let vy = Math.sin(angle) * speed;

            this.tokenElements.push({el: token, data: tokenData, x, y, vx, vy});

            token.style.left = `${x}px`;
            token.style.top = `${y}px`;

            token.addEventListener('click', () => {
                window.location.href = tokenData.url;
            });


            this.container.appendChild(token);
        });
    }

    updateVelocities() {
        this.tokenElements.forEach(tokenObj => {
            const speed = this.calculateVelocity(tokenObj.data);
            const angle = Math.atan2(tokenObj.vy, tokenObj.vx); // keep direction
            tokenObj.vx = Math.cos(angle) * speed;
            tokenObj.vy = Math.sin(angle) * speed;
        });
    }

    animate() {
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;

        this.tokenElements.forEach(tokenObj => {
            let {el, x, y, vx, vy} = tokenObj;

            x += vx;
            y += vy;

            if (x <= 0 || x >= width - 50) {
                vx *= -1;
                x = Math.max(0, Math.min(x, width - 50));
            }
            if (y <= 0 || y >= height - 50) {
                vy *= -1;
                y = Math.max(0, Math.min(y, height - 50));
            }

            el.style.left = `${x}px`;
            el.style.top = `${y}px`;

            tokenObj.x = x;
            tokenObj.y = y;
            tokenObj.vx = vx;
            tokenObj.vy = vy;
        });

        requestAnimationFrame(() => this.animate());
    }
}

    document.addEventListener("DOMContentLoaded", () => {
    // Initialize flying tokens and store the instance
    const flyingTokens = new FlyingTokens();

    // Setup hover summaries
    const summaryBox = document.getElementById("summary-box");
    const imageBox = document.getElementById("image-box");
    const previewImg = document.getElementById("preview-img");
    const textNames = document.querySelectorAll(".text-name");
    const topBox = document.querySelector(".top-right-box");

    // calculate summary position
    function updateSummaryPosition() {
        const rect = topBox.getBoundingClientRect();
        summaryBox.style.top = `${rect.bottom + 10}px`;
    }
    updateSummaryPosition();
    window.addEventListener("resize", updateSummaryPosition);

    // hover logic
    textNames.forEach(nameEl => {
        nameEl.addEventListener("mouseenter", () => {
            const textName = nameEl.textContent.trim();
            summaryBox.textContent = nameEl.getAttribute("data-summary");
            summaryBox.style.display = "block";

            const tokenObj = flyingTokens.tokenElements.find(t => t.data.assignedText === textName);
            if (tokenObj) {
                tokenObj.el.style.transform = "scale(1.5)";
                tokenObj.el.style.zIndex = 1500;

                // show image
                previewImg.src = tokenObj.data.image;
                imageBox.style.display = "block";
            }
        });

        nameEl.addEventListener("mouseleave", () => {
            summaryBox.style.display = "none";
            imageBox.style.display = "none"; // hide again
            previewImg.src = ""; // reset

            const tokenObj = flyingTokens.tokenElements.find(t => t.data.assignedText === nameEl.textContent.trim());
            if (tokenObj) {
                tokenObj.el.style.transform = "scale(1)";
                tokenObj.el.style.zIndex = 1000;
            }
        });
    });
});



