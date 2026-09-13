/**
 * DIREITO DO CONSUMIDOR AÉREO - SCRIPT INTERATIVO DE ALTO NÍVEL
 * Funcionalidades:
 * 1. Background Interativo: Constelação de Partículas + Efeito Magnético com o Mouse + Avião de Scroll
 * 2. Autocomplete de Aeroportos (Lista Completa)
 * 3. Simulador Multi-Etapas com Cálculo e Mensagem para WhatsApp (100% Genérico e Personalizável)
 * 4. Guia de Balcão com Abas e Cópia de Minutas com Toast
 * 5. Carrossel de Depoimentos Arrastável (Touch / Mouse Drag)
 * 6. Quadro Interativo de Valores por Distância (Slider e Botões)
 * 7. FAQ Accordion Suave
 */

// =========================================================================
// CONFIGURAÇÃO DO NÚMERO DE WHATSAPP:
// Altere o número abaixo para o WhatsApp do seu cliente (com DDI e DDD, apenas números)
// =========================================================================
const WHATSAPP_NUMERO = "5561991147699"; 

document.addEventListener("DOMContentLoaded", function() {

    // =========================================================================
    // 1. BACKGROUND INTERATIVO: MOUSE AURA + PARTICULAS QUE REAGEM AO MOUSE + AVIÃO
    // =========================================================================
    const canvas = document.getElementById("interactive-canvas-bg");
    const planeFollower = document.getElementById("scrollPlaneFollower");
    const mouseGlow = document.getElementById("mouseCursorGlow");

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let targetMouseX = mouseX;
    let targetMouseY = mouseY;

    // Rastrear posição do mouse para aura e partículas
    window.addEventListener("mousemove", function(e) {
        targetMouseX = e.clientX;
        targetMouseY = e.clientY;
    });

    if (canvas) {
        const ctx = canvas.getContext("2d");
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        window.addEventListener("resize", function() {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            initParticles();
        });

        // Partículas interativas de fundo (estrelas / nós aeronáuticos)
        const particleCount = window.innerWidth > 768 ? 45 : 22;
        let particles = [];

        function initParticles() {
            particles = [];
            for (let i = 0; i < particleCount; i++) {
                particles.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    vx: (Math.random() - 0.5) * 0.6,
                    vy: (Math.random() - 0.5) * 0.6,
                    radius: Math.random() * 2 + 1,
                    baseAlpha: Math.random() * 0.4 + 0.2
                });
            }
        }
        initParticles();

        // Rastro de condensação do avião
        let flightTrail = [];
        const maxTrailLength = 32;
        let currentPos = { x: width * 0.1, y: height * 0.2, angle: 45 };
        let targetPos = { x: width * 0.1, y: height * 0.2, angle: 45 };

        function animateBackground() {
            // Suavização do mouse glow
            mouseX += (targetMouseX - mouseX) * 0.1;
            mouseY += (targetMouseY - mouseY) * 0.1;
            if (mouseGlow) {
                mouseGlow.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
            }

            ctx.clearRect(0, 0, width, height);

            // 1. Renderizar nós de partículas interativas que se conectam
            for (let i = 0; i < particles.length; i++) {
                let p = particles[i];
                p.x += p.vx;
                p.y += p.vy;

                if (p.x < 0) p.x = width;
                if (p.x > width) p.x = 0;
                if (p.y < 0) p.y = height;
                if (p.y > height) p.y = 0;

                // Desenhar a partícula (pontos dourados e brancos sutis)
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(218, 151, 39, ${p.baseAlpha})`;
                ctx.fill();

                // Conexão entre partículas próximas
                for (let j = i + 1; j < particles.length; j++) {
                    let p2 = particles[j];
                    let dist = Math.hypot(p.x - p2.x, p.y - p2.y);
                    if (dist < 110) {
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.strokeStyle = `rgba(218, 151, 39, ${0.12 * (1 - dist / 110)})`;
                        ctx.lineWidth = 0.8;
                        ctx.stroke();
                    }
                }

                // Interação com o Mouse (conexão magnética luminosa)
                let mouseDist = Math.hypot(p.x - mouseX, p.y - mouseY);
                if (mouseDist < 160) {
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(mouseX, mouseY);
                    ctx.strokeStyle = `rgba(255, 192, 67, ${0.28 * (1 - mouseDist / 160)})`;
                    ctx.lineWidth = 1;
                    ctx.stroke();

                    // Suave atração ao mouse
                    p.x += (mouseX - p.x) * 0.005;
                    p.y += (mouseY - p.y) * 0.005;
                }
            }

            // 2. Trajetória do avião no scroll
            if (planeFollower) {
                const scrollY = window.scrollY || window.pageYOffset;
                const docHeight = document.documentElement.scrollHeight - window.innerHeight;
                const progress = Math.min(Math.max(scrollY / (docHeight || 1), 0), 1);

                const viewY = (progress * (height * 0.75)) + (height * 0.12);
                const wave = Math.sin(progress * Math.PI * 4);
                const viewX = (width * 0.5) + (wave * (width * 0.38));

                const dx = viewX - currentPos.x;
                const dy = viewY - currentPos.y;
                const angleDeg = Math.atan2(dy, dx) * (180 / Math.PI) + 90;

                targetPos.x = viewX;
                targetPos.y = viewY;
                targetPos.angle = angleDeg;

                currentPos.x += (targetPos.x - currentPos.x) * 0.14;
                currentPos.y += (targetPos.y - currentPos.y) * 0.14;

                let diffAngle = targetPos.angle - currentPos.angle;
                while (diffAngle < -180) diffAngle += 360;
                while (diffAngle > 180) diffAngle -= 360;
                currentPos.angle += diffAngle * 0.14;

                planeFollower.style.transform = `translate(${currentPos.x}px, ${currentPos.y}px) rotate(${currentPos.angle}deg)`;

                flightTrail.unshift({ x: currentPos.x, y: currentPos.y });
                if (flightTrail.length > maxTrailLength) {
                    flightTrail.pop();
                }

                if (flightTrail.length > 2) {
                    // Linha dourada
                    ctx.beginPath();
                    ctx.moveTo(flightTrail[0].x, flightTrail[0].y);
                    for (let k = 1; k < flightTrail.length; k++) {
                        ctx.lineTo(flightTrail[k].x, flightTrail[k].y);
                    }
                    ctx.strokeStyle = "rgba(218, 151, 39, 0.4)";
                    ctx.lineWidth = 3;
                    ctx.lineCap = "round";
                    ctx.stroke();

                    // Fumaça esbranquiçada
                    for (let k = 0; k < flightTrail.length; k++) {
                        const pt = flightTrail[k];
                        const r = (k / flightTrail.length) * 7 + 2;
                        const op = (1 - (k / flightTrail.length)) * 0.22;
                        ctx.beginPath();
                        ctx.arc(pt.x, pt.y, r, 0, Math.PI * 2);
                        ctx.fillStyle = `rgba(255, 255, 255, ${op})`;
                        ctx.fill();
                    }
                }
            }

            requestAnimationFrame(animateBackground);
        }

        requestAnimationFrame(animateBackground);
    }

    // =========================================================================
    // 2. HEADER SCROLL & MENU MOBILE
    // =========================================================================
    const header = document.querySelector(".site-header");
    window.addEventListener("scroll", function() {
        if (window.scrollY > 30) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }
    });

    const mobileToggle = document.getElementById("mobileToggle");
    const navMenu = document.getElementById("navMenu");

    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener("click", function() {
            navMenu.classList.toggle("mobile-active");
            const icon = mobileToggle.querySelector("i");
            if (icon) {
                icon.classList.toggle("fa-bars");
                icon.classList.toggle("fa-times");
            }
        });

        navMenu.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => {
                navMenu.classList.remove("mobile-active");
                const icon = mobileToggle.querySelector("i");
                if (icon) {
                    icon.classList.add("fa-bars");
                    icon.classList.remove("fa-times");
                }
            });
        });
    }

    // =========================================================================
    // 3. AUTOCOMPLETE DE AEROPORTOS (LISTA COMPLETA)
    // =========================================================================
    const allAirports = [
        // INTERNACIONAIS
        "Lisboa - Humberto Delgado (LIS) - Portugal",
        "Porto - Francisco Sá Carneiro (OPO) - Portugal",
        "Miami International (MIA) - Estados Unidos",
        "Orlando International (MCO) - Estados Unidos",
        "Nova York - John F. Kennedy (JFK) - Estados Unidos",
        "Nova York - Newark Liberty (EWR) - Estados Unidos",
        "Paris - Charles de Gaulle (CDG) - França",
        "Paris - Orly (ORY) - França",
        "Londres - Heathrow (LHR) - Reino Unido",
        "Londres - Gatwick (LGW) - Reino Unido",
        "Madri - Barajas Adolfo Suárez (MAD) - Espanha",
        "Barcelona - El Prat (BCN) - Espanha",
        "Buenos Aires - Ezeiza (EZE) - Argentina",
        "Buenos Aires - Aeroparque (AEP) - Argentina",
        "Santiago - Arturo Merino Benítez (SCL) - Chile",
        "Montevidéu - Carrasco (MVD) - Uruguai",
        "Roma - Fiumicino Leonardo da Vinci (FCO) - Itália",
        "Milão - Malpensa (MXP) - Itália",
        "Frankfurt (FRA) - Alemanha",
        "Amsterdam - Schiphol (AMS) - Holanda",
        "Cidade do Panamá - Tocumen (PTY) - Panamá",
        "Cancún (CUN) - México",
        "Cidade do México - Benito Juárez (MEX) - México",
        "Toronto - Pearson (YYZ) - Canadá",
        "Dubai International (DXB) - Emirados Árabes",
        "Doha - Hamad (DOH) - Catar",

        // RIO DE JANEIRO
        "Rio de Janeiro - Santos Dumont (SDU)",
        "Rio de Janeiro - Galeão (GIG)",
        "Rio de Janeiro - Jacarepaguá (RRJ)",
        "Cabo Frio (CFB)",
        "Campos dos Goytacazes (CAW)",
        "Macaé (MEA)",
        "Resende (REZ)",

        // SÃO PAULO
        "São Paulo - Congonhas (CGH)",
        "São Paulo - Guarulhos (GRU)",
        "Campinas - Viracopos (VCP)",
        "São José dos Campos (SJK)",
        "Ribeirão Preto (RAO)",
        "São José do Rio Preto (SJP)",
        "Presidente Prudente (PPB)",
        "Bauru / Arealva (JTC)",
        "Marília (MII)",
        "Araçatuba (ARU)",
        "Sorocaba (SOD)",
        "Franca (FRC)",

        // DISTRITO FEDERAL & GOIÁS
        "Brasília - Juscelino Kubitschek (BSB)",
        "Goiânia - Santa Genoveva (GYN)",
        "Caldas Novas (CLV)",
        "Rio Verde (RVD)",

        // BAHIA
        "Salvador - Deputado Luís Eduardo Magalhães (SSA)",
        "Porto Seguro (BPS)",
        "Ilhéus - Jorge Amado (IOS)",
        "Vitória da Conquista (VDC)",
        "Barreiras (BRA)",
        "Paulo Afonso (PAF)",
        "Feira de Santana (FEC)",
        "Guanambi (GNM)",
        "Lençóis - Chapada Diamantina (LEC)",

        // MINAS GERAIS
        "Belo Horizonte - Confins (CNF)",
        "Belo Horizonte - Pampulha (PLU)",
        "Uberlândia (UDI)",
        "Uberaba (UBA)",
        "Juiz de Fora / Zona da Mata (IZA)",
        "Montes Claros (MOC)",
        "Ipatinga / Vale do Aço (IPN)",
        "Governador Valadares (GVR)",
        "Varginha (VAG)",
        "Divinópolis (DIQ)",

        // PERNAMBUCO & CEARÁ
        "Recife - Guararapes (REC)",
        "Fernando de Noronha (FEN)",
        "Petrolina (PNZ)",
        "Caruaru (CAU)",
        "Serra Talhada (SET)",
        "Fortaleza - Pinto Martins (FOR)",
        "Juazeiro do Norte (JDO)",
        "Jericoacoara / Cruz (JJD)",
        "Aracati (ARX)",

        // PARANÁ & SANTA CATARINA
        "Curitiba - Afonso Pena (CWB)",
        "Foz do Iguaçu (IGU)",
        "Maringá (MGF)",
        "Londrina (LDB)",
        "Cascavel (CAC)",
        "Ponta Grossa (PGZ)",
        "Umuarama (UMU)",
        "Florianópolis - Hercílio Luz (FLN)",
        "Navegantes (NVG)",
        "Joinville (JOI)",
        "Chapecó (XAP)",
        "Criciúma / Jaguaquara (CCM)",
        "Correia Pinto / Lages (EEA)",

        // RIO GRANDE DO SUL & ESPÍRITO SANTO
        "Porto Alegre - Salgado Filho (POA)",
        "Caxias do Sul (CXJ)",
        "Pelotas (PET)",
        "Passo Fundo (PFB)",
        "Santa Maria (RIA)",
        "Uruguaiana (URG)",
        "Santo Ângelo (GEL)",
        "Bagé (BGX)",
        "Vitória - Eurico de Aguiar Salles (VIX)",

        // AMAZONAS, PARÁ & AMAPÁ
        "Manaus - Eduardo Gomes (MAO)",
        "Tefé (TFF)",
        "Parintins (PIN)",
        "Tabatinga (TBT)",
        "São Gabriel da Cachoeira (SJL)",
        "Belém - Val-de-Cans (BEL)",
        "Santarém (STM)",
        "Marabá (MAB)",
        "Carajás / Parauapebas (CKS)",
        "Altamira (ATM)",
        "Tucuruí (TUR)",
        "Macapá - Alberto Alcolumbre (MCP)",

        // DEMAIS ESTADOS
        "São Luís - Marechal Cunha Machado (SLZ)",
        "Imperatriz (IMP)",
        "Teresina - Senador Petrônio Portella (THE)",
        "Parnaíba (PHB)",
        "Natal - São Gonçalo do Amarante (NAT)",
        "João Pessoa - Castro Pinto (JPA)",
        "Campina Grande (CPV)",
        "Maceió - Zumbi dos Palmares (MCZ)",
        "Aracaju - Santa Maria (AJU)",
        "Cuiabá - Marechal Rondon (CGB)",
        "Sinop (OPS)",
        "Campo Grande (CGR)",
        "Dourados (DOU)",
        "Bonito (BYO)",
        "Palmas - Lysias Rodrigues (PMW)",
        "Porto Velho - Jorge Teixeira (PVH)",
        "Boa Vista - Atlas Brasil Cantanhede (BVB)",
        "Rio Branco - Plácido de Castro (RBR)"
    ];

    function setupAirportAutocomplete(inputId, suggestionsId) {
        const input = document.getElementById(inputId);
        const suggestionsBox = document.getElementById(suggestionsId);
        if (!input || !suggestionsBox) return;

        input.addEventListener("input", function() {
            const query = this.value.toLowerCase().trim();
            suggestionsBox.innerHTML = "";
            if (!query) {
                suggestionsBox.style.display = "none";
                return;
            }

            const filtered = allAirports.filter(ap => ap.toLowerCase().includes(query));
            if (filtered.length > 0) {
                filtered.slice(0, 8).forEach(ap => {
                    const item = document.createElement("div");
                    item.className = "autocomplete-item";
                    item.innerHTML = `<i class="fas fa-plane" style="color: #DA9727; margin-right: 8px;"></i> ${ap}`;
                    item.addEventListener("click", function() {
                        input.value = ap;
                        suggestionsBox.style.display = "none";
                    });
                    suggestionsBox.appendChild(item);
                });
                suggestionsBox.style.display = "block";
            } else {
                suggestionsBox.style.display = "none";
            }
        });

        document.addEventListener("click", function(e) {
            if (e.target !== input && !suggestionsBox.contains(e.target)) {
                suggestionsBox.style.display = "none";
            }
        });
    }

    setupAirportAutocomplete("calc-origin", "suggestions-origin");
    setupAirportAutocomplete("calc-destination", "suggestions-destination");
    setupAirportAutocomplete("calc-connection", "suggestions-connection");

    // =========================================================================
    // 4. LÓGICA DO SIMULADOR MULTI-ETAPAS
    // =========================================================================
    function setupPillGroup(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;
        const btns = container.querySelectorAll(".pill-btn, .pill-card");
        btns.forEach(btn => {
            btn.addEventListener("click", function() {
                btns.forEach(b => b.classList.remove("active"));
                this.classList.add("active");
            });
        });
    }

    setupPillGroup("delay-hours-options");
    setupPillGroup("volunteer-options");
    setupPillGroup("doc-options");

    // Lógica do botão de conexão na Etapa 1
    const directOptionsBtns = document.querySelectorAll("#direct-options .pill-btn");
    const connectionGroup = document.getElementById("connection-group");
    directOptionsBtns.forEach(btn => {
        btn.addEventListener("click", function() {
            directOptionsBtns.forEach(b => b.classList.remove("active"));
            this.classList.add("active");
            const val = this.getAttribute("data-direct");
            if (val && val.includes("Não")) {
                if (connectionGroup) connectionGroup.style.display = "block";
            } else {
                if (connectionGroup) {
                    connectionGroup.style.display = "none";
                    const connInput = document.getElementById("calc-connection");
                    if (connInput) connInput.value = "";
                }
            }
        });
    });

    // Lógica de Bagagem na Etapa 3
    const issueBtns = document.querySelectorAll("#issue-options .pill-card");
    const baggageNotice = document.getElementById("baggage-notice");
    const flightConditionalQuestions = document.getElementById("flight-conditional-questions");

    issueBtns.forEach(btn => {
        btn.addEventListener("click", function() {
            issueBtns.forEach(b => b.classList.remove("active"));
            this.classList.add("active");
            const selectedIssue = this.getAttribute("data-issue") || "";
            
            if (selectedIssue.includes("Bagagem")) {
                if (baggageNotice) baggageNotice.style.display = "block";
                if (flightConditionalQuestions) flightConditionalQuestions.style.display = "none";
            } else {
                if (baggageNotice) baggageNotice.style.display = "none";
                if (flightConditionalQuestions) flightConditionalQuestions.style.display = "block";
            }
        });
    });

    // Estado do Formulário da Calculadora
    window.calcData = {
        origin: "",
        destination: "",
        isDirect: "Sim, voo direto",
        connection: "",
        date: "",
        airline: "",
        flightNum: "",
        issue: "Voo Atrasado",
        delayHours: "Mais de 4 horas",
        volunteer: "Não fui voluntário",
        doc: "Sim, tenho documentos"
    };

    window.updateStepUI = function(step) {
        for (let i = 1; i <= 4; i++) {
            const stepEl = document.getElementById(`step-${i}`);
            const dotEl = document.getElementById(`dot-${i}`);
            if (stepEl) stepEl.style.display = i === step ? "block" : "none";
            if (dotEl) {
                if (i <= step) dotEl.classList.add("active");
                else dotEl.classList.remove("active");
            }
        }
        const fill = document.getElementById("calcProgressFill");
        if (fill) fill.style.width = `${step * 25}%`;

        const calcSec = document.getElementById("simulador");
        if (calcSec && step > 1) {
            calcSec.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    window.nextStep = function(step) {
        if (step === 1) {
            const originVal = document.getElementById("calc-origin") ? document.getElementById("calc-origin").value.trim() : "";
            const destVal = document.getElementById("calc-destination") ? document.getElementById("calc-destination").value.trim() : "";
            if (!originVal || !destVal) {
                alert("Por favor, informe o aeroporto de origem e o destino final.");
                return;
            }
            window.calcData.origin = originVal;
            window.calcData.destination = destVal;

            const activeDirect = document.querySelector("#direct-options .pill-btn.active");
            window.calcData.isDirect = activeDirect ? activeDirect.getAttribute("data-direct") : "Sim, voo direto";

            if (window.calcData.isDirect.includes("Não")) {
                const connVal = document.getElementById("calc-connection") ? document.getElementById("calc-connection").value.trim() : "";
                if (!connVal) {
                    alert("Por favor, informe onde foi a conexão do seu voo.");
                    return;
                }
                window.calcData.connection = connVal;
            } else {
                window.calcData.connection = "Voo Direto (Sem Conexão)";
            }

            window.updateStepUI(2);
        } else if (step === 2) {
            const dateVal = document.getElementById("calc-date") ? document.getElementById("calc-date").value : "";
            const airlineVal = document.getElementById("calc-airline") ? document.getElementById("calc-airline").value : "";
            if (!dateVal || !airlineVal) {
                alert("Por favor, informe a data da partida e a companhia aérea.");
                return;
            }
            window.calcData.date = dateVal;
            window.calcData.airline = airlineVal;
            const flightNumInput = document.getElementById("calc-flight-num");
            window.calcData.flightNum = flightNumInput && flightNumInput.value.trim() ? flightNumInput.value.trim() : "Não informado";
            window.updateStepUI(3);
        }
    };

    window.prevStep = function(step) {
        window.updateStepUI(step - 1);
    };

    window.calculateResult = function() {
        const activeIssue = document.querySelector("#issue-options .active");
        const activeDelay = document.querySelector("#delay-hours-options .active");
        const activeVolunteer = document.querySelector("#volunteer-options .active");
        const activeDoc = document.querySelector("#doc-options .active");

        if (activeIssue) window.calcData.issue = activeIssue.getAttribute("data-issue") || "Voo Atrasado";
        if (activeDelay) window.calcData.delayHours = activeDelay.getAttribute("data-delay") || "Mais de 4 horas";
        if (activeVolunteer) window.calcData.volunteer = activeVolunteer.getAttribute("data-volunteer") || "Não fui voluntário";
        if (activeDoc) window.calcData.doc = activeDoc.getAttribute("data-doc") || "Sim, tenho documentos";

        const isBagagem = window.calcData.issue.includes("Bagagem");
        const isAtrasoInferior = !isBagagem && (window.calcData.delayHours === "Menos de 2 horas" || window.calcData.delayHours === "De 2 a 4 horas");

        const resultBox = document.getElementById("result-box-content");
        if (!resultBox) return;

        if (isAtrasoInferior) {
            // Caso NÃO elegível direto por danos morais simples
            resultBox.innerHTML = `
                <div class="result-badge ineligible"><i class="fas fa-exclamation-triangle"></i> Critérios da Legislação</div>
                <h2 style="color: #B45309;">Seu caso possui particularidades jurídicas</h2>
                <p class="result-desc" style="margin-top: 15px;">
                    De acordo com a <strong>Resolução nº 400 da ANAC</strong> e o Superior Tribunal de Justiça (STJ), atrasos inferiores a <strong>4 horas</strong> no destino final, em regra geral, <strong>não configuram dano moral presumido automático</strong>, salvo se você teve prejuízos materiais comprovados (perda de diárias pagas, consultas ou compromissos).
                </p>

                <div class="summary-card">
                    <h4>Resumo da Sua Simulação:</h4>
                    <ul>
                        <li>📍 <strong>Rota:</strong> ${window.calcData.origin} ➔ ${window.calcData.destination}</li>
                        ${window.calcData.isDirect.includes("Não") ? `<li>🔄 <strong>Conexão em:</strong> ${window.calcData.connection}</li>` : `<li>✈️ <strong>Tipo:</strong> Voo Direto</li>`}
                        <li>📅 <strong>Data / Cia:</strong> ${window.calcData.date} | ${window.calcData.airline}</li>
                        <li>⚠️ <strong>Ocorrência:</strong> ${window.calcData.issue} (Atraso: <strong>${window.calcData.delayHours}</strong>)</li>
                    </ul>
                </div>

                <p style="font-size: 0.92rem; color: #475569; margin-bottom: 20px;">
                    Você perdeu reunião profissional, diária de hotel ou passeio pago por causa dessa demora? Fale com nossos especialistas no WhatsApp para avaliarmos sua situação concreta.
                </p>

                <a href="https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent('Olá! Fiz a simulação de voo com atraso menor que 4h, mas tive prejuízos decorrentes do atraso e gostaria de orientação jurídica.')}" target="_blank" class="calc-whatsapp-btn" style="background: #D97706;">
                    <i class="fab fa-whatsapp"></i> Tirar Dúvidas com Nossos Especialistas no WhatsApp
                </a>
                <button type="button" class="calc-btn-back" style="margin-top: 20px;" onclick="prevStep(4)"><i class="fas fa-redo"></i> Refazer Simulação</button>
            `;
        } else {
            // Caso ELEGÍVEL
            const valorMax = isBagagem ? "R$ 8.000,00 a R$ 12.000,00" : "R$ 10.000,00";
            const textoProblema = isBagagem ? "Bagagem Extraviada / Danificada" : `${window.calcData.issue} (${window.calcData.delayHours})`;

            resultBox.innerHTML = `
                <div class="result-badge"><i class="fas fa-trophy"></i> Excelente Chance de Indenização!</div>
                <h2>Seu Caso é Altamente Elegível!</h2>
                <div class="result-amount">Você pode receber até <span>${valorMax}</span> de Indenização</div>
                <p class="result-desc">Conforme as normas da ANAC e o Código de Defesa do Consumidor, os problemas informados geram direito à compensação financeira por danos morais e materiais.</p>
                
                <div class="summary-card">
                    <h4>Resumo do Seu Pedido:</h4>
                    <ul>
                        <li>📍 <strong>Rota:</strong> ${window.calcData.origin} ➔ ${window.calcData.destination}</li>
                        ${window.calcData.isDirect.includes("Não") ? `<li>🔄 <strong>Conexão em:</strong> ${window.calcData.connection}</li>` : `<li>✈️ <strong>Tipo:</strong> Voo Direto</li>`}
                        <li>📅 <strong>Data / Cia:</strong> ${window.calcData.date} | ${window.calcData.airline} (Voo: ${window.calcData.flightNum})</li>
                        <li>⚠️ <strong>Problema:</strong> ${textoProblema}</li>
                        <li>📋 <strong>Detalhes:</strong> Voluntário: ${window.calcData.volunteer} | Possui Docs: ${window.calcData.doc}</li>
                    </ul>
                </div>

                <!-- FORMULÁRIO DE DADOS DO PASSAGEIRO -->
                <div class="passenger-info-card">
                    <h4>Preencha seus dados para receber o atendimento prioritário no WhatsApp:</h4>
                    <p>Informe seus dados abaixo para que nossos especialistas já recebam a sua simulação completa e façam a análise gratuita do seu caso.</p>
                    
                    <div class="passenger-grid">
                        <div class="passenger-input-group full-width">
                            <label for="calc-client-name">Nome Completo *</label>
                            <input type="text" id="calc-client-name" placeholder="Digite seu nome completo">
                        </div>

                        <div class="passenger-input-group">
                            <label for="calc-client-phone">Seu WhatsApp com DDD *</label>
                            <input type="tel" id="calc-client-phone" placeholder="(XX) XXXXX-XXXX" maxlength="15">
                        </div>

                        <div class="passenger-input-group">
                            <label for="calc-client-city">Cidade / Estado (UF) *</label>
                            <input type="text" id="calc-client-city" placeholder="Ex: Salvador/BA ou São Paulo/SP">
                        </div>
                    </div>
                </div>

                <button type="button" class="calc-whatsapp-btn" onclick="sendSimulationToWhatsApp()">
                    <i class="fab fa-whatsapp"></i> ENVIAR DADOS E SOLICITAR INDENIZAÇÃO NO WHATSAPP
                </button>
                <span class="calc-guarantee-text">🔒 Análise 100% Gratuita • Cláusula Risco Zero: Você só paga honorários se e quando receber a indenização.</span>
                <div style="margin-top: 15px;">
                    <button type="button" class="calc-btn-back" onclick="prevStep(4)"><i class="fas fa-arrow-left"></i> Voltar e Alterar Dados</button>
                </div>
            `;

            const phoneInput = document.getElementById("calc-client-phone");
            if (phoneInput) {
                applyPhoneMask(phoneInput);
            }
        }

        window.updateStepUI(4);
    };

    function applyPhoneMask(input) {
        if (!input) return;
        input.addEventListener("input", function(e) {
            let val = e.target.value.replace(/\D/g, "");
            if (val.length > 11) val = val.substring(0, 11);

            if (val.length > 6) {
                e.target.value = `(${val.substring(0, 2)}) ${val.substring(2, 7)}-${val.substring(7)}`;
            } else if (val.length > 2) {
                e.target.value = `(${val.substring(0, 2)}) ${val.substring(2)}`;
            } else if (val.length > 0) {
                e.target.value = `(${val}`;
            }
        });
    }

    window.sendSimulationToWhatsApp = function() {
        const nameInput = document.getElementById("calc-client-name");
        const phoneInput = document.getElementById("calc-client-phone");
        const cityInput = document.getElementById("calc-client-city");

        const nome = nameInput ? nameInput.value.trim() : "";
        const telefone = phoneInput ? phoneInput.value.trim() : "";
        const cidade = cityInput ? cityInput.value.trim() : "";

        if (!nome || nome.split(/\s+/).length < 2) {
            alert("Por favor, informe seu nome completo (nome e sobrenome).");
            if (nameInput) nameInput.focus();
            return;
        }

        const phoneDigits = telefone.replace(/\D/g, "");
        if (phoneDigits.length < 10) {
            alert("Por favor, informe um número de WhatsApp válido com DDD.");
            if (phoneInput) phoneInput.focus();
            return;
        }

        if (!cidade) {
            alert("Por favor, informe sua Cidade e Estado (UF).");
            if (cityInput) cityInput.focus();
            return;
        }

        const isBagagem = window.calcData.issue.includes("Bagagem");
        const rotaText = window.calcData.isDirect.includes("Não")
            ? `${window.calcData.origin} ➔ ${window.calcData.destination} (Conexão em: ${window.calcData.connection})`
            : `${window.calcData.origin} ➔ ${window.calcData.destination} (Voo Direto)`;

        const msg = `Olá! Fiz a simulação de voo no site e meu caso é elegível para indenização!\n\n` +
            `👤 *DADOS DO PASSAGEIRO:*\n` +
            `• Nome: ${nome}\n` +
            `• WhatsApp: ${telefone}\n` +
            `• Cidade/UF: ${cidade}\n\n` +
            `📍 *ROTA:* ${rotaText}\n` +
            `📅 *DATA:* ${window.calcData.date}\n` +
            `✈️ *COMPANHIA AÉREA:* ${window.calcData.airline} (Voo: ${window.calcData.flightNum})\n` +
            `⚠️ *OCORRÊNCIA:* ${window.calcData.issue}\n` +
            (!isBagagem ? `⏱️ *TEMPO DE ATRASO:* ${window.calcData.delayHours}\n🙋 *FOI VOLUNTÁRIO:* ${window.calcData.volunteer}\n` : ``) +
            `📑 *POSSUI COMPROVANTES:* ${window.calcData.doc}\n\n` +
            `Gostaria de dar entrada na minha indenização com auxílio da assessoria jurídica!`;

        window.open(`https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(msg)}`, "_blank");
    };

    // =========================================================================
    // 5. GUIA PRÁTICO DE BALCÃO (SELETOR DE CENÁRIOS E BOTÃO COPIAR)
    // =========================================================================
    window.switchOrientacaoTab = function(tabIndex) {
        const cards = document.querySelectorAll(".scenario-selector-grid .scenario-card, .orientacoes-tabs .tab-btn");
        const panels = document.querySelectorAll(".orientacao-panel");

        cards.forEach((card, idx) => {
            const currentIdx = (idx % 3) + 1;
            const statusSpan = card.querySelector(".scenario-status span");
            const statusIcon = card.querySelector(".scenario-status i");

            if (currentIdx === tabIndex) {
                card.classList.add("active");
                card.style.borderColor = "#DA9727";
                card.style.borderTop = "5px solid #DA9727";
                card.style.boxShadow = "0 12px 30px rgba(218, 151, 39, 0.18)";
                if (statusSpan) statusSpan.textContent = "Caso Selecionado";
                if (statusIcon) {
                    statusIcon.className = "fas fa-check-circle";
                    statusIcon.style.color = "#16A34A";
                }
            } else {
                card.classList.remove("active");
                card.style.borderColor = "#E2E8F0";
                card.style.borderTop = "4px solid #CBD5E1";
                card.style.boxShadow = "0 4px 16px rgba(0, 0, 0, 0.04)";
                if (statusSpan) statusSpan.textContent = "Ver O Que Fazer";
                if (statusIcon) {
                    statusIcon.className = "fas fa-arrow-right";
                    statusIcon.style.color = "#DA9727";
                }
            }
        });

        panels.forEach((panel, idx) => {
            if (idx + 1 === tabIndex) {
                panel.classList.add("active");
                if (window.innerWidth <= 820) {
                    setTimeout(() => {
                        panel.scrollIntoView({ behavior: "smooth", block: "nearest" });
                    }, 100);
                }
            } else {
                panel.classList.remove("active");
            }
        });
    };

    const toast = document.getElementById("toast-notification");
    function showToast(msg) {
        if (!toast) return;
        toast.innerHTML = `<i class="fas fa-check-circle"></i> <span>${msg}</span>`;
        toast.classList.add("show");
        setTimeout(() => {
            toast.classList.remove("show");
        }, 3200);
    }

    window.copyText = function(elementId) {
        const el = document.getElementById(elementId);
        if (!el) return;
        const text = el.innerText || el.textContent;

        navigator.clipboard.writeText(text).then(() => {
            showToast("Texto copiado com sucesso! Pode colar no seu e-mail ou WhatsApp.");
        }).catch(() => {
            const textarea = document.createElement("textarea");
            textarea.value = text;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand("copy");
            document.body.removeChild(textarea);
            showToast("Texto copiado para a área de transferência!");
        });
    };

    // =========================================================================
    // 6. CARROSSEL DE DEPOIMENTOS ARRASTÁVEL (DRAG / SWIPE)
    // =========================================================================
    const track = document.getElementById("testimonialsTrack");
    const viewport = document.getElementById("carouselViewport");
    const prevBtn = document.getElementById("prevTestimonial");
    const nextBtn = document.getElementById("nextTestimonial");
    const dotsContainer = document.getElementById("carouselDots");

    if (track && viewport) {
        const cards = track.querySelectorAll(".testimonial-card");
        let currentIndex = 0;
        let isDragging = false;
        let startX = 0;
        let currentTranslate = 0;
        let prevTranslate = 0;

        if (dotsContainer) {
            dotsContainer.innerHTML = "";
            cards.forEach((_, idx) => {
                const dot = document.createElement("button");
                dot.className = `carousel-dot ${idx === 0 ? "active" : ""}`;
                dot.setAttribute("aria-label", `Depoimento ${idx + 1}`);
                dot.addEventListener("click", () => goToSlide(idx));
                dotsContainer.appendChild(dot);
            });
        }

        function getCardWidth() {
            if (!cards[0]) return 320;
            return cards[0].offsetWidth + 24;
        }

        function updateCarouselPosition() {
            const cardWidth = getCardWidth();
            const maxIndex = Math.max(cards.length - (window.innerWidth > 1024 ? 3 : window.innerWidth > 768 ? 2 : 1), 0);
            
            if (currentIndex > maxIndex) currentIndex = maxIndex;
            if (currentIndex < 0) currentIndex = 0;

            const targetTranslate = -currentIndex * cardWidth;
            track.style.transform = `translateX(${targetTranslate}px)`;
            prevTranslate = targetTranslate;

            if (dotsContainer) {
                const dots = dotsContainer.querySelectorAll(".carousel-dot");
                dots.forEach((d, i) => {
                    d.classList.toggle("active", i === currentIndex);
                });
            }
        }

        function goToSlide(index) {
            currentIndex = index;
            updateCarouselPosition();
        }

        if (nextBtn) {
            nextBtn.addEventListener("click", () => {
                const maxIndex = Math.max(cards.length - (window.innerWidth > 1024 ? 3 : window.innerWidth > 768 ? 2 : 1), 0);
                if (currentIndex < maxIndex) currentIndex++;
                else currentIndex = 0;
                updateCarouselPosition();
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener("click", () => {
                const maxIndex = Math.max(cards.length - (window.innerWidth > 1024 ? 3 : window.innerWidth > 768 ? 2 : 1), 0);
                if (currentIndex > 0) currentIndex--;
                else currentIndex = maxIndex;
                updateCarouselPosition();
            });
        }

        viewport.addEventListener("mousedown", dragStart);
        viewport.addEventListener("touchstart", dragStart, { passive: true });
        window.addEventListener("mousemove", dragAction);
        window.addEventListener("touchmove", dragAction, { passive: true });
        window.addEventListener("mouseup", dragEnd);
        window.addEventListener("touchend", dragEnd);

        function dragStart(e) {
            isDragging = true;
            startX = e.type.includes("mouse") ? e.pageX : e.touches[0].clientX;
            track.style.transition = "none";
        }

        function dragAction(e) {
            if (!isDragging) return;
            const currentX = e.type.includes("mouse") ? e.pageX : e.touches[0].clientX;
            const diffX = currentX - startX;
            currentTranslate = prevTranslate + diffX;
            track.style.transform = `translateX(${currentTranslate}px)`;
        }

        function dragEnd() {
            if (!isDragging) return;
            isDragging = false;
            track.style.transition = "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)";
            const movedBy = currentTranslate - prevTranslate;

            if (movedBy < -70) currentIndex++;
            else if (movedBy > 70) currentIndex--;
            updateCarouselPosition();
        }

        window.addEventListener("resize", updateCarouselPosition);
    }

    // =========================================================================
    // 7. QUADRO INTERATIVO DE VALORES POR DISTÂNCIA
    // =========================================================================
    const distPills = document.querySelectorAll(".dist-pill");
    const distCards = document.querySelectorAll(".distance-card");
    const kmSlider = document.getElementById("kmRangeSlider");
    const currentKmDisplay = document.getElementById("currentKmDisplay");
    const currentCompDisplay = document.getElementById("currentCompDisplay");
    const currentCategoryDisplay = document.getElementById("currentCategoryDisplay");

    function activateDistanceTab(category) {
        distPills.forEach(p => {
            p.classList.toggle("active", p.getAttribute("data-dist") === category);
        });

        distCards.forEach(card => {
            if (card.getAttribute("data-card-dist") === category) {
                card.classList.add("highlight-card");
            } else {
                card.classList.remove("highlight-card");
            }
        });
    }

    distPills.forEach(pill => {
        pill.addEventListener("click", function() {
            const category = this.getAttribute("data-dist");
            activateDistanceTab(category);

            if (kmSlider) {
                if (category === "curta") kmSlider.value = 850;
                else if (category === "media") kmSlider.value = 2400;
                else if (category === "longa") kmSlider.value = 6500;
                updateSliderValues(kmSlider.value);
            }
        });
    });

    function updateSliderValues(kmVal) {
        const km = parseInt(kmVal, 10);
        if (currentKmDisplay) currentKmDisplay.innerText = `${km.toLocaleString("pt-BR")} km`;

        let category = "curta";
        let baseComp = "Até R$ 1.200,00";
        let catName = "Curta Distância";

        if (km <= 1500) {
            category = "curta";
            baseComp = "Até R$ 1.200,00 + Danos Morais";
            catName = "Curta Distância (Até 1.500 km)";
        } else if (km > 1500 && km <= 3500) {
            category = "media";
            baseComp = "Até R$ 2.000,00 + Danos Morais";
            catName = "Média Distância (1.500 a 3.500 km)";
        } else {
            category = "longa";
            baseComp = "Até R$ 3.500,00 (Até R$ 10.000 com Dano Moral)";
            catName = "Longa Distância (Mais de 3.500 km)";
        }

        if (currentCompDisplay) currentCompDisplay.innerText = baseComp;
        if (currentCategoryDisplay) currentCategoryDisplay.innerText = catName;

        activateDistanceTab(category);
    }

    if (kmSlider) {
        kmSlider.addEventListener("input", function() {
            updateSliderValues(this.value);
        });
    }

    // =========================================================================
    // 8. FAQ INTERATIVO ACCORDION
    // =========================================================================
    const faqItems = document.querySelectorAll(".faq-item");
    faqItems.forEach(item => {
        const btn = item.querySelector(".faq-question-btn");
        if (btn) {
            btn.addEventListener("click", () => {
                const isOpen = item.classList.contains("active");
                faqItems.forEach(i => i.classList.remove("active"));
                if (!isOpen) {
                    item.classList.add("active");
                }
            });
        }
    });

});
