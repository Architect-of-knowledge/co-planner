# Guided planning example: a small booking app

Illustrative exchange, not a recorded model evaluation. The same flow works with `/co-planner --guided` in Claude and `$co-planner --guided` in Codex. Hebrew sessions translate the dialogue and decisions.

**User:** I run a one-person repair business. I want customers to book appointments online. I don't know what to plan.

**Planner:** I'll guide you through the decisions that affect the first useful version. What should customers be able to do without contacting you: request a time for your approval, or book an available time immediately? I recommend immediate booking if your working hours are predictable; manual approval gives you more flexibility but creates work for every appointment.

**User:** Immediately. Only one appointment at a time. I sometimes block afternoons for other work.

**Planner:** Then the first version needs your available hours, blocked periods, and a check that prevents two customers from confirming the same slot. Another easy-to-miss situation: a customer needs to cancel. Should they cancel themselves through their booking link, or contact you? I recommend self-service cancellation with a cutoff you choose, if that matches how you run the business.

**User:** They should contact me for now. I don't want to think about cutoff rules yet.

**Planner:** Accepted: customers book free slots immediately; you manage blocked times; cancellations go through you. Self-service cancellation stays out of this version because you want to keep the rules simple. Next I'll settle appointment duration and what confirmation details customers need.

The implementation plan then ties the accepted outcomes to tasks and tests, including simultaneous booking attempts. It does not silently add payments, multiple staff calendars or self-service cancellation. A managed handoff points to that plan when implementation begins, so the next session can resume without replaying the dialogue.

A real session would inspect existing scheduling code before recommending implementation details and would ask only questions the repository and previous answers cannot resolve.
