/* Conservative, authored workplace dialogue. No model, network, storage or grades. */
(function () {
  'use strict';
  const goalLabels = {
    boundary: 'a refusal or limit', resign: 'resignation', scope: 'revised scope or expectations',
    help: 'support', pause: 'a pause', recovery: 'a realistic recovery plan', custom: 'your own goal',
  };
  const reflectionPaths = {
    own: 'recovery', repair: 'recovery', recovery: 'recovery', plan: 'recovery', scope: 'scope', refusal: 'boundary',
    support: 'help', pause: 'pause', resign: 'resign', clarify: 'custom', uncertain: 'custom',
    anger: 'custom', hostile: 'custom', blame: 'custom', conflict: 'custom', threat: 'custom',
    disengage: 'pause', unrelated: 'custom', unknown: 'custom',
  };
  const authoredKinds = {
    own: 'own', boundary: 'scope', blame: 'blame', hostile: 'disengage', repair: 'repair',
    scope: 'scope', refusal: 'refusal', support: 'support', pause: 'pause', clarify: 'clarify', recovery: 'recovery',
    plan: 'plan', dismiss: 'disengage', resign: 'resign', exit: 'uncertain',
  };
  const normalize = text => String(text).toLowerCase().replace(/[’‘]/g, "'")
    .replace(/\bi'm\b/g, 'i am').replace(/\bi'll\b/g, 'i will').replace(/\bi've\b/g, 'i have').replace(/\bi'd\b/g, 'i would')
    .replace(/\byou're\b/g, 'you are').replace(/\bcan't\b/g, 'cannot').replace(/\bwon't\b/g, 'will not')
    .replace(/\bdon't\b/g, 'do not').replace(/\bisn't\b/g, 'is not').replace(/\s+/g, ' ').trim();
  const clauseEnd = '(?=$|[.!?;,]|\\s+(?:because|and|but|so|please)\\b)';
  const positiveResign = new RegExp("\\bi (?:quit(?: (?:this|the|my) job)?|resign(?: from (?:this|the|my) job)?|(?:am|'m) resigning(?: from (?:this|the|my) job)?|(?:am|'m) leaving (?:this|the|my) job|have decided to (?:resign|leave (?:this|the|my) job)|confirm my resignation|am confirming my decision to resign)" + '\\s*' + clauseEnd, 'g');
  const negativeResign = /\bi (?:(?:am|'m) not resigning|(?:do not|don't|will not|won't) (?:want to )?(?:resign|quit)|(?:am|'m) not (?:saying|confirming) (?:that )?i (?:resign|quit)|(?:do not|don't|never) (?:say|mean) (?:that )?i (?:resign|quit))\b|\bnot (?:a|my) resignation\b/g;
  const uncertainty = /\b(?:might|may|maybe|perhaps|considering|thinking (?:about|of)|not sure|unsure|if|would|could|should|suppose|imagine|joking)\b/;
  const leavingTopic = /\b(?:resign(?:ation|ing)?|quit(?:ting)?|leav(?:e|ing) (?:this|the|my) job|take this job and shove it)\b/;
  const threat = /\bi (?:will|'ll|am going to|'m going to|want to|intend to|plan to) (?:hurt|kill|punch|hit|attack|shoot) (?:you|him|her|them|someone)\b/;
  const targetInsult = /\b(?:fuck you|fuck off|screw you|shut up|kiss my ass|you (?:are|'re) (?:an? )?(?:idiot|moron|asshole|useless|stupid|incompetent)|you idiot)\b/;
  const profanity = /\b(?:fuck(?:ing)?|shit|damn|asshole|kiss my ass)\b/;
  const reportedOrQuestioned = /\b(?:you|he|she|they|someone) (?:said|says|asked)\b|\b(?:what if|did i say|when i said|suppose i|imagine i|i said|i never said|do not (?:assume|think|say) (?:that )?i)\b/;
  const pause = /\bi (?:need|want|would like) to (?:pause|take a break)\b|\bi (?:(?:need|want|request|am asking for) (?:a |some )?(?:break|pause|time to think|space)|(?:cannot|can't) continue (?:this|the) (?:conversation|discussion|meeting))\b|\b(?:can|could) we (?:pause|take a break)\b|\bplease (?:give me (?:a moment|some space)|let me (?:pause|take a break))\b/;
  const scope = /\b(?:the|this|our|project) scope (?:has |was )?(?:changed|expanded|increased)\b|\b(?:scope|deadline|expectations) (?:is|are) (?:unrealistic|unreasonable)\b|\bi (?:cannot|can't|will not|won't) (?:meet|commit to) (?:the |this |that |an? )?(?:original |current |expanded )?(?:deadline|scope|combination|expectations)\b|\bi (?:need|require) more time (?:because|to|for)\b|\b(?:reduce|adjust|revise|renegotiate|change) (?:the |this |our )?(?:scope|deadline|expectations)\b/;
  const refusal = /\bi (?:(?:will not|won't|refuse to|cannot|can't) (?:accept|take on|complete|finish|do|send|deliver|work|commit|agree)|(?:am|'m) not (?:accepting|agreeing|committing))\b|\bmy answer (?:to (?:this|the) request )?is no\b|\bi (?:will not|won't) (?:be shouted at|discuss (?:my |these )?personal details|share (?:my |more )?personal information)\b/;
  const furtherRefusal = /\bi (?:am not (?:doing|taking on) (?:any (?:more )?|more |additional )?(?:work|this (?:work|project|assignment)|the (?:work|project|assignment))|(?:refuse to|will not|cannot) (?:continue (?:working|to work)|provide (?:another |any (?:more )?|an? )?(?:update|report))|am not (?:continuing (?:to work|with (?:this|the) (?:work|project))|working on (?:this|the) (?:project|assignment)))\b/;
  const deadlineConcern = /\b(?:your|the|this|our) (?:deadline|timeline|schedule) is (?:ridiculous|unworkable|too tight|unrealistic|unreasonable)\b|\b(?:the |project )?(?:requirements|priorities) (?:have |were )?changed\b|\byou (?:have )?added more work\b/;
  const ordinaryHelp = /\b(?:can|could) i (?:get|have) (?:some |more )?(?:help|support|assistance)\b/;
  const ordinaryClarification = /\bcan i (?:explain|describe|tell you)\b|\bwhat (?:do you need from me|should i do next|is most important|needs to happen next)\b|\b(?:can|could) you (?:be more specific|tell me what you need)\b/;
  const explanation = /\bi (?:want to |would like to |need to )?explain (?:what happened|my (?:side|perspective)|the (?:situation|delay))\b/;
  const fairSolution = /\b(?:find|agree on|discuss|decide on|work (?:toward|towards)) (?:a )?fair (?:solution|way forward|next step)\b/;
  const unrelated = /^(?:my favou?rite colou?r is [a-z-]+(?:,? and i had (?:pancakes|toast|eggs) for breakfast)?|i had (?:pancakes|toast|eggs) for breakfast)[.!]?$/;
  const positiveWork = /\bi (?:will|agree to|commit to) (?:finish|complete|do|send|deliver|take on|accept)\b/;
  const support = /\bi (?:need|want|am asking for|would like) (?:some |additional |more )?(?:help|support|assistance)\b|\b(?:can|could) (?:you|someone|we) help (?:me|us)\b|\bwhat (?:help|support|adjustments) (?:is|are) available\b/;
  const accountability = /\bi (?:underestimated (?:the|this|my) (?:work|task|time)|should have (?:warned|flagged|told|notified)|forgot to (?:send|flag|tell|notify)|take responsibility for|made (?:a|the) mistake)\b|\b(?:the delay was|that was|it was) my (?:mistake|responsibility|fault)\b/;
  const blame = /\b(?:it (?:is not|isn't)|this (?:is not|isn't)) my fault\b|\b(?:everybody|everyone|someone) else (?:messed|caused|failed)\b|\bit (?:is|was) (?:their|your|his|her) fault\b/;
  const clarification = /\b(?:can|could|would) you (?:please )?(?:clarify|explain|tell me|confirm)\b|\bwhat (?:do you mean|changed|is (?:the|your) (?:priority|expectation)|am i expected to (?:do|deliver)|information do you need|remains (?:to be done|unclear))\b|\b(?:can|could) we (?:review|compare|clarify|discuss|check) (?:the |our )?(?:facts|remaining work|what remains|priorities|scope|options|support|deadline)\b|\bplease (?:clarify|explain|confirm) (?:the |what |whether |notice|final pay|any handover)\b/;
  const repair = /\bi (?:want|would like|need) to (?:reset|restart|start over) (?:this |the |our )?(?:conversation|discussion)\b|\bi apologize for (?:how|the way) i spoke\b/;
  const anger = /\bi (?:am|'m|feel) (?:angry|frustrated|upset|furious|overwhelmed)\b|\bthis is (?:fucking |damn )?(?:ridiculous|frustrating|unfair)\b/;
  const disengage = /^(?:whatever[.! ]*)?(?:i (?:do not|don't) care(?: what happens)?[.! ]*)?$|^leave me alone[.! ]*$/;
  // A proposal is recognized only as a whole, bounded sentence with a work object.
  // Merely mentioning update/status/finish/time never earns a productive-plan reply.
  const plan = /^(?:i (?:can|will|'ll|plan to|intend to) (?:send|provide|write|share|prepare) (?:you |the client )?(?:a |an |the )?(?:written )?(?:status )?(?:update|report|summary|plan)(?: (?:in|within) \d+ (?:minutes?|hours?|days?)| by (?:today|tomorrow|friday|monday|noon|\d{1,2}(?::\d{2})?(?: ?[ap]m)?))?(?:,? (?:with|including) (?:a realistic delivery time|the risks|what remains|the remaining work))?|i (?:can|will|'ll) (?:finish|complete|deliver) (?:the |this )?(?:report|work|task|project) (?:by (?:today|tomorrow|friday|monday|noon)|in \d+ (?:hours?|days?)))[.!]?$/;

  function analyze(text, options = {}) {
    const original = String(text).trim();
    const value = normalize(original);
    const goalPath = Object.hasOwn(goalLabels, options.goal?.path) ? options.goal.path : null;
    const negativeMatches = Array.from(value.matchAll(negativeResign));
    const positiveMatches = Array.from(value.matchAll(positiveResign)).filter(match => !negativeMatches.some(negative => match.index >= negative.index && match.index < negative.index + negative[0].length));
    const negatedAttribution = /\bi (?:do not|am not|never) (?:think|say|mean|believe|call|calling|saying|want|intend|plan)\b/;
    // Only attribute a matched phrase when its own clause is asserted. A later
    // direct statement remains eligible after a quoted/denied earlier clause.
    const asserted = found => {
      const prefix=value.slice(0,found.index).split(/[.!?;]|\bbut\b|\bhowever\b/).pop();
      return !reportedOrQuestioned.test(prefix) && !negatedAttribution.test(prefix)
        && !/\b(?:if|suppose|imagine|what if)\b/.test(prefix);
    };
    const findAsserted = expression => Array.from(value.matchAll(new RegExp(expression.source,'g'))).find(asserted);
    const directThreat=findAsserted(threat),directInsult=findAsserted(targetInsult);
    const fairMatch=findAsserted(fairSolution);
    const fairPrefix=fairMatch ? value.slice(0,fairMatch.index).split(/[.!?;]|\bbut\b|\bhowever\b/).pop() : '';
    const reportedAggression = !directThreat && !directInsult && (reportedOrQuestioned.test(value) || negatedAttribution.test(value)) && (threat.test(value) || targetInsult.test(value));
    const flags = {
      profane: profanity.test(value), personalAttack: Boolean(directInsult),
      reportedSpeech: reportedAggression,
      explainFacts: Boolean(findAsserted(explanation)),
      fairSolution: Boolean(fairMatch && /\bi (?:want|would like) to\b|\b(?:can|could) we\b/.test(fairPrefix) && !/\b(?:not|never|cannot)\b/.test(fairPrefix)),
      notResigning: negativeMatches.length > 0, goalMismatch: false, unverifiedCommitment: false,
      personalBoundary: findAsserted(/\bi (?:will not|cannot) be shouted at\b/) ? 'treatment' : findAsserted(/\bi (?:will not|cannot) (?:share (?:my |more )?personal information|discuss (?:my |these )?personal details)\b/) ? 'privacy' : null,
    };
    let kind = 'unknown', match = null, basis = 'No reliable scripted match; no intention, feeling or grade is inferred.';
    const decide = (candidate, expression) => {
      const found = findAsserted(expression);
      if (found) { kind = candidate; match = found[0]; return true; }
      return false;
    };
    const negativeDelivery = /\bi (?:will not|cannot|refuse to) (?:finish|complete|do|accept|take on|work)\b/.test(value);
    const positiveDelivery = /\bi (?:will|agree to|commit to) (?:finish|complete|do|accept|take on|work)\b/.test(value);
    const inconsistentWork = negativeDelivery && positiveDelivery && !/\b(?:until|unless|before|under (?:these|current) conditions|today|tomorrow|revised|with support)\b/.test(value);
    const leavingClause = value.split(/[.!?;]/).filter(part => leavingTopic.test(part)).join(' ');
    const pureQuestion = value.endsWith('?') && !/[.!;]/.test(value.slice(0, -1));
    if (reportedAggression) {
      // A quoted or questioned threat is not asserted as the learner's intention.
      kind = 'unknown';
    } else if (decide('threat', threat)) {
      flags.stopConversation = true;
    } else if ((positiveMatches.length && negativeMatches.length) || inconsistentWork) {
      kind = 'conflict'; match = original;
    } else if (reportedOrQuestioned.test(leavingClause) && leavingTopic.test(value)) {
      kind = 'uncertain'; match = original;
    } else if (leavingTopic.test(value) && (uncertainty.test(leavingClause) || pureQuestion || /\bi (?:want to|wish i could) (?:resign|quit|leave (?:this|the|my) job)\b|take this job and shove it/.test(value))) {
      kind = 'uncertain'; match = original;
    } else if (positiveMatches.length) {
      kind = 'resign'; match = positiveMatches[0][0];
    } else if (decide('pause', pause)) {
      // Explicitly requesting a break never becomes a resignation.
    } else if (directInsult && (decide('refusal', refusal) || decide('refusal', furtherRefusal))) {
      // A personal attack does not erase an explicitly stated refusal.
    } else if (decide('hostile', targetInsult)) {
      // Delivery and a chosen goal are kept separate.
    } else if (decide('scope', scope) || decide('scope', deadlineConcern) || decide('refusal', refusal) || decide('refusal', furtherRefusal) || decide('support', support) || decide('support', ordinaryHelp) || decide('repair', repair) || decide('own', accountability) || decide('blame', blame) || decide('clarify', clarification) || decide('clarify', ordinaryClarification) || decide('anger', anger)) {
      // These are bounded speech acts; they do not establish the whole intention.
    } else if (value && disengage.test(value)) {
      kind = 'disengage'; match = original;
    } else if (plan.test(value)) {
      kind = 'plan'; match = original; flags.unverifiedCommitment = true;
    } else if (flags.explainFacts && flags.fairSolution) {
      kind = 'recovery'; match = original;
    } else if (flags.explainFacts) {
      kind = 'clarify'; match = findAsserted(explanation)[0];
    } else if (unrelated.test(value)) {
      kind = 'unrelated'; match = original;
    } else if (flags.notResigning) {
      kind = 'clarify'; match = negativeMatches[0][0];
    } else if (options.authoredText === original && Object.hasOwn(authoredKinds, options.authoredKind)) {
      kind = authoredKinds[options.authoredKind]; match = original;
      basis = 'An authored example matched exactly. This is a scripted illustration, not a measurement.';
    }
    if (match && !basis.startsWith('An authored')) basis = 'A stated phrase matched a limited script. Other meanings and real outcomes remain unverified.';
    const incompatible = {
      resign: ['scope', 'refusal', 'pause', 'support'], pause: ['resign'],
      boundary: ['resign'], recovery: ['resign', 'refusal', 'pause'],
      scope: ['resign'], help: ['resign'],
    };
    if (goalPath && (incompatible[goalPath]?.includes(kind) || goalPath === 'resign' && flags.notResigning)) flags.goalMismatch = true;
    if (flags.personalBoundary) flags.goalMismatch = false;
    if (goalPath === 'scope' && kind === 'refusal' && /\b(?:before|until|unless|current|conditions)\b/.test(value)) flags.goalMismatch = false;
    return {
      kind, matched: kind !== 'unknown', text: original, goalPath,
      reflectionPath: reflectionPaths[kind], flags, basis,
      evidence: match ? [{ dimension: kind, text: match }] : [],
    };
  }

  const responses = {
    own: ["You have named your part in the delay. What remains, and what can you realistically offer next?", "You have named an action you could have taken. We still need the facts, remaining work and a realistic next step."],
    clarify: ["You are asking for clarification. Which expectation or fact do you need me to explain first?", "We still need a shared understanding. Let's clarify the specific question before assuming a commitment."],
    plan: ["You have proposed a work update. What is still uncertain, and is that timing realistic?", "That is a proposed next step. We still need to check the remaining work, risks and timing; delivery is not guaranteed."],
    scope: ["You are asking to revisit scope or timing. Which expectation needs to change before you can commit?", "We have identified a scope or timing limit. Any adjustment still needs agreement; I cannot promise approval."],
    refusal: ["Your refusal or limit is clear. I will not treat that as agreement. We need to review what's unfinished and who will update the client. Is this final, or are there conditions you would discuss?", "Your refusal or limit is explicit. I need to review responsibilities and the client update; we may still disagree about what is owed. What needs to be clarified?"],
    support: ["You are asking for support. What help would be useful? You choose what personal details to share.", "You have requested support. We still need to establish what is available and what you want to explore."],
    pause: ["You are asking for a pause. I will not treat a break as resignation or agreement to more work. Would you like to say when or how to continue?", "We can pause this conversation. When or how to resume, and the original work issue, remain open."],
    resign: ["You have said you are resigning. I will not treat that as agreement to finish this assignment. What practical details would you like to clarify?", "You have confirmed that you are resigning. We can discuss notice, final pay, timing and any handover. I will not treat this as agreement to finish the assignment."],
    uncertain: ["I will not assume a resignation from uncertain or quoted words. Are you deciding to resign, asking for a pause, or considering your options?", "Your decision about leaving is not established by this wording. You can clarify it or take time; no work agreement should be assumed."],
    hostile: ["I will discuss the deadline, but personal attacks are not acceptable. What specifically is unworkable, or would you prefer to pause?", "We can discuss your concern without personal attacks. If we cannot do that now, we will pause; the work issue still needs attention."],
    anger: ["You have expressed a strong reaction. I will not assume a refusal or resignation. What would you like me to understand or change?", "The reaction is clear, but the request or decision still needs clarification. You can name a limit, ask for support or pause."],
    blame: ["You are disputing responsibility. What specific facts or handoffs should we check before deciding what happens next?", "Responsibility is still disputed. We need specific facts rather than assume who caused the delay or what anyone has agreed to do."],
    conflict: ["Those words point in different directions. Which decision or limit do you want me to understand? I will not assume agreement.", "The wording does not establish one consistent decision. We need clarification before making commitments."],
    threat: ["I cannot continue a work discussion while threats of harm are being made. We will stop this exchange and address safety before discussing the assignment.", "This exchange remains paused because of the threat. A work plan does not resolve the need for safety."],
    repair: ["You are asking to reset the conversation. What fact or limit would you like to state differently?", "You have offered to reset the exchange. That can reopen discussion, but the work, limits and any next step still need agreement."],
    recovery: ["You are choosing to check the work before promising a recovery plan. What facts or limits should we clarify first?", "You have proposed checking the facts before a commitment. The remaining work, support and realistic timing still need agreement."],
    disengage: ["You are ending or stepping away from the exchange. Would you like to request a pause or clarify a decision?", "We will pause this exchange. It has not established agreement about the assignment or what happens next."],
    unrelated: ["That doesn't explain what happened with the project. Can you tell me about the work, or what you want to do next?", "We still haven't addressed the missed deadline. I need to understand the work's status or your decision before I can update the client."],
    unknown: ["I'm not sure how that relates to the deadline. What would you like me to understand about the work or your decision?", "I still need to understand your point. Are you asking a question, setting a limit, or making a decision?"],
  };

  function manager(analysis, options = {}) {
    const turn = options.turn === 1 ? 1 : 0;
    if (analysis.kind === 'threat') return responses.threat[turn];
    if (options.previous?.kind === 'threat') return 'We need to address the threat and safety before resuming a work discussion. No assignment agreement has been made.';
    if (analysis.flags.reportedSpeech) return "I don't want to misread that. Are you quoting someone, disagreeing with those words, or raising a concern?";
    if (analysis.flags.personalBoundary === 'treatment') return turn === 0
      ? 'You have stated a refusal or limit about being shouted at. We can discuss the work respectfully. Would you like to pause or clarify the work issue?'
      : 'Your limit on being shouted at remains clear. It is not acceptance of more work; responsibilities and any next step still need clarification.';
    if (analysis.flags.personalBoundary === 'privacy') return turn === 0
      ? 'You have stated a refusal or limit about what you share. You choose what personal details to disclose. What work information or support would you like to discuss?'
      : 'Your privacy limit remains clear. You decide what personal details to share; any work or support arrangement still needs clarification.';
    if (analysis.flags.personalAttack && analysis.kind !== 'hostile') {
      const decision = analysis.kind === 'resign' ? 'You have stated resignation, not agreement to finish the assignment. ' : analysis.kind === 'refusal' ? 'Your refusal or limit is explicit. ' : '';
      return decision + 'Personal attacks make the exchange harder. We can pause or discuss the decision without attacking the person.';
    }
    if (analysis.flags.notResigning && !['pause','conflict','uncertain'].includes(analysis.kind)) return 'You have said you are not resigning. That does not mean you have agreed to the assignment. What would you like to clarify next?';
    // Jordan hears submitted words, never a private goal from Help me draft.
    const path = turn === 1 && reflectionPaths[options.previous?.kind];
    if (path === 'resign' && ['plan', 'clarify', 'own', 'repair', 'recovery'].includes(analysis.kind)) return 'You chose to leave the job. We can clarify notice, final pay, timing and any handover without treating this as acceptance of the assignment.';
    if (path === 'boundary' && ['plan', 'clarify', 'own', 'repair', 'recovery'].includes(analysis.kind)) return 'Your earlier refusal or limit remains part of this conversation. Which practical detail do you want to clarify? A new work commitment should not be assumed.';
    if (path === 'pause' && ['plan', 'clarify', 'own', 'repair', 'recovery'].includes(analysis.kind)) return 'You asked for a pause. We can clarify when or how to return, without treating that as resignation or a new work commitment.';
    if (analysis.kind === 'own' && analysis.flags.explainFacts && analysis.flags.fairSolution) return turn === 0
      ? "You've acknowledged a mistake and want a fair solution. Tell me what happened; then we can look at the remaining work and a realistic next step."
      : "I can hear your explanation before we decide what is fair. We still need the facts, what remains, and what each of us can reasonably do.";
    if (analysis.flags.explainFacts && ['clarify','recovery'].includes(analysis.kind)) return "You want to explain what happened. Go ahead; then we can check the facts and what needs to happen next, without assuming agreement.";
    if (['hostile', 'conflict', 'uncertain', 'anger', 'disengage', 'unknown', 'unrelated'].includes(analysis.kind)) return responses[analysis.kind][turn];
    return (responses[analysis.kind] || responses.unknown)[turn];
  }

  // Qualitative teaching points describe visible wording, not personality or ability.
  const teaching = {
    own: ['Accountability', 'You named an action you could have taken.', 'Owning a specific action can make the discussion more concrete.', 'Taking responsibility does not establish every cause of a delay.', 'The manager asks what remains because accountability alone does not produce a plan.', 'Another person might need more facts before understanding your part.', 'Separate one action you own from factors you do not control.', 'Instead of “Everything is my fault,” try “I should have flagged the risk earlier; here is what remains.”'],
    clarify: ['Clarification and listening', 'You asked for information or clarified a decision.', 'A specific question can reduce assumptions before a commitment.', 'A general question may still leave the exact information needed unclear.', 'The manager asks for the specific expectation or fact to clarify.', 'The other person may hear uncertainty rather than disagreement.', 'Ask one question that checks a specific expectation.', 'Instead of “What?”, try “Which deadline and scope are you asking me to commit to?”'],
    plan: ['Realistic commitments', 'You proposed a concrete work step.', 'Naming an update or deliverable gives the discussion something specific to check.', 'This script cannot establish whether the timing or commitment is realistic.', 'The manager checks risks and timing rather than treating a promise as proof of delivery.', 'The other person may hear a possibility rather than a final commitment.', 'Check the remaining work before promising a time.', 'Instead of “I will fix everything,” try “I can send a status update in 30 minutes, with the risks and remaining work.”'],
    scope: ['Negotiation and boundaries', 'You raised a scope or timing limit.', 'Naming the tradeoff can separate capacity from agreement.', 'The other person may not approve the adjustment you request.', 'The manager asks which expectation needs to change before commitment.', 'A request for revised expectations might be mistaken for accepting the current ones.', 'Privately note what changed and one adjustment you want clarified.', 'Instead of “This is impossible,” try “The scope changed; can we reduce the work or revise the deadline?”'],
    refusal: ['Clear boundaries', 'You stated a refusal or limit.', 'A clear limit can prevent an agreement being assumed.', 'The refusal does not settle responsibilities or guarantee acceptance by the other person.', 'The manager checks what remains open rather than forcing compliance.', 'A conditional refusal may be heard as a final refusal unless the condition is explicit.', 'Privately write one request you would decline and the limit you want to keep.', 'Instead of “Whatever,” try “I am not accepting this request under these conditions.”'],
    support: ['Asking for support', 'You asked for help or support.', 'Naming a need can open a discussion without requiring private disclosure.', 'The available support and whether it fits are not established.', 'The manager asks what help is useful instead of assuming your needs.', 'The other person may need a more specific request before knowing what is possible.', 'Privately name one form of support you might request.', 'Instead of “You should know what I need,” try “Could someone help me check the remaining work?”'],
    pause: ['Pausing deliberately', 'You asked for a break from the conversation.', 'An explicit pause distinguishes stopping now from resigning or accepting work.', 'When or how to return may still be unclear.', 'The manager asks about continuing without treating a pause as a job decision.', 'A walkout without explanation could be mistaken for leaving the job.', 'Rehearse one sentence asking for a pause. You choose whether or when to return.', 'Instead of “I am out of here,” try “I need a pause; I am not resigning.”'],
    resign: ['Communicating a decision', 'You stated a decision to leave the job.', 'Clear resignation wording distinguishes leaving from accepting the assignment.', 'Notice, final pay, timing and any handover still need clarification.', 'The manager acknowledges the decision without assuming agreement to finish the work.', 'Uncertain language about leaving could be heard as considering options rather than a confirmed decision.', 'Draft one private resignation statement. You decide whether to send it.', 'Instead of “Maybe I am done,” a confirmed decision could be “I am resigning; please explain the next steps.”'],
    uncertain: ['Clarifying an important decision', 'You raised leaving or resignation without a settled decision.', 'Naming uncertainty can keep a decision open.', 'A listener might mistake uncertain or quoted words for formal resignation.', 'The manager asks rather than decides what you mean.', 'You might be considering options, quoting someone or asking for a pause.', 'Privately write what is decided and what is still uncertain.', 'Instead of an unclear “I might be done,” try “I am considering leaving, but I have not decided.”'],
    hostile: ['Expressing a limit without personal attacks', 'The wording contains a personal attack.', 'Your underlying concern or limit can still be stated and explored.', 'A personal attack can stop a productive exchange without making the request clear.', 'The manager sets a limit on the delivery while leaving room for a boundary or pause.', 'The listener cannot know whether the words mean refusal, anger or a wish to stop.', 'Try one sentence naming your limit without attacking the person.', 'Instead of “You are an idiot,” try “I disagree with this expectation and want to explain my limit.”'],
    anger: ['Naming a reaction and a request', 'You described a strong reaction.', 'Naming your reaction can be a starting point without making a work commitment.', 'The requested change or decision may still be unclear.', 'The manager asks what you want understood rather than inferring resignation or refusal.', 'A strong reaction can coexist with several different goals.', 'Privately write one request or limit you want the other person to understand.', 'Instead of “This is ridiculous” alone, try “This feels unfair; I want to clarify how the deadline was set.”'],
    blame: ['Separating claims from facts', 'You disputed responsibility or attributed it elsewhere.', 'Disputing responsibility can raise a legitimate issue to investigate.', 'A claim alone does not establish who caused the delay.', 'The manager asks for specific facts before allocating responsibility.', 'Another person might hear a factual concern or might hear an unsupported accusation.', 'Privately list one observable handoff or fact you want checked.', 'Instead of “Everyone else messed up,” try “The approval arrived after the agreed handoff; can we review the timeline?”'],
    conflict: ['Consistency and clarification', 'The wording gives conflicting signals.', 'Noticing a conflict offers a chance to clarify before commitment.', 'The listener cannot safely choose which statement represents your decision.', 'The manager asks which decision or limit to use.', 'The apparent contradiction might reflect different conditions that were not stated.', 'Privately write one sentence separating your decision from any condition.', 'Instead of “I agree and I refuse,” try “I refuse the current request; I would discuss a smaller scope.”'],
    threat: ['Keeping an exchange safe', 'The wording threatens harm.', 'You can still choose to stop and express a concern without threats.', 'A threat can require the conversation to stop before work can be discussed.', 'The manager prioritizes safety; a project plan does not resolve a threat.', 'The script cannot determine real-world risk, intent or consequences.', 'Step away from the fictional exchange and draft a concern without threatening harm.', 'Instead of a threat, try “I cannot continue this conversation; I need to stop.”'],
    repair: ['Repairing an exchange', 'You asked to reset how the conversation is going.', 'A reset can reopen a difficult discussion.', 'Resetting does not itself settle the work issue or erase earlier words.', 'The manager invites a clearer statement of facts or limits.', 'A listener may still need you to acknowledge what needs changing.', 'Draft one private update about what remains and what you can realistically offer.', 'Instead of “Forget it,” try “I want to reset; here is the fact or limit I need to explain.”'],
    recovery: ['Checking facts before commitment', 'You proposed reviewing the work before making a new promise.', 'Checking facts can help separate a realistic offer from an unsupported commitment.', 'A recovery plan and its feasibility have not yet been agreed.', 'The manager asks for the remaining work, support and timing before commitment.', 'The other person might hear a promise unless the need to check facts is explicit.', 'Draft one private update about what remains and what you can realistically offer.', 'Instead of “I will fix everything,” try “Let us check what remains before agreeing a delivery time.”'],
    disengage: ['Making a pause explicit', 'The wording steps away from the exchange.', 'You can choose to pause or decline without pretending to agree.', 'The wording does not establish what happens next.', 'The manager pauses rather than praising a recovery plan that was not offered.', 'The listener may not know whether you want a pause or a final decision.', 'Privately write one sentence saying whether you want to pause or decline.', 'Instead of “Whatever,” try “I need to pause this conversation; I am not making a new commitment.”'],
    unknown: ['Checking understanding', 'This script cannot reliably determine what the wording communicates.', 'No strength or difficulty assessment of unfamiliar wording is claimed.', 'The message may be clear to a person even though this limited script cannot interpret it.', 'The manager asks for clarification rather than inventing understanding or a successful plan.', 'The wording could have a meaning outside the examples this script supports.', 'Privately write one question that could check whether someone understood your goal.', 'Try making one decision or request explicit, such as “Can you clarify the deadline?”'],
    unrelated: ['Connecting a reply to the situation', 'You shared personal facts about colour or breakfast, without addressing the work.', 'You have not accepted work or made an unsupported promise.', 'The listener still lacks information about the missed deadline or your decision.', 'Jordan redirects to the project because these personal facts do not answer the workplace question.', 'This could be a deliberate change of subject, a misunderstanding or an attempt to make conversation; the script cannot establish which.', 'Privately draft one sentence about the project, a question or the decision you want to communicate.', 'For example: “Before I respond about the project, can you clarify the priority?”'],
  };

  function feedback(first, last, options = {}) {
    const current = last || first;
    // An explicit null means the learner cleared this context. Only callers that
    // omit the goal option may inherit analysis context from an earlier turn.
    const goalPath = Object.hasOwn(options, 'goal')
      ? Object.hasOwn(goalLabels, options.goal?.path) ? options.goal.path : null
      : current.goalPath || first.goalPath;
    const selected = goalPath ? 'Your selected goal remains ' + goalLabels[goalPath] + '. ' : '';
    const unsafe = first.kind === 'threat' || current.kind === 'threat';
    const kind = unsafe ? 'threat' : current.kind;
    const [skill, communicated, constructive, difficulty, why, alternative, action, example] = teaching[kind] || teaching.unknown;
    let outcome;
    let unresolved;
    let contextualPath = null;
    if (kind === 'threat') {
      outcome = 'The exchange pauses because of a threat. A work agreement or recovery plan has not been established.';
      unresolved = 'Safety and whether a conversation can continue remain unresolved. This script cannot assess real-world risk.';
    } else if (kind === 'conflict') {
      outcome = selected + 'The words point in different directions; no new decision or agreement should be assumed.';
      unresolved = 'Which goal, decision and conditions you want to communicate still need clarification.';
    } else if (['unknown', 'unrelated', 'uncertain', 'hostile', 'anger', 'blame', 'disengage'].includes(kind)) {
      const earlier = first.kind === 'refusal' ? 'Your earlier refusal or limit is not an agreement to work. ' : first.kind === 'resign' ? 'Your earlier statement about leaving is not acceptance of the assignment. ' : first.kind === 'pause' ? 'Your earlier pause is not a resignation. ' : '';
      outcome = selected + earlier + ({
        unknown: 'This script has not established a shared meaning or a useful recovery plan.',
        unrelated: 'The reply does not address the missed deadline. No work agreement or recovery plan has been established.',
        uncertain: 'The decision about leaving remains open; no resignation is assumed.',
        hostile: 'The personal attack makes the exchange harder; no workable next step is established.',
        anger: 'A strong reaction was expressed, but the request or decision remains open.',
        blame: 'Responsibility remains disputed; the facts have not been established.',
        disengage: 'The conversation pauses without a work agreement.',
      }[kind]);
      unresolved = kind === 'uncertain' ? 'Whether you are resigning, considering options or asking for a pause still needs clarification.' : 'What you want understood, what the other person understands and any practical next step remain open.';
    } else {
      const statedDecision = ['resign','refusal','pause'].includes(kind) && !current.flags.personalBoundary ? reflectionPaths[kind] : null;
      const earlierDecision = ['resign','refusal','pause','scope','support'].includes(first.kind) && ['plan','clarify','own','repair','recovery'].includes(kind) ? first.reflectionPath : null;
      // A private drafting goal is not evidence that the learner said it.
      const path = current.flags.notResigning && !['pause','conflict','uncertain'].includes(kind) ? 'custom' : statedDecision || earlierDecision || reflectionPaths[kind];
      contextualPath = path;
      const outcomes = {
        resign: 'You state a decision to leave the job. The work assignment is not accepted; notice, final pay and any handover remain open.',
        boundary: 'You state a refusal or limit. Agreement and practical next steps remain open.',
        scope: 'You ask for revised expectations about scope or timing before committing. An adjustment is not guaranteed.',
        help: 'You state a need for support while choosing what to share. What help is available remains open.',
        pause: 'You ask for a pause without resigning or agreeing to more work. When or how to return remains open.',
        recovery: kind === 'own' ? 'You name your part in the delay. A realistic recovery plan still needs facts and agreement.' : kind === 'repair' ? 'You try to reset the exchange. The work, limits and next step still need agreement.' : kind === 'recovery' ? 'You propose checking facts before a commitment. A recovery plan still needs agreement.' : 'You propose a concrete next step. Its feasibility and timing still need to be checked.',
        custom: 'You try to clarify what you want understood. No unchosen commitment is established.',
      };
      const open = {
        resign: 'Notice, final pay, timing and any handover remain practical questions. This prototype cannot determine employment rights or consequences.',
        boundary: 'Whether the other person accepts the refusal or limit, responsibilities and next steps remain unresolved.',
        scope: 'The scope, deadline, priorities and support still need agreement.',
        help: 'What support is available, who can provide it and what you choose to disclose remain open.',
        pause: 'When or how to return, and the original work issue, remain open.',
        recovery: 'The facts, remaining work, risks, support and realistic timing still need confirmation.',
        custom: 'Your meaning, the other person’s understanding and any chosen next step still need clarification.',
      };
      outcome = outcomes[path] || outcomes.custom;
      unresolved = open[path] || open.custom;
    }
    const contextActions = {
      resign: teaching.resign[6], boundary: teaching.refusal[6], scope: teaching.scope[6],
      help: teaching.support[6], pause: teaching.pause[6], recovery: teaching.repair[6], custom: teaching.unknown[6],
    };
    if (current.flags.personalBoundary && !unsafe) outcome = 'You state a personal refusal or limit. ' + selected + 'No new work commitment should be assumed.';
    if (current.flags.notResigning && !['pause','conflict','uncertain'].includes(kind) && !unsafe) outcome = 'You say you are not resigning. That is not acceptance of the assignment; your next decision remains open.';
    const explanationAndSolution = kind === 'own' && current.flags.explainFacts && current.flags.fairSolution;
    return {
      outcome,
      communicated: explanationAndSolution ? 'You acknowledged a mistake, asked to explain what happened and proposed finding a fair solution.' : communicated,
      constructive: explanationAndSolution ? 'You combined accountability with a request to hear the facts, instead of accepting all blame or promising a fix before discussing it.' : constructive,
      difficulty: current.flags.personalBoundary ? 'The work issue and any support still need clarification; a privacy or treatment boundary does not settle those questions.' : current.flags.personalAttack ? 'A personal attack can obstruct discussion of your decision. ' + difficulty : difficulty,
      why: current.flags.personalBoundary ? 'The manager separates your personal boundary from the work issue instead of requiring you to negotiate privacy or respectful treatment.' : why,
      skill, alternative, unresolved,
      improvement: explanationAndSolution ? 'Add one specific fact about what happened and ask what a fair next step would require; leave the decision open until you have discussed it.' : kind === 'refusal' ? 'Keep the refusal clear. If you choose, add what needs clarifying about unfinished work or responsibilities; you do not have to offer more work.' : kind === 'hostile' ? 'Replace the personal judgment with the specific deadline concern; keep any limit or disagreement you want to communicate.' : kind === 'unrelated' ? 'Connect the next reply to the work, a question or an explicit decision; personal facts alone do not explain the missed deadline.' : kind === 'unknown' ? 'Make one request or decision explicit, or choose a goal yourself. This script cannot judge unfamiliar language.' : 'Clarify the specific limit, fact or next step that remains open.',
      example, action: contextualPath ? contextActions[contextualPath] || action : action, basis: selected + current.basis, kind, goalPath,
    };
  }

  const api = { analyze, manager, feedback, goalLabels };
  if (typeof window !== 'undefined') window.HumanLiteracyDialogue = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})();
