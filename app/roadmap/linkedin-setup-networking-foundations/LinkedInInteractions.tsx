"use client";

import { useMemo, useState } from "react";
import { Award, Check, CheckCircle2 } from "lucide-react";

type SurveyQuestion = {
  question: string;
  answers: [string, string[]][];
};

const surveyQuestions: SurveyQuestion[] = [
  {
    question: "When your schedule gets busy, what do you usually do?",
    answers: [
      ["Make a plan and prioritize what needs to get done.", ["Time Management", "Prioritization", "Organization"]],
      ["Ask for help or communicate with the people involved.", ["Communication", "Self-Advocacy", "Collaboration"]],
      ["Push through and stay consistent.", ["Discipline", "Work Ethic", "Resilience"]],
      ["Adjust as things change.", ["Adaptability", "Flexibility", "Problem Solving"]],
    ],
  },
  {
    question: "How do you usually contribute to your team?",
    answers: [
      ["Leading by example.", ["Leadership", "Accountability"]],
      ["Encouraging teammates.", ["Empathy", "Emotional Intelligence", "Teamwork"]],
      ["Communicating during practices/competition.", ["Communication", "Collaboration"]],
      ["Doing my role consistently even when it is not noticed.", ["Reliability", "Discipline", "Team-First Mindset"]],
    ],
  },
  {
    question: "What best describes how you handle setbacks?",
    answers: [
      ["I reflect, learn, and adjust.", ["Growth Mindset", "Analytical Thinking"]],
      ["I stay calm and keep going.", ["Resilience", "Composure"]],
      ["I ask for feedback.", ["Coachability", "Communication"]],
      ["I focus on the next opportunity.", ["Adaptability", "Goal Setting"]],
    ],
  },
  {
    question: "What part of being a student-athlete has challenged you the most?",
    answers: [
      ["Balancing school, practice, travel, and life.", ["Time Management", "Organization"]],
      ["Communicating with different people.", ["Communication", "Relationship Building"]],
      ["Staying confident through ups and downs.", ["Resilience", "Emotional Control"]],
      ["Figuring out my future outside of sports.", ["Career Exploration", "Self-Awareness", "Initiative"]],
    ],
  },
  {
    question: "Which activity feels most natural to you?",
    answers: [
      ["Planning ahead.", ["Organization", "Strategic Planning"]],
      ["Helping teammates.", ["Mentorship", "Teamwork"]],
      ["Performing under pressure.", ["Composure", "Competitiveness"]],
      ["Learning new systems or roles.", ["Adaptability", "Learning Agility"]],
    ],
  },
  {
    question: "How do you usually respond to feedback?",
    answers: [
      ["I apply it quickly.", ["Coachability", "Execution"]],
      ["I ask questions to understand it.", ["Communication", "Curiosity"]],
      ["I reflect on it and make a plan.", ["Critical Thinking", "Self-Improvement"]],
      ["I use it as motivation.", ["Motivation", "Resilience"]],
    ],
  },
  {
    question: "What are you most proud of as a student-athlete?",
    answers: [
      ["Staying committed through hard seasons.", ["Perseverance", "Resilience"]],
      ["Supporting my teammates.", ["Teamwork", "Empathy"]],
      ["Growing as a leader.", ["Leadership", "Confidence"]],
      ["Balancing multiple responsibilities.", ["Time Management", "Accountability"]],
    ],
  },
  {
    question: "When working with others, what role do you usually take?",
    answers: [
      ["Organizer/planner.", ["Organization", "Planning"]],
      ["Encourager/supporter.", ["Empathy", "Teamwork"]],
      ["Communicator.", ["Communication", "Collaboration"]],
      ["Problem solver.", ["Problem Solving", "Critical Thinking"]],
    ],
  },
];

const checklistItems = [
  "Created LinkedIn account with personal email",
  "Added professional profile photo",
  "Added simple background photo",
  "Added headline",
  "Completed About section",
  "Added Utah State University to Education",
  "Added Division I Student-Athlete experience",
  "Added 5-10 skills",
  "Followed Utah State University",
  "Followed Utah State University Athletics company page",
  "Connected with at least 5 people",
  "Reviewed LinkedIn Do's and Don'ts",
];

