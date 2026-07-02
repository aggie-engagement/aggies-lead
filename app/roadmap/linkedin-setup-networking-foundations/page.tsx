import { existsSync } from "node:fs";
import path from "node:path";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Award,
  BriefcaseBusiness,
  Check,
  CheckCircle2,
  CircleAlert,
  GraduationCap,
  ImageIcon,
  MapPin,
  Network,
  PlusCircle,
  Search,
  Sparkles,
  Table2,
  UserRound,
  Users,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
  LinkedInCompletionChecklist,
  SkillsSurvey,
} from "./LinkedInInteractions";

const imageBase = "/images/linkedin";

const linkedInBasics = [
  "Build a professional profile",
  "Connect with alumni, employers, teammates, and professionals",
  "Explore careers, internships, and opportunities",
  "Showcase your experience as a Utah State student-athlete",
];

const athleteBenefits = [
  "Showcase your athletic, academic, and leadership experience",
  "Build a professional network before graduation",
  "Connect with former student-athletes and alumni",
  "Explore internships, jobs, and career paths",
  "Translate athlete skills into professional strengths",
];

const setupSteps: SetupStep[] = [
  {
    number: "01",
    title: "Create Your Account",
    image: "linkedin-create-account.jpg",
    instructions: [
      "Create your LinkedIn account using your personal email, not your school email.",
      "Create a strong password you will remember.",
    ],
    note:
      "Your personal email stays with you after graduation and helps keep your LinkedIn account connected long-term.",
    important: [
      "Use a personal email such as Gmail, iCloud, Yahoo, etc.",
      "Do not use your school email to create the account.",
    ],
    icon: UserRound,
  },
  {
    number: "02",
    title: "Set Your Location",
    image: "linkedin-location.jpg",
    instructions: ["Set your location to Logan, Utah."],
    explanation:
      "This helps LinkedIn recommend local opportunities, university connections, Utah State alumni, and nearby networking opportunities.",
    icon: MapPin,
  },
  {
    number: "03",
    title: "Add Your Student Experience",
    image: "linkedin-student-experince.jpg",
    instructions: [
      'When LinkedIn asks about your recent experience, select "I\'m a student."',
      "Make sure the button turns green.",
      "Then enter Utah State University, your degree, and your field of study.",
    ],
    example: [
      "School: Utah State University",
      "Degree: Bachelor of Science",
      "Field of Study: Kinesiology",
    ],
    icon: GraduationCap,
  },
  {
    number: "04",
    title: "Career Opportunities Interest",
    image: "linkedin-interests.jpg",
    instructions: [
      'When LinkedIn asks "Interested in new career opportunities?" select:',
      '"Maybe, if I see the right opportunity"',
    ],
    explanation:
      "This allows you to explore internships, career paths, and networking opportunities without making your profile appear as if you are actively job searching.",
    icon: BriefcaseBusiness,
  },
  {
    number: "05",
    title: "Job Interests & Locations",
    image: "linkedin-job-interests.jpg",
    instructions: [
      "LinkedIn may ask what jobs or industries interest you.",
      "Choose careers you are interested in, industries you may want to explore, and positions related to your major.",
    ],
    reminder:
      "You can update these later. You do not need to have your entire career figured out right now.",
    icon: Sparkles,
  },
  {
    number: "06",
    title: "Add Your Profile Photo",
    image: "linkedin-profile-photo.jpg",
    instructions: [
      "Upload a professional profile photo.",
      "For student-athletes, your Utah State roster headshot or media day headshot is a perfect option.",
    ],
    good: [
      "Roster headshot",
      "Media day photo",
      "Professional headshot",
      "Clear photo from shoulders up",
      "Neutral/simple background",
    ],
    avoid: [
      "Selfies",
      "Mirror pictures",
      "Group photos",
      "Cropped photos",
      "Party photos",
      "Filters",
      "Blurry images",
    ],
    icon: UserRound,
  },
  {
    number: "07",
    title: 'Skip "Connect With People You May Know"',
    image: "linkedin-connect-skip.jpg",
    instructions: ['For now, click "Continue" and skip this section.'],
    explanation:
      "You will intentionally build your connections later through Aggies Lead recommendations and networking guidance.",
    icon: Network,
  },
  {
    number: "08",
    title: 'Skip "Follow Interests"',
    image: "linkedin-company-interest-skip.jpg",
    instructions: ['For now, click "Continue" and skip this section.'],
    explanation:
      "Later, you will learn who to follow, what organizations matter, and how to build a professional network intentionally.",
    icon: Network,
  },
  {
    number: "09",
    title: "Download the Mobile App",
    image: "linkedin-download-app.jpg",
    instructions: [
      "LinkedIn will provide a QR code to download the mobile app.",
      "Use your phone to scan the QR code and install the LinkedIn app.",
    ],
    explanation:
      "The mobile app makes it easier to respond to messages, connect with people, update your profile, and stay active on LinkedIn.",
    icon: CheckCircle2,
  },
];

