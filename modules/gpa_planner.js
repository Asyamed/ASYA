// --- GPA Bölümünü Render Edecek Fonksiyon ---
const renderGpaSection = ({ asyaState, helpers }) => {
    const { years=[] } = asyaState.gpa;
    const courseOptions = asyaState.commonCourses.map(c=>`<option value="${c}">${c}</option>`).join('');
    
    // GPA istatistik başlığını render eden iç fonksiyon
    const renderGpaStatsHeader = () => {
        const { cgpa, projected } = helpers.computeGPA();
        return `
        <div class="glass soft p-3 flex flex-wrap items-center justify-between gap-4 mb-4">
            <div class="flex items-center gap-3 text-sm">
                <span>Hedef Not (projeksiyon):</span>
                <select data-action="change-target-grade" class="input bg-white/5 py-1 text-xs">
                    ${Object.keys(asyaState.gradeScale).map(g=>`<option ${g===asyaState.targetFutureGrade?'selected':''}>${g}</option>`).join('')}
                </select>
            </div>
            <div class="flex items-center gap-4">
                <div class="flex items-center gap-2">
                    <span class="text-text-secondary text-sm">GANO</span>
                    <span class="font-bold text-white text-base">${cgpa}</span>
                </div>
                <div class="flex items-center gap-2">
                    <span class="text-text-secondary text-sm">Projeksiyon</span>
                    <span class="font-bold text-accent text-base">${projected}</span>
                </div>
                <button class="main-button py-1.5 px-4 text-sm" data-action="save-gpa">Kaydet</button>
            </div>
        </div>`;
    };

    return `
    <div id="gpa-content-wrapper">
        ${renderGpaStatsHeader()}
        <div class="flex items-center justify-end mb-4">
            <button data-action="add-year" class="main-button text-sm font-semibold py-2 px-4 flex items-center gap-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                Yıl Ekle
            </button>
        </div>
        <div class="space-y-6">
            ${years.map((year, yi) => `
            <div class="glass soft overflow-hidden">
                <div class="p-4 flex items-center justify-between bg-white/5">
                    <div class="flex items-center gap-4">
                        <input data-action="edit-year-title" data-year="${year.id}" value="${year.title || ((yi + 1) + '. Yıl')}" class="input bg-white/10 font-semibold text-lg w-40">
                        <span class="badge active text-base">Yıl GNO: ${helpers.yearGPA(year)}</span>
                    </div>
                    <div class="flex items-center gap-2">
                        <button data-action="add-kurul" data-year="${year.id}" class="px-3 py-1.5 rounded-lg bg-accent/20 hover:bg-accent/40 text-sm font-semibold text-accent">+ Kurul Ekle</button>
                        <button data-action="remove-year" data-year="${year.id}" class="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                        </button>
                    </div>
                </div>
                <div class="p-4">
                    <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                        ${(year.kuruls || []).map((kurul, ki) => `
                        <div class="glass p-3 rounded-lg border border-border">
                            <div class="flex items-center justify-between mb-3">
                                <input data-action="edit-kurul-title" data-year="${year.id}" data-kurul="${kurul.id}" value="${kurul.title || ((ki + 1) + '. Kurul')}" class="input bg-white/5 font-semibold text-base w-3/4">
                                <button data-action="remove-kurul" data-year="${year.id}" data-kurul="${kurul.id}" class="p-1.5 rounded bg-red-500/20 hover:bg-red-500/30 text-xs">
                                    <svg class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" /></svg>
                                </button>
                            </div>
                             <div class="mb-3">
                                <label class="text-xs text-text-secondary">Kurul Sınav Notu</label>
                                <input type="text" data-action="edit-kurul-exam-grade" data-year="${year.id}" data-kurul="${kurul.id}" value="${kurul.examGrade || ''}" placeholder="Örn: 85" class="input w-full mt-1 text-sm">
                             </div>
                            <table class="w-full table-mini">
                                <thead><tr class="text-text-secondary text-xs"><th class="text-left w-2/4">Ders</th><th class="text-center">Kredi</th><th class="text-center">Not</th><th></th></tr></thead>
                                <tbody>
                                    ${(kurul.courses || []).map(course => `
                                    <tr>
                                        <td class="pr-2 py-1"><input data-action="edit-course-name" data-year="${year.id}" data-kurul="${kurul.id}" data-course="${course.id}" value="${course.name || ''}" placeholder="Ders adı" list="common-courses" class="input w-full text-sm"></td>
                                        <td class="px-1 py-1"><input type="number" min="0" step="0.5" value="${course.credit || 0}" data-action="edit-course-credit" data-year="${year.id}" data-kurul="${kurul.id}" data-course="${course.id}" class="input w-14 text-center text-sm"></td>
                                        <td class="px-1 py-1">
                                            <select data-action="edit-course-grade" data-year="${year.id}" data-kurul="${kurul.id}" data-course="${course.id}" class="input w-full text-center text-sm">
                                                <option value="">-</option>
                                                ${Object.keys(asyaState.gradeScale).map(g => `<option ${course.grade === g ? 'selected' : ''} value="${g}">${g}</option>`).join('')}
                                            </select>
                                        </td>
                                        <td class="text-right py-1">
                                            <button data-action="remove-course" data-year="${year.id}" data-kurul="${kurul.id}" data-course="${course.id}" class="p-1.5 rounded bg-white/5 hover:bg-red-500/20 text-xs">
                                               <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                            </button>
                                        </td>
                                    </tr>`).join('')}
                                </tbody>
                            </table>
                            <datalist id="common-courses">${courseOptions}</datalist>
                            <div class="mt-2">
                                <button data-action="add-course" data-year="${year.id}" data-kurul="${kurul.id}" class="w-full py-1.5 rounded bg-white/5 hover:bg-white/10 text-xs font-semibold">+ Ders Ekle</button>
                            </div>
                        </div>`).join('') || '<p class="text-text-secondary text-sm text-center col-span-full py-4">Henüz kurul eklenmedi.</p>'}
                    </div>
                </div>
            </div>`).join('')}
        </div>
    </div>`;
};

