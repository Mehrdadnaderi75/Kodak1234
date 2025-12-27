
/**
 * بازی ماجراجویی ریاضی برای کودکان ۵-۶ سال
 * بدون فریم‌ورک - Vanilla JS
 */

// داده‌های اولیه و وضعیت برنامه
let state = {
    screen: 'home', // home, game, parent, reward
    stars: parseInt(localStorage.getItem('math_stars') || '0'),
    completedGames: parseInt(localStorage.getItem('math_completed') || '0'),
    currentGame: null,
    currentQuestion: null,
    score: 0,
    questionIndex: 0,
    totalQuestions: 5,
    feedback: null // correct, wrong
};

const EMOJIS = ['🍎', '🚗', '🐶', '🍕', '🍦', '⚽️', '🐱', '🦄', '🎈', '🧸'];

// تابع ذخیره‌سازی
function saveProgress() {
    localStorage.setItem('math_stars', state.stars.toString());
    localStorage.setItem('math_completed', state.completedGames.toString());
}

// تابع تغییر صفحه
function navigate(screen, gameType = null) {
    state.screen = screen;
    if (gameType) {
        state.currentGame = gameType;
        state.questionIndex = 0;
        state.score = 0;
        generateQuestion();
    }
    render();
}

// تولید سوال رندوم
function generateQuestion() {
    const emoji = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
    let prompt = "";
    // Fix: explicitly type answer to allow both numbers and strings for different game modes
    let answer: string | number = 0;
    let options: (string | number)[] = [];
    let visuals: (string | number)[] = [];

    switch(state.currentGame) {
        case 'counting':
            answer = Math.floor(Math.random() * 9) + 1;
            prompt = `چند تا ${emoji} می‌بینی؟`;
            visuals = Array(answer as number).fill(emoji);
            break;
        case 'addition':
            const a = Math.floor(Math.random() * 5) + 1;
            const b = Math.floor(Math.random() * 4) + 1;
            answer = a + b;
            prompt = `${a} + ${b} میشه چند تا؟`;
            visuals = [...Array(a).fill(emoji), '➕', ...Array(b).fill(emoji)];
            break;
        case 'subtraction':
            const s1 = Math.floor(Math.random() * 5) + 5;
            const s2 = Math.floor(Math.random() * 4) + 1;
            answer = s1 - s2;
            prompt = `${s1} منهای ${s2} چنده؟`;
            visuals = Array(s1).fill(emoji);
            break;
        case 'patterns':
            const e1 = EMOJIS[0];
            const e2 = EMOJIS[1];
            prompt = "بعدی کدومه؟";
            visuals = [e1, e2, e1, e2];
            answer = e1; // ساده برای تست
            break;
    }

    // تولید گزینه‌ها
    options = [answer];
    while(options.length < 4) {
        if (typeof answer === 'number') {
            let alt = Math.max(1, answer + (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random()*3)+1));
            if(!options.includes(alt)) options.push(alt);
        } else {
            let alt = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
            if(!options.includes(alt)) options.push(alt);
        }
    }
    options.sort(() => Math.random() - 0.5);

    state.currentQuestion = { prompt, answer, options, visuals };
}

// بررسی پاسخ
function checkAnswer(choice) {
    if (state.feedback) return;

    if (choice == state.currentQuestion.answer) {
        state.feedback = 'correct';
        state.score++;
        state.stars++;
    } else {
        state.feedback = 'wrong';
    }

    saveProgress();
    render();

    setTimeout(() => {
        state.feedback = null;
        if (state.questionIndex < state.totalQuestions - 1) {
            state.questionIndex++;
            generateQuestion();
        } else {
            state.screen = 'reward';
            state.completedGames++;
            saveProgress();
        }
        render();
    }, 1500);
}