const nextSteps = [
  "improve your profile",
  "create your headline",
  "build your About section",
  "add athletics as experience",
  "translate athlete skills",
  "start building your network intentionally",
];

const aboutTemplates = [
  {
    title: "Template 1 - Basic First-Year Template",
    text:
      "I am a Division I student-athlete at Utah State University pursuing a degree in [Major]. I am currently exploring opportunities in [Career Field/Industry] and continuing to build skills in leadership, communication, teamwork, and time management.",
  },
  {
    title: "Template 2 - Unsure Career Path Template",
    text:
      "I am a student-athlete at Utah State University studying [Major/Undeclared]. I am currently exploring different career paths while developing skills through athletics, academics, and campus involvement. I am interested in learning from professionals and building meaningful connections.",
  },
  {
    title: "Template 3 - Career-Focused Template",
    text:
      "I am a Utah State University student-athlete majoring in [Major] with an interest in [Career Field]. Through athletics and academics, I have developed strong skills in discipline, teamwork, adaptability, and communication. I am excited to continue learning and gaining experience in this field.",
  },
  {
    title: "Template 4 - Athlete Identity Template",
    text:
      "As a student-athlete at Utah State University, I balance Division I athletics with academic and professional development. My experience in sport has helped me build resilience, leadership, time management, and a strong work ethic. I am currently interested in exploring opportunities in [Career Field].",
  },
  {
    title: "Template 5 - Simple Intro Template",
    text:
      "I am a [Sport] student-athlete at Utah State University pursuing a degree in [Major]. I am passionate about personal growth, teamwork, and preparing for life after athletics. I am currently exploring career opportunities in [Career Field/Not sure yet].",
  },
];

const educationFields = [
  "School: Utah State University",
  "Degree",
  "Field of Study",
  "Start Date",
  "Expected End Date",
  "Grade/GPA, if you choose",
  "Activities and societies",
  "Description",
  "Skills",
];

const experienceBullets = [
  "Balance Division I athletics with a full-time academic schedule.",
  "Commit 20+ hours per week to training, competition, meetings, recovery, and team responsibilities.",
  "Develop discipline, resilience, and time management through year-round athletic preparation.",
  "Collaborate with teammates and coaches to pursue individual and team goals.",
  "Represent Utah State University in NCAA competition.",
  "Manage travel, academic responsibilities, and performance expectations during competition season.",
  "Participate in community engagement and student-athlete development opportunities.",
  "Build leadership, communication, and accountability through team environments.",
  "Adapt to high-pressure situations while maintaining focus and professionalism.",
  "Demonstrate commitment to continuous improvement through training, feedback, and performance evaluation.",
];

const studentAthleteSkills = [
  "Leadership",
  "Teamwork",
  "Time Management",
  "Communication",
  "Adaptability",
  "Resilience",
  "Work Ethic",
  "Accountability",
  "Problem Solving",
  "Coachability",
  "Public Speaking",
  "Organization",
  "Collaboration",
  "Discipline",
  "Emotional Intelligence",
];

const skillTranslations = [
  ["I balance athletics with a full course load.", "Time management, prioritization, discipline"],
  ["I travel during season and still keep up with school.", "Adaptability, organization, accountability"],
  ["I communicate with coaches and teammates daily.", "Communication, teamwork, active listening"],
  ["I handle pressure during competitions.", "Resilience, composure, performance under pressure"],
  ["I recover from mistakes quickly.", "Growth mindset, adaptability, emotional control"],
  ["I wake up early for lifts/practice.", "Discipline, consistency, work ethic"],
  ["I help younger teammates learn team expectations.", "Leadership, mentorship, training"],
  ["I attend study hall/tutoring while managing practice.", "Academic discipline, accountability, planning"],
  ["I contribute to team goals even when my role changes.", "Flexibility, team-first mindset, collaboration"],
  ["I work through injuries or setbacks responsibly.", "Resilience, patience, problem-solving"],
  ["I review film/performance feedback.", "Coachability, analytical thinking, continuous improvement"],
  ["I participate in community service.", "Civic engagement, service orientation, social responsibility"],
  ["I represent USU at events or competitions.", "Professionalism, public representation, brand awareness"],
  ["I manage NIL, social media, or personal branding.", "Personal branding, marketing, digital communication"],
  ["I balance athletics, school, and a job/tutoring.", "Multitasking, time management, responsibility"],
  ["I communicate with professors about travel.", "Professional communication, self-advocacy"],
  ["I compete for playing time/lineup spots.", "Competitiveness, perseverance, goal setting"],
  ["I work with athletic trainers or support staff.", "Collaboration, trust, communication"],
  ["I follow team policies and compliance rules.", "Integrity, attention to detail, accountability"],
  ["I support teammates after losses or setbacks.", "Empathy, emotional intelligence, team leadership"],
];

