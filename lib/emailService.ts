export const emailConfig = {
  senderName: "Aggies Lead",
  senderEmail: "aggieslead@usu.edu",
  replyToEmail: "aggieslead@usu.edu",
  status: "Placeholder / Not Connected",
  appUrl: "https://aggieslead.usu.edu",
};

export type EmailTemplateKey =
  | "accountActivation"
  | "passwordReset"
  | "eventRsvpConfirmation"
  | "eventReminder"
  | "coachAccountCreated"
  | "adminInvite"
  | "weeklyAdminSummary"
  | "monthlyCoachTeamSummary"
  | "roadTripConfirmation"
  | "jobShadowConfirmation";

export type PlaceholderEmail = {
  id: string;
  to: string;
  templateKey: EmailTemplateKey;
  subject: string;
  fromName: string;
  fromEmail: string;
  replyToEmail: string;
  body: string;
  createdAt: string;
  status: "placeholder-not-sent";
};

type TemplateVariables = Record<string, string | number | undefined>;

export const placeholderEmailStorageKey = "aggies-lead:placeholder-email-log";

export const emailTemplates: Record<EmailTemplateKey, { label: string; subject: string; body: (variables: TemplateVariables) => string }> = {
  accountActivation: {
    label: "Account Activation",
    subject: "Activate Your Aggies Lead Account",
    body: (variables) => `Hello ${variables.firstName ?? "there"},

You have been added to Aggies Lead.

Log in using your school email:
${variables.email ?? "[School Email]"}

Temporary password:
${variables.temporaryPassword ?? "aggieslead"}

After logging in, you will be prompted to create a new password. Then you will complete your student-athlete profile so Aggies Lead can connect you to the correct team, roadmap, and resources.

Login link:
${variables.loginLink ?? "[Login Link]"}

Thank you,
Aggies Lead`,
  },
  passwordReset: {
    label: "Password Reset",
    subject: "Reset Your Aggies Lead Password",
    body: (variables) => `Hello ${variables.firstName ?? "there"},

A password reset was requested for your Aggies Lead account.

Temporary password or reset link:
${variables.resetLink ?? variables.temporaryPassword ?? "[Reset Link]"}

If you did not request this, contact Aggies Lead.

Thank you,
Aggies Lead`,
  },
  eventRsvpConfirmation: {
    label: "Event RSVP Confirmation",
    subject: "You're Registered for [Event Name]",
    body: (variables) => `Hello ${variables.firstName ?? "there"},

You are registered for ${variables.eventName ?? "[Event Name]"}.

Date: ${variables.eventDate ?? "[Date]"}
Time: ${variables.eventTime ?? "[Time]"}
Location: ${variables.eventLocation ?? "[Location]"}

View event details in Aggies Lead:
${variables.eventLink ?? emailConfig.appUrl}

Thank you,
Aggies Lead`,
  },
  eventReminder: {
    label: "Event Reminder",
    subject: "Reminder: [Event Name] is Coming Up",
    body: (variables) => `Hello ${variables.firstName ?? "there"},

This is a reminder that ${variables.eventName ?? "[Event Name]"} is coming up.

Date: ${variables.eventDate ?? "[Date]"}
Time: ${variables.eventTime ?? "[Time]"}
Location: ${variables.eventLocation ?? "[Location]"}

View details:
${variables.eventLink ?? emailConfig.appUrl}

Thank you,
Aggies Lead`,
  },
  coachAccountCreated: {
    label: "Coach Account Created",
    subject: "Your Aggies Lead Coach Account",
    body: (variables) => `Hello ${variables.firstName ?? "Coach"},

Your Aggies Lead coach account has been created.

Login email: ${variables.email ?? "[Email]"}
Temporary password: ${variables.temporaryPassword ?? "[Temporary Password]"}
Assigned team(s): ${variables.assignedTeams ?? "[Assigned Teams]"}

Log in here:
${variables.loginLink ?? emailConfig.appUrl}

Thank you,
Aggies Lead`,
  },
  adminInvite: {
    label: "Admin Invite",
    subject: "You've Been Invited to Aggies Lead",
    body: (variables) => `Hello,

You have been invited to become an Aggies Lead admin.

Accept your invite here:
${variables.inviteLink ?? "[Invite Link]"}

Admin access allows you to manage student-athlete development data, teams, modules, events, and settings.

Thank you,
Aggies Lead`,
  },
  weeklyAdminSummary: {
    label: "Weekly Admin Summary",
    subject: "Aggies Lead Weekly Summary",
    body: (variables) => `Hello,

Here is your weekly Aggies Lead summary.

Total student-athletes: ${variables.totalStudentAthletes ?? "[Total Student-Athletes]"}
Overall completion: ${variables.overallCompletion ?? "[Overall Completion]"}
Events this week: ${variables.eventsThisWeek ?? "[Events This Week]"}
Items needing attention: ${variables.needsAttention ?? "[Items Needing Attention]"}

Open Aggies Lead:
${variables.dashboardLink ?? emailConfig.appUrl}

Thank you,
Aggies Lead`,
  },
  monthlyCoachTeamSummary: {
    label: "Monthly Coach Team Summary",
    subject: "Aggies Lead Team Progress Summary",
    body: (variables) => `Hello ${variables.firstName ?? "Coach"},

Here is your monthly Aggies Lead team progress summary.

Team: ${variables.teamName ?? "[Team Name]"}
Team completion: ${variables.teamCompletion ?? "[Team Completion]"}
Event participation: ${variables.eventParticipation ?? "[Event Participation]"}
Modules needing attention: ${variables.missingModules ?? "[Missing Modules]"}

Open your Coach Dashboard:
${variables.dashboardLink ?? emailConfig.appUrl}

Thank you,
Aggies Lead`,
  },
  roadTripConfirmation: {
    label: "Road Trip Confirmation",
    subject: "Aggie Road Trip Confirmation",
    body: (variables) => `Hello ${variables.firstName ?? "there"},

You are confirmed for ${variables.eventName ?? "[Aggie Road Trip]"}.

Date: ${variables.eventDate ?? "[Date]"}
Time: ${variables.eventTime ?? "[Time]"}
Location: ${variables.eventLocation ?? "[Location]"}
Transportation: ${variables.transportation ?? "[Transportation Details]"}

View details:
${variables.eventLink ?? emailConfig.appUrl}

Thank you,
Aggies Lead`,
  },
  jobShadowConfirmation: {
    label: "Job Shadow Confirmation",
    subject: "Job Shadow Confirmation",
    body: (variables) => `Hello ${variables.firstName ?? "there"},

Your job shadow or micro-internship confirmation is below.

Company / Organization: ${variables.organization ?? "[Organization]"}
Professional Contact: ${variables.contactName ?? "[Contact Name]"}
Date: ${variables.eventDate ?? "[Date]"}
Time: ${variables.eventTime ?? "[Time]"}

View details:
${variables.eventLink ?? emailConfig.appUrl}

Thank you,
Aggies Lead`,
  },
};

export function buildPlaceholderEmail(templateKey: EmailTemplateKey, to: string, variables: TemplateVariables = {}): PlaceholderEmail {
  const template = emailTemplates[templateKey];
  return {
    id: `email-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    to,
    templateKey,
    subject: template.subject,
    fromName: emailConfig.senderName,
    fromEmail: emailConfig.senderEmail,
    replyToEmail: emailConfig.replyToEmail,
    body: template.body(variables),
    createdAt: new Date().toISOString(),
    status: "placeholder-not-sent",
  };
}

export function queuePlaceholderEmail(templateKey: EmailTemplateKey, to: string, variables: TemplateVariables = {}) {
  if (typeof window === "undefined") return null;
  const email = buildPlaceholderEmail(templateKey, to, variables);
  const saved = window.localStorage.getItem(placeholderEmailStorageKey);
  const current = saved ? (JSON.parse(saved) as PlaceholderEmail[]) : [];
  window.localStorage.setItem(placeholderEmailStorageKey, JSON.stringify([email, ...current]));
  return email;
}
