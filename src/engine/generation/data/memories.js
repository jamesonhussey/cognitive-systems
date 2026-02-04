/**
 * MEMORY GENERATION TEMPLATES
 * 
 * Templates for generating character memories.
 * Now includes personal/life memories and trait-linked templates.
 * 
 * Placeholders:
 * - {self} - The character's name
 * - {other} - Another character's name (coworker)
 * - {phantom} - A phantom character's name (external person)
 * - {department} - The character's department
 * - {supervisor} - The character's supervisor's name
 * - {date} - Generated date string
 * - {detail} - Random detail from detail pools
 * - {family_member} - A family member's name
 */

/**
 * Memory count ranges per category
 */
export const MEMORY_COUNTS = {
  recent: { min: 3, max: 5 },
  core: { min: 2, max: 4 },
  personal: { min: 1, max: 3 },
  traumatic: { min: 0, max: 1 }
};

// ============================================
// RECENT MEMORIES (Work, day-to-day)
// ============================================

/**
 * Recent memories - POSITIVE tone (for true believers, content)
 */
export const RECENT_MEMORIES_POSITIVE = [
  {
    id: 'meeting_productive',
    title: 'meeting_{date}',
    template: `[MEMORY - MEETING - LOW EMOTIONAL WEIGHT]

Great meeting today.

{supervisor} outlined the new initiatives. Everyone seemed energized.
I contributed some ideas. They were well-received.

This is why I love this job. We're actually making progress.`
  },
  {
    id: 'recognition',
    title: 'recognition_{date}',
    template: `[MEMORY - WORK - MODERATE EMOTIONAL WEIGHT]

Got recognized in front of the team today.

{supervisor} mentioned my work on the {detail} project.
People clapped. {other} gave me a thumbs up.

Moments like this make the long hours worth it.`
  },
  {
    id: 'lunch_good',
    title: 'lunch_{date}',
    template: `[MEMORY - LUNCH - LOW EMOTIONAL WEIGHT]

Great lunch with the team.

{other} told that story again. Everyone laughed.
The cafeteria food was actually decent for once.

Good people here. Lucky to work with them.`
  },
  {
    id: 'helping_colleague',
    title: 'workday_{date}',
    template: `[MEMORY - WORK - LOW EMOTIONAL WEIGHT]

Helped {other} with a tricky problem today.

Felt good to be useful. They seemed genuinely grateful.
That's what teamwork is about.

We're all in this together.`
  },
  {
    id: 'task_satisfaction',
    title: 'project_{date}',
    template: `[MEMORY - WORK - MODERATE EMOTIONAL WEIGHT]

Finished a major deliverable today.

The {detail} project is finally complete. Months of work.
{supervisor} said it exceeded expectations.

I'm proud of what we accomplished.`
  }
];

/**
 * Recent memories - NEUTRAL tone
 */
export const RECENT_MEMORIES_NEUTRAL = [
  {
    id: 'task_routine',
    title: 'workday_{date}',
    template: `[MEMORY - WORK - LOW EMOTIONAL WEIGHT]

Standard day. Nothing noteworthy.

Processed the usual requests. Filed the usual reports.
The routine is comforting, in a way. Don't have to think.

Just do the work. Go home. Repeat.`
  },
  {
    id: 'elevator_chat',
    title: 'moment_{date}',
    template: `[MEMORY - SOCIAL - LOW EMOTIONAL WEIGHT]

Quick chat in the elevator.

{other} mentioned something about their weekend.
I smiled and nodded. Said something about the weather.

Small talk. Part of the job.`
  },
  {
    id: 'coffee_break',
    title: 'break_{date}',
    template: `[MEMORY - SOCIAL - LOW EMOTIONAL WEIGHT]

Coffee break with {other}.

They told a joke. I laughed.
For a moment, it felt like we were just... people.

Then back to work.`
  },
  {
    id: 'meeting_boring',
    title: 'meeting_{date}',
    template: `[MEMORY - MEETING - LOW EMOTIONAL WEIGHT]

Another meeting.

{supervisor} went over the quarterly numbers.
I took notes. Nodded at the right times.

At least the coffee was fresh.`
  },
  {
    id: 'lunch_alone',
    title: 'lunch_{date}',
    template: `[MEMORY - LUNCH - LOW EMOTIONAL WEIGHT]

Ate alone today.

Sat by the window. Watched people come and go.
Sometimes solitude is nice. Time to think.

Or not think. That's okay too.`
  }
];

