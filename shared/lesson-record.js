/* TEAL v0.3: local-first, optional learning record shared by Lessons 01–10. */
(() => {
  'use strict';
  const app=document.getElementById('app');
  const match=location.pathname.match(/\/lessons\/(\d{2})\//);
  if(!app||!match||typeof window.render!=='function') return;
  const number=match[1], key='teal-learning-record-v03-'+number;
  const defaults={recall:'',meaning:'',plan:'',self:'',others:'',everything:'',outcome:'',updated:''};
  const clean=v=>String(v||'').trim().slice(0,2000);
  let data={...defaults},storageWorks=false;
  try {
    const old=JSON.parse(localStorage.getItem(key)||'null');
    if(old&&typeof old==='object') Object.keys(defaults).forEach(k=>data[k]=clean(old[k]));
    localStorage.setItem(key+'-test','1');localStorage.removeItem(key+'-test');storageWorks=true;
  }catch(_){}
  function save(){
    data.updated=new Date().toISOString();
    if(!storageWorks)return false;
    try{localStorage.setItem(key,JSON.stringify(data));return true;}
    catch(_){storageWorks=false;return false;}
  }
  function node(tag,text,parent,cls){
    const n=document.createElement(tag);
    if(text!==undefined&&text!==null)n.textContent=text;
    if(cls)n.className=cls;
    parent.append(n);return n;
  }
  function section(title){
    const s=node('section',null,app,'teal-record-card');
    node('h2',title,s,'teal-record-heading');return s;
  }
  function field(s,id,label,hint){
    const l=node('label',label,s,'teal-record-label');l.htmlFor='teal-'+id;
    node('p',hint,s,'teal-record-hint');
    const a=node('textarea',null,s,'teal-record-input');
    a.id='teal-'+id;a.rows=id==='recall'?4:3;a.maxLength=2000;a.value=data[id];
    a.addEventListener('input',()=>{
      data[id]=clean(a.value);save();
      const status=document.getElementById('teal-save-status');
      if(status)status.textContent=storageWorks?'Draft saved in this browser.':'Browser storage unavailable: export your work to keep it.';
    });
    return a;
  }
  function button(s,text,fn,secondary=false){
    const b=node('button',text,s,'teal-record-button'+(secondary?' secondary':''));
    b.type='button';b.addEventListener('click',fn);return b;
  }
  function notes(s,id){
    const n=node('div',null,s,'teal-record-notes');n.id=id;
    n.setAttribute('role','status');n.setAttribute('aria-live','polite');return n;
  }
  function showNotes(target,lines){
    target.replaceChildren();
    const ul=node('ul',null,target);
    lines.forEach(line=>node('li',line,ul));
  }
  function reflectionAnalysis(){
    const out=[];
    if(!data.recall)out.push('No written reflection provided. You may skip this activity.');
    else {
      out.push('In your words: “'+data.recall+'”');
      const t=data.recall.toLowerCase(),themes=[];
      if(/rest|boundary|limit|capacity|energy|time|need|protect/.test(t))themes.push('recognizing personal needs or limits');
      if(/help|listen|support|respect|other|care|feel/.test(t))themes.push('consideration for other people');
      if(/both|some|balance|compromis|trade|together|part/.test(t))themes.push('balancing competing needs');
      if(/future|trust|long.term|relationship|shared|later/.test(t))themes.push('wider or longer-term effects');
      if(themes.length)out.push('Your response appears to touch on '+themes.join('; ')+'. This is a reading prompt, not a grade.');
      else out.push('Consider what your response suggests about Self, Others, and Everything.');
    }
    out.push(data.meaning?'Possible real-life use you described: “'+data.meaning+'”':'What real-life situation could help you test this idea?');
    out.push('What could challenge your interpretation? Consider an alternative perspective or a tradeoff.');
    return out;
  }
  function planAnalysis(){
    return [
      data.plan?'Your intended action: “'+data.plan+'”':'No action plan yet. Skipping is permitted.',
      data.self?'Respect for Self: “'+data.self+'”':'Respect for Self: What capacity, safety need or boundary matters?',
      data.others?'Respect for Others: “'+data.others+'”':'Respect for Others: Who else is affected, and how can you respect their needs?',
      data.everything?'Respect for Everything: “'+data.everything+'”':'Respect for Everything: What wider or longer-term effect should be considered?',
      'Next check: Is this action safe, specific and realistic? When might you try it?',
      data.outcome?'Outcome you reported (not independently verified): “'+data.outcome+'”':'No observed outcome has been reported; a plan is not evidence of completion.'
    ];
  }
  function quizText(){
    if(typeof quizItems==='undefined'||typeof quizAnswers==='undefined')return 'Not available';
    return quizItems.map((q,i)=>{
      const opts=typeof optionsFor==='function'?optionsFor(q):q.choices;
      const answer=quizAnswers[i];
      return (i+1)+'. '+(q.question||q.q||'Knowledge check')+'\n   My answer: '+(answer===undefined?'Unanswered':clean(opts[answer]?.text||'Unanswered'));
    }).join('\n');
  }
  function report(){
    return [
      'TEAL · PERSONAL LEARNING RECORD','Trinity Equals Amazing Love',
      'Lesson '+number+' — '+(typeof lessonTitle==='string'?lessonTitle:document.title),
      'Exported: '+new Date().toLocaleString(),'Last edited: '+(data.updated?new Date(data.updated).toLocaleString():'Not saved'),
      '','04 · REMEMBER IT',
      'Knowledge-check choices (not a moral score):',quizText(),
      '','My reflection:',data.recall||'Not provided',
      '','Where this may apply:',data.meaning||'Not provided',
      '','Reflection review:',...reflectionAnalysis().map(t=>'- '+t),
      '','05 · LIVE IT',
      'Intended action (not a confirmed outcome):',data.plan||'Not provided',
      '','Respect for Self:',data.self||'Not provided',
      'Respect for Others:',data.others||'Not provided',
      'Respect for Everything:',data.everything||'Not provided',
      '','Actual outcome (self-reported):',data.outcome||'Not reported yet',
      '','Plan review:',...planAnalysis().map(t=>'- '+t),
      '','This private educational reflection is not a diagnosis, moral score, or verification of an outcome.'
    ].join('\n');
  }
  function download(){
    try{
      const u=URL.createObjectURL(new Blob([report()],{type:'text/plain;charset=utf-8'}));
      const a=document.createElement('a');a.href=u;a.download='TEAL_Lesson_'+number+'_Record_'+new Date().toISOString().slice(0,10)+'.txt';
      document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),30000);return true;
    }catch(_){return false;}
  }
  function print(){
    document.getElementById('teal-print-sheet')?.remove();
    const sheet=node('section',null,document.body,'teal-print-sheet');sheet.id='teal-print-sheet';
    node('h1','TEAL — Personal Learning Record',sheet);node('pre',report(),sheet);
    document.body.classList.add('teal-print-mode');
    try{window.print();}catch(_){document.body.classList.remove('teal-print-mode');sheet.remove();}
    setTimeout(()=>{document.body.classList.remove('teal-print-mode');sheet.remove();},60000);
  }
  window.addEventListener('afterprint',()=>{document.body.classList.remove('teal-print-mode');document.getElementById('teal-print-sheet')?.remove();});
  function remember(){
    const s=section('Your personal Remember It reflection');
    node('p','The knowledge check above is unchanged. You can also capture what you understood in your own words.',s);
    field(s,'recall','What did you learn?','A reflection, not a graded answer.');
    field(s,'meaning','Where might you use this?','An example from daily life.');
    const feedback=notes(s,'teal-remember-feedback');
    button(s,'Review my reflection',()=>showNotes(feedback,reflectionAnalysis()));
    if(data.recall||data.meaning)showNotes(feedback,reflectionAnalysis());
    node('p','Private to this browser when storage permits. Export your record before clearing browser data.',s,'teal-record-hint');
  }
  function live(){
    const s=section('My action plan and learning record');
    node('p','Make a realistic plan and consider all three forms of respect. Only report an outcome after something actually happens.',s);
    field(s,'plan','What do you plan to try?','A concrete action, question or sentence.');
    field(s,'self','Respect for Self — what matters for you?','Consider safety, limits, time, energy or needs.');
    field(s,'others','Respect for Others — how can you be considerate?','Consider dignity, consent and different needs.');
    field(s,'everything','Respect for Everything — what wider effects matter?','Consider shared resources, trust, relationships or the environment.');
    field(s,'outcome','What actually happened? (optional; add later)','Leave blank until tried. Never invent an outcome.');
    const feedback=notes(s,'teal-plan-feedback');
    button(s,'Review my plan',()=>showNotes(feedback,planAnalysis()));
    if(data.plan||data.outcome)showNotes(feedback,planAnalysis());
    const end=node('section',null,s,'teal-record-export');
    node('h3','Finish your lesson: review, save or print',end);
    const status=node('p',storageWorks?'Drafts are stored in this browser. Export a separate copy to keep it.':'Browser storage unavailable. Export a text copy to keep your work.',end,'teal-record-hint');
    status.id='teal-save-status';status.setAttribute('role','status');
    const preview=node('pre',report(),end,'teal-record-report');preview.id='teal-full-report';
    const buttons=node('div',null,end,'teal-record-actions');
    button(buttons,'Update my record',()=>{preview.textContent=report();showNotes(feedback,planAnalysis());});
    button(buttons,'Save as text',()=>{preview.textContent=report();status.textContent=download()?'Text download started. Check Downloads.':'Download unavailable. Copy the text below instead.';});
    button(buttons,'Print / Save PDF',()=>{preview.textContent=report();print();},true);
    button(buttons,'Copy record',async()=>{
      preview.textContent=report();
      try{await navigator.clipboard.writeText(preview.textContent);status.textContent='Copied.';}
      catch(_){status.textContent='Clipboard blocked. Select and copy the record below.';}
    },true);
    button(buttons,'Erase this lesson record',()=>{
      if(!window.confirm('Delete this lesson’s local reflection and plan? Export a copy first if needed.'))return;
      data={...defaults};try{localStorage.removeItem(key);}catch(_){};window.render();
    },true);
    node('p','On shared devices, others using this browser profile might see saved entries. This feature makes no server request or account submission.',end,'teal-record-hint');
  }
  const oldRender=window.render;
  window.render=function(...args){
    const v=oldRender.apply(this,args);
    if(stage==='results')remember();
    if(stage==='live')live();
    return v;
  };
})();