// رندر کردن صفحات
function render() {
    const app = document.getElementById('app');
    if (!app) return;
    if (state.screen === 'home') {
        app.innerHTML = `
            <div class="p-6 flex flex-col items-center">
                <header class="w-full max-w-2xl flex justify-between items-center mb-8">
                    <div class="flex items-center gap-3">
                        <div class="w-16 h-16 bg-white rounded-full flex items-center justify-center text-4xl shadow-md border-4 border-yellow-400 animate-bounce-slow">🦁</div>
                        <h1 class="text-3xl font-lalezar text-blue-800">ماجراجویی ریاضی!</h1>
                    </div>
                    <div class="bg-yellow-100 px-4 py-2 rounded-2xl border-2 border-yellow-400 flex items-center gap-2">
                        <span class="text-2xl">⭐</span>
                        <span class="text-2xl font-bold text-yellow-700">${state.stars}</span>
                    </div>
                </header>

                <div class="w-full max-w-2xl bg-white rounded-[3rem] p-8 mb-8 shadow-xl border-4 border-white text-center">
                    <h2 class="text-3xl font-lalezar text-blue-600 mb-6">سلام قهرمان کوچولو! کدوم بازی رو دوست داری؟</h2>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <button onclick="window.navigate('game', 'counting')" class="bg-blue-400 p-6 rounded-3xl text-white font-lalezar text-2xl kid-shadow kid-button-active">🔢 بازی شمارش</button>
                        <button onclick="window.navigate('game', 'addition')" class="bg-green-400 p-6 rounded-3xl text-white font-lalezar text-2xl kid-shadow kid-button-active">➕ بازی جمع</button>
                        <button onclick="window.navigate('game', 'subtraction')" class="bg-pink-400 p-6 rounded-3xl text-white font-lalezar text-2xl kid-shadow kid-button-active">➖ بازی تفریق</button>
                        <button onclick="window.navigate('game', 'patterns')" class="bg-yellow-400 p-6 rounded-3xl text-white font-lalezar text-2xl kid-shadow kid-button-active">🧩 الگوها</button>
                    </div>
                </div>

                <button onclick="window.navigate('parent')" class="mt-4 text-gray-400 flex items-center gap-2 font-bold">
                    ⚙️ پنل والدین
                </button>
            </div>
        `;
    } else if (state.screen === 'game') {
        const q = state.currentQuestion;
        app.innerHTML = `
            <div class="p-6 flex flex-col items-center ${state.feedback === 'correct' ? 'bg-green-100' : state.feedback === 'wrong' ? 'bg-red-100' : ''} transition-colors duration-300 min-h-screen">
                <header class="w-full max-w-2xl flex justify-between items-center mb-6">
                    <button onclick="window.navigate('home')" class="bg-red-400 text-white px-6 py-2 rounded-2xl font-lalezar kid-shadow kid-button-active">خروج</button>
                    <div class="text-2xl font-lalezar text-blue-800">سوال ${state.questionIndex + 1} از ۵</div>
                </header>

                <div class="w-full max-w-2xl bg-white rounded-[3rem] p-10 shadow-2xl border-4 border-white flex flex-col items-center">
                    <h2 class="text-4xl font-lalezar text-blue-900 mb-10">${q.prompt}</h2>
                    
                    <div class="flex flex-wrap justify-center gap-4 mb-12 text-6xl">
                        ${q.visuals.map(v => `<span>${v}</span>`).join('')}
                    </div>

                    <div class="grid grid-cols-2 gap-6 w-full">
                        ${q.options.map((opt, i) => `
                            <button onclick="window.checkAnswer('${opt}')" 
                                    class="bg-blue-100 hover:bg-blue-200 p-8 rounded-3xl text-4xl font-lalezar text-blue-800 kid-shadow kid-button-active transition-all
                                    ${state.feedback && opt == q.answer ? 'bg-green-400 text-white' : ''}
                                    ${state.feedback === 'wrong' && opt != q.answer ? 'animate-shake' : ''}">
                                ${opt}
                            </button>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    } else if (state.screen === 'reward') {
        app.innerHTML = `
            <div class="p-6 flex flex-col items-center justify-center min-h-screen bg-green-50">
                <div class="text-9xl mb-6">🎉</div>
                <h2 class="text-6xl font-lalezar text-green-700 mb-4">آفرین قهرمان!</h2>
                <p class="text-3xl font-lalezar text-green-600 mb-8">تو تونستی ${state.score} تا ستاره بگیری!</p>
                <div class="flex gap-4 mb-10">
                    ${Array(state.score).fill('⭐').map(s => `<span class="text-6xl animate-bounce">${s}</span>`).join('')}
                </div>
                <button onclick="window.navigate('home')" class="bg-blue-500 text-white px-12 py-6 rounded-3xl font-lalezar text-3xl kid-shadow kid-button-active">برگشت به خانه</button>
            </div>
        `;
    } else if (state.screen === 'parent') {
        app.innerHTML = `
            <div class="p-6 flex flex-col items-center">
                <div class="w-full max-w-md bg-white rounded-3xl p-8 shadow-xl">
                    <h2 class="text-2xl font-bold mb-6 text-center">گزارش پیشرفت فرزند</h2>
                    <div class="space-y-4 mb-8">
                        <div class="flex justify-between p-3 bg-gray-50 rounded-xl">
                            <span>کل ستاره‌ها:</span>
                            <span class="font-bold">${state.stars} ⭐</span>
                        </div>
                        <div class="flex justify-between p-3 bg-gray-50 rounded-xl">
                            <span>بازی‌های تمام شده:</span>
                            <span class="font-bold">${state.completedGames}</span>
                        </div>
                    </div>
                    <button onclick="window.resetData()" class="w-full bg-red-100 text-red-600 py-3 rounded-xl font-bold mb-4">پاک کردن تمام اطلاعات</button>
                    <button onclick="window.navigate('home')" class="w-full bg-gray-800 text-white py-3 rounded-xl font-bold">بازگشت</button>
                </div>
            </div>
        `;
    }
}

// توابع عمومی برای دسترسی در HTML
// Fix: Use type assertion on window to allow dynamic properties in TypeScript
(window as any).navigate = navigate;
(window as any).checkAnswer = checkAnswer;
(window as any).resetData = () => {
    if(confirm('آیا مطمئن هستید؟ تمام ستاره‌ها پاک می‌شوند.')) {
        localStorage.clear();
        location.reload();
    }
};

// شروع برنامه
render();