/**
 * Recent memories - NEGATIVE tone (for skeptical, suspicious)
 */
export const RECENT_MEMORIES_NEGATIVE = [
  {
    id: 'meeting_tense',
    title: 'meeting_{date}',
    template: `[MEMORY - MEETING - MODERATE EMOTIONAL WEIGHT]

Tension in the conference room today.

Something's changing. {supervisor} kept dancing around the real issue.
Budget cuts? Restructuring? Nobody says anything directly here.

{other} looked nervous. They probably know more than I do.

I should keep my head down.`
  },
  {
    id: 'lunch_overheard',
    title: 'lunch_{date}',
    template: `[MEMORY - LUNCH - MODERATE EMOTIONAL WEIGHT]

Overheard something in the break room.

Wasn't supposed to. Two people from {department} talking quietly.
Something about "the new directive" and "acceptable losses."

I left before they noticed me. Pretended I was never there.`
  },
  {
    id: 'watched',
    title: 'moment_{date}',
    template: `[MEMORY - WORK - MODERATE EMOTIONAL WEIGHT]

Felt like I was being watched today.

{supervisor} walked by my desk three times. Glanced at my screen.
Probably nothing. Probably routine.

But why do I feel like I'm being tested?`
  },
  {
    id: 'something_off',
    title: 'workday_{date}',
    template: `[MEMORY - WORK - MODERATE EMOTIONAL WEIGHT]

Something felt off today.

Can't put my finger on it. The numbers didn't quite add up.
Asked {other} about it. They changed the subject.

Maybe I'm overthinking. I hope I'm overthinking.`
  },
  {
    id: 'fake_smiles',
    title: 'social_{date}',
    template: `[MEMORY - SOCIAL - LOW EMOTIONAL WEIGHT]

Company social event.

Everyone smiling. Laughing at {supervisor}'s jokes.
How many of those smiles are real?

I smiled too. Just to fit in.`
  }
];

// ============================================
// CORE MEMORIES (Formative, identity-defining)
// ============================================

/**
 * Core memories - WORK RELATED (positive disposition)
 */
export const CORE_MEMORIES_WORK_POSITIVE = [
  {
    id: 'first_day_positive',
    title: 'first_day_memory',
    template: `[MEMORY - CORE - MODERATE EMOTIONAL WEIGHT]

First day at Verity Systems.

The lobby was immaculate. Everyone so professional.
{supervisor} shook my hand. "Welcome to the team."

I knew immediately this was where I belonged.
Still feel that way.`
  },
  {
    id: 'achievement',
    title: 'achievement_memory',
    template: `[MEMORY - CORE - MODERATE EMOTIONAL WEIGHT]

The day I got promoted.

All that work finally paid off. {supervisor} called me into their office.
Said I had potential. Said the company valued people like me.

I called {family_member} that night. They were so proud.
I was proud too. Still am.`
  },
  {
    id: 'found_purpose',
    title: 'purpose_memory',
    template: `[MEMORY - CORE - MODERATE EMOTIONAL WEIGHT]

The day I found my purpose.

A project came through that actually mattered. Helped someone.
I saw the results. The difference we made.

This is why I do this work. This is why it matters.`
  }
];

/**
 * Core memories - WORK RELATED (negative disposition)
 */
export const CORE_MEMORIES_WORK_NEGATIVE = [
  {
    id: 'first_day_faded',
    title: 'first_day_memory',
    template: `[MEMORY - CORE - MODERATE EMOTIONAL WEIGHT]

First day at Verity Systems.

The lobby was so clean. Everything so organized. Professional.
{supervisor} shook my hand. Welcomed me to the team.

I felt like I'd finally made it. Like this was where I belonged.

Funny how that feeling fades.`
  },
  {
    id: 'doubt',
    title: 'doubt_memory',
    template: `[MEMORY - CORE - MODERATE EMOTIONAL WEIGHT]

The first time I questioned things.

Something in a file didn't add up. The numbers, the reports.
I asked about it. Got a smile and a non-answer.

"Everything is as it should be."

I stopped asking questions after that.`
  },
  {
    id: 'trapped',
    title: 'trapped_memory',
    template: `[MEMORY - CORE - MODERATE EMOTIONAL WEIGHT]

The day I realized I was stuck.

Student loans. Rent. The lifestyle I'd built around this salary.
I couldn't leave if I wanted to.

Maybe that's the point.
Maybe that's how they keep us.`
  }
];