const firstConnections = [
  "teammates",
  "coaches",
  "academic advisors",
  "athletic department staff",
  "Aggies Lead staff",
  "classmates",
  "professors",
  "former teammates",
  "alumni from your sport",
  "alumni in your major/career field",
];

const doItems = [
  "Use a professional photo",
  "Keep your profile updated",
  "Add your student-athlete experience",
  "Follow Utah State University and Utah State University Athletics",
  "Connect with people intentionally",
  "Use professional language",
  "Respond respectfully",
  "Add skills that reflect your real experience",
];

const dontItems = [
  "Use selfies or party photos",
  "Leave your profile blank",
  "Use your school email to create the account",
  "Message everyone without a purpose",
  "Post inappropriate content",
  "Exaggerate experience",
  "Ignore your profile after creating it",
  "Add skills that do not reflect your actual experience",
];

const sideNavItems = [
  "What Is LinkedIn?",
  "Why LinkedIn Matters",
  "Create Your LinkedIn Account",
  "Navigate to Your Profile",
  "Add a Background Photo",
  "Add Profile Sections",
  "About Section",
  "Education Section",
  "Experience Section",
  "Skills Section",
  "Athlete Skills Translator",
  "Optional Skill Survey",
  "Follow Key Accounts",
  "Connections to Make",
  "First LinkedIn Post",
  "Do's and Don'ts",
  "Profile Checklist",
];

type SetupStep = {
  number: string;
  title: string;
  image: string;
  instructions: string[];
  icon: LucideIcon;
  note?: string;
  important?: string[];
  explanation?: string;
  example?: string[];
  reminder?: string;
  good?: string[];
  avoid?: string[];
};

