
/**
 * بازی ماجراجویی ریاضی کودکان (نسخه Vanilla JS)
 * کاملاً ایستا و سازگار با GitHub Pages
 */

interface GameState {
    screen: 'home' | 'game' | 'reward' | 'parent';
    stars: number;
    completedLevels: number;
    currentGame: string | null;
    currentQuestion: any;
    questionIndex: number;
    score: number;
    feedback: 'correct' | 'wrong' | null;
}

let state: GameState = {
    screen: 'home',
    stars: parseInt(localStorage.getItem('math_quest_stars') || '0'),
    completedLevels: parseInt(localStorage.getItem('math_quest_levels') || '0'),
    currentGame: null,
    currentQuestion: null,
    questionIndex: 0,
    score: 0,
    feedback: null
};

const EMOJIS = ['🍎', '🚗', '🐶', '🍕', '🍦', '⚽️', '🐱', '🦄', '🎈', '🧸'];

function save() {
    localStorage.setItem('math_quest_stars', state.stars.toString());
    localStorage.setItem('math_quest_levels', state.completedLevels.toString());
}

function render() {
    const app = document.getElementById('app');
    if (!app) return;

    if (state.screen === 'home') {
        renderHome(app);
    } else if (state.screen === 'game') {
        renderGame(app);
    } else if (state.screen === 'reward') {
        renderReward(app);
    } else if (state.screen === 'parent') {
        renderParent(app);
    }
}

function renderHome(app: HTMLElement) {
    app.innerHTML = `
        <div class="w-full max-w-2xl p-6 flex flex-col items-center">
            <header class="w-full flex justify-between items-center mb-10">
                <div class="flex items-center gap-3">
                    <div class="w-16 h-16 bg-white rounded-full flex items-center justify-center text-4xl shadow-lg border-4 border-yellow-300 animate-bounce">🦁</div>
                    <div>
                        <h1 class="text-3xl font-lalezar text-blue-900 leading-none">ریاضی‌دان قهرمان</h1>
                        <p class="text-blue-500 font-bold mt-1">آماده‌ای برای بازی؟</p>
                    </div>
                </div>
                <div class="bg-yellow-100 px-5 py-2 rounded-2xl border-2 border-yellow-400 flex items-center gap-2 shadow-sm">
                    <span class="text-2xl">⭐</span>
                    <span class="text-2xl font-bold text-yellow-700">${state.stars}</span>
                </div>
            </header>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full mb-10">
                <div onclick="window.startGame('counting')" class="kid-btn bg-blue-400 p-8 rounded-[2.5rem] text-white text-center shadow-blue">
                    <div class="text-6xl mb-4">🔢</div>
                    <div class="text-2xl font-lalezar">بازی شمارش</div>
                </div>
                <div onclick="window.startGame('addition')" class="kid-btn bg-green-400 p-8 rounded-[2.5rem] text-white text-center shadow-green">
                    <div class="text-6xl mb-4">➕</div>
                    <div class="text-2xl font-lalezar">بازی جمع</div>
                </div>
                <div onclick="window.startGame('subtraction')" class="kid-btn bg-pink-400 p-8 rounded-[2.5rem] text-white text-center shadow-pink">
                    <div class="text-6xl mb-4">➖</div>
                    <div class="text-2xl font-lalezar">بازی تفریق</div>
                </div>
                <div onclick="window.startGame('patterns')" class="kid-btn bg-yellow-400 p-8 rounded-[2.5rem] text-white text-center shadow-yellow">
                    <div class="text-6xl mb-4">🧩</div>
                    <div class="text-2xl font-lalezar">الگوها</div>
                </div>
            </div>

            <button onclick="window.changeScreen('parent')" class="text-blue-300 font-bold flex items-center gap-2 hover:text-blue-500 transition-colors">
                ⚙️ تنظیمات والدین
            </button>
        </div>
    `;
}

function renderGame(app: HTMLElement) {
    const q = state.currentQuestion;
    const bgClass = state.feedback === 'correct' ? 'bg-green-100' : state.feedback === 'wrong' ? 'bg-red-100' : 'bg-blue-50';
    
    app.innerHTML = `
        <div class="w-full min-h-screen ${bgClass} transition-colors duration-300 flex flex-col items-center p-6">
            <div class="w-full max-w-2xl flex justify-between items-center mb-8">
                <button onclick="window.changeScreen('home')" class="kid-btn bg-red-400 text-white px-6 py-2 rounded-2xl font-lalezar shadow-red">خروج</button>
                <div class="flex items-center gap-2">
                    <div class="w-32 h-4 bg-gray-200 rounded-full overflow-hidden border-2 border-white">
                        <div class="h-full bg-blue-400 transition-all" style="width: ${(state.questionIndex / 5) * 100}%"></div>
                    </div>
                </div>
                <div class="text-xl font-lalezar text-blue-800">سوال ${state.questionIndex + 1} از ۵</div>
            </div>

            <div class="w-full max-w-2xl bg-white rounded-[3rem] p-8 shadow-2xl border-4 border-white flex flex-col items-center relative overflow-hidden">
                ${state.feedback === 'correct' ? '<div class="absolute inset-0 flex items-center justify-center text-9xl star-fly z-50">🌟</div>' : ''}
                
                <h2 class="text-4xl font-lalezar text-blue-900 mb-8">${q.prompt}</h2>
                
                <div class="flex flex-wrap justify-center gap-4 mb-12 min-h-[120px]">
                    ${q.visuals.map((v: string) => `<span class="text-6xl animate-pop">${v}</span>`).join('')}
                </div>

                <div class="grid grid-cols-2 gap-6 w-full max-w-md">
                    ${q.options.map((opt: any) => `
                        <button onclick="window.handleAnswer('${opt}')" 
                                class="kid-btn bg-blue-50 hover:bg-blue-100 p-8 rounded-3xl text-4xl font-lalezar text-blue-800 shadow-blue border-2 border-blue-200
                                ${state.feedback && opt == q.answer ? 'bg-green-400 text-white border-green-500 shadow-green' : ''}
                                ${state.feedback === 'wrong' && opt != q.answer ? 'animate-shake' : ''}">
                            ${opt}
                        </button>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
}