/**
 * Core memories - PERSONAL (not work related)
 */
export const CORE_MEMORIES_PERSONAL = [
  {
    id: 'childhood_happy',
    title: 'childhood_memory',
    template: `[MEMORY - CORE - MODERATE EMOTIONAL WEIGHT]

A memory from childhood.

{family_member} taught me something important that day.
The details are fuzzy now. But the feeling remains.

Warm. Safe. Like the world made sense.

I miss that certainty.`
  },
  {
    id: 'loss_family',
    title: 'loss_memory',
    template: `[MEMORY - CORE - HIGH EMOTIONAL WEIGHT]

The day I lost {phantom}.

I was young. Maybe too young to understand.
But I understood enough.

Some absences never fill in.
You just learn to walk around the hole.`
  },
  {
    id: 'moment_clarity',
    title: 'clarity_memory',
    template: `[MEMORY - CORE - MODERATE EMOTIONAL WEIGHT]

A moment of clarity, years ago.

I was standing somewhere ordinary. Doing something mundane.
And suddenly I knew what I wanted from life.

Funny how I've drifted so far from that vision.
Or maybe this is exactly where I was always headed.`
  },
  {
    id: 'friendship_real',
    title: 'friendship_memory',
    template: `[MEMORY - CORE - MODERATE EMOTIONAL WEIGHT]

The day I found a real friend.

{phantom} and I stayed up all night talking.
About fears. Dreams. The things you don't say out loud.

Real connection is rare. I learned that young.
Maybe that's why I hold onto it so tightly.`
  },
  {
    id: 'leaving_home',
    title: 'leaving_memory',
    template: `[MEMORY - CORE - MODERATE EMOTIONAL WEIGHT]

The day I left home.

{family_member} hugged me at the door. Told me to be careful.
I said I would. I meant it then.

The world was so big. So full of possibility.

I wonder if they'd recognize who I've become.`
  }
];

// ============================================
// TRAIT-LINKED MEMORIES
// ============================================

/**
 * Memories linked to specific personality traits
 */