// --- Planlayıcı Bölümünü Render Edecek Fonksiyon ---
const renderPlannerSection = ({ asyaState, helpers }) => {
    const y = asyaState.planner.monthYear.year;
    const m = asyaState.planner.monthYear.month;
    const grid = helpers.getCalendarGrid(y, m);
    const monthName = new Date(y, m, 1).toLocaleString('tr-TR', { month: 'long', year: 'numeric' });
    const calendarCells = grid.map(d => {
        if (!d) return `<div class="h-24 border border-border/50 rounded-lg bg-white/2"></div>`;
        const key = helpers.fmtDate(d);
        const tasks = asyaState.planner.byDate[key] || [];
        const isSel = asyaState.planner.selectedDate === key;
        const isToday = helpers.fmtDate(new Date()) === key;
        return `
        <button data-action="select-date" data-date="${key}" class="h-24 text-left border rounded-lg hover:bg-white/10 transition-colors duration-200 ${isSel ? 'bg-accent/10 border-accent/50' : 'border-border/50'}">
            <div class="px-2 pt-1 text-xs ${isToday ? 'font-bold text-accent' : 'text-text-secondary'}">${d.getDate()}</div>
            <div class="px-2 space-y-1 mt-1 overflow-hidden">
                ${tasks.slice(0, 2).map(t => `<div class="text-[11px] truncate ${t.done ? 'line-through text-text-secondary' : 'text-text-primary'}">● ${t.text}</div>`).join('')}
                ${tasks.length > 2 ? `<div class="text-[11px] text-text-secondary">+${tasks.length - 2} daha</div>` : ''}
            </div>
        </button>`;
    }).join('');
    const scheduleDays = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cts', 'Paz'];
    const scheduleTimes = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];
    const scheduleData = asyaState.planner.schedule || {};

    return `
    <div class="space-y-4">
        <div class="grid grid-cols-1 xl:grid-cols-3 gap-4">
            <div class="xl:col-span-2 glass soft p-4">
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                        <button data-action="calendar-prev" class="p-2 rounded-md bg-white/5 hover:bg-white/10"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg></button>
                        <div class="font-semibold text-lg w-40 text-center">${monthName}</div>
                        <button data-action="calendar-next" class="p-2 rounded-md bg-white/5 hover:bg-white/10"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg></button>
                    </div>
                    <div class="text-sm text-text-secondary">Gün seçip görev ekleyin</div>
                </div>
                <div class="grid grid-cols-7 gap-2 mt-3">${['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cts', 'Paz'].map(day => `<div class="text-xs text-text-secondary text-center font-semibold">${day}</div>`).join('')}${calendarCells}</div>
            </div>
            <div class="glass soft p-4">
                <h4 class="font-semibold text-lg">Seçili Gün</h4>
                <div class="text-sm text-text-secondary mb-3">${new Date(asyaState.planner.selectedDate.replace(/-/g, '/')).toLocaleDateString('tr-TR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
                <div class="mt-2 flex gap-2"><input class="input flex-1" placeholder="Yeni görev..." data-action="date-task-input"><button class="main-button px-4 py-1.5 text-sm font-semibold" data-action="add-date-task">Ekle</button></div>
                <div class="mt-3 space-y-2 h-48 overflow-y-auto pr-1" id="selected-date-tasks">
                    ${(asyaState.planner.byDate[asyaState.planner.selectedDate] || []).length > 0 ? (asyaState.planner.byDate[asyaState.planner.selectedDate] || []).map(t => `
                    <div class="todo-item ${t.done ? 'done' : ''}">
                        <label class="todo-label" data-action="toggle-date-task" data-id="${t.id}"><span class="todo-checkbox"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg></span><span class="todo-text">${t.text}</span></label>
                        <button class="p-1.5 rounded-md bg-red-500/10 hover:bg-red-500/30 text-red-400" data-action="delete-date-task" data-id="${t.id}"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg></button>
                    </div>`).join('') : '<p class="text-center text-sm text-text-secondary pt-12">Bu gün için görev yok.</p>'}
                </div>
            </div>
        </div>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div class="glass soft p-4">
                <div class="flex items-center justify-between mb-3"><h4 class="font-semibold text-lg">Haftalık Plan</h4><div class="flex gap-2"><input class="input flex-1" placeholder="Haftalık hedef..." data-action="weekly-task-input"><button data-action="add-weekly-task" class="main-button px-4 py-1.5 text-sm font-semibold">Ekle</button></div></div>
                <div class="space-y-2 h-48 overflow-y-auto pr-1" id="weekly-tasks">
                    ${(asyaState.planner.weekly || []).map((t, idx) => `<div class="todo-item ${t.done ? 'done' : ''}"><label class="todo-label" data-action="toggle-weekly-task" data-index="${idx}"><span class="todo-checkbox"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg></span><span class="todo-text">${t.text}</span></label><button class="p-1.5 rounded-md bg-red-500/10 hover:bg-red-500/30 text-red-400" data-action="delete-weekly-task" data-index="${idx}"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg></button></div>`).join('')}
                </div>
            </div>
            <div class="glass soft p-4">
                <div class="flex items-center justify-between mb-3"><h4 class="font-semibold text-lg">Günlük Plan</h4><div class="flex gap-2 items-center"><button data-action="clear-daily-tasks" class="text-xs text-text-secondary hover:text-white">Bugünü Temizle</button><input class="input flex-1" placeholder="Günlük görev..." data-action="daily-task-input"><button data-action="add-daily-task" class="main-button px-4 py-1.5 text-sm font-semibold">Ekle</button></div></div>
                <div class="space-y-2 h-48 overflow-y-auto pr-1" id="daily-tasks">
                    ${(asyaState.planner.daily || []).map((t, idx) => `<div class="todo-item ${t.done ? 'done' : ''}"><label class="todo-label" data-action="toggle-daily-task" data-index="${idx}"><span class="todo-checkbox"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg></span><span class="todo-text">${t.text}</span></label><button class="p-1.5 rounded-md bg-red-500/10 hover:bg-red-500/30 text-red-400" data-action="delete-daily-task" data-index="${idx}"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg></button></div>`).join('')}
                </div>
            </div>
        </div>
        <div class="glass soft p-4">
            <h3 class="text-lg font-semibold mb-3">Haftalık Ders Programı</h3>
            <div class="overflow-x-auto">
                <table class="w-full schedule-table">
                    <thead><tr><th class="w-24">Saat</th>${scheduleDays.map(day => `<th>${day}</th>`).join('')}</tr></thead>
                    <tbody>
                        ${scheduleTimes.map(time => `<tr><td>${time}</td>${scheduleDays.map(day => {
                            const key = `${day.toLowerCase().substring(0, 3)}-${time.replace(':', '')}`;
                            const value = scheduleData[key] || '';
                            return `<td><div class="schedule-entry">${value}</div><button data-action="open-schedule-modal" data-key="${key}" class="schedule-add-btn">+</button></td>`;
                        }).join('')}</tr>`).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    </div>`;
};