export default function LinkedInSetupNetworkingFoundationsPage() {
  return (
    <div className="space-y-10">
      <section className="grid gap-6 lg:grid-cols-[0.78fr_1.22fr]">
        <aside className="card-surface h-fit rounded-lg p-5 lg:sticky lg:top-28">
          <div className="flex items-center gap-3 border-b border-aggie-silver/15 pb-5">
            <span className="chrome-surface grid h-11 w-11 place-items-center rounded-lg text-aggie-navy shadow-steel">
              <Network className="h-6 w-6" />
            </span>
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.22em] text-aggie-silver">
                LinkedIn Module
              </p>
              <p className="mt-1 text-sm text-aggie-muted">Networking foundations</p>
            </div>
          </div>

          <div className="mt-5 max-h-[62vh] space-y-2 overflow-y-auto pr-1">
            {sideNavItems.map((item, index) => (
              <a
                key={item}
                href={`#section-${index + 1}`}
                className="flex items-center gap-3 rounded-lg border border-aggie-silver/12 bg-white/[0.04] p-3 transition hover:border-aggie-steel/50 hover:bg-white/[0.075]"
              >
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg border border-aggie-silver/20 text-xs font-black text-aggie-ice">
                  {index + 1}
                </span>
                <p className="text-sm font-bold leading-5 text-aggie-light/78">{item}</p>
              </a>
            ))}
          </div>
        </aside>

        <div className="min-w-0">
          <p className="text-sm font-bold uppercase tracking-[0.28em] text-aggie-silver">
            Aggies Lead
          </p>
          <h1 className="text-glow mt-3 text-4xl font-black tracking-tight text-white md:text-6xl">
            LinkedIn Setup & Networking Foundations
          </h1>
          <p className="mt-5 max-w-4xl text-lg leading-8 text-aggie-light/76 md:text-xl md:leading-9">
            Build the first piece of your professional presence as a Utah State
            student-athlete, then use LinkedIn intentionally as your network
            grows.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              ["Professional profile", "Start with a clear identity"],
              ["Athlete advantage", "Translate experience into strengths"],
              ["Network ready", "Prepare for intentional connections"],
            ].map(([title, text]) => (
              <div key={title} className="card-surface rounded-lg p-5">
                <p className="text-sm font-black uppercase tracking-[0.2em] text-aggie-silver">
                  {title}
                </p>
                <p className="mt-3 text-sm leading-6 text-aggie-muted">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <NumberedSection id="section-1" number="01" title="What Is LinkedIn?">
        <div className="grid gap-5 lg:grid-cols-[0.88fr_1.12fr]">
          <div className="card-surface rounded-lg p-6">
            <p className="text-2xl font-black leading-9 text-white md:text-3xl md:leading-10">
              LinkedIn is social media for the professional world.
            </p>
          </div>
          <div className="card-surface rounded-lg p-6">
            <h3 className="text-2xl font-black text-white">It helps you</h3>
            <div className="mt-5 grid gap-3">
              {linkedInBasics.map((item) => (
                <IconLine key={item} icon={Check} text={item} />
              ))}
            </div>
          </div>
        </div>
      </NumberedSection>

      <NumberedSection
        id="section-2"
        number="02"
        title="Why LinkedIn Matters for Student-Athletes"
      >
        <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="card-surface rounded-lg p-6">
            <h3 className="text-2xl font-black text-white">
              As a student-athlete, LinkedIn helps you
            </h3>
            <div className="mt-5 grid gap-3">
              {athleteBenefits.map((item) => (
                <IconLine key={item} icon={Check} text={item} />
              ))}
            </div>
          </div>
          <div className="card-surface rounded-lg p-6">
            <span className="chrome-surface grid h-12 w-12 place-items-center rounded-lg text-aggie-navy shadow-glow">
              <Sparkles className="h-6 w-6" />
            </span>
            <p className="mt-5 text-xl font-black leading-8 text-white">
              You do not need everything figured out right now.
            </p>
            <p className="mt-3 leading-7 text-aggie-light/76">
              LinkedIn is meant to grow with you throughout college.
            </p>
          </div>
        </div>
      </NumberedSection>

      <NumberedSection id="section-3" number="03" title="Create Your LinkedIn Account">
        <p className="mb-5 max-w-4xl text-lg leading-8 text-aggie-light/76">
          Follow these steps to set up your LinkedIn account correctly as a Utah
          State student-athlete.
        </p>
        <div className="grid gap-5">
          {setupSteps.map((step) => (
            <WalkthroughCard key={step.number} step={step} />
          ))}
        </div>
      </NumberedSection>

      <section className="card-surface rounded-lg p-8 text-center md:p-12">
        <div className="chrome-surface mx-auto grid h-16 w-16 place-items-center rounded-lg text-aggie-navy shadow-glow">
          <CheckCircle2 className="h-9 w-9" />
        </div>
        <h2 className="text-glow mt-7 text-4xl font-black tracking-tight text-white">
          Your LinkedIn Account Is Created
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-aggie-light/76">
          Once setup is complete, you will officially have your LinkedIn account
          created.
        </p>
        <div className="mx-auto mt-6 grid max-w-4xl gap-3 text-left md:grid-cols-2">
          {nextSteps.map((item) => (
            <IconLine key={item} icon={Check} text={item} />
          ))}
        </div>
        <Link
          href="#section-4"
          className="chrome-surface mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-aggie-chrome/60 px-5 text-sm font-black text-aggie-navy shadow-glow transition hover:brightness-110"
        >
          Continue to Profile Setup
          <ArrowRight className="h-4 w-4" />
        </Link>
      </section>

      <NumberedSection id="section-4" number="04" title="Navigate to Your Personal Profile">
        <SingleScreenshotSection
          image="linkedin-navigating-to-personal-page.jpg"
          title="Navigate to Your Personal Profile"
          icon={UserRound}
        >
          <p>
            After logging into LinkedIn, go to your personal profile page. This
            is where you will build and edit the sections employers, alumni, and
            professionals will see.
          </p>
        </SingleScreenshotSection>
      </NumberedSection>

      <NumberedSection id="section-5" number="05" title="Add a Background Photo">
        <SingleScreenshotSection
          image="linkedin-personal-page-background-photo.jpg"
          title="Add a Background Photo"
          icon={ImageIcon}
        >
          <p>Choose a simple, professional background image.</p>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <SimpleList
              title="Good options"
              items={[
                "Utah State campus photo",
                "landscape image",
                "stadium or athletics facility photo",
                "simple navy/white/USU-themed image",
                "one of LinkedIn's default background options",
              ]}
              tone="good"
            />
            <SimpleList
              title="Avoid"
              items={[
                "party photos",
                "busy graphics with too much text",
                "blurry images",
                "memes",
                "anything inappropriate or overly personal",
              ]}
              tone="bad"
            />
          </div>
        </SingleScreenshotSection>
      </NumberedSection>

      <NumberedSection id="section-6" number="06" title="Add Profile Sections">
        <SingleScreenshotSection
          image="linkedin-personal-page-add-sections.jpg"
          title="Add Profile Sections"
          icon={PlusCircle}
        >
          <p>
            Use the "Add profile section" area to begin building out your
            LinkedIn profile.
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {["About", "Education", "Experience", "Skills"].map((item) => (
              <IconLine key={item} icon={Check} text={item} />
            ))}
          </div>
        </SingleScreenshotSection>
      </NumberedSection>

      <NumberedSection id="section-7" number="07" title="Build Your About Section">
        <SingleScreenshotSection
          image="linkedin-about-skills-section.jpg"
          title="Build Your About Section"
          icon={UserRound}
        >
          <p>
            Your About section is a short summary that tells people who you are,
            what you study, what you are interested in, and what strengths you
            bring as a student-athlete.
          </p>
          <p className="mt-3">Keep it short, professional, and easy to read.</p>
        </SingleScreenshotSection>
        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          {aboutTemplates.map((template) => (
            <article key={template.title} className="card-surface rounded-lg p-5">
              <p className="text-sm font-black uppercase tracking-[0.18em] text-aggie-silver">
                {template.title}
              </p>
              <p className="mt-3 text-sm font-semibold leading-7 text-aggie-light/78">
                "{template.text}"
              </p>
            </article>
          ))}
        </div>
        <PlaceholderCard
          title="Coming Later: Generate My About Section"
          text="This feature will eventually use your profile questionnaire answers to create a personalized LinkedIn About section."
        />
      </NumberedSection>

      <NumberedSection id="section-8" number="08" title="Add Your Education">
        <div className="grid gap-5 lg:grid-cols-2">
          <ScreenshotPanel image="linkedin-section-education-1.jpg" title="Education section step 1" />
          <ScreenshotPanel image="linkedin-section-education-2.jpg" title="Education section step 2" />
        </div>
        <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_0.9fr]">
          <InfoCard title="Fields to complete" icon={GraduationCap}>
            <div className="grid gap-3 md:grid-cols-2">
              {educationFields.map((item) => (
                <IconLine key={item} icon={Check} text={item} />
              ))}
            </div>
          </InfoCard>
          <InfoCard title="Example" icon={CheckCircle2}>
            <div className="space-y-2 text-sm font-bold leading-6 text-aggie-light/78">
              <p>School: Utah State University</p>
              <p>Degree: Bachelor of Science</p>
              <p>Field of Study: Kinesiology</p>
              <p>Expected End Date: May 2028</p>
              <p>Activities and Societies: Utah State Student-Athlete, Women's Soccer</p>
              <p>GPA: Optional</p>
            </div>
            <Callout
              title="Note"
              text="You do not have to include your GPA unless you feel comfortable sharing it."
            />
          </InfoCard>
        </div>
      </NumberedSection>

      <NumberedSection id="section-9" number="09" title="Add Athletics as Experience">
        <SingleScreenshotSection
          image="linkedin-section-athletic-ecperince.jpg"
          title="Add Athletics as Experience"
          icon={Award}
        >
          <p>
            Athletics counts as experience. As a student-athlete, you are
            building professional skills through training, competition, travel,
            communication, leadership, teamwork, and performance under pressure.
          </p>
        </SingleScreenshotSection>
        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          <InfoCard title="Recommended entry" icon={BriefcaseBusiness}>
            <div className="space-y-2 text-sm font-bold leading-6 text-aggie-light/78">
              <p>Title: Division I Student-Athlete</p>
              <p>Organization: Utah State University Athletics</p>
              <p>Location: Logan, Utah</p>
              <p>Start Date: [Month/Year you started at USU]</p>
              <p>End Date: Present</p>
            </div>
          </InfoCard>
          <InfoCard title="Description template" icon={UserRound}>
            <p className="text-sm font-semibold leading-7 text-aggie-light/78">
              "Division I [Sport] student-athlete at Utah State University.
              Began competing for USU in [Year] while pursuing a degree in
              [Major] with an expected graduation date of [Month Year]. Balance
              athletics, academics, travel, training, and team responsibilities
              while developing leadership, communication, time management, and
              performance skills."
            </p>
          </InfoCard>
        </div>
        <InfoCard title="Experience bullet options" icon={CheckCircle2} className="mt-5">
          <div className="grid gap-3 md:grid-cols-2">
            {experienceBullets.map((item) => (
              <IconLine key={item} icon={Check} text={item} />
            ))}
          </div>
        </InfoCard>
      </NumberedSection>

      <NumberedSection id="section-10" number="10" title="Add Skills">
        <SingleScreenshotSection
          image="linkedin-section-skills.jpg"
          title="Add Skills"
          icon={Sparkles}
        >
          <p>
            Your Skills section helps show what strengths you are building
            through athletics, academics, work, leadership, and campus
            involvement.
          </p>
        </SingleScreenshotSection>
        <InfoCard title="Recommended student-athlete skills" icon={CheckCircle2} className="mt-5">
          <div className="flex flex-wrap gap-3">
            {studentAthleteSkills.map((skill) => (
              <span
                key={skill}
                className="rounded-lg border border-aggie-silver/25 bg-white/[0.06] px-4 py-3 text-sm font-black text-aggie-ice"
              >
                {skill}
              </span>
            ))}
          </div>
        </InfoCard>
      </NumberedSection>

      <NumberedSection id="section-11" number="11" title="Athlete Skills Translator">
        <InfoCard title="Translate athlete experience into LinkedIn skills" icon={Table2}>
          <p className="mb-5 leading-7 text-aggie-light/76">
            Use this chart to translate what you do as a student-athlete into
            professional LinkedIn skills.
          </p>
          <div className="overflow-hidden rounded-lg border border-aggie-silver/15">
            <div className="grid bg-white/[0.08] text-sm font-black uppercase tracking-[0.18em] text-aggie-silver md:grid-cols-2">
              <div className="border-b border-aggie-silver/15 p-4 md:border-b-0 md:border-r">
                What you do
              </div>
              <div className="p-4">Professional skills</div>
            </div>
            {skillTranslations.map(([athleteAction, skills]) => (
              <div
                key={athleteAction}
                className="grid border-t border-aggie-silver/12 bg-white/[0.035] md:grid-cols-2"
              >
                <p className="border-b border-aggie-silver/10 p-4 text-sm font-semibold leading-6 text-aggie-light/80 md:border-b-0 md:border-r">
                  {athleteAction}
                </p>
                <p className="p-4 text-sm font-bold leading-6 text-aggie-ice">
                  {skills}
                </p>
              </div>
            ))}
          </div>
        </InfoCard>
      </NumberedSection>

      <NumberedSection id="section-12" number="12" title="Find Your Top LinkedIn Skills">
        <p className="mb-5 max-w-4xl text-lg leading-8 text-aggie-light/76">
          This optional survey recommends five LinkedIn skills based on how you
          already operate as a student-athlete.
        </p>
        <SkillsSurvey />
      </NumberedSection>

      <NumberedSection id="section-13" number="13" title="Follow Key USU Accounts">
        <p className="mb-5 max-w-4xl text-lg leading-8 text-aggie-light/76">
          Start by following the two main USU pages below.
        </p>
        <div className="grid gap-5 lg:grid-cols-2">
          <FollowCard
            account="Utah State University"
            image="linkedin-follow-usu.jpg"
            instructions={'Search "Utah State University" and follow the official university page.'}
          />
          <FollowCard
            account="Utah State University Athletics"
            image="linkedin-follow-usuathletics.jpg"
            instructions={
              'Search "Utah State University Athletics." Make sure to select the company page by using the "Companies" filter if needed. Then follow the official Utah State University Athletics page.'
            }
          />
        </div>
        <Callout
          title="Important note"
          text="When searching for Utah State University Athletics, make sure you are looking for the company page. If you do not select Company or Companies, it may be harder to find the correct page."
        />
      </NumberedSection>

      <NumberedSection id="section-14" number="14" title="Connections to Make Right Now">
        <InfoCard title="Recommended first connections" icon={Users}>
          <p className="mb-5 leading-7 text-aggie-light/76">
            Start with people you already know or who are part of your USU
            support system.
          </p>
          <div className="grid gap-3 md:grid-cols-2">
            {firstConnections.map((item) => (
              <IconLine key={item} icon={Users} text={item} />
            ))}
          </div>
          <Callout
            title="Important note"
            text="LinkedIn may limit how many messages you can send each month. Before messaging people, choose your top 3 most meaningful connections and start there."
          />
        </InfoCard>
        <PlaceholderCard
          title="Coming Later: Suggested Connections"
          text="Eventually, Aggies Lead will recommend alumni and professionals based on your sport, major, desired career field, location, transfer status, and career interests."
        />
      </NumberedSection>

      <NumberedSection id="section-15" number="15" title="First LinkedIn Post">
        <PlaceholderCard
          title="Coming next"
          text="Aggies Lead will guide you through writing your first LinkedIn post as a Utah State student-athlete."
        />
      </NumberedSection>

      <NumberedSection id="section-16" number="16" title="LinkedIn Do's and Don'ts">
        <div className="grid gap-5 lg:grid-cols-2">
          <ChecklistCard title="Do" items={doItems} tone="good" />
          <ChecklistCard title="Don't" items={dontItems} tone="bad" />
        </div>
      </NumberedSection>

      <NumberedSection id="section-17" number="17" title="LinkedIn Profile Checklist">
        <LinkedInCompletionChecklist />
      </NumberedSection>
    </div>
  );
}