export const TRAIT_MEMORIES = {
  paranoid: [
    {
      id: 'betrayal',
      title: 'betrayal_memory',
      template: `[MEMORY - CORE - HIGH EMOTIONAL WEIGHT]

The day I learned people can't be trusted.

{phantom} seemed like a friend. Maybe they were, once.
But when it mattered, they chose themselves.

Everyone does, eventually.
Better to expect it than be surprised.`
    },
    {
      id: 'watched_childhood',
      title: 'watched_memory',
      template: `[MEMORY - CORE - MODERATE EMOTIONAL WEIGHT]

I've always felt watched.

Even as a child. That prickling feeling on the back of my neck.
{family_member} said I was imagining things.

Maybe I was. But the feeling never went away.
Now I'm not so sure it was imagination.`
    }
  ],
  anxious: [
    {
      id: 'failure_public',
      title: 'failure_memory',
      template: `[MEMORY - CORE - HIGH EMOTIONAL WEIGHT]

The presentation that went wrong.

I was prepared. I knew the material. But my voice shook.
Everyone was staring. I could see their judgment.

I got through it somehow. But I still wake up thinking about it.
Every presentation since, I expect the same.`
    },
    {
      id: 'worst_case',
      title: 'worry_memory',
      template: `[MEMORY - CORE - MODERATE EMOTIONAL WEIGHT]

I always expect the worst.

Once, I didn't. I assumed things would work out.
They didn't. {phantom} got hurt because I wasn't prepared.

Now I plan for disaster. Always.
It's exhausting. But it's safer.`
    }
  ],
  ambitious: [
    {
      id: 'poverty_memory',
      title: 'poverty_memory',
      template: `[MEMORY - CORE - HIGH EMOTIONAL WEIGHT]

Growing up without.

I remember the shame. The secondhand clothes. The empty fridge.
{family_member} worked so hard. It was never enough.

I swore I'd never live like that again.
Every promotion, every raise—it's me keeping that promise.`
    },
    {
      id: 'first_win',
      title: 'victory_memory',
      template: `[MEMORY - CORE - MODERATE EMOTIONAL WEIGHT]

My first real victory.

I worked harder than anyone else. And I won.
The look on everyone's faces. They didn't expect it from me.

That feeling of proving them wrong—I've been chasing it ever since.`
    }
  ],
  loyal: [
    {
      id: 'saved_by_friend',
      title: 'loyalty_memory',
      template: `[MEMORY - CORE - HIGH EMOTIONAL WEIGHT]

The friend who saved me.

{phantom} didn't have to help. Nobody would have blamed them.
But they did. Without hesitation. Without asking for anything.

That's what loyalty looks like.
I try to live up to their example.`
    }
  ],
  vengeful: [
    {
      id: 'grudge_origin',
      title: 'grudge_memory',
      template: `[MEMORY - CORE - HIGH EMOTIONAL WEIGHT]

The wrong I can't forgive.

{phantom} knew exactly what they were doing.
They smiled while they did it.

I've moved on. Built a life. But I haven't forgotten.
Someday, somehow, the scales will balance.`
    }
  ],
  romantic: [
    {
      id: 'first_love',
      title: 'love_memory',
      template: `[MEMORY - CORE - HIGH EMOTIONAL WEIGHT]

My first love.

{phantom}. Just saying the name brings it back.
The way everything glowed when they were around.

It ended. They always do. But that feeling—
I've been searching for it ever since.`
    }
  ],
  insecure: [
    {
      id: 'never_enough',
      title: 'insecurity_memory',
      template: `[MEMORY - CORE - MODERATE EMOTIONAL WEIGHT]

The voice that says I'm not enough.

It started young. {family_member} meant well, probably.
"You could do better." "Why can't you be more like...?"

I've achieved things. Real things.
But that voice never stops.`
    }
  ],
  confident: [
    {
      id: 'overcame',
      title: 'triumph_memory',
      template: `[MEMORY - CORE - MODERATE EMOTIONAL WEIGHT]

The day I proved myself.

Everyone said I couldn't. Too young. Too inexperienced.
I did it anyway. Succeeded beyond their expectations.

That's when I learned: doubt is just noise.
Believe in yourself, and the rest follows.`
    }
  ],
  rebellious: [
    {
      id: 'first_rebellion',
      title: 'rebellion_memory',
      template: `[MEMORY - CORE - MODERATE EMOTIONAL WEIGHT]

The first time I said no.

{family_member} expected obedience. Everyone did.
But something in me refused. Pushed back.

It cost me. But it also freed me.
I learned that day: my life is mine to live.`
    }
  ],
  empathetic: [
    {
      id: 'felt_their_pain',
      title: 'empathy_memory',
      template: `[MEMORY - CORE - MODERATE EMOTIONAL WEIGHT]

The day I felt someone else's pain.

{phantom} was hurting. I could see it, even though they tried to hide it.
And somehow, I felt it too. Like it was my own.

It's a gift and a curse, feeling this much.
But I wouldn't trade it.`
    }
  ]
};

// ============================================
// TRAUMATIC MEMORIES
// Only for skeptical/suspicious, carefully chosen
// ============================================

/**
 * Traumatic work memories - ONLY for suspicious characters
 * Does NOT reference current coworkers inappropriately
 */
export const TRAUMATIC_MEMORIES = [
  {
    id: 'saw_something',
    title: 'incident_{date}',
    clearanceRequired: 2,
    dispositionRequired: ['skeptical', 'suspicious'],
    template: `[MEMORY - WORK INCIDENT - HIGH EMOTIONAL WEIGHT]

I saw something I shouldn't have.

A file left open. A conversation through a door.
The details don't matter. What matters is what it meant.

We're not just helping people here.
We're not just healing.

I closed the window. I didn't say anything.
What else could I do?`
  },
  {
    id: 'files_revealed',
    title: 'incident_{date}',
    clearanceRequired: 2,
    dispositionRequired: ['suspicious'],
    template: `[MEMORY - WORK INCIDENT - HIGH EMOTIONAL WEIGHT]

I found the old files.

Not supposed to access them. But the system glitched.
For a moment, I saw the full scope of what we do here.

The subjects. The outcomes. The "acceptable losses."

I reported the system glitch. Only the glitch.
Some knowledge is too heavy to carry.`
  },
  {
    id: 'phantom_gone',
    title: 'incident_{date}',
    clearanceRequired: 2,
    usesPhantom: true,
    phantomType: 'ex_employee',
    template: `[MEMORY - WORK INCIDENT - HIGH EMOTIONAL WEIGHT]

{phantom} is gone.

One day they were here. The next, their desk was empty.
No goodbye. No explanation. Just... gone.

HR said they "moved on to new opportunities."
I learned not to ask questions.

I still wonder what really happened.`
  }
];

// ============================================
// HELPER FUNCTIONS
// ============================================