const gpaPlannerModule = {
    id: 'gpa-tracker', 
    name: 'GPA & Planlayıcı', 
    roles: ['student'], 
    hasChatHistory: false, 
    icon: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg>`, 
    render: (context) => {
        return `
        <div class="h-full flex flex-col">
            <div class="flex-shrink-0 p-2 glass soft mb-3">
                <div class="flex items-center justify-center gap-2 bg-background/40 p-1 rounded-lg">
                    <button class="gpa-planner-tab flex-1 text-center" data-tab-btn="planner">Planlayıcı</button>
                    <button class="gpa-planner-tab flex-1 text-center" data-tab-btn="gpa">GPA Takibi</button>
                </div>
            </div>
            <div class="flex-1 overflow-y-auto pr-2">
                <div id="planner-section" class="tab-content-panel space-y-4">
                    ${renderPlannerSection(context)}
                </div>
                <div id="gpa-section" class="tab-content-panel space-y-6">
                    ${renderGpaSection(context)}
                </div>
            </div>

            <div id="schedule-modal" class="fixed inset-0 bg-black/60 z-40 flex items-center justify-center p-4 hidden">
                 <div class="glass-strong soft w-full max-w-md p-4 rounded-xl border border-border">
                     <div class="flex justify-between items-center mb-4">
                         <h3 class="text-lg font-semibold">Ders Seç</h3>
                         <button data-action="close-schedule-modal" class="p-2 rounded-full hover:bg-white/10">&times;</button>
                     </div>
                     <input id="schedule-modal-search" class="input w-full mb-3" placeholder="Ders ara...">
                     <div id="schedule-modal-list" class="max-h-64 overflow-y-auto space-y-1 pr-2">
                         ${context.asyaState.commonCourses.map(course => `<button class="w-full text-left p-2 rounded-lg hover:bg-white/10 transition-colors text-sm" data-course-name="${course}">${course}</button>`).join('')}
                     </div>
                 </div>
            </div>
        </div>`;
    },
    // Bu fonksiyonları dışarıdan erişilebilir yapalım ki event listener'lar dinamik olarak yeniden render edebilsin
    renderGpaSection,
    renderPlannerSection
};

export default gpaPlannerModule;