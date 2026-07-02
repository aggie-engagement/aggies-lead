"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  Download,
  Eye,
  FileText,
  Pencil,
  Plus,
  Search,
  Star,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { useAuth } from "@/components/AuthState";

type ResourceCategory =
  | "Resume Templates"
  | "Cover Letter Templates"
  | "Networking Templates"
  | "Interview Resources"
  | "Career Planning Worksheets"
  | "Financial Literacy Resources"
  | "Life After Sport / Transition Resources";

type ResourceItem = {
  id: string;
  title: string;
  category: ResourceCategory;
  description: string;
  fileType: string;
  featured: boolean;
  previewAvailable: boolean;
  fileName: string;
};

const storageKey = "aggies-lead:resource-library";

const categories: ResourceCategory[] = [
  "Resume Templates",
  "Cover Letter Templates",
  "Networking Templates",
  "Interview Resources",
  "Career Planning Worksheets",
  "Financial Literacy Resources",
  "Life After Sport / Transition Resources",
];

const seededResources: ResourceItem[] = [
  ...resourceGroup("Resume Templates", [
    "Student-Athlete Resume Template",
    "Internship Resume Template",
    "Graduate School Resume Template",
    "Professional Athletics Resume Template",
    "General Professional Resume Template",
  ], "Editable resume template for building a polished, student-athlete friendly resume.", "DOCX"),
  ...resourceGroup("Cover Letter Templates", [
    "Internship Cover Letter Template",
    "Full-Time Job Cover Letter Template",
    "Graduate School Letter Template",
    "General Cover Letter Template",
  ], "Editable letter template with prompts for writing a clear, professional message.", "DOCX"),
  ...resourceGroup("Networking Templates", [
    "LinkedIn Connection Request Template",
    "Informational Interview Request Template",
    "Networking Follow-Up Email Template",
    "Thank-You Email Template",
    "Professional Introduction Template",
  ], "Copy-ready message template for starting and maintaining professional relationships.", "DOCX"),
  ...resourceGroup("Interview Resources", [
    "STAR Method Worksheet",
    "Mock Interview Prep Guide",
    "Common Interview Questions",
    "Interview Reflection Worksheet",
    "Questions to Ask Employers",
  ], "Practice guide or worksheet for interview preparation and reflection.", "PDF"),
  ...resourceGroup("Career Planning Worksheets", [
    "Career Mapping Worksheet",
    "Goal Setting Worksheet",
    "Industry Research Worksheet",
    "Job Search Tracker",
    "Internship Application Tracker",
  ], "Worksheet for organizing goals, research, applications, and next steps.", "XLSX"),
  ...resourceGroup("Financial Literacy Resources", [
    "Monthly Budget Template",
    "Savings Goal Tracker",
    "Expense Tracker",
    "Credit Basics Guide",
    "High-Yield Savings Guide",
  ], "Practical money resource for budgeting, saving, tracking expenses, and learning finance basics.", "XLSX"),
  ...resourceGroup("Life After Sport / Transition Resources", [
    "Life After Sport Reflection Worksheet",
    "Post-USU Transition Checklist",
    "Professional References Tracker",
    "Alumni Networking Worksheet",
  ], "Transition planning resource for life after sport, alumni connections, and post-USU readiness.", "PDF"),
].map((resource, index) => ({
  ...resource,
  featured: ["Student-Athlete Resume Template", "STAR Method Worksheet", "Career Mapping Worksheet", "Post-USU Transition Checklist"].includes(resource.title),
  previewAvailable: index % 3 !== 1,
}));

const emptyForm: Omit<ResourceItem, "id"> = {
  title: "",
  category: "Resume Templates",
  description: "",
  fileType: "PDF",
  featured: false,
  previewAvailable: true,
  fileName: "",
};

