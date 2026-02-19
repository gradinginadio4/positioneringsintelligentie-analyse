/* ========================================== */
/* DUTCH VERSION (Flanders)                   */
/* Folder: /nl/                               */
/* File: script.js                            */
/* ========================================== */

const app = {
    currentStep: 0,
    data: {
        spec: null,
        size: null,
        intl: null,
        pricing: null
    },
    
    threatMatrix: {
        'tax_litigation': { big4_pressure: 0.3, moore_pressure: 0.2, density: 'medium' },
        'corporate_ma': { big4_pressure: 0.9, moore_pressure: 0.8, density: 'high' },
        'esg_advisory': { big4_pressure: 0.8, moore_pressure: 0.4, density: 'high' },
        'audit_assurance': { big4_pressure: 0.95, moore_pressure: 0.9, density: 'very_high' }
    },

    sizeMultiplier: {
        'small': 0.7,
        'medium': 1.0,
        'large': 1.3
    },

    init() {
        this.showSection('intro-section');
    },

    showSection(id) {
        document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
        document.getElementById(id).classList.add('active');
        window.scrollTo(0, 0);
    },

    nextStep() {
        this.currentStep++;
        this.showSection(`step-${this.currentStep}`);
    },

    selectOption(category, value, element) {
        const parent = element.parentElement;
        parent.querySelectorAll('.option-card').forEach(c => c.classList.remove('selected'));
        element.classList.add('selected');
        
        this.data[category] = value;
        
        setTimeout(() => {
            if (this.currentStep < 4) {
                this.nextStep();
            } else {
                this.calculateResults();
            }
        }, 400);
    },

    calculateResults() {
        const specData = this.threatMatrix[this.data.spec];
        const sizeMult = this.sizeMultiplier[this.data.size];
        
        let threatScore = (specData.big4_pressure * 0.6 + specData.moore_pressure * 0.4) * sizeMult;
        
        if (this.data.intl === 'global') threatScore *= 1.2;
        if (this.data.intl === 'local') threatScore *= 0.8;
        
        let asymmetryScore = 0;
        if (this.data.pricing === 'premium' && this.data.size === 'small') {
            asymmetryScore = 85;
        } else if (this.data.spec === 'esg_advisory' && this.data.size !== 'large') {
            asymmetryScore = 75;
        } else if (threatScore > 0.8) {
            asymmetryScore = 40;
        } else {
            asymmetryScore = 60;
        }

        let threatLevel, threatText;
        if (threatScore > 0.9) {
            threatLevel = 'Structurele Druk';
            threatText = 'Hoge kwetsbaarheid voor Big 4 aanbestedingen.';
        } else if (threatScore > 0.6) {
            threatLevel = 'Hoge Druk';
            threatText = 'Actieve concurrentie op grote accounts.';
        } else if (threatScore > 0.4) {
            threatLevel = 'Matige Druk';
            threatText = 'Relatieve comfortzone maar monitoring nodig.';
        } else {
            threatLevel = 'Lage Druk';
            threatText = 'Sterke defensieve positie in niche.';
        }

        const consortium = this.generateConsortium();

        document.getElementById('threat-level').textContent = threatLevel;
        document.getElementById('threat-level').style.color = threatScore > 0.8 ? '#ef4444' : (threatScore > 0.5 ? '#f59e0b' : '#10b981');
        document.getElementById('threat-context').textContent = threatText;
        document.getElementById('asymmetry-index').textContent = asymmetryScore + '/100';
        document.getElementById('crowding-index').textContent = this.getDensityLabel(specData.density);
        
        document.getElementById('strategic-narrative').innerHTML = this.generateNarrative(threatScore, asymmetryScore);
        
        this.renderHeatmap();
        this.renderConsortium(consortium);
        
        this.showSection('results-section');
    },

    getDensityLabel(density) {
        const labels = {
            'very_high': 'Zeer Hoog (Verzadigd)',
            'high': 'Hoog',
            'medium': 'Gemiddeld',
            'low': 'Laag (Kans)'
        };
        return labels[density] || 'Gemiddeld';
    },

    generateNarrative(threat, asymmetry) {
        let narrative = '';
        
        if (threat > 0.8) {
            narrative = `<strong>Analyse:</strong> Uw huidige positionering bevindt zich direct in het vizier van de Big 4 strategieën. `;
            narrative += `De dichtheid van publieke wervingen in uw specialisatie wijst op een intentie om de mid-market te absorberen. `;
        } else if (threat > 0.5) {
            narrative = `<strong>Analyse:</strong> U opereert in een zone van actieve maar gestructureerde concurrentie. `;
        } else {
            narrative = `<strong>Analyse:</strong> Uw nichepositionering biedt natuurlijke bescherming tegen Big 4 standardisatie. `;
        }

        if (asymmetry > 70) {
            narrative += `<br><br><strong>Strategische Aanbeveling:</strong> Uw hoge asymmetrie-index suggereert een "flankerings" kans. In plaats van frontale concurrentie op algemene aanbestedingen, focus op het creëren van een excellentieconsortium (zie simulatie hieronder) als geloofwaardig alternatief.`;
        } else {
            narrative += `<br><br><strong>Strategische Aanbeveling:</strong> Differentiatie via ultra-gespecialiseerde technische expertise blijft uw beste verdediging. Vermijd prijzenoorlogen op generieke segmenten.`;
        }
        
        return narrative;
    },

    generateConsortium() {
        const archetypes = [
            { name: 'Technische Niche Kantoor', role: 'Sectorspecifieke expertise (bv: Pharma, Fintech)' },
            { name: 'Onafhankelijk ESG Advies', role: 'CSRD-rapportage & Due Diligence' },
            { name: 'Tax Litigation Boutique', role: 'Complexe grensoverschrijdende fiscale geschillen' },
            { name: 'IT Advisory Specialist', role: 'Cybersecurity & Data compliance' },
            { name: 'Onafhankelijk Corporate Finance', role: 'M&A mid-market & fundraising' }
        ];

        let selected = [];
        if (this.data.spec === 'tax_litigation') {
            selected = [archetypes[1], archetypes[3], archetypes[4]];
        } else if (this.data.spec === 'corporate_ma') {
            selected = [archetypes[0], archetypes[2], archetypes[3]];
        } else if (this.data.spec === 'esg_advisory') {
            selected = [archetypes[0], archetypes[2], archetypes[4]];
        } else {
            selected = [archetypes[0], archetypes[1], archetypes[4]];
        }
        
        return selected;
    },

    renderHeatmap() {
        const container = document.getElementById('service-heatmap');
        const services = [
            { name: 'Audit', intensity: 0.9 },
            { name: 'Tax', intensity: 0.7 },
            { name: 'Advies', intensity: 0.8 },
            { name: 'ESG', intensity: 0.6 },
            { name: 'Risk', intensity: 0.75 },
            { name: 'Data', intensity: 0.85 },
            { name: 'Legal', intensity: 0.5 },
            { name: 'MA', intensity: 0.9 }
        ];
        
        container.innerHTML = services.map(s => {
            const color = s.intensity > 0.8 ? '#000887' : (s.intensity > 0.6 ? '#4a5fd9' : '#a5b0e8');
            return `<div class="heatmap-cell" style="background: ${color}">${s.name}</div>`;
        }).join('');
    },

    renderConsortium(archetypes) {
        const container = document.getElementById('consortium-archetypes');
        container.innerHTML = archetypes.map(a => `
            <div class="archetype-card">
                <h4>${a.name}</h4>
                <p>${a.role}</p>
            </div>
        `).join('');
    },

    reset() {
        this.currentStep = 0;
        this.data = { spec: null, size: null, intl: null, pricing: null };
        document.querySelectorAll('.option-card').forEach(c => c.classList.remove('selected'));
        this.showSection('intro-section');
    }
};

document.addEventListener('DOMContentLoaded', () => {
    app.init();
});