function renderReward(app: HTMLElement) {
    app.innerHTML = `
        <div class="w-full min-h-screen bg-green-50 flex flex-col items-center justify-center p-6 text-center">
            <div class="text-9xl mb-6 animate-bounce">🏆</div>
            <h2 class="text-6xl font-lalezar text-green-700 mb-4">هوراااا!</h2>
            <p class="text-3xl font-lalezar text-green-600 mb-8">تو تونستی ${state.score} تا ستاره درخشان بگیری!</p>
            <div class="flex gap-4 mb-12">
                ${Array(state.score).fill('⭐').map(s => `<span class="text-6xl star-fly">${s}</span>`).join('')}
            </div>
            <button onclick="window.changeScreen('home')" class="kid-btn bg-blue-500 text-white px-12 py-6 rounded-[2rem] font-lalezar text-3xl shadow-blue">دمت گرم! بریم خونه</button>
        </div>
    `;
}

function renderParent(app: HTMLElement) {
    app.innerHTML = `
        <div class="w-full min-h-screen flex flex-col items-center justify-center p-6">
            <div class="w-full max-w-md bg-white rounded-[2.5rem] p-10 shadow-2xl border-4 border-white">
                <h2 class="text-3xl font-bold mb-8 text-center text-gray-800">پنل مدیریت والدین</h2>
                <div class="space-y-4 mb-10">
                    <div class="flex justify-between p-4 bg-blue-50 rounded-2xl border-2 border-blue-100">
                        <span class="text-gray-600 font-bold">مجموع ستاره‌ها:</span>
                        <span class="text-2xl font-bold text-blue-600">${state.stars} ⭐</span>
                    </div>
                    <div class="flex justify-between p-4 bg-green-50 rounded-2xl border-2 border-green-100">
                        <span class="text-gray-600 font-bold">مراحل انجام شده:</span>
                        <span class="text-2xl font-bold text-green-600">${state.completedLevels}</span>
                    </div>
                </div>
                <button onclick="window.resetData()" class="w-full bg-red-50 text-red-500 py-4 rounded-2xl font-bold mb-4 border-2 border-red-100 hover:bg-red-100 transition-colors">پاک کردن تمام اطلاعات</button>
                <button onclick="window.changeScreen('home')" class="w-full bg-gray-800 text-white py-4 rounded-2xl font-bold shadow-lg">بازگشت به بازی</button>
            </div>
        </div>
    `;
}

// منطق بازی
(window as any).startGame = (type: string) => {
    state.currentGame = type;
    state.questionIndex = 0;
    state.score = 0;
    state.screen = 'game';
    generateQuestion();
    render();
};

(window as any).changeScreen = (screen: 'home' | 'game' | 'reward' | 'parent') => {
    state.screen = screen;
    render();
};

(window as any).handleAnswer = (choice: any) => {
    if (state.feedback) return;

    if (choice == state.currentQuestion.answer) {
        state.feedback = 'correct';
        state.score++;
        state.stars++;
    } else {
        state.feedback = 'wrong';
    }

    render();

    setTimeout(() => {
        state.feedback = null;
        if (state.questionIndex < 4) {
            state.questionIndex++;
            generateQuestion();
        } else {
            state.screen = 'reward';
            state.completedLevels++;
            save();
        }
        render();
    }, 1500);
};

(window as any).resetData = () => {
    if (confirm('آیا مطمئن هستید؟ تمام پیشرفت کودک پاک خواهد شد.')) {
        localStorage.clear();
        location.reload();
    }
};

function generateQuestion() {
    const emoji = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
    let prompt = "";
    let answer: any = 0;
    let visuals: any[] = [];
    let options: any[] = [];

    switch (state.currentGame) {
        case 'counting':
            answer = Math.floor(Math.random() * 8) + 2;
            prompt = `بشمار! چند تا ${emoji} اینجا هست؟`;
            visuals = Array(answer).fill(emoji);
            break;
        case 'addition':
            const a = Math.floor(Math.random() * 5) + 1;
            const b = Math.floor(Math.random() * 4) + 1;
            answer = a + b;
            prompt = `این‌ها رو با هم جمع کن!`;
            visuals = [...Array(a).fill(emoji), '➕', ...Array(b).fill(emoji)];
            break;
        case 'subtraction':
            const s1 = Math.floor(Math.random() * 5) + 5;
            const s2 = Math.floor(Math.random() * 4) + 1;
            answer = s1 - s2;
            prompt = `اگه ${s2} تا برداریم، چند تا می‌مونه؟`;
            visuals = Array(s1).fill(emoji);
            break;
        case 'patterns':
            const e1 = EMOJIS[0];
            const e2 = EMOJIS[1];
            prompt = `کدوم شکل جای علامت سوال می‌شینه؟`;
            visuals = [e1, e2, e1, e2, '❓'];
            answer = e1;
            break;
    }

    options = [answer];
    while (options.length < 4) {
        let alt = state.currentGame === 'patterns' ? EMOJIS[Math.floor(Math.random()*EMOJIS.length)] : Math.max(1, answer + (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 3) + 1));
        if (!options.includes(alt)) options.push(alt);
    }
    options.sort(() => Math.random() - 0.5);

    state.currentQuestion = { prompt, answer, visuals, options };
}

// شروع اولیه
render();