export default function ResourcesPage() {
  const { role } = useAuth();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [resources, setResources] = useState<ResourceItem[]>([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<ResourceCategory | "All">("All");
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [previewResource, setPreviewResource] = useState<ResourceItem | null>(null);
  const [message, setMessage] = useState("");
  const isAdmin = role === "admin";

  useEffect(() => {
    const saved = window.localStorage.getItem(storageKey);
    if (saved) {
      try {
        setResources(JSON.parse(saved) as ResourceItem[]);
        return;
      } catch {
        window.localStorage.removeItem(storageKey);
      }
    }
    setResources(seededResources);
    window.localStorage.setItem(storageKey, JSON.stringify(seededResources));
  }, []);

  const featuredResources = resources.filter((resource) => resource.featured);
  const filteredResources = useMemo(() => {
    const query = search.trim().toLowerCase();
    return resources.filter((resource) => {
      const matchesCategory = categoryFilter === "All" || resource.category === categoryFilter;
      const matchesSearch = !query || [resource.title, resource.category, resource.description, resource.fileType].join(" ").toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [categoryFilter, resources, search]);

  const saveResources = (nextResources: ResourceItem[]) => {
    setResources(nextResources);
    window.localStorage.setItem(storageKey, JSON.stringify(nextResources));
  };

  const saveResource = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.title.trim() || !form.description.trim() || !form.fileType.trim()) {
      setMessage("Add a title, description, and file type before saving.");
      return;
    }
    if (editingId) {
      saveResources(resources.map((resource) => resource.id === editingId ? { ...resource, ...form, fileName: form.fileName || resource.fileName } : resource));
      setEditingId(null);
      setMessage("Resource updated.");
    } else {
      const nextResource: ResourceItem = {
        id: `resource-${Date.now()}`,
        ...form,
        fileName: form.fileName || `${slugify(form.title)}.${form.fileType.toLowerCase()}`,
      };
      saveResources([nextResource, ...resources]);
      setMessage("Resource added.");
    }
    setForm(emptyForm);
  };

  const editResource = (resource: ResourceItem) => {
    setEditingId(resource.id);
    setForm({
      title: resource.title,
      category: resource.category,
      description: resource.description,
      fileType: resource.fileType,
      featured: resource.featured,
      previewAvailable: resource.previewAvailable,
      fileName: resource.fileName,
    });
    setMessage("Editing resource.");
  };

  const deleteResource = (id: string) => {
    const confirmed = window.confirm("Delete this resource from the library?");
    if (!confirmed) return;
    saveResources(resources.filter((resource) => resource.id !== id));
    setMessage("Resource deleted.");
  };

  const moveResource = (id: string, direction: "up" | "down") => {
    const index = resources.findIndex((resource) => resource.id === id);
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    if (index < 0 || swapIndex < 0 || swapIndex >= resources.length) return;
    const nextResources = [...resources];
    [nextResources[index], nextResources[swapIndex]] = [nextResources[swapIndex], nextResources[index]];
    saveResources(nextResources);
  };

  const toggleFeatured = (id: string) => {
    saveResources(resources.map((resource) => resource.id === id ? { ...resource, featured: !resource.featured } : resource));
  };

  const downloadResource = (resource: ResourceItem) => {
    const contents = buildPlaceholderFile(resource);
    downloadTextFile(resource.fileName || `${slugify(resource.title)}.${resource.fileType.toLowerCase()}`, contents);
  };

  const uploadFile = (file: File | undefined) => {
    if (!file) return;
    const extension = file.name.split(".").pop()?.toUpperCase() ?? "FILE";
    setForm((current) => ({ ...current, fileName: file.name, fileType: extension }));
    setMessage(`Attached placeholder file: ${file.name}`);
  };

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Resources"
        title="Resource Library"
        description="Download editable templates, worksheets, and guides for career development, networking, financial literacy, interviews, and transition planning."
      />

      <section className="card-surface rounded-lg p-5">
        <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
          <label className="relative block">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-aggie-muted" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search templates, worksheets, guides"
              className="min-h-12 w-full rounded-lg border border-white/10 bg-white/8 pl-11 pr-4 text-white outline-none transition focus:border-aggie-ice"
            />
          </label>
          <select
            value={categoryFilter}
            onChange={(event) => setCategoryFilter(event.target.value as ResourceCategory | "All")}
            className="min-h-12 rounded-lg border border-white/10 bg-aggie-navy px-4 text-white outline-none transition focus:border-aggie-ice"
          >
            <option value="All">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </section>

      {featuredResources.length ? (
        <section>
          <div className="mb-4 flex items-center gap-3">
            <Star className="h-5 w-5 fill-aggie-ice text-aggie-ice" />
            <h2 className="text-2xl font-black text-white">Featured Resources</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {featuredResources.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} onDownload={downloadResource} onPreview={setPreviewResource} />
            ))}
          </div>
        </section>
      ) : null}

      {isAdmin ? (
        <section className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
          <article className="card-surface rounded-lg p-6">
            <div className="flex items-center gap-3">
              <Plus className="h-6 w-6 text-aggie-ice" />
              <h2 className="text-2xl font-black text-white">{editingId ? "Edit Resource" : "Add New Resource"}</h2>
            </div>
            <form onSubmit={saveResource} className="mt-5 grid gap-4">
              <TextInput label="Resource Title" value={form.title} onChange={(value) => setForm({ ...form, title: value })} />
              <label className="block">
                <span className="text-sm font-black uppercase tracking-[0.16em] text-aggie-silver">Category</span>
                <select
                  value={form.category}
                  onChange={(event) => setForm({ ...form, category: event.target.value as ResourceCategory })}
                  className="mt-2 min-h-12 w-full rounded-lg border border-white/10 bg-aggie-navy px-4 text-white outline-none transition focus:border-aggie-ice"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="text-sm font-black uppercase tracking-[0.16em] text-aggie-silver">Description</span>
                <textarea
                  value={form.description}
                  onChange={(event) => setForm({ ...form, description: event.target.value })}
                  className="mt-2 min-h-24 w-full rounded-lg border border-white/10 bg-white/8 px-4 py-3 text-white outline-none transition focus:border-aggie-ice"
                />
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                <TextInput label="File Type" value={form.fileType} onChange={(value) => setForm({ ...form, fileType: value.toUpperCase() })} />
                <TextInput label="File Name" value={form.fileName} onChange={(value) => setForm({ ...form, fileName: value })} />
              </div>
              <div className="flex flex-wrap gap-3">
                <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-white/10 bg-white/6 px-4 py-3 text-sm font-bold text-aggie-light">
                  <input type="checkbox" checked={form.featured} onChange={(event) => setForm({ ...form, featured: event.target.checked })} className="h-4 w-4 accent-aggie-ice" />
                  Mark featured
                </label>
                <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-white/10 bg-white/6 px-4 py-3 text-sm font-bold text-aggie-light">
                  <input type="checkbox" checked={form.previewAvailable} onChange={(event) => setForm({ ...form, previewAvailable: event.target.checked })} className="h-4 w-4 accent-aggie-ice" />
                  Preview available
                </label>
              </div>
              <input ref={fileInputRef} type="file" className="hidden" onChange={(event) => uploadFile(event.target.files?.[0])} />
              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/6 px-4 text-sm font-black text-white transition hover:border-aggie-ice/40 hover:bg-white/10"
                >
                  <Upload className="h-4 w-4 text-aggie-ice" />
                  Upload File
                </button>
                <button
                  type="submit"
                  className="chrome-surface inline-flex min-h-12 items-center justify-center rounded-lg border border-aggie-chrome/60 px-5 text-sm font-black text-aggie-navy shadow-glow transition hover:brightness-110"
                >
                  {editingId ? "Save Resource" : "Add Resource"}
                </button>
              </div>
            </form>
            {message ? (
              <p className="mt-4 rounded-lg border border-aggie-ice/30 bg-aggie-ice/10 p-4 text-sm font-bold text-aggie-light">{message}</p>
            ) : null}
          </article>

          <article className="card-surface rounded-lg p-6">
            <h2 className="text-2xl font-black text-white">Admin Resource Management</h2>
            <p className="mt-3 leading-7 text-aggie-light/74">
              Organize resources, mark featured items, edit details, reorder cards, and remove outdated files.
            </p>
            <div className="mt-5 max-h-[640px] space-y-3 overflow-y-auto pr-1">
              {resources.map((resource) => (
                <div key={resource.id} className="rounded-lg border border-white/10 bg-white/6 p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="font-black text-white">{resource.title}</p>
                      <p className="mt-1 text-sm font-semibold text-aggie-muted">{resource.category} • {resource.fileType}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <IconButton label="Move up" icon={ArrowUp} onClick={() => moveResource(resource.id, "up")} />
                      <IconButton label="Move down" icon={ArrowDown} onClick={() => moveResource(resource.id, "down")} />
                      <IconButton label="Featured" icon={Star} onClick={() => toggleFeatured(resource.id)} active={resource.featured} />
                      <IconButton label="Edit" icon={Pencil} onClick={() => editResource(resource)} />
                      <IconButton label="Delete" icon={Trash2} onClick={() => deleteResource(resource.id)} danger />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </article>
        </section>
      ) : null}

      <section>
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-black text-white">All Resources</h2>
            <p className="mt-1 text-sm font-semibold text-aggie-muted">{filteredResources.length} resources shown</p>
          </div>
          <p className="text-sm font-bold text-aggie-light/74">
            {isAdmin ? "Admin controls enabled" : "View and download access"}
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredResources.map((resource) => (
            <ResourceCard key={resource.id} resource={resource} onDownload={downloadResource} onPreview={setPreviewResource} />
          ))}
        </div>
      </section>

      {previewResource ? (
        <div className="fixed inset-0 z-[90] bg-black/65 p-4 backdrop-blur-sm">
          <div className="card-surface mx-auto max-h-[calc(100vh-2rem)] max-w-2xl overflow-y-auto rounded-lg p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.18em] text-aggie-silver">Preview</p>
                <h2 className="mt-2 text-2xl font-black text-white">{previewResource.title}</h2>
              </div>
              <button
                type="button"
                onClick={() => setPreviewResource(null)}
                className="grid h-10 w-10 place-items-center rounded-lg border border-white/10 text-aggie-light transition hover:bg-white/10"
                aria-label="Close preview"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-5 rounded-lg border border-white/10 bg-white/6 p-5">
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-aggie-silver">{previewResource.category}</p>
              <p className="mt-3 leading-7 text-aggie-light/78">{previewResource.description}</p>
              <pre className="mt-5 whitespace-pre-wrap rounded-lg border border-white/10 bg-black/20 p-4 text-sm leading-6 text-aggie-light">
                {buildPlaceholderFile(previewResource)}
              </pre>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function ResourceCard({ resource, onDownload, onPreview }: { resource: ResourceItem; onDownload: (resource: ResourceItem) => void; onPreview: (resource: ResourceItem) => void }) {
  return (
    <article className="card-surface flex min-h-[280px] flex-col rounded-lg p-5">
      <div className="flex items-start justify-between gap-4">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg border border-aggie-silver/20 bg-white/6 text-aggie-ice">
          <FileText className="h-5 w-5" />
        </span>
        <div className="flex items-center gap-2">
          {resource.featured ? <Star className="h-4 w-4 fill-aggie-ice text-aggie-ice" /> : null}
          <span className="rounded-lg border border-white/10 bg-white/6 px-2 py-1 text-xs font-black text-aggie-silver">{resource.fileType}</span>
        </div>
      </div>
      <h3 className="mt-4 text-xl font-black text-white">{resource.title}</h3>
      <p className="mt-2 text-xs font-black uppercase tracking-[0.16em] text-aggie-silver">{resource.category}</p>
      <p className="mt-3 flex-1 text-sm font-semibold leading-6 text-aggie-light/74">{resource.description}</p>
      <div className="mt-5 grid gap-2 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => onDownload(resource)}
          className="chrome-surface inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-aggie-chrome/60 px-4 text-sm font-black text-aggie-navy shadow-glow transition hover:brightness-110"
        >
          <Download className="h-4 w-4" />
          Download
        </button>
        <button
          type="button"
          disabled={!resource.previewAvailable}
          onClick={() => onPreview(resource)}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/6 px-4 text-sm font-black text-white transition hover:border-aggie-ice/40 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-45"
        >
          <Eye className="h-4 w-4 text-aggie-ice" />
          Preview
        </button>
      </div>
    </article>
  );
}

function TextInput({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block">
      <span className="text-sm font-black uppercase tracking-[0.16em] text-aggie-silver">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 min-h-12 w-full rounded-lg border border-white/10 bg-white/8 px-4 text-white outline-none transition focus:border-aggie-ice"
      />
    </label>
  );
}

function IconButton({ label, icon: Icon, onClick, active = false, danger = false }: { label: string; icon: typeof Pencil; onClick: () => void; active?: boolean; danger?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      className={`grid h-10 w-10 place-items-center rounded-lg border text-aggie-light transition ${
        danger
          ? "border-red-300/25 bg-red-300/10 hover:bg-red-300/15"
          : active
            ? "border-aggie-ice/40 bg-aggie-ice/15"
            : "border-white/10 bg-white/6 hover:border-aggie-ice/40 hover:bg-white/10"
      }`}
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}

function resourceGroup(category: ResourceCategory, titles: string[], description: string, fileType: string): ResourceItem[] {
  return titles.map((title) => ({
    id: slugify(`${category}-${title}`),
    title,
    category,
    description,
    fileType,
    featured: false,
    previewAvailable: true,
    fileName: `${slugify(title)}.${fileType.toLowerCase()}`,
  }));
}

function buildPlaceholderFile(resource: ResourceItem) {
  return [
    resource.title,
    "",
    `Category: ${resource.category}`,
    `File Type: ${resource.fileType}`,
    "",
    resource.description,
    "",
    "Editable placeholder resource for the Aggies Lead local prototype.",
    "Replace this content with the final template, worksheet, or guide when source files are available.",
  ].join("\n");
}

function downloadTextFile(filename: string, contents: string) {
  const blob = new Blob([contents], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}
