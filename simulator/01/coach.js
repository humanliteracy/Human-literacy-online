/* v1: curated examples and learner-chosen goals. No model, requests, or storage. */
(function () {
  'use strict';
  const paths = {
    boundary: {
      label: 'Decline or hold a firm boundary', kind: 'boundary',
      outcome: 'Possible outcome: you state a refusal or limit. Agreement and practical next steps remain open.',
      options: [
        ['Direct and firm', 'I am not accepting this request under these conditions. I want to be clear about that boundary.'],
        ['Firm, with room to discuss', 'I cannot take this on as requested. We can discuss different conditions, but that does not mean I am agreeing to the current request.'],
        ['Keep the refusal brief', 'My answer to this request is no. I can explain my limit if that would help us understand each other.'],
      ],
      followups: ['My decision is still no under the current conditions. What remains to be clarified?', 'I am open to discussing different conditions, without committing to this request.'],
      manager: ['You are choosing to decline this request under these conditions. Is that a final decision, or are there different conditions you want to discuss?', 'We have made your boundary explicit. We still need to clarify responsibilities and next steps; I cannot promise that we will agree.'],
      clear: 'Your wording may make a refusal or limit explicit without agreeing to the assignment.',
      unresolved: 'Whether the other person accepts the limit, what responsibilities remain, and what happens next still need clarification.',
      action: 'Privately write one request you would decline and the limit you want to keep. You do not have to offer an alternative.',
    },
    resign: {
      label: 'Leave or resign from the job', kind: 'resign',
      outcome: 'Possible outcome: you confirm a decision to leave the job and ask about the practical next steps. The work assignment is not accepted.',
      options: [
        ['State the decision directly', 'I am resigning from this job. Please explain the practical next steps.'],
        ['Ask about the process', 'I am resigning from this job. Who should I contact about formal offboarding?'],
        ['Keep it brief', 'I am resigning from this job.'],
      ],
      followups: ['I am confirming my decision to resign. Let us clarify notice and any handover.', 'I want to leave this job. I need information about the process before agreeing to practical details.'],
      manager: ['You have said you want to resign. I will not treat that as agreement to finish this assignment. What practical details would you like to clarify?', 'We have clarified that you are choosing to leave. Notice, pay, and any handover still depend on your circumstances and applicable arrangements.'],
      clear: 'Your wording may make the decision to resign explicit, rather than accepting the assignment or only asking for a short break.',
      unresolved: 'Notice, final pay, timing, and any handover remain practical questions. This prototype cannot determine employment rights or consequences.',
      action: 'Draft one private resignation statement. You decide whether to send it.',
    },
    scope: {
      label: 'Renegotiate scope, time, or expectations', kind: 'boundary',
      outcome: 'Possible outcome: you identify a scope or time tradeoff and ask for revised expectations before committing.',
      options: [
        ['Facts and a firm limit', 'The scope changed. I cannot meet the original deadline with the added work. We need to agree on a realistic scope and deadline.'],
        ['Explore options together', 'The added scope needs more time. Can we compare reducing the work, adjusting the deadline, or adding support? I cannot commit to the current combination.'],
        ['Make the tradeoff explicit', 'We can discuss the original scope at the agreed time, or the expanded scope with a revised deadline. I need us to agree on expectations before I commit.'],
      ],
      followups: ['Please confirm the agreed scope, deadline, and available support before I commit.', 'I cannot promise both the expanded scope and the original deadline. Which expectation can change?'],
      manager: ['You are asking to revisit scope and time rather than promising the current combination. Which tradeoff or support would you like us to discuss?', 'We have identified a need for revised expectations. The scope, deadline, and support still need agreement; no new commitment should be assumed.'],
      clear: 'Your wording may distinguish a scope change from a commitment you can realistically make, and put alternatives on the table.',
      unresolved: 'The actual scope of work, deadline, priorities, and support still need agreement. A request does not guarantee an adjustment.',
      action: 'Privately note what changed and one scope, time, or support adjustment you want to ask about.',
    },
    help: {
      label: 'Communicate distress or ask for support', kind: 'unclear',
      outcome: 'Possible outcome: you state a need for support while choosing what personal information to share. Available support is not yet established.',
      options: [
        ['Name the need directly', 'I need support with this situation. I want to explain what is difficult and discuss what help is available.'],
        ['Protect personal details', 'I am not ready to share personal details. I do need a change in how we handle this work. Can we discuss available support?'],
        ['Ask for a concrete conversation', 'I want time to explain what I need, without an immediate commitment to more work. Who can help us discuss adjustments?'],
      ],
      followups: ['I want to discuss support without having to disclose more personal information than I choose.', 'Can we identify a specific support option and check whether it fits what I need?'],
      manager: ['You are choosing to ask for support. You decide what personal details to share. What kind of help or adjustment would you like to discuss?', 'You have stated a need for support. We have not yet established what is available or appropriate; you can decide what to explore next.'],
      clear: 'Your wording may state a need for support while keeping control of what personal details you share.',
      unresolved: 'What support is available, who can provide it, and what you want to disclose remain your choices to explore.',
      action: 'Privately name one form of support you might request. Share only what you choose.',
    },
    pause: {
      label: 'Pause the conversation without resigning', kind: 'exit',
      outcome: 'Possible outcome: you distinguish taking a pause from resigning. When or how to resume remains open.',
      options: [
        ['Ask for a pause', 'I need to pause this conversation. I am not saying I resign. I would like to agree on when to return to it.'],
        ['Set a clear limit', 'I cannot continue this discussion right now. This is a break from the conversation, not a decision to leave the job.'],
        ['Request another format', 'I want to take a break and continue in writing or at another time. I am not making a new work commitment right now.'],
      ],
      followups: ['I am asking for a pause, not resigning. Can we clarify a time or format for returning?', 'I cannot continue right now. I will consider when I can return to the discussion.'],
      manager: ['You are asking to pause rather than resign. Would you like to discuss when or how to continue, without deciding the work issue right now?', 'We have distinguished a pause from leaving the job. Timing and the original work issue remain unresolved.'],
      clear: 'Your wording may distinguish taking a break from resigning or accepting a new obligation.',
      unresolved: 'When or how to resume, and the original issue, may still need discussion.',
      action: 'Rehearse one sentence asking for a pause. You choose whether or when to return.',
    },
    recovery: {
      label: 'Discuss accountability and a recovery plan', kind: 'own',
      outcome: 'Possible outcome: you discuss your part and a recovery plan without promising a delivery time before checking the facts.',
      options: [
        ['Own a specific action', 'I should have flagged the risk earlier. I want to explain what remains and agree on realistic next steps.'],
        ['Clarify before committing', 'I want to address my part in the delay and check the remaining work before I promise a new delivery time.'],
        ['Work toward a shared plan', 'Can we review the facts and priorities, then agree on a recovery plan I can realistically follow?'],
      ],
      followups: ['Let us confirm the remaining work and a realistic update time before I promise delivery.', 'I will explain the risks and what support is needed so we can agree on next steps.'],
      manager: ['You are choosing to discuss your part and a recovery plan. What facts or limits should we clarify before setting a new expectation?', 'We have identified a need for a realistic plan. The remaining work, support, and delivery time still need to be confirmed.'],
      clear: 'Your wording may separate your part in the situation from promises you cannot yet make.',
      unresolved: 'The remaining work, support, and a realistic delivery time still need confirmation.',
      action: 'Draft one private update about what remains and what you can realistically offer.',
    },
    custom: {
      label: 'Another goal / I want to clarify it myself', kind: 'unclear',
      outcome: 'Possible outcome: you try to clarify what you want to communicate. This script cannot infer a more specific outcome for your goal.',
      options: [],
      followups: ['I want to clarify my goal before deciding what to do next.', 'Please ask what I mean rather than assume my intention.'],
      manager: ['I do not have a scripted response tailored to that goal. What would you like to clarify, without making a commitment you do not choose?', 'We have not established a shared understanding yet. You can clarify, pause, or choose a different way to communicate.'],
      clear: 'Your own wording is the starting point. This prototype cannot determine what it means to you.',
      unresolved: 'Your goal and what the other person understands may still need clarification. No intention or feeling can be established by this script.',
      action: 'Privately write one question that could check whether someone understood your goal.',
    },
  };
  // Exact curated examples only; arbitrary language is never classified by this coach.
  const examples = new Map([
    ['you all can kiss my ass', { path: 'boundary', goal: 'I want to hold a firm boundary rather than accept this request.', hearing: 'A hypothetical manager might hear a refusal or an end to the conversation. That may not be your intention.', tentative: 'You might be communicating a limit. Those words alone do not tell us your feelings, intention, or decision.' }],
    ['the expectations are unreasonable. i quit', { path: 'resign', goal: 'I want to resign rather than accept these expectations.', hearing: 'A hypothetical manager may hear a decision to leave the job and may ask whether you want to confirm it.', tentative: 'You might be communicating a decision to resign. Resigning can be a legitimate choice; you decide whether this reading fits.' }],
    ['i need more time because the scope changed', { path: 'scope', goal: 'I want revised expectations that respect the scope change and my capacity.', hearing: 'A hypothetical manager may hear a request to revisit scope and time, rather than a promise to meet the original deadline.', tentative: 'You might be communicating a need for realistic expectations. You decide what facts and limits matter to you.' }],
  ]);

  function readGoal(goal) {
    const dialogue = window.HumanLiteracyDialogue;
    const direct = dialogue.analyze(goal);
    if (direct.matched && direct.kind !== 'unrelated') return direct;
    // A private purpose is not a spoken decision. These bounded conversions
    // select editable wording recipes only; Jordan never receives this text.
    const purpose = goal.trim().replace(/[’‘]/g, "'").match(/^(?:i (?:want|would like|need) to|my goal is to)\s+(.+)$/i)?.[1];
    if (!purpose) return direct;
    if (/^(?:ask for|request) (?:some |more )?(?:help|support|assistance)\b/i.test(purpose)) return dialogue.analyze('I need support.');
    if (/^(?:ask a question|clarify|understand)\b/i.test(purpose)) return dialogue.analyze('Can you clarify the situation?');
    if (/^(?:decline|refuse) (?:this|the|any more) (?:request|assignment|work|project)\b/i.test(purpose)) return dialogue.analyze('I will not accept this request.');
    if (/^(?:take a break|pause)(?:\b)/i.test(purpose)) return dialogue.analyze('I need a pause.');
    if (/^resign(?:\b)/i.test(purpose)) return dialogue.analyze('I am resigning.');
    return dialogue.analyze('I want to ' + purpose);
  }

  function wordingFor({path, goal, literal}) {
    const reading = readGoal(goal), original = window.HumanLiteracyDialogue.analyze(literal);
    // Reuse an actual stated action, rather than substituting a missed warning
    // or a generic admission merely because accountability is the private goal.
    const ownedClause = original.kind === 'own' ? literal.split(/[.!?;]|\bbut\b/i).find(clause => window.HumanLiteracyDialogue.analyze(clause).kind === 'own') : '';
    const ownOpening = ownedClause ? ownedClause.trim().replace(/[,\s]+$/, '') + '. ' : '';
    const chosen = path === 'custom' ? reading.reflectionPath : path;
    const option = (label, words, difference) => [label, words, difference];
    if (path === 'custom' && reading.kind === 'stop') return {tailored:true,options:[
      option('Ask to be left alone', 'Please leave me alone.', 'Ends this interaction without a reason, work promise or employment decision.'),
      option('End the discussion', 'I want to end this conversation.', 'Keeps the end request explicit; it does not offer to negotiate.'),
      option('Keep it brief', 'Please stop this conversation.', 'Asks for closure without changing your intention.'),
    ]};
    const privacy = reading.flags.personalBoundary === 'privacy' || /^(?:i (?:want|would like) to|my goal is to) (?:keep my personal (?:details|information) private|(?:ask for|get) (?:help|support) without (?:sharing|disclosing) (?:my |more )?personal (?:details|information))\b/i.test(goal);
    if (['boundary','help','custom'].includes(path) && (privacy || original.kind === 'refusal' && original.flags.personalBoundary === 'privacy')) return {tailored:true,options:[
      option('Keep personal details private', path === 'help' || reading.kind === 'support' ? 'I need support with the work, and I choose not to share personal details. What help is available?' : 'I will not share personal information. What work details do you need to discuss?', 'States a privacy limit without accepting additional work.'),
      option('Separate work from private details', 'I will not discuss my personal details. Can you clarify the work question?', 'Keeps the conversation on work information you choose to share.'),
      option('Keep the limit brief', 'I will not share personal information. Please keep this discussion focused on the work.', 'Sets the same privacy boundary without giving a reason.'),
    ]};
    if (['boundary','custom'].includes(path) && (reading.flags.personalBoundary === 'treatment' || original.kind === 'refusal' && original.flags.personalBoundary === 'treatment')) return {tailored:true,options:[
      option('Set a respectful limit', 'I will not be shouted at. We can speak respectfully or pause this conversation.', 'Sets a treatment boundary without resigning or accepting work.'),
      option('Ask for a pause', 'I need to pause this conversation. We can return to the work issue without shouting.', 'Separates a pause from a decision about the assignment.'),
      option('Keep the limit brief', 'I will not be shouted at. I am not continuing this discussion.', 'States the limit without a work commitment.'),
    ]};
    if (['custom','recovery','help'].includes(path) && reading.flags.explainFacts && (reading.flags.explainRisks || reading.flags.explainSupport || reading.flags.explainPart)) {
      const topic = reading.flags.explainRisks && reading.flags.explainSupport ? 'the risks and what support is needed' : reading.flags.explainRisks ? 'the risks' : reading.flags.explainSupport ? 'what support is needed' : 'my part';
      return {tailored:true,options:[
        option('Make room for the explanation', ownOpening + "I'd like to explain " + topic + ' before we decide on next steps.', 'Names the topic you chose without inventing the explanation or a work promise.'),
        option('Ask to be heard', 'Can I explain ' + topic + ', then discuss the options with you?', 'Invites discussion before a decision; it does not claim an agreement.'),
        option('Keep it brief', 'I want to explain ' + topic + '.', 'Keeps the request specific and leaves the explanation in your own words.'),
      ]};
    }
    if (['custom','recovery'].includes(path) && (reading.flags.explainFacts || reading.flags.fairSolution)) {
      const opening = ownOpening;
      const fair = reading.flags.fairSolution ? 'a fair next step' : 'what happens next';
      return {tailored:true, options:[
        option('Explain before deciding', opening + "I'd like to explain what happened before we decide on " + fair + '.', opening ? 'Retains the action you stated without accepting all blame or promising a fix.' : 'Asks to be heard before a decision, without adding an admission.'),
        option('Invite a discussion', 'Can I explain my perspective, then discuss ' + fair + ' with you?', 'Invites both perspectives without assuming you already agree.'),
        option('Keep it brief', opening + 'Can we discuss what happened and ' + fair + '?', 'Keeps the request concise and leaves the decision open.'),
      ]};
    }
    const refusalContext = [reading.kind === 'refusal' ? goal : '', original.kind === 'refusal' ? literal : ''].join(' ');
    if (chosen === 'boundary' && (reading.flags.temporaryRefusal || original.flags.temporaryRefusal)) {
      const timing=refusalContext.match(/\b(today|right now|for now)\b/i)?.[0];
      if(timing)return {tailored:true,options:[
        option('Keep the time limit', 'I will not accept this assignment ' + timing + '.', 'Preserves the stated timing without turning it into a permanent refusal or resignation.'),
        option('Keep later decisions open', 'I will not accept this assignment ' + timing + '. I am not making a commitment about later work.', 'Adds no promise after the time limit.'),
        option('State no with the timing', 'My answer to this request is no ' + timing + '.', 'Keeps the refusal and its timing, without an offer of help.'),
      ]};
    }
    if (['boundary','custom'].includes(path) && (reading.kind === 'refusal' || original.kind === 'refusal') && /any more work|further work|continue working|another update/i.test(refusalContext)) {
      const noUpdate = /(?:not|refuse to) provide (?:another|any) update/i.test(refusalContext);
      const noWork = /any more work|further work|continue working/i.test(refusalContext);
      const limit = noUpdate && noWork ? 'I will not continue working on this project or provide another update.' : noUpdate ? 'I will not provide another update.' : 'I am not doing any more work on this project.';
      return {tailored:true,options:[
        option('State the limit', limit + ' We need to clarify what happens next.', 'Keeps the work refusal explicit without turning it into resignation.'),
        option('Ask about next steps', limit + ' What needs to be clarified about responsibilities?', 'Adds one practical question without offering more work.'),
        option('Keep the decision brief', limit, 'States the same limit without an explanation or alternative offer.'),
      ]};
    }
    if (chosen === 'boundary' && !reading.flags.conditionalRefusal && !original.flags.conditionalRefusal) return {tailored:true,options:[
      option('Direct and firm', 'I am not accepting this request.', 'States no without a condition or an offer of other help.'),
      option('Prevent an assumed agreement', 'I will not accept this request. Please do not treat that as agreement.', 'Keeps the refusal firm; it does not invite negotiation.'),
      option('Keep it brief', 'My answer to this request is no.', 'The refusal needs no explanation or alternative offer.'),
    ]};
    if (path === 'custom' && reading.kind === 'uncertain') return {tailored:true,options:[
      option('Keep the decision open', "I'm considering leaving this job, but I haven't decided. I want to discuss my options.", 'Makes uncertainty explicit; this is not a resignation.'),
      option('Ask for information', "Before I decide whether to leave this job, can you explain the practical options?", 'Asks for information without committing to stay or leave.'),
      option('Ask for time', 'I might leave this job, but I have not made a decision. I need time to consider my options.', 'Requests space while keeping the decision yours.'),
    ]};
    if (path === 'custom' && reading.kind === 'clarify') return {tailored:true,options:[
      option('Clarify the expectation', 'Can you clarify what you need from me before I decide on next steps?', 'Asks about expectations without accepting the assignment.'),
      option('Ask what comes first', 'Can you tell me what you need me to respond to first?', 'Focuses on one question instead of promising a solution.'),
      option('Check understanding', 'Can you clarify the question before I make a commitment?', 'Makes understanding a separate step from agreeing.'),
    ]};
    if (chosen === 'recovery') return {tailored:true,options:[
      option('Start with what is known', ownOpening ? ownOpening + "I'd like to explain my part before we agree on next steps." : 'Can we review the remaining work before I promise a new delivery time?', 'Uses only the accountability you stated; it does not invent a missed warning or a delivery promise.'),
      option('Check the facts together', 'Can we review the facts, priorities and support before agreeing on a realistic next step?', 'Invites a review without assuming fault or agreement.'),
      option('Keep promises realistic', 'Can you clarify what remains before I make a new commitment?', 'Separates checking the work from promising a result.'),
    ]};
    if (chosen === 'scope' && !((original.kind === 'scope' && /scope (?:has |was )?changed|requirements (?:have |were )?changed|added (?:more |the )?work/i.test(literal)) || (reading.kind === 'scope' && /scope (?:has |was )?changed|requirements (?:have |were )?changed|added (?:more |the )?work/i.test(goal)))) return {tailored:true,options:[
      option('Review before committing', 'Can we review the scope, deadline and available support before I commit?', 'Asks about expectations without inventing a scope change.'),
      option('Ask about priorities', 'Can you clarify the priority and what can change about the scope or deadline?', 'Makes the tradeoff a question rather than a promise.'),
      option('Clarify the deadline', 'Can you clarify the deadline and what needs to be delivered?', 'Asks one practical question without claiming the work changed.'),
    ]};
    if (chosen === 'resign') {
      // Do not compress a consequential decision into generic resignation copy.
      // Preserve the confirmed goal verbatim except this bounded private-to-spoken
      // prefix conversion. Unfamiliar conditions remain editable learner wording;
      // their presence does not imply the script understood them.
      const spoken = goal.trim().replace(/^(?:i (?:want|would like|need) to|my goal is to) (?:resign|quit|leave (?:this|the|my) (?:job|company))\b/i, 'I am resigning');
      const converted = spoken !== goal.trim();
      if (reading.flags.notResigning || !converted && ['uncertain','pause','stop','refusal','scope','support','clarify'].includes(reading.kind)) return {tailored:true,options:[
        option('Keep my actual goal', goal, 'Your written goal takes priority over the resignation selector. Keep it, or change the selected path.'),
        option('Ask for information', goal + ' Please explain the applicable process before I decide anything else.', 'Preserves your goal without turning it into resignation.'),
        option('Ask for written information', goal + ' Please send the relevant information in writing.', 'Adds an optional information request, without a work promise.'),
      ]};
      const stated = window.HumanLiteracyDialogue.analyze(spoken).kind === 'resign' || converted;
      const words = stated ? spoken.replace(/\bI quit\b/g, 'I am resigning') : 'I am resigning from this job.';
      const sentence = /[.!?]$/.test(words) ? words : words + '.';
      return {tailored:stated,options:[
        option('Keep my decision and conditions', sentence, stated ? 'Keeps your confirmed wording and conditions; edit anything before using it.' : 'A basic resignation example. Add your timing and conditions before using it.'),
        option('Also ask about the process', sentence + ' Who should I contact about formal offboarding?', 'Adds only an optional process question; it offers no work or negotiation.'),
        option('Also ask for written information', sentence + ' Please send the applicable offboarding information in writing.', 'Requests information without agreeing to a handover or further project work.'),
      ]};
    }
    if (paths[chosen]?.options.length) return {tailored:path === 'custom',options:paths[chosen].options};
    return {tailored:false,options:[
      option('Ask to explain', "Can you clarify what you need me to respond to? I'd like to explain my point before deciding.", 'A neutral opener; it does not claim to express your specific goal.'),
      option('Check the question', 'Can you clarify what you need me to respond to?', 'Asks one question without making a new commitment.'),
      option('Introduce your concern', 'Can I explain a different concern before we decide?', 'Makes room for your own words; it does not invent the concern.'),
    ]};
  }

  const differences = {
    boundary:['States no without offering another assignment.','Discusses different conditions while retaining the current refusal.','Offers to explain the limit without changing no.'],
    resign:['States resignation and asks about next steps.','Explains a reason; discussing a handover is not accepting the assignment.','Asks who to contact about notice and a handover.'],
    scope:['Names the scope change and a deadline limit.','Puts scope, time and support options on the table.','States the tradeoff before making a commitment.'],
    help:['Names a need for support.','Keeps personal details private while asking about help.','Asks who can help discuss adjustments before more work is accepted.'],
    pause:['Asks when to return and explicitly rules out resignation.','States a present limit on continuing the discussion.','Offers a different time or format without a new work commitment.'],
    recovery:['Owns a specific action without promising delivery.','Checks the remaining work before setting a time.','Invites a shared review of facts and priorities.'],
    custom:['States a request or decision to review.','Invites clarification without assuming agreement.','Keeps the next decision open.'],
  };

  function createCoach({ moveDraft, onChange, onAdvance, isComplete = () => false }) {
    const $ = id => document.getElementById(id);
    let confirmed = null, reviewedLiteral = null, lastPath = '';
    const drafts = new Map(), goalDrafts = new Map();
    const defaultGoals = {
      boundary: 'I want to decline this request and keep my boundary.',
      resign: 'I want to resign rather than accept these expectations.',
      scope: 'I want to clarify realistic scope, time, or support before committing.',
      help: 'I want support without sharing more personal information than I choose.',
      pause: 'I want to pause this conversation, not resign.',
      recovery: 'I want to discuss my part and realistic next steps.', custom: '',
    };
    function resizeOptions() {
      if (!$('coachChoices').checkVisibility()) return;
      for (const input of $('coachOptions').querySelectorAll('textarea')) {
        if (input.closest('details:not([open])')) continue;
        input.style.height = 'auto';
        input.style.height = Math.max(94, input.scrollHeight + 4) + 'px';
      }
    }
    function updateTransferNotice() {
      $('coachWordsNotice').textContent = isComplete()
        ? 'Using wording starts a new conversation and replaces the completed transcript. Private drafts stay available.'
        : $('coachWordsNotice').dataset.neutral === 'true'
          ? 'These are neutral openers, not a tailored rewrite. Edit to fit; only Say this sends your reply.'
          : 'Your goal stays private. Use this wording fills your reply; only Say this sends it.';
      for (const button of $('coachOptions').querySelectorAll('button')) {
        const label = button.dataset.optionLabel;
        button.textContent = isComplete() ? 'Use in new conversation' : 'Use this wording';
        button.setAttribute('aria-label', button.textContent + ': ' + label + ' (move to simulator)');
      }
    }
    window.addEventListener('resize', resizeOptions);
    $('expressStudio').addEventListener('toggle', () => { resizeOptions(); updateTransferNotice(); });
    $('coachReview').addEventListener('toggle', () => { if (!$('coachReview').open) resizeOptions(); });
    for (const [value, path] of Object.entries(paths)) {
      const option = document.createElement('option');
      option.value = value; option.textContent = path.label; $('coachPath').append(option);
    }
    function saveOptions() {
      if (confirmed) drafts.set(confirmed.key, [...$('coachOptions').querySelectorAll('textarea')].map(n => n.value));
    }
    function clearChoices() {
      saveOptions(); onChange(); confirmed = null;
      $('coachChoices').classList.add('hidden');
      $('coachChosenGoal').textContent = ''; $('coachOptions').replaceChildren();
      for (const id of ['coachPath', 'coachGoal']) $(id).removeAttribute('aria-invalid');
    }
    function showExpression() {
      $('expressionQuestion').classList.remove('hidden');
      $('coachUnderstanding').classList.add('hidden'); $('coachChoices').classList.add('hidden');
      $('expressWords').focus();
    }
    function clearReading() {
      reviewedLiteral = null; lastPath = '';
      $('coachReview').open = true; $('readingDetails').open = false;
      for (const id of ['coachLiteral', 'coachHearing', 'coachTentative']) $(id).textContent = '';
      $('coachGoal').value = ''; $('coachPath').value = ''; $('coachStatus').textContent = '';
      $('expressWords').removeAttribute('aria-invalid');
    }
    function reset() {
      clearChoices(); drafts.clear(); goalDrafts.clear(); clearReading();
      $('coachWordsNotice').textContent = '';
      $('expressionQuestion').classList.remove('hidden'); $('coachUnderstanding').classList.add('hidden');
    }
    $('coachEditExpression').addEventListener('click', showExpression);
    $('expressWords').addEventListener('input', () => {
      if (lastPath) goalDrafts.set(lastPath, $('coachGoal').value);
      clearChoices(); clearReading();
      $('expressionQuestion').classList.remove('hidden'); $('coachUnderstanding').classList.add('hidden');
    });
    $('coachGoal').addEventListener('input', clearChoices);
    $('coachPath').addEventListener('change', () => {
      if (lastPath) goalDrafts.set(lastPath, $('coachGoal').value);
      clearChoices(); lastPath = $('coachPath').value;
      $('coachGoal').value = goalDrafts.has(lastPath) ? goalDrafts.get(lastPath) : defaultGoals[lastPath] || '';
      $('coachStatus').textContent = 'Check or edit the goal for your selected path.';
    });
    $('coachUnderstand').addEventListener('click', () => {
      const literal = $('expressWords').value;
      if (!literal.trim()) {
        $('coachStatus').textContent = 'Local recordings are not transcribed. Type words to explore, or return to your reply.';
        $('expressWords').setAttribute('aria-invalid', 'true'); $('expressWords').focus(); return;
      }
      onAdvance();
      if (literal !== reviewedLiteral) {
        clearChoices();
        const normalized = literal.trim().toLowerCase();
        const example = examples.get(normalized.endsWith('.') ? normalized.slice(0, -1) : normalized);
        reviewedLiteral = literal;
        $('coachLiteral').textContent = literal;
        const reading = window.HumanLiteracyDialogue.analyze(literal);
        const recognized = reading.matched && ['own','refusal','resign','scope','support','pause','clarify','repair','recovery','plan','uncertain','explain','stop'].includes(reading.kind);
        const proposed = reading.kind === 'stop' ? 'custom' : recognized ? reading.reflectionPath : '';
        $('coachHearing').textContent = example?.hearing || (recognized ? 'These words may relate to ' + window.HumanLiteracyDialogue.goalLabels[proposed] + '. A listener may still need more detail.' : 'I do not have a scripted reading for these words. Please choose what you want to communicate.');
        $('coachTentative').textContent = example?.tentative || 'This is a limited wording match, not a reading of your feelings or whole intention. You can change or reject the proposed goal.';
        $('coachPath').value = example?.path || proposed; lastPath = $('coachPath').value;
        $('coachGoal').value = example?.goal || (reading.kind === 'uncertain' ? 'I might quit, but I have not decided.' : defaultGoals[proposed] || '');
        if (reading.kind === 'resign') $('coachGoal').value = literal.trim();
        if (reading.kind === 'clarify') $('coachGoal').value = 'I want to clarify what is expected.';
        if (reading.kind === 'stop') $('coachGoal').value = 'I want to end this conversation.';
        if (reading.kind !== 'resign') {
          if (reading.flags.personalBoundary === 'privacy') $('coachGoal').value = 'I want to keep my personal information private.';
          if (reading.flags.personalBoundary === 'treatment') $('coachGoal').value = 'I want to set a limit on being shouted at.';
          if (reading.flags.explainFacts && reading.flags.fairSolution) $('coachGoal').value = 'I want to explain what happened and find a fair solution.';
          else if (reading.flags.explainFacts) $('coachGoal').value = 'I want to explain ' + (reading.flags.explainRisks && reading.flags.explainSupport ? 'the risks and what support is needed' : reading.flags.explainRisks ? 'the risks' : reading.flags.explainSupport ? 'what support is needed' : reading.flags.explainPart ? 'my part' : 'what happened') + '.';
        }
        $('coachStatus').textContent = example || recognized ? 'Check this proposed goal; change it if needed.' : 'Please clarify your goal.';
      }
      $('expressWords').removeAttribute('aria-invalid');
      $('expressionQuestion').classList.add('hidden'); $('coachUnderstanding').classList.remove('hidden');
      $('coachReview').open = true; $('coachUnderstandingTitle').focus();
    });
    $('coachReject').addEventListener('click', () => {
      clearChoices(); $('coachGoal').value = ''; $('coachPath').value = ''; lastPath = '';
      $('coachHearing').textContent = 'Possible reading rejected. This prototype cannot establish what you intended.';
      $('coachTentative').textContent = 'You can choose a different path and describe your own goal, or skip coaching.';
      $('coachStatus').textContent = 'Interpretation rejected. Your original expression is unchanged.';
      $('coachPath').focus();
    });
    $('coachConfirm').addEventListener('click', () => {
      const path = $('coachPath').value, goal = $('coachGoal').value.trim();
      if (!path || !goal) {
        $('coachStatus').textContent = 'Choose your communication path and write or confirm your own goal first.';
        const input = $(path ? 'coachGoal' : 'coachPath'); input.setAttribute('aria-invalid', 'true'); input.focus(); return;
      }
      const key = JSON.stringify([reviewedLiteral, path, goal]);
      if (!confirmed || confirmed.key !== key) {
        clearChoices(); confirmed = { path, goal, key }; goalDrafts.set(path, goal);
        const more = document.createElement('details'); more.id = 'coachMore'; more.className = 'coach-more';
        const summary = document.createElement('summary'); summary.textContent = 'More responses (2)';
        const additional = document.createElement('div'); more.append(summary, additional);
        more.addEventListener('toggle', resizeOptions);
        const wording = wordingFor({path,goal,literal:reviewedLiteral || ''});
        const options = wording.options;
        $('coachWordsNotice').textContent = wording.tailored ? 'Your goal stays private. Review these editable ways to say it.' : path === 'custom' ? 'No tailored rewrite fits this goal yet. These are neutral openers; edit them to fit.' : 'Your goal stays private. Review the wording before moving it.';
        $('coachWordsNotice').dataset.tailored = String(wording.tailored);
        $('coachWordsNotice').dataset.neutral = String(path === 'custom' && !wording.tailored);
        const saved = drafts.get(key);
        options.forEach(([label, words, difference], index) => {
          const article = document.createElement('article'); article.className = 'coach-option';
          const fieldId = 'coachWording' + index;
          const heading = document.createElement('label'); heading.className = 'write-label'; heading.htmlFor = fieldId; heading.textContent = label;
          const explanation = document.createElement('p'); explanation.id = fieldId+'Difference'; explanation.className='micro'; explanation.textContent=difference || differences[path][index];
          const input = document.createElement('textarea'); input.id = fieldId; input.maxLength = 2400; input.autocomplete = 'off'; input.value = saved?.[index] ?? words; input.setAttribute('aria-describedby',explanation.id);
          input.addEventListener('input', resizeOptions);
          const button = document.createElement('button'); button.type = 'button'; button.className = 'secondary'; button.dataset.optionLabel = label;
          button.addEventListener('click', () => {
            if (!input.value.trim()) { input.focus(); $('coachStatus').textContent = 'Enter wording you want to try, or choose another option.'; return; }
            $('practiceWords').value = input.value; saveOptions();
            moveDraft(input.value, { path: confirmed.path, goal: confirmed.goal });
            $('coachStatus').textContent = 'Draft moved. Nothing was sent.';
          });
          article.append(heading, explanation, input, button); (index === 0 ? $('coachOptions') : additional).append(article);
        });
        $('coachOptions').append(more);
      }
      $('coachChosenGoal').textContent = 'Your chosen goal: ' + goal;
      $('coachReview').open = false; $('coachStatus').textContent = 'Goal confirmed.';
      $('coachChoices').classList.remove('hidden'); updateTransferNotice(); resizeOptions(); $('coachChoicesTitle').focus();
    });
    return { reset, focus: () => {
      const target = !$('expressionQuestion').classList.contains('hidden') ? $('expressWords')
        : $('coachReview').open ? $('coachUnderstandingTitle') : $('coachChoicesTitle');
      target.focus();
    }, getContext: () => confirmed ? { path: confirmed.path, goal: confirmed.goal } : null };
  }
  window.HumanLiteracyCoach = { paths, createCoach, wordingFor };
})();