export function SkillsSurvey() {
  const [answers, setAnswers] = useState<Record<number, number>>({});

  const topSkills = useMemo(() => {
    const scores = new Map<string, number>();

    Object.entries(answers).forEach(([questionIndex, answerIndex]) => {
      const skills = surveyQuestions[Number(questionIndex)].answers[answerIndex][1];
      skills.forEach((skill) => scores.set(skill, (scores.get(skill) ?? 0) + 1));
    });

    return Array.from(scores.entries())
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .slice(0, 5)
      .map(([skill]) => skill);
  }, [answers]);

  const complete = Object.keys(answers).length === surveyQuestions.length;

  return (
    <div className="grid gap-5">
      {surveyQuestions.map((item, questionIndex) => (
        <article key={item.question} className="card-surface rounded-lg p-5">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-aggie-silver">
            Question {questionIndex + 1}
          </p>
          <h3 className="mt-2 text-xl font-black leading-8 text-white">{item.question}</h3>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {item.answers.map(([answer], answerIndex) => {
              const selected = answers[questionIndex] === answerIndex;

              return (
                <button
                  key={answer}
                  type="button"
                  onClick={() =>
                    setAnswers((current) => ({ ...current, [questionIndex]: answerIndex }))
                  }
                  className={`min-h-16 rounded-lg border p-4 text-left text-sm font-bold leading-6 transition ${
                    selected
                      ? "chrome-surface border-aggie-chrome/60 text-aggie-navy shadow-steel"
                      : "border-aggie-silver/15 bg-white/[0.045] text-aggie-light/78 hover:border-aggie-steel hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {answer}
                </button>
              );
            })}
          </div>
        </article>
      ))}

      <article className="card-surface rounded-lg p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-aggie-silver">
              Results
            </p>
            <h3 className="mt-2 text-2xl font-black text-white">
              Your Top 5 Suggested LinkedIn Skills
            </h3>
            <p className="mt-3 leading-7 text-aggie-light/76">
              Add these to your LinkedIn Skills section if they feel true to your experience.
            </p>
          </div>
          <span className="chrome-surface grid h-12 w-12 place-items-center rounded-lg text-aggie-navy shadow-glow">
            <Award className="h-6 w-6" />
          </span>
        </div>

        {complete ? (
          <div className="mt-5 flex flex-wrap gap-3">
            {topSkills.map((skill) => (
              <span
                key={skill}
                className="rounded-lg border border-aggie-silver/25 bg-white/[0.06] px-4 py-3 text-sm font-black text-aggie-ice"
              >
                {skill}
              </span>
            ))}
          </div>
        ) : (
          <p className="mt-5 rounded-lg border border-aggie-silver/15 bg-white/[0.045] p-4 text-sm font-bold leading-6 text-aggie-muted">
            Answer all 8 questions to see your recommended skills.
          </p>
        )}
      </article>
    </div>
  );
}

export function LinkedInCompletionChecklist() {
  const [checked, setChecked] = useState<string[]>([]);
  const [earned, setEarned] = useState(false);
  const allComplete = checked.length === checklistItems.length;

  function toggle(item: string) {
    setChecked((current) =>
      current.includes(item)
        ? current.filter((currentItem) => currentItem !== item)
        : [...current, item],
    );
    setEarned(false);
  }

  if (earned) {
    return (
      <article className="card-surface rounded-lg p-8 text-center md:p-12">
        <div className="chrome-surface mx-auto grid h-16 w-16 place-items-center rounded-lg text-aggie-navy shadow-glow">
          <Award className="h-9 w-9" />
        </div>
        <h3 className="text-glow mt-7 text-4xl font-black tracking-tight text-white">
          LinkedIn Starter Badge Earned
        </h3>
        <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-aggie-light/76">
          You created the foundation for your professional LinkedIn presence and
          took your first step toward building your career network.
        </p>
      </article>
    );
  }

  return (
    <article className="card-surface rounded-lg p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.2em] text-aggie-silver">
            Progress
          </p>
          <h3 className="mt-2 text-2xl font-black text-white">
            {checked.length} of {checklistItems.length} complete
          </h3>
        </div>
        <div className="h-2 w-full rounded-full bg-white/10 md:w-64">
          <div
            className="h-2 rounded-full bg-gradient-to-r from-aggie-ice via-aggie-silver to-aggie-steel shadow-steel transition-all duration-500"
            style={{ width: `${(checked.length / checklistItems.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-2">
        {checklistItems.map((item) => {
          const selected = checked.includes(item);

          return (
            <button
              key={item}
              type="button"
              onClick={() => toggle(item)}
              className={`flex min-h-14 items-center gap-3 rounded-lg border p-4 text-left text-sm font-bold leading-6 transition ${
                selected
                  ? "border-aggie-chrome/40 bg-white/[0.09] text-white shadow-steel"
                  : "border-aggie-silver/15 bg-white/[0.045] text-aggie-light/78 hover:border-aggie-steel hover:bg-white/10"
              }`}
            >
              <span
                className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg ${
                  selected
                    ? "chrome-surface text-aggie-navy"
                    : "border border-aggie-silver/20 text-aggie-muted"
                }`}
              >
                {selected && <Check className="h-4 w-4" />}
              </span>
              {item}
            </button>
          );
        })}
      </div>

      {allComplete && (
        <button
          type="button"
          onClick={() => setEarned(true)}
          className="chrome-surface mt-6 inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-aggie-chrome/60 px-5 text-sm font-black text-aggie-navy shadow-glow transition hover:brightness-110"
        >
          Complete Module
          <CheckCircle2 className="h-4 w-4" />
        </button>
      )}
    </article>
  );
}
