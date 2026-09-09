import { Breadcrumbs } from "@/components/layout/DocShell";
import { AutoTraceWorkbench, type AutoSample } from "@/components/trace/AutoTraceWorkbench";

/**
 * Generic visualizer workbench.
 *
 * Unlike `/questions/[slug]/trace`, nothing here is authored per problem — the
 * pasted source is instrumented, executed, and classified at runtime.
 */
const SAMPLES: AutoSample[] = [
  {
    label: "Array",
    source: `function threeSum(nums) {
  nums.sort((a, b) => a - b);
  const result = [];

  for (let i = 0; i < nums.length - 2; i++) {
    if (nums[i] > 0) break;
    if (i > 0 && nums[i] === nums[i - 1]) continue;

    let left = i + 1;
    let right = nums.length - 1;

    while (left < right) {
      const sum = nums[i] + nums[left] + nums[right];

      if (sum < 0) {
        left++;
      } else if (sum > 0) {
        right--;
      } else {
        result.push([nums[i], nums[left], nums[right]]);
        while (left < right && nums[left] === nums[left + 1]) left++;
        while (left < right && nums[right] === nums[right - 1]) right--;
        left++;
        right--;
      }
    }
  }

  return result;
}

const result = threeSum([-1, 0, 1, 2, -1, -4]);`,
  },
  {
    label: "Window",
    source: `function lengthOfLongestSubstring(s) {
  const lastSeen = new Map();
  let best = 0;
  let left = 0;

  for (let right = 0; right < s.length; right++) {
    const c = s[right];

    if (lastSeen.has(c) && lastSeen.get(c) >= left) {
      left = lastSeen.get(c) + 1;
    }

    lastSeen.set(c, right);
    best = Math.max(best, right - left + 1);
  }

  return best;
}

const result = lengthOfLongestSubstring("abcabcbb");`,
  },
  {
    label: "Intervals",
    source: `function merge(intervals) {
  intervals.sort((a, b) => a[0] - b[0]);

  const merged = [];
  let active = intervals[0];

  for (let i = 1; i < intervals.length; i++) {
    const current = intervals[i];

    if (current[0] <= active[1]) {
      active[1] = Math.max(active[1], current[1]);
    } else {
      merged.push(active);
      active = current;
    }
  }

  merged.push(active);
  return merged;
}

const result = merge([[1, 3], [2, 6], [8, 10], [15, 18]]);`,
  },
  {
    label: "Linked list",
    source: `function node(val, next) {
  return { val: val, next: next || null };
}

const l1 = node(2, node(4, node(3)));
const l2 = node(5, node(6, node(4)));

function addTwoNumbers(a, b) {
  const dummy = node(0);
  let current = dummy;
  let carry = 0;

  while (a || b || carry) {
    const sum = (a ? a.val : 0) + (b ? b.val : 0) + carry;
    carry = Math.floor(sum / 10);

    current.next = node(sum % 10);
    current = current.next;

    if (a) a = a.next;
    if (b) b = b.next;
  }

  return dummy.next;
}

const result = addTwoNumbers(l1, l2);`,
  },
];

export default function WorkbenchPage() {
  return (
    <>
      <Breadcrumbs
        crumbs={[{ label: "InterviewPrep", href: "/" }, { label: "Visualizer workbench" }]}
        meta={["Generated trace", "Runs in your browser"]}
      />
      <AutoTraceWorkbench samples={SAMPLES} />
    </>
  );
}
