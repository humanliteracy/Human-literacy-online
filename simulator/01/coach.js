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
      action: 'If useful, privately write one request you would decline, the limit you want to keep, and whether you are open to any alternative. You do not have to offer one.',
    },
    resign: {
      label: 'Leave or resign from the job', kind: 'resign',
      outcome: 'Possible outcome: you confirm a decision to leave the job and ask about the practical next steps. The work assignment is not accepted.',
      options: [
        ['State the decision directly', 'The expectations are unreasonable for me. I am resigning from this job. I want to clarify the practical next steps.'],
        ['Explain without accepting the assignment', 'I have decided to leave this job because these expectations do not work for me. I am willing to discuss a handover, not to accept this assignment.'],
        ['Keep it brief', 'I am resigning. Please explain the process and who I should speak with about notice and any handover.'],
      ],
      followups: ['I am confirming my decision to resign. Let us clarify notice and any handover.', 'I want to leave this job. I need information about the process before agreeing to practical details.'],
      manager: ['You have said you want to resign. I will not treat that as agreement to finish this assignment. Would you like to confirm that decision and discuss the process?', 'We have clarified that you are choosing to leave. Notice, pay, and any handover still depend on your circumstances and applicable arrangements.'],
      clear: 'Your wording may make the decision to resign explicit, rather than accepting the assignment or only asking for a short break.',
      unresolved: 'Notice, final pay, timing, and any handover remain practical questions. This prototype cannot determine employment rights or consequences.',
      action: 'If you choose, draft a private resignation statement and a list of questions about notice, final pay, and handover. Review your own circumstances before sending anything.',
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
      action: 'If helpful, make a short private list: what changed, what you can realistically offer, and which scope, time, or support options you want clarified.',
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
      action: 'If useful, write down one form of support you might request and one detail you prefer to keep private. You can decide whether and with whom to discuss it.',
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
      action: 'If useful, rehearse one sentence asking for a pause and one way to clarify whether or when you want to return to the conversation.',
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
      action: 'If useful, draft a private update with what happened, what remains, and what you can realistically commit to. Include any support or adjustment you need.',
    },
    custom: {
      label: 'Another goal / I want to clarify it myself', kind: 'unclear',
      outcome: 'Possible outcome: you try to clarify what you want to communicate. This script cannot infer a more specific outcome for your goal.',
      options: [],
      followups: ['I want to clarify my goal before deciding what to do next.', 'Please ask what I mean rather than assume my intention.'],
      manager: ['I do not have a scripted response tailored to that goal. What would you like to clarify, without making a commitment you do not choose?', 'We have not established a shared understanding yet. You can clarify, pause, or choose a different way to communicate.'],
      clear: 'Your own wording is the starting point. This prototype cannot determine what it means to you.',
      unresolved: 'Your goal and what the other person understands may still need clarification. No intention or feeling can be established by this script.',
      action: 'If useful, write what you want someone to understand and one question that could check whether they understood you. You can keep it private.',
    },
  };
  // Exact curated examples only; arbitrary language is never classified by this coach.
  const examples = new Map([
    ['you all can kiss my ass', { path: 'boundary', goal: 'I want to hold a firm boundary rather than accept this request.', hearing: 'A hypothetical manager might hear a refusal or an end to the conversation. That may not be your intention.', tentative: 'You might be communicating a limit. Those words alone do not tell us your feelings, intention, or decision.' }],
    ['the expectations are unreasonable. i quit', { path: 'resign', goal: 'I want to resign rather than accept these expectations.', hearing: 'A hypothetical manager may hear a decision to leave the job and may ask whether you want to confirm it.', tentative: 'You might be communicating a decision to resign. Resigning can be a legitimate choice; you decide whether this reading fits.' }],
    ['i need more time because the scope changed', { path: 'scope', goal: 'I want revised expectations that respect the scope change and my capacity.', hearing: 'A hypothetical manager may hear a request to revisit scope and time, rather than a promise to meet the original deadline.', tentative: 'You might be communicating a need for realistic expectations. You decide what facts and limits matter to you.' }],
  ]);

  function createCoach({ moveDraft, onChange }) {
    const $ = id => document.getElementById(id);
    let confirmed = null;
    function resizeOptions() {
      if ($('coachChoices').classList.contains('hidden')) return;
      for (const input of $('coachOptions').querySelectorAll('textarea')) {
        input.style.height = 'auto';
        input.style.height = Math.max(94, input.scrollHeight + 4) + 'px';
      }
    }
    window.addEventListener('resize', resizeOptions);
    for (const [value, path] of Object.entries(paths)) {
      const option = document.createElement('option');
      option.value = value; option.textContent = path.label; $('coachPath').append(option);
    }
    function clearChoices() {
      onChange();
      confirmed = null;
      $('coachChoices').classList.add('hidden');
      $('coachChosenGoal').textContent = '';
      $('coachOptions').replaceChildren();
    }
    function reset() {
      clearChoices();
      $('coachUnderstanding').classList.add('hidden');
      for (const id of ['coachLiteral', 'coachHearing', 'coachTentative']) $(id).textContent = '';
      $('coachGoal').value = ''; $('coachPath').value = '';
      $('coachStatus').textContent = 'You choose whether a possible interpretation fits. You can change or reject it.';
    }
    $('expressWords').addEventListener('input', reset);
    $('coachGoal').addEventListener('input', clearChoices);
    $('coachPath').addEventListener('change', clearChoices);
    $('coachUnderstand').addEventListener('click', () => {
      reset();
      const literal = $('expressWords').value;
      if (!literal.trim()) {
        $('coachStatus').textContent = 'Enter the words you want to explore in Express. A local recording is not transcribed or interpreted by this coach.';
        $('expressWords').focus(); return;
      }
      // Ignore only a final period and letter case when matching the displayed examples.
      const normalized = literal.trim().toLowerCase();
      const example = examples.get(normalized.endsWith('.') ? normalized.slice(0, -1) : normalized);
      $('coachLiteral').textContent = literal;
      $('coachHearing').textContent = example?.hearing || 'I do not have a scripted reading for these words. I cannot tell what a manager would hear. Please clarify your communication goal yourself.';
      $('coachTentative').textContent = example?.tentative || 'No intention or feeling is inferred. Choose a path and describe what you want to communicate, or keep your own wording.';
      $('coachPath').value = example?.path || '';
      $('coachGoal').value = example?.goal || '';
      $('coachStatus').textContent = example ? 'A curated example matches these words. Its possible reading is yours to edit or reject.' : 'Please clarify: these words are outside the curated examples. No interpretation or score has been invented.';
      $('coachUnderstanding').classList.remove('hidden');
      $('coachUnderstandingTitle').focus();
    });
    $('coachReject').addEventListener('click', () => {
      clearChoices(); $('coachGoal').value = ''; $('coachPath').value = '';
      $('coachHearing').textContent = 'Possible reading rejected. This prototype cannot establish what you intended.';
      $('coachTentative').textContent = 'You can choose a different path and describe your own goal, or skip coaching.';
      $('coachStatus').textContent = 'Interpretation rejected. Your original expression is unchanged.';
      $('coachPath').focus();
    });
    $('coachConfirm').addEventListener('click', () => {
      clearChoices();
      const path = $('coachPath').value, goal = $('coachGoal').value.trim();
      if (!path || !goal) {
        $('coachStatus').textContent = 'Choose your communication path and write or confirm your own goal first.';
        $(path ? 'coachGoal' : 'coachPath').focus(); return;
      }
      confirmed = { path, goal };
      $('coachChosenGoal').textContent = 'Your chosen goal: ' + goal;
      const options = path === 'custom' ? [
        ['State your own goal', 'What I want you to understand is: ' + goal],
        ['Invite clarification', 'My goal is: ' + goal + ' Can we check what that means before deciding next steps?'],
        ['Keep decisions open', 'I want to clarify this first: ' + goal + ' I am not making a new commitment in this conversation.'],
      ] : paths[path].options;
      options.forEach(([label, words], index) => {
        const article = document.createElement('article'); article.className = 'coach-option';
        const fieldId = 'coachWording' + index;
        const heading = document.createElement('label'); heading.className = 'write-label'; heading.htmlFor = fieldId; heading.textContent = label;
        const input = document.createElement('textarea'); input.id = fieldId; input.maxLength = 600; input.autocomplete = 'off'; input.value = words.slice(0, 600);
        input.addEventListener('input', resizeOptions);
        const button = document.createElement('button'); button.type = 'button'; button.className = 'secondary'; button.textContent = 'Move this wording to simulator';
        button.setAttribute('aria-label', 'Move ' + label.toLowerCase() + ' wording to simulator');
        button.addEventListener('click', () => {
          if (!input.value.trim()) { input.focus(); $('coachStatus').textContent = 'Enter wording you want to try, or choose another option.'; return; }
          $('practiceWords').value = input.value;
          moveDraft(input.value.trim(), { ...confirmed });
          $('coachStatus').textContent = 'Your chosen wording moved to the reply. Nothing was sent; you still choose whether to submit it.';
        });
        article.append(heading, input, button); $('coachOptions').append(article);
      });
      $('coachChoices').classList.remove('hidden'); resizeOptions(); $('coachChoicesTitle').focus();
    });
    return { reset, getContext: () => confirmed ? { ...confirmed } : null };
  }
  window.HumanLiteracyCoach = { paths, createCoach };
})();