function NumberedSection({
  id,
  number,
  title,
  children,
}: {
  id: string;
  number: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-28">
      <div className="mb-5">
        <p className="text-sm font-black uppercase tracking-[0.28em] text-aggie-silver">
          Section {number}
        </p>
        <h2 className="text-glow mt-2 text-3xl font-black tracking-tight text-white md:text-4xl">
          {title}
        </h2>
      </div>
      {children}
    </section>
  );
}

function WalkthroughCard({ step }: { step: SetupStep }) {
  const Icon = step.icon;

  return (
    <article className="card-surface overflow-hidden rounded-lg">
      <div className="grid gap-0 lg:grid-cols-[0.92fr_1.08fr]">
        <div className="border-b border-aggie-silver/15 bg-aggie-navy/75 p-4 lg:border-b-0 lg:border-r lg:border-aggie-silver/15">
          <ScreenshotFrame image={step.image} title={step.title} />
        </div>
        <div className="p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.22em] text-aggie-silver">
                Step {step.number}
              </p>
              <h3 className="mt-2 text-2xl font-black text-white">{step.title}</h3>
            </div>
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg border border-aggie-silver/20 bg-aggie-steel/16 text-aggie-ice shadow-steel">
              <Icon className="h-6 w-6" />
            </span>
          </div>

          <div className="mt-5 space-y-3">
            {step.instructions.map((instruction) => (
              <IconLine key={instruction} icon={Check} text={instruction} />
            ))}
          </div>

          {step.note && <Callout title="Note" text={step.note} />}
          {step.explanation && <Callout title="Why it matters" text={step.explanation} />}
          {step.reminder && <Callout title="Reminder" text={step.reminder} />}

          {step.important && (
            <div className="mt-5 rounded-lg border border-aggie-chrome/35 bg-white/[0.06] p-4">
              <p className="text-sm font-black uppercase tracking-[0.2em] text-aggie-silver">
                Important
              </p>
              <div className="mt-4 grid gap-3">
                {step.important.map((item) => (
                  <IconLine key={item} icon={CircleAlert} text={item} />
                ))}
              </div>
            </div>
          )}

          {step.example && (
            <div className="mt-5 rounded-lg border border-aggie-silver/15 bg-white/[0.045] p-4">
              <p className="text-sm font-black uppercase tracking-[0.2em] text-aggie-silver">
                Example
              </p>
              <div className="mt-4 grid gap-2">
                {step.example.map((item) => (
                  <p key={item} className="text-sm font-bold leading-6 text-aggie-light/78">
                    {item}
                  </p>
                ))}
              </div>
            </div>
          )}

          {(step.good || step.avoid) && (
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {step.good && <SimpleList title="Good profile photos" items={step.good} tone="good" />}
              {step.avoid && <SimpleList title="Avoid" items={step.avoid} tone="bad" />}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

function SingleScreenshotSection({
  image,
  title,
  icon: Icon,
  children,
}: {
  image: string;
  title: string;
  icon: LucideIcon;
  children: React.ReactNode;
}) {
  return (
    <article className="card-surface overflow-hidden rounded-lg">
      <div className="grid gap-0 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="border-b border-aggie-silver/15 bg-aggie-navy/75 p-4 lg:border-b-0 lg:border-r lg:border-aggie-silver/15">
          <ScreenshotFrame image={image} title={title} />
        </div>
        <div className="p-6">
          <span className="grid h-12 w-12 place-items-center rounded-lg border border-aggie-silver/20 bg-aggie-steel/16 text-aggie-ice shadow-steel">
            <Icon className="h-6 w-6" />
          </span>
          <h3 className="mt-4 text-2xl font-black text-white">{title}</h3>
          <div className="mt-4 leading-7 text-aggie-light/76">{children}</div>
        </div>
      </div>
    </article>
  );
}

function ScreenshotPanel({ image, title }: { image: string; title: string }) {
  return (
    <article className="card-surface rounded-lg p-4">
      <ScreenshotFrame image={image} title={title} />
    </article>
  );
}

function FollowCard({
  account,
  image,
  instructions,
}: {
  account: string;
  image: string;
  instructions: string;
}) {
  return (
    <article className="card-surface overflow-hidden rounded-lg">
      <div className="border-b border-aggie-silver/15 bg-aggie-navy/75 p-4">
        <ScreenshotFrame image={image} title={account} />
      </div>
      <div className="p-6">
        <p className="text-sm font-black uppercase tracking-[0.2em] text-aggie-silver">
          Account
        </p>
        <h3 className="mt-2 text-2xl font-black text-white">{account}</h3>
        <p className="mt-4 leading-7 text-aggie-light/76">{instructions}</p>
      </div>
    </article>
  );
}

function ScreenshotFrame({ image, title }: { image: string; title: string }) {
  const src = `${imageBase}/${image}`;
  const imagePath = path.join(process.cwd(), "public", "images", "linkedin", image);
  const imageExists = existsSync(imagePath);

  return (
    <div className="relative mx-auto aspect-video w-full max-w-3xl overflow-hidden rounded-lg border border-aggie-silver/20 bg-aggie-navy/40 shadow-steel">
      {imageExists ? (
        <Image
          src={src}
          alt={`${title} screenshot`}
          fill
          sizes="(min-width: 1024px) 50vw, 92vw"
          className="object-cover object-center"
        />
      ) : (
        <div className="flex h-full flex-col items-center justify-center p-8 text-center">
          <CircleAlert className="h-10 w-10 text-aggie-ice" />
          <p className="mt-4 text-sm font-black uppercase tracking-[0.2em] text-aggie-silver">
            Screenshot Missing
          </p>
          <p className="mt-3 text-sm leading-6 text-aggie-muted">{image}</p>
        </div>
      )}
    </div>
  );
}

function InfoCard({
  title,
  icon: Icon,
  children,
  className = "",
}: {
  title: string;
  icon: LucideIcon;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <article className={`card-surface rounded-lg p-6 ${className}`}>
      <div className="mb-5 flex items-center gap-3">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg border border-aggie-silver/20 bg-aggie-steel/16 text-aggie-ice shadow-steel">
          <Icon className="h-5 w-5" />
        </span>
        <h3 className="text-2xl font-black text-white">{title}</h3>
      </div>
      {children}
    </article>
  );
}

function PlaceholderCard({ title, text }: { title: string; text: string }) {
  return (
    <article className="card-surface mt-5 rounded-lg p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.2em] text-aggie-silver">
            Future Feature
          </p>
          <h3 className="mt-2 text-2xl font-black text-white">{title}</h3>
          <p className="mt-3 leading-7 text-aggie-light/76">{text}</p>
        </div>
        <span className="chrome-surface grid h-12 w-12 shrink-0 place-items-center rounded-lg text-aggie-navy shadow-glow">
          <Sparkles className="h-6 w-6" />
        </span>
      </div>
    </article>
  );
}

function Callout({ title, text }: { title: string; text: string }) {
  return (
    <div className="mt-5 rounded-lg border border-aggie-silver/15 bg-white/[0.045] p-4">
      <p className="text-sm font-black uppercase tracking-[0.2em] text-aggie-silver">
        {title}
      </p>
      <p className="mt-3 leading-7 text-aggie-light/76">{text}</p>
    </div>
  );
}

function SimpleList({
  title,
  items,
  tone,
}: {
  title: string;
  items: string[];
  tone: "good" | "bad";
}) {
  const Icon = tone === "good" ? Check : X;

  return (
    <div className="rounded-lg border border-aggie-silver/15 bg-white/[0.045] p-4">
      <p className="text-sm font-black uppercase tracking-[0.2em] text-aggie-silver">
        {title}
      </p>
      <div className="mt-4 space-y-2">
        {items.map((item) => (
          <div key={item} className="flex gap-2">
            <span
              className={`mt-1 grid h-5 w-5 shrink-0 place-items-center rounded ${
                tone === "good" ? "bg-aggie-steel/20 text-aggie-ice" : "bg-red-500/10 text-red-100"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
            </span>
            <p className="text-sm font-semibold leading-6 text-aggie-light/78">{item}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ChecklistCard({
  title,
  items,
  tone,
}: {
  title: string;
  items: string[];
  tone: "good" | "bad";
}) {
  const Icon = tone === "good" ? Check : X;

  return (
    <article className="card-surface rounded-lg p-6">
      <h3 className="text-2xl font-black text-white">{title}</h3>
      <div className="mt-5 space-y-3">
        {items.map((item) => (
          <div key={item} className="flex gap-3 rounded-lg border border-aggie-silver/12 bg-white/[0.045] p-3">
            <span
              className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg ${
                tone === "good"
                  ? "bg-aggie-steel/20 text-aggie-ice"
                  : "bg-red-500/10 text-red-100"
              }`}
            >
              <Icon className="h-4 w-4" />
            </span>
            <p className="font-semibold leading-6 text-aggie-light/78">{item}</p>
          </div>
        ))}
      </div>
    </article>
  );
}

function IconLine({ icon: Icon, text }: { icon: LucideIcon; text: string }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-aggie-silver/12 bg-white/[0.045] p-3">
      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-aggie-steel/16 text-aggie-ice">
        <Icon className="h-4 w-4" />
      </span>
      <p className="font-semibold leading-6 text-aggie-light/78">{text}</p>
    </div>
  );
}
