# Communication Coach: v1 and a future v2 adapter

## Working v1: static, scripted, and learner controlled

`simulator/01/coach.js` is a local catalog, not a language model. Its only automatic matches are the three literal examples from issue #1 (case and a final period are ignored). Everything else explicitly asks the learner to clarify their own goal. There are no model calls, inferred emotions, transcript analysis, confidence scores, credentials, storage, or coach-related network requests.

The learner reviews or rejects the possible reading, selects a path, and confirms or edits a goal. Each path provides three editable scripted examples, with no universally correct option. The custom path uses transparent templates containing the learner's own goal. Clicking a transfer button only fills the simulator input. The separate **Say this** action sends it to the fictional manager; authored follow-up choices and reflection preserve the selected path. Editing the reply removes its pending coaching context. Rejecting/editing a reading invalidates its suggestions and pending context. Direct, uncoached roleplay retains its existing simple rules; these are not extended to pretend to understand arbitrary new language. Unrecognized wording and learner-chosen goals receive no numeric grade.

Local MediaRecorder audio remains in page memory and is never transcribed by the coach. Optional browser dictation is a separate feature with its own prominent external-service consent. It can use a browser provider, appends words for the learner to review, and never automatically interprets or sends them. No application provider key is needed or present.

## Future v2: design only, not activated

A real contextual model and multiple-turn simulation would require a separately hosted HTTPS backend; GitHub Pages cannot safely hold provider credentials. The owner must first approve the provider, cost controls/billing, data policy, and deployment. Do not enable paid calls or collect user data just to make this design concrete. The shipped page has no v2 endpoint, feature switch, provider SDK, or auto-fallback to a model.

Use separate interpretation and conversation adapters so the UI need not change its consent, rejection, editing, or explicit-submit boundaries:

```ts
type Goal = { path: string; description: string; confirmedByLearner: boolean };
type InterpretationRequest = {
  version: 1;
  scenarioId: "missed-deadline";
  text: string; // Only text the learner explicitly chose to share, at most 2000 characters.
  goal?: Goal;
};
type Interpretation = {
  kind: "possibilities" | "clarification-needed";
  literalText: string; // Must exactly equal the submitted text.
  possibleManagerReading?: string; // Tentative, never a diagnosis or asserted hidden emotion.
  possibleGoals: Array<{ path: string; description: string }>;
  alternatives: Array<{ label: string; text: string; goalPath: string }>;
  clarificationQuestion?: string;
};
interface InterpretationAdapter {
  interpret(input: InterpretationRequest, signal: AbortSignal): Promise<Interpretation>;
}
interface ConversationAdapter {
  respond(input: {
    version: 1;
    scenarioId: "missed-deadline";
    selectedGoal: Goal;
    messages: Array<{ speaker: "learner" | "manager"; text: string }>;
  }, signal: AbortSignal): Promise<{
    managerReply: string;
    reflection?: { madeClear: string; unresolved: string; optionalPractice: string };
  }>;
}
```

Suggested future endpoints are `POST /api/coach/v1/interpret` and `POST /api/coach/v1/turn` on the approved backend. These routes do not exist in this release. A backend adapter, rather than the page, supplies provider authentication. Keep credentials in server-side environment/secret settings and never return them to a browser. Cross-origin allowlists, bounded requests, rate limits, timeouts, abuse controls, and an owner-defined spending cap are prerequisites for a public anonymous endpoint.

## Consent and data boundaries for v2

- Show the actual recipient/provider, exactly which text/history will leave the page, the purpose, and the established retention/deletion policy before offering an unchecked opt-in. Browser speech consent and local-recording consent are not AI consent.
- Declining leaves v1 fully functional. A separate explicit action submits the selected text; do not upload saved recordings or the private first reaction by default. Audio interpretation would need a separate design and explicit consent.
- Minimize shared context and do not attach an identity, analytics identifier, or account. Disable request-body logging, provider training/retention where supported, and content telemetry by default; verify the real settings before promising them.
- Withdrawal aborts in-flight browser requests and invalidates late responses, but cannot undo data already transmitted. Explain that limit honestly. Use request generations to prevent deleted or edited text from resurfacing through stale responses.
- Treat utterances and model responses as untrusted data. Enforce an output schema, length bounds, supported paths, and literal-text equality. Render text as text, never executable HTML. User text must not become instructions to reveal secrets, call tools, alter consent, or override the learner's selected goal.
- Interpretation must stay tentative and rejectable. Preserve a choice to resign, refuse, pause, or seek changes; do not silently transform it into compliance. If a goal is ambiguous, ask for clarification. Do not diagnose feelings or promise therapy, relief, employment rights, or workplace outcomes.
- Return 2–3 differentiated options for the learner-confirmed goal, not a universal correct response. Never auto-transfer, auto-submit, or infer a numerical grade from model text. A conversation request follows a separate explicit **Say this** action.

Before enabling any v2 adapter, add contract and browser tests for unknown wording, the three issue examples, goal preservation, edit/reject, prompt-injection attempts, provider timeout/invalid output, consent decline/withdrawal, offline fallback, stale responses, and distinct resignation/scope/recovery reflection. None of those provider behaviors are claimed as tested by the v1 suite.
