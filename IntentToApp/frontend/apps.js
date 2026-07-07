const specialApps = ['travel', 'finance', 'healthcare', 'education', 'event'];

function isSpecialApp(intentId) {
    return specialApps.includes(intentId);
}

function renderSpecialApp(intentId) {
    const canvas = document.getElementById('dynamic-canvas');
    canvas.innerHTML = ''; 
    const wrapper = document.createElement('div');
    wrapper.className = 'special-app-wrapper';
    
    if (intentId === 'travel') {
        renderTravelApp(wrapper);
    } else if (intentId === 'finance') {
        renderFinanceApp(wrapper);
    } else if (intentId === 'healthcare') {
        renderHealthcareApp(wrapper);
    } else if (intentId === 'education') {
        renderEducationApp(wrapper);
    } else if (intentId === 'event') {
        renderEventApp(wrapper);
    }
    
    canvas.appendChild(wrapper);
}

function renderTravelApp(container) {
    container.innerHTML = `
      <h2 class="app-title">✈️ Travel & Itinerary Planning</h2>
      <div class="app-grid">
         <div class="glass-card">
            <h3>Trip Details</h3>
            <div class="input-group">
               <label>Destination</label>
               <input type="text" id="travel-dest" placeholder="Where to?">
            </div>
            <div class="input-group row">
               <div><label>Start Date</label><input type="date" id="travel-start"></div>
               <div><label>End Date</label><input type="date" id="travel-end"></div>
            </div>
         </div>

         <div class="glass-card">
            <h3>Day-wise Itinerary</h3>
            <button class="action-btn" id="travel-add-day">+ Add Day Activity</button>
            <div id="travel-itinerary" class="scrollable-list"></div>
         </div>

         <div class="glass-card">
            <h3>Budget Calculator</h3>
            <div class="input-group row">
               <label>Total Budget ($)</label>
               <input type="number" id="travel-total" value="0">
            </div>
            <div class="budget-splits">
               <input type="number" id="travel-tr" placeholder="Transport" class="ttest">
               <input type="number" id="travel-fd" placeholder="Food" class="ttest">
               <input type="number" id="travel-st" placeholder="Stay" class="ttest">
               <input type="number" id="travel-mc" placeholder="Misc" class="ttest">
            </div>
            <div class="budget-result">Rem: <span id="travel-rem" class="pos">$0</span></div>
         </div>

         <div class="glass-card">
            <h3>Hotel & Flight Tracker</h3>
            <div class="input-group row">
               <input type="text" id="hf-n" placeholder="Name">
               <input type="date" id="hf-d">
            </div>
            <div class="input-group row">
               <input type="text" id="hf-b" placeholder="Booking ID">
               <input type="number" id="hf-c" placeholder="Cost ($)">
            </div>
            <button class="action-btn" id="hf-add">+ Track Booking</button>
            <div id="hf-list" class="scrollable-list tiny"></div>
         </div>

         <div class="glass-card">
            <h3>Packing Checklist</h3>
            <div class="input-group row">
               <input type="text" id="pack-i" placeholder="Item name">
               <button class="action-btn" id="pack-a">+</button>
            </div>
            <div id="pack-l" class="scrollable-list tiny"></div>
         </div>

         <div class="glass-card">
            <h3>Group Expenses Splitter</h3>
            <div class="input-group row">
               <input type="text" id="g-n" placeholder="Name">
               <input type="number" id="g-p" placeholder="Amount Paid">
               <button class="action-btn" id="g-a">+</button>
            </div>
            <div id="g-l" class="scrollable-list tiny"></div>
            <div class="budget-text" id="g-res" style="text-align:left;line-height:1.4"></div>
         </div>
      </div>
    `;

    // JS Logic
    let days = 0;
    document.getElementById('travel-add-day').onclick = () => {
        days++;
        const div = document.createElement('div'); div.className = 'list-item';
        div.innerHTML = `<span>Day ${days}</span> <input type="text" placeholder="Activity details..." style="width:70%; border:none; border-bottom:1px solid #fff; background:transparent; color:#fff;">`;
        document.getElementById('travel-itinerary').appendChild(div);
    };

    const calcB = () => {
        const t = parseFloat(document.getElementById('travel-total').value||0);
        const sums = ['travel-tr','travel-fd','travel-st','travel-mc'].reduce((a,id) => a + (parseFloat(document.getElementById(id).value||0)), 0);
        const r = t - sums;
        document.getElementById('travel-rem').textContent = '$'+r;
        document.getElementById('travel-rem').className = r>=0 ? 'pos' : 'neg';
    };
    document.querySelectorAll('#travel-total, .ttest').forEach(e => e.oninput = calcB);

    document.getElementById('hf-add').onclick = () => {
        const n=document.getElementById('hf-n').value; const b=document.getElementById('hf-b').value;
        const c=document.getElementById('hf-c').value;
        if(!n) return;
        const d = document.createElement('div'); d.className='list-item';
        d.innerHTML = `<span>${n}</span> <span>ID:${b} | $${c}</span>`;
        document.getElementById('hf-list').appendChild(d);
     };

     document.getElementById('pack-a').onclick = () => {
        const v = document.getElementById('pack-i').value;
        if(!v) return;
        const d = document.createElement('div'); d.className='checkbox-item';
        d.innerHTML = `<input type="checkbox"> <span>${v}</span>`;
        document.getElementById('pack-l').appendChild(d);
        document.getElementById('pack-i').value='';
     };

     let gps = [];
     document.getElementById('g-a').onclick = () => {
         const n = document.getElementById('g-n').value;
         const p = parseFloat(document.getElementById('g-p').value||0);
         if(!n) return;
         gps.push({n,p});
         const d = document.createElement('div'); d.className='list-item';
         d.innerHTML = `<span>${n}</span> <span>Paid $${p}</span>`;
         document.getElementById('g-l').appendChild(d);
         const tot = gps.reduce((a,b)=>a+b.p,0);
         const per = tot/gps.length;
         let txt = `Total: $${tot} <br>Per Person: $${per.toFixed(2)}<br>`;
         gps.forEach(g => {
             const df = g.p - per;
             if(df>0) txt += `<span style="color:#10b981">${g.n} is owed $${df.toFixed(2)}</span><br>`;
             else if(df<0) txt += `<span style="color:#ef4444">${g.n} owes $${Math.abs(df).toFixed(2)}</span><br>`;
             else txt += `${g.n} settled.<br>`;
         });
         document.getElementById('g-res').innerHTML = txt;
     };
}

