import type { ConceptualQuestion } from "../conceptual";

export const gitQuestions: ConceptualQuestion[] = [
  {
    topicSlug: "git",
    slug: "git-rebase-vs-merge",
    title: "What is the difference between Git Rebase and Git Merge?",
    difficulty: "EASY",
    subtopic: "Version Control",
    synopsis: "Preserving exact commit history via merge commit vs linear history rewriting.",
    shortAnswer:
      "Git Merge creates a new 'merge commit' that joins two branch histories together, preserving exact true historical context. Git Rebase moves or 're-applies' feature branch commits on top of the target base branch, creating a clean, linear commit history by rewriting commit hashes.",
    detailedExplanation: [
      "**Git Merge.** Non-destructive operation. History retains all branch commits in chronological order along with explicit merge commits (\`Merge branch 'feature' into main\`). Easy to trace, but history can become cluttered with multiple branch tracks.",
      "**Git Rebase.** Replays your feature commits one by one on top of the latest \`main\` branch tip. Result is a clean, single linear timeline without merge commits. However, it rewrites commit hashes.",
      "**Golden Rule of Rebasing.** NEVER rebase commits that have been pushed to a public/shared branch! Rebasing shared branches rewrites history for collaborators, causing git conflicts and duplicate commit trees.",
    ],
    example: {
      language: "JAVA",
      code: `# Standard Merge (Preserves History)
git checkout main
git merge feature/login # Creates merge commit

# Interactive Rebase (Linear History on Feature Branch)
git checkout feature/login
git rebase main # Re-applies feature commits on top of main
git checkout main
git merge feature/login # Fast-forward merge!`,
    },
    interviewTip:
      "Explain your team workflow: 'Rebase local feature branches onto main before creating a Pull Request to keep feature history clean, but use Merge on shared main branches to avoid rewriting public history.'",
    commonTrap:
      "Rebasing a shared \`main\` or \`release\` branch that other developers are actively pulling from.",
    followUpQuestions: [
      "What is Interactive Rebasing (git rebase -i)?",
      "What is the difference between git reset --hard, --soft, and --mixed?",
      "How does git cherry-pick work?",
    ],
    relatedTopics: ["Git", "Version Control", "Workflow"],
    tags: ["Git", "Version Control"],
  },
];