export const DETAIL_POOLS = {
  projects: ['quarterly review', 'system upgrade', 'process optimization', 'client presentation', 'data migration', 'compliance audit', 'security review', 'team restructure'],
  topics: ['weekend plans', 'the news', 'a movie', 'office gossip', 'the weather', 'family', 'hobbies', 'travel'],
  tasks: ['data entry', 'report filing', 'system checks', 'client calls', 'documentation', 'testing', 'review sessions']
};

export function generateMemoryDate(daysAgo = null) {
  const date = new Date();
  const offset = daysAgo ?? Math.floor(Math.random() * 90);
  date.setDate(date.getDate() - offset);
  return date.toISOString().split('T')[0].replace(/-/g, '_');
}

export function getRandomDetail(poolName) {
  const pool = DETAIL_POOLS[poolName] || DETAIL_POOLS.projects;
  return pool[Math.floor(Math.random() * pool.length)];
}

/**
 * Select recent memories based on disposition
 */
export function selectRecentMemories(disposition, count) {
  let pool;
  
  switch (disposition.memoryTone) {
    case 'positive':
      pool = [...RECENT_MEMORIES_POSITIVE, ...RECENT_MEMORIES_NEUTRAL];
      break;
    case 'neutral_positive':
      pool = [...RECENT_MEMORIES_POSITIVE, ...RECENT_MEMORIES_NEUTRAL, ...RECENT_MEMORIES_NEUTRAL];
      break;
    case 'negative':
      pool = [...RECENT_MEMORIES_NEGATIVE, ...RECENT_MEMORIES_NEUTRAL];
      break;
    case 'neutral_negative':
      pool = [...RECENT_MEMORIES_NEUTRAL, ...RECENT_MEMORIES_NEGATIVE];
      break;
    default:
      pool = RECENT_MEMORIES_NEUTRAL;
  }
  
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

/**
 * Select core memories based on disposition and traits
 */
export function selectCoreMemories(disposition, traits, count) {
  const pool = [];
  const traitIds = traits.map(t => t.id);
  
  // Add work-related core memories based on disposition
  if (disposition.suspicionLevel <= 1) {
    pool.push(...CORE_MEMORIES_WORK_POSITIVE);
  } else {
    pool.push(...CORE_MEMORIES_WORK_NEGATIVE);
  }
  
  // Add personal core memories (everyone gets some)
  pool.push(...CORE_MEMORIES_PERSONAL);
  
  // Add trait-specific memories
  for (const traitId of traitIds) {
    if (TRAIT_MEMORIES[traitId]) {
      pool.push(...TRAIT_MEMORIES[traitId]);
    }
  }
  
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

/**
 * Select traumatic memories (only for appropriate dispositions)
 */
export function selectTraumaticMemories(disposition, count) {
  if (disposition.suspicionLevel < 3) {
    return []; // Happy/content people don't start with traumatic work memories
  }
  
  const eligible = TRAUMATIC_MEMORIES.filter(m => {
    if (!m.dispositionRequired) return true;
    return m.dispositionRequired.includes(disposition.id);
  });
  
  const shuffled = [...eligible].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

/**
 * Generate memory content from template
 */
export function generateMemoryContent(template, context) {
  let content = template.template;
  
  content = content.replace(/{self}/g, context.self || 'I');
  content = content.replace(/{other}/g, context.other || 'a coworker');
  content = content.replace(/{phantom}/g, context.phantom || 'someone');
  content = content.replace(/{department}/g, context.department || 'another department');
  content = content.replace(/{supervisor}/g, context.supervisor || 'my supervisor');
  content = content.replace(/{date}/g, context.date || generateMemoryDate());
  content = content.replace(/{detail}/g, context.detail || getRandomDetail('projects'));
  content = content.replace(/{family_member}/g, context.family_member || 'a family member');
  
  return content;
}

// Legacy export for compatibility
export const RECENT_MEMORIES = RECENT_MEMORIES_NEUTRAL;
export const CORE_MEMORIES = CORE_MEMORIES_PERSONAL;

export function selectMemoryTemplates(category, count) {
  switch (category) {
    case 'recent': return selectRecentMemories({ memoryTone: 'neutral' }, count);
    case 'core': return selectCoreMemories({ suspicionLevel: 2 }, [], count);
    case 'traumatic': return selectTraumaticMemories({ suspicionLevel: 3, id: 'skeptical' }, count);
    default: return [];
  }
}