function renderFinanceApp(container) {
    container.innerHTML = `
      <h2 class="app-title">💰 Finance & Wealth Management</h2>
      <div class="app-grid">
         <div class="glass-card">
            <h3>Income & Expense Log</h3>
            <div class="tabs"><button class="tab-btn active" id="f-t-inc">Income</button><button class="tab-btn" id="f-t-exp">Expense</button></div>
            <div class="input-group row">
               <input type="number" id="f-amt" placeholder="Amount ($)">
               <input type="date" id="f-dt" class="small-dt">
            </div>
            <div class="input-group row">
               <input type="text" id="f-cat" placeholder="Category (e.g. Rent, Food)">
               <button class="action-btn" id="f-add">+</button>
            </div>
            <div id="f-l" class="scrollable-list tiny"></div>
         </div>

         <div class="glass-card">
            <h3>Monthly Budget limits</h3>
            <div class="input-group row">
                <input type="number" id="f-lim" placeholder="Set Limit ($)">
            </div>
            <div class="progress-bar-bg"><div class="progress-bar-fill" id="f-bar"></div></div>
            <div class="budget-text" id="f-bar-txt">0% Spent</div>
            
            <h4 style="margin-top:0.5rem;color:var(--accent);">Spend by Category</h4>
            <div class="pie-chart-container">
                <div class="pie-chart" id="f-pie"></div>
                <div id="f-leg" class="pie-legend"></div>
            </div>
         </div>

         <div class="glass-card">
            <h3>Savings Goal Tracker</h3>
            <input type="text" placeholder="Goal Name" id="f-g-n">
            <div class="input-group row">
               <input type="number" id="f-g-trg" placeholder="Target ($)">
               <input type="number" id="f-g-cur" placeholder="Saved so far">
            </div>
            <button class="action-btn" id="f-g-up">Update Progress</button>
            <div class="ring-container">
                <div class="progress-ring" id="f-rg">
                    <div class="ring-inner-text" id="f-rg-t">0%</div>
                </div>
            </div>
         </div>

         <div class="glass-card">
            <h3>Upcoming Bill Reminders</h3>
            <div class="input-group row">
               <input type="text" id="b-n" placeholder="Bill Name">
               <input type="date" id="b-d">
               <button class="action-btn" id="b-a">+</button>
            </div>
            <div id="b-l" class="scrollable-list tiny"></div>
         </div>
      </div>
    `;

    let exps = []; let isIn = true;
    document.getElementById('f-t-inc').onclick=()=>{isIn=true; document.getElementById('f-t-inc').classList.add('active'); document.getElementById('f-t-exp').classList.remove('active');};
    document.getElementById('f-t-exp').onclick=()=>{isIn=false; document.getElementById('f-t-exp').classList.add('active'); document.getElementById('f-t-inc').classList.remove('active');};

    const upFin = () => {
        const lim = parseFloat(document.getElementById('f-lim').value||1);
        const tot = exps.reduce((a,b)=>a+b.amt,0);
        let pct = (tot/lim)*100; if(pct>100) pct=100;
        document.getElementById('f-bar').style.width = pct+'%';
        document.getElementById('f-bar').style.background = pct>80 ? '#ef4444':'#10b981';
        document.getElementById('f-bar-txt').textContent = \`\${pct.toFixed(2)}% Spent ($\${tot} / $\${lim})\`;

        const cmap = {};
        exps.forEach(e=> cmap[e.c] = (cmap[e.c]||0)+e.amt);
        const cols = ['#f87171','#fbbf24','#34d399','#60a5fa','#a78bfa'];
        let co='', cd=0, ci=0, tl=tot||1; let leg='';
        for(let k in cmap) {
            let dg = (cmap[k]/tl)*360;
            let hl = cols[ci%cols.length];
            co += \`\${hl} \${cd}deg \${cd+dg}deg,\`;
            leg += \`<div><span style="display:inline-block;width:10px;height:10px;background:\${hl}"></span> \${k} ($\${cmap[k]})</div>\`;
            cd+=dg; ci++;
        }
        if(co) co=co.slice(0,-1); else co='transparent 0deg 360deg';
        document.getElementById('f-pie').style.background = \`conic-gradient(\${co})\`;
        document.getElementById('f-leg').innerHTML = leg;
    };
    document.getElementById('f-lim').oninput = upFin;

    document.getElementById('f-add').onclick = () => {
        const a=parseFloat(document.getElementById('f-amt').value);
        const c=document.getElementById('f-cat').value||'Misc';
        const d=document.getElementById('f-dt').value;
        if(!a) return;
        const nd = document.createElement('div'); nd.className='list-item';
        if(isIn) {
            nd.innerHTML=\`<span class="pos">+$${a} (${c})</span><span>${d}</span>\`;
        } else {
            exps.push({amt:a, c:c});
            nd.innerHTML=\`<span class="neg">-$${a} (${c})</span><span>${d}</span>\`;
        }
        document.getElementById('f-l').appendChild(nd);
        upFin();
    };

    document.getElementById('f-g-up').onclick=()=>{
        const trg = parseFloat(document.getElementById('f-g-trg').value||1);
        const cur = parseFloat(document.getElementById('f-g-cur').value||0);
        let pct = (cur/trg)*100; if(pct<0)pct=0; if(pct>100)pct=100;
        document.getElementById('f-rg').style.setProperty('--percentage', pct+'%');
        document.getElementById('f-rg-t').textContent = pct.toFixed(1)+'%';
        document.getElementById('f-rg-t').style.color = pct>=100?'#10b981':'#fff';
    };

    document.getElementById('b-a').onclick=()=>{
        const n=document.getElementById('b-n').value; const d=document.getElementById('b-d').value;
        if(!n) return;
        const nd = document.createElement('div'); nd.className='checkbox-item';
        nd.innerHTML = \`<input type="checkbox"> <span>\${n} (Due:\${d})</span>\`;
        document.getElementById('b-l').appendChild(nd);
    };
}

function renderHealthcareApp(container) {
    container.innerHTML = `
      <h2 class="app-title">🏥 Healthcare & Medical Logs</h2>
      <div class="app-grid">
         <div class="glass-card">
            <h3>Patient Information</h3>
            <div class="input-group row">
               <input type="text" placeholder="Full Name">
               <input type="number" placeholder="Age">
            </div>
            <div class="input-group row">
               <input type="text" placeholder="Blood Group">
               <input type="text" placeholder="Allergies">
            </div>
         </div>

         <div class="glass-card">
            <h3>Symptom Logger</h3>
            <div class="input-group row">
               <input type="text" id="s-n" placeholder="Symptom">
               <input type="date" id="s-d">
            </div>
            <div class="input-group row">
               <select id="s-s"><option>Mild</option><option>Moderate</option><option>Severe</option></select>
               <button class="action-btn" id="s-a">+ Log</button>
            </div>
            <div id="s-l" class="scrollable-list tiny"></div>
         </div>

         <div class="glass-card">
            <h3>Medicine Timetable</h3>
            <div class="input-group row">
               <input type="text" id="m-n" placeholder="Meds Name & Dose">
               <select id="m-t"><option>Morning</option><option>Afternoon</option><option>Night</option></select>
               <button class="action-btn" id="m-a">+</button>
            </div>
            <div id="m-l" class="scrollable-list tiny"></div>
         </div>

         <div class="glass-card">
            <h3>Scheduling & Connect</h3>
            <h4 style="color:var(--accent); font-weight:400; font-size:1rem;">Appt Scheduler</h4>
            <div class="input-group row">
                <input type="text" id="a-n" placeholder="Dr. Name">
                <input type="datetime-local" id="a-d">
                <button class="action-btn" id="a-a">+</button>
            </div>
            <div id="a-l" class="scrollable-list tiny" style="margin-bottom:1rem;"></div>

            <h4 style="color:var(--accent); font-weight:400; font-size:1rem;">Emergency Contacts</h4>
            <div class="input-group row">
                <input type="text" id="e-n" placeholder="Name">
                <input type="tel" id="e-t" placeholder="Phone">
                <button class="action-btn" id="e-a">+</button>
            </div>
            <div id="e-l" class="scrollable-list tiny"></div>
         </div>

         <div class="glass-card">
            <h3>Daily Water Intake (Goal: 8)</h3>
            <div style="font-size:1.5rem;" id="w-c">0 / 8 Glasses</div>
            <div class="progress-bar-bg"><div class="progress-bar-fill" id="w-b"></div></div>
            <div class="glass-panels" id="w-g-c">
                <span class="water-glass">💧</span><span class="water-glass">💧</span><span class="water-glass">💧</span><span class="water-glass">💧</span>
                <span class="water-glass">💧</span><span class="water-glass">💧</span><span class="water-glass">💧</span><span class="water-glass">💧</span>
            </div>
         </div>
      </div>
    `;

    document.getElementById('s-a').onclick=()=>{
        const n=document.getElementById('s-n').value;const d=document.getElementById('s-d').value;const s=document.getElementById('s-s').value;
        if(!n)return;
        const nd=document.createElement('div');nd.className='list-item';
        let cl = s==='Severe'?'neg':s==='Moderate'?'#fbbf24':'pos';
        nd.innerHTML=\`<span>\${n}</span><span>\${d} | <b style="color:\${cl}">\${s}</b></span>\`;
        document.getElementById('s-l').appendChild(nd);
    };

    document.getElementById('m-a').onclick=()=>{
        const n=document.getElementById('m-n').value; const t=document.getElementById('m-t').value;
        if(!n)return;
        const nd=document.createElement('div');nd.className='checkbox-item';
        nd.innerHTML=\`<input type="checkbox"> <span>\${n} (\${t})</span>\`;
        document.getElementById('m-l').appendChild(nd);
    };

    document.getElementById('a-a').onclick=()=>{
        const n=document.getElementById('a-n').value; const d=document.getElementById('a-d').value;
        if(!n)return;
        const nd=document.createElement('div');nd.className='list-item';
        nd.innerHTML=\`<span>Dr. \${n}</span><span>\${new Date(d).toLocaleString()}</span>\`;
        document.getElementById('a-l').appendChild(nd);
    };

    document.getElementById('e-a').onclick=()=>{
        const n=document.getElementById('e-n').value; const t=document.getElementById('e-t').value;
        if(!n)return;
        const nd=document.createElement('div');nd.className='list-item';
        nd.innerHTML=\`<span>⚠️ \${n}</span><a href="tel:\${t}" style="color:var(--accent)">\${t}</a>\`;
        document.getElementById('e-l').appendChild(nd);
    };

    let wg = 0;
    const gEls = document.querySelectorAll('.water-glass');
    gEls.forEach((g, idx) => {
        g.onclick = () => {
            wg = idx+1;
            gEls.forEach((gl, i) => { if(i<wg) gl.classList.add('filled'); else gl.classList.remove('filled'); });
            document.getElementById('w-c').textContent = \`\${wg} / 8 Glasses\`;
            document.getElementById('w-b').style.width = \`\${(wg/8)*100}%\`;
        };
    });
}

function renderEducationApp(container) {
    container.innerHTML = `
      <h2 class="app-title">🎓 Education & Study Portal</h2>
      <div class="app-grid">
         <div class="glass-card">
            <h3>Subject Manager</h3>
            <div class="input-group row">
               <input type="text" id="su-n" placeholder="Subject Name">
               <input type="color" id="su-c" style="padding:0;height:42px;width:50px;border:none;">
               <button class="action-btn" id="su-add">+</button>
            </div>
            <div id="su-l" style="display:flex;gap:0.5rem;flex-wrap:wrap;margin-top:1rem;"></div>
         </div>

         <div class="glass-card">
            <h3>Assignment Tracker</h3>
            <div class="input-group row">
               <input type="text" id="as-su" placeholder="Subject">
               <input type="text" id="as-n" placeholder="Assignment Name">
            </div>
            <div class="input-group row">
               <input type="date" id="as-d">
               <button class="action-btn" id="as-a">+ Add Task</button>
            </div>
            <div id="as-l" class="scrollable-list tiny"></div>
         </div>

         <div class="glass-card">
            <h3>Study Planner</h3>
            <div class="input-group row">
               <input type="text" id="sp-su" placeholder="Subject">
               <select id="sp-d"><option>Mon</option><option>Tue</option><option>Wed</option><option>Thu</option><option>Fri</option><option>Sat</option><option>Sun</option></select>
            </div>
            <div class="input-group row">
               <input type="number" id="sp-h" placeholder="Hours">
               <button class="action-btn" id="sp-a">+ Plan</button>
            </div>
            <div id="sp-l" class="scrollable-list tiny"></div>
         </div>

         <div class="glass-card">
            <h3>Quick Notes</h3>
            <input type="text" id="nt-su" placeholder="Topic Title" style="margin-bottom:0.5rem;">
            <textarea id="nt-t" placeholder="Write your notes here..." rows="3" style="resize:none;margin-bottom:0.5rem;"></textarea>
            <button class="action-btn" id="nt-a">Save Note</button>
            <div id="nt-l" class="scrollable-list tiny" style="margin-top:0.5rem"></div>
         </div>

         <div class="glass-card">
            <h3>Exam Countdown</h3>
            <div class="input-group row">
               <input type="text" id="ex-n" placeholder="Exam Name">
               <input type="date" id="ex-d">
               <button class="action-btn" id="ex-a">+</button>
            </div>
            <div id="ex-l" class="scrollable-list tiny"></div>
         </div>

         <div class="glass-card">
            <h3>Topic Progress</h3>
            <div class="input-group row">
               <input type="text" id="tp-n" placeholder="Topic Name">
               <input type="number" id="tp-t" placeholder="Total Chapters">
               <input type="number" id="tp-d" placeholder="Done">
            </div>
            <button class="action-btn" id="tp-a" style="margin-bottom:0.5rem;">Update Bar</button>
            <div class="progress-bar-bg"><div class="progress-bar-fill" id="tp-b" style="background:var(--accent)"></div></div>
            <div class="budget-text" id="tp-rt">0% Done</div>
         </div>
      </div>
    `;

    document.getElementById('su-add').onclick=()=>{
        const n=document.getElementById('su-n').value; const c=document.getElementById('su-c').value;
        if(!n)return;
        const t = document.createElement('span'); t.className='subject-tag';
        t.style.background = c; t.textContent = n;
        document.getElementById('su-l').appendChild(t);
    };

    document.getElementById('as-a').onclick=()=>{
        const s=document.getElementById('as-su').value; const n=document.getElementById('as-n').value; const d=document.getElementById('as-d').value;
        if(!n)return;
        const nd=document.createElement('div'); nd.className='checkbox-item';
        nd.innerHTML=\`<input type="checkbox"> <span>[\${s}] \${n} (Due:\${d})</span>\`;
        document.getElementById('as-l').appendChild(nd);
    };
    
    document.getElementById('sp-a').onclick=()=>{
        const s=document.getElementById('sp-su').value; const dy=document.getElementById('sp-d').value; const h=document.getElementById('sp-h').value;
        if(!s)return;
        const nd=document.createElement('div'); nd.className='list-item';
        nd.innerHTML=\`<span>\${dy} - \${s}</span><span>\${h} Hrs</span>\`;
        document.getElementById('sp-l').appendChild(nd);
    };

    document.getElementById('nt-a').onclick=()=>{
        const s=document.getElementById('nt-su').value; const t=document.getElementById('nt-t').value;
        if(!s)return;
        const nd=document.createElement('div'); nd.className='list-item';
        nd.innerHTML=\`<span><strong>\${s}</strong>: \${t}</span>\`;
        document.getElementById('nt-l').appendChild(nd);
    };

    document.getElementById('ex-a').onclick=()=>{
        const n=document.getElementById('ex-n').value; const d=document.getElementById('ex-d').value;
        if(!n || !d)return;
        const days = Math.ceil((new Date(d) - new Date())/(1000*60*60*24));
        const nd=document.createElement('div'); nd.className='list-item';
        nd.innerHTML=\`<span>\${n}</span><strong class="neg">\${days} Days Left</strong>\`;
        document.getElementById('ex-l').appendChild(nd);
    };

    document.getElementById('tp-a').onclick=()=>{
        const t=parseFloat(document.getElementById('tp-t').value||1);
        const d=parseFloat(document.getElementById('tp-d').value||0);
        let pct = (d/t)*100; if(pct>100)pct=100;
        document.getElementById('tp-b').style.width=pct+'%';
        document.getElementById('tp-rt').textContent=\`\${pct.toFixed(1)}% Done (\${d}/\${t})\`;
    };
}

function renderEventApp(container) {
    container.innerHTML = `
      <h2 class="app-title">🎉 Event Coordination</h2>
      <div class="app-grid">
         <div class="glass-card">
            <h3>Event Details</h3>
            <div class="input-group row">
               <input type="text" placeholder="Event Name">
               <select><option>Wedding</option><option>Party</option><option>Corporate</option><option>Birthday</option></select>
            </div>
            <div class="input-group row">
               <input type="date">
               <input type="text" placeholder="Venue Location">
            </div>
         </div>

         <div class="glass-card">
            <h3>Guest List & RSVP</h3>
            <div class="input-group row">
               <input type="text" id="gu-n" placeholder="Name">
               <select id="gu-s"><option>Pending</option><option>Yes</option><option>No</option></select>
               <button class="action-btn" id="gu-a">+</button>
            </div>
            <div id="gu-l" class="scrollable-list tiny" style="margin-bottom:0.5rem"></div>
            <div class="budget-text" id="gu-t" style="text-align:left;">Live Count: 0 Attending</div>
         </div>

         <div class="glass-card">
            <h3>Budget Allocation</h3>
            <input type="number" id="ev-tot" placeholder="Total Event Budget ($)">
            <div class="budget-splits">
               <input type="number" id="ev-1" placeholder="Venue" class="evt-sp">
               <input type="number" id="ev-2" placeholder="Food/Catering" class="evt-sp">
               <input type="number" id="ev-3" placeholder="Decor" class="evt-sp">
               <input type="number" id="ev-4" placeholder="Music/Misc" class="evt-sp">
            </div>
            <div class="budget-result">Rem: <span id="ev-r" class="pos">$0</span></div>
         </div>

         <div class="glass-card">
            <h3>Task Matrix</h3>
            <div class="input-group row">
               <input type="text" id="tk-n" placeholder="Task">
               <input type="text" id="tk-p" placeholder="Assigned To">
            </div>
            <div class="input-group row">
               <input type="date" id="tk-d">
               <button class="action-btn" id="tk-a">+</button>
            </div>
            <div id="tk-l" class="scrollable-list tiny"></div>
         </div>

         <div class="glass-card">
            <h3>Vendor Registry</h3>
            <div class="input-group row">
               <input type="text" id="v-n" placeholder="Vendor">
               <input type="text" id="v-s" placeholder="Service">
            </div>
            <div class="input-group row">
               <input type="number" id="v-a" placeholder="Agreed $">
               <button class="action-btn" id="v-btn">+</button>
            </div>
            <div id="v-l" class="scrollable-list tiny"></div>
         </div>

         <div class="glass-card">
            <h3>Day-of-Timeline Schedule</h3>
            <div class="input-group row">
               <input type="time" id="dl-t">
               <input type="text" id="dl-a" placeholder="Activity">
               <button class="action-btn" id="dl-btn">+</button>
            </div>
            <div id="dl-l" class="scrollable-list tiny"></div>
         </div>
      </div>
    `;

    let gcnt=0;
    document.getElementById('gu-a').onclick=()=>{
        const n=document.getElementById('gu-n').value;const s=document.getElementById('gu-s').value;
        if(!n)return;
        if(s==='Yes') gcnt++;
        const cl = s==='Yes'?'pos':s==='No'?'neg':'#fbbf24';
        const nd=document.createElement('div');nd.className='list-item';
        nd.innerHTML=\`<span>\${n}</span><strong style="color:\${cl}">\${s}</strong>\`;
        document.getElementById('gu-l').appendChild(nd);
        document.getElementById('gu-t').textContent = \`Live Count: \${gcnt} Attending\`;
    };

    const eb=()=>{
        const t=parseFloat(document.getElementById('ev-tot').value||0);
        const s=['ev-1','ev-2','ev-3','ev-4'].reduce((a,id)=>a+(parseFloat(document.getElementById(id).value||0)),0);
        const r=t-s;
        document.getElementById('ev-r').textContent='$'+r;
        document.getElementById('ev-r').className=r>=0?'pos':'neg';
    };
    document.querySelectorAll('#ev-tot, .evt-sp').forEach(e=>e.oninput=eb);

    document.getElementById('tk-a').onclick=()=>{
        const n=document.getElementById('tk-n').value;const p=document.getElementById('tk-p').value;
        if(!n)return;
        const nd=document.createElement('div');nd.className='checkbox-item';
        nd.innerHTML=\`<input type="checkbox"> <span>\${n} (@\${p})</span>\`;
        document.getElementById('tk-l').appendChild(nd);
    };

    document.getElementById('v-btn').onclick=()=>{
        const n=document.getElementById('v-n').value;const s=document.getElementById('v-s').value;const a=document.getElementById('v-a').value;
        if(!n)return;
        const nd=document.createElement('div');nd.className='list-item';
        nd.innerHTML=\`<span>\${n} (\${s})</span><span class="neg">$\${a}</span>\`;
        document.getElementById('v-l').appendChild(nd);
    };
    
    let tlns = [];
    document.getElementById('dl-btn').onclick=()=>{
        const t=document.getElementById('dl-t').value;const a=document.getElementById('dl-a').value;
        if(!t||!a)return;
        tlns.push({t,a});
        tlns.sort((i,j)=>i.t.localeCompare(j.t));
        const p=document.getElementById('dl-l'); p.innerHTML='';
        tlns.forEach(o=>{
            const nd=document.createElement('div');nd.className='list-item';
            nd.style.borderLeft="3px solid var(--accent)"; nd.style.background="linear-gradient(90deg, rgba(56, 189, 248, 0.1), transparent)";
            nd.innerHTML=\`<strong>\${o.t}</strong> <span>\${o.a}</span>\`;
            p.appendChild(nd);
        });
    };
}
