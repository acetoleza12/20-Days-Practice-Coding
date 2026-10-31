const $ = (s) => document.querySelector(s);
const field = (label, value = "", type = "text") => ({ label, value, type });
const num = (x) => {
  if (String(x).trim() === "" || !Number.isFinite(Number(x)))
    throw Error("Please enter a valid number.");
  return Number(x);
};
const integer = (x, min, max) => {
  const n = num(x);
  if (!Number.isInteger(n) || n < min || n > max)
    throw Error(`Enter a whole number from ${min} to ${max}.`);
  return n;
};
const list = (x) => {
  if (!x.trim()) throw Error("Enter numbers separated by commas.");
  return x.split(",").map(num);
};
const tools = [
  [
    "Calculator",
    "Numbers",
    "+",
    "The everyday math companion.",
    [
      field("First number", 12, "number"),
      field("Operation", "+", "select"),
      field("Second number", 3, "number"),
    ],
    (a, op, b) => {
      a = num(a);
      b = num(b);
      if (op === "/" && b === 0) throw Error("Cannot divide by zero.");
      return { "+": () => a + b, "−": () => a - b, "×": () => a * b, "/": () => a / b }[
        op
      ]();
    },
  ],
  [
    "Even or odd",
    "Numbers",
    "÷",
    "Find which side a number is on.",
    [field("Whole number", 27, "number")],
    (a) =>
      integer(a, -Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER) % 2 === 0
        ? "Even"
        : "Odd",
  ],
  [
    "Largest number",
    "Numbers",
    "↑",
    "Find the standout in your list.",
    [field("Numbers separated by commas", "12, 45, 7, 89, 23")],
    (a) => Math.max(...list(a)),
  ],
  [
    "Reverse text",
    "Text",
    "↔",
    "Give your words a new direction.",
    [field("Your text", "Hello, world!", "textarea")],
    (a) => [...a].reverse().join(""),
  ],
  [
    "Palindrome checker",
    "Text",
    "◎",
    "See if your words work both ways.",
    [field("Word or phrase", "A man, a plan, a canal: Panama", "textarea")],
    (a) => {
      const s = a.toLowerCase().replace(/[^a-z0-9]/g, "");
      if (!s) throw Error("Enter a word with English letters or numbers.");
      return s === [...s].reverse().join("")
        ? "Yes! It is a palindrome."
        : "This is not a palindrome.";
    },
  ],
  [
    "Factorial",
    "Numbers",
    "n!",
    "Multiply your way to the answer.",
    [field("Whole number (0–170)", 5, "number")],
    (a) => {
      let r = 1;
      for (let i = 2; i <= integer(a, 0, 170); i++) r *= i;
      return r;
    },
  ],
  [
    "Times table",
    "Numbers",
    "×",
    "A quick refresher on multiplication.",
    [field("Number", 5, "number")],
    (a) =>
      Array.from(
        { length: 12 },
        (_, i) => `${num(a)} × ${i + 1} = ${num(a) * (i + 1)}`,
      ).join("\n"),
  ],
  [
    "Vowel counter",
    "Text",
    "Aa",
    "Give a, e, i, o, and u a headcount.",
    [field("Your text", "JavaScript is full of possibilities.", "textarea")],
    (a) => `${(a.match(/[aeiou]/gi) || []).length} vowels`,
  ],
  [
    "Temperature",
    "Everyday",
    "°",
    "From Celsius to Fahrenheit in a flash.",
    [field("Celsius", 30, "number")],
    (a) => `${num(a)} °C = ${Number(((num(a) * 9) / 5 + 32).toFixed(8))} °F`,
  ],
  [
    "Remove duplicates",
    "Text",
    "≋",
    "Keep one of each. Lose the repeats.",
    [field("Items separated by commas", "apple, banana, apple, orange", "textarea")],
    (a) =>
      [
        ...new Set(
          a
            .split(",")
            .map((x) => x.trim())
            .filter(Boolean),
        ),
      ].join(", ") || "No items entered.",
  ],
  [
    "Number sorter",
    "Numbers",
    "↕",
    "Get your numbers in order.",
    [field("Numbers separated by commas", "40, 5, 100, 2, 15")],
    (a) =>
      list(a)
        .sort((a, b) => a - b)
        .join(", "),
  ],
  [
    "Sum it up",
    "Numbers",
    "Σ",
    "Bring all your numbers together.",
    [field("Numbers separated by commas", "10, 20, 30")],
    (a) => list(a).reduce((a, b) => a + b, 0),
  ],
  [
    "Even numbers",
    "Numbers",
    "₂",
    "Find the even ones in the crowd.",
    [field("Whole numbers separated by commas", "1, 2, 3, 4, 5, 6")],
    (a) => {
      const ns = list(a);
      if (ns.some((n) => !Number.isSafeInteger(n)))
        throw Error("Enter safe whole numbers only.");
      return ns.filter((n) => n % 2 === 0).join(", ") || "No even numbers found.";
    },
  ],
  [
    "Prime checker",
    "Numbers",
    "P",
    "Discover a number’s prime status.",
    [field("Whole number (0–1 billion)", 17, "number")],
    (a) => {
      const n = integer(a, 0, 1e9);
      if (n < 2) return "Not prime";
      for (let i = 2; i * i <= n; i++) if (n % i === 0) return "Not prime";
      return "Prime!";
    },
  ],
  [
    "Fibonacci",
    "Numbers",
    "φ",
    "Explore nature’s favorite sequence.",
    [field("Number of terms (1–100)", 8, "number")],
    (a) => {
      let x = 0n,
        y = 1n,
        r = [];
      for (let i = 0; i < integer(a, 1, 100); i++) {
        r.push(String(x));
        [x, y] = [y, x + y];
      }
      return r.join(", ");
    },
  ],
  [
    "Word counter",
    "Text",
    "¶",
    "A little clarity on your word count.",
    [field("Your text", "Small tools can make a big difference.", "textarea")],
    (a) =>
      `${a.trim() ? a.trim().split(/\s+/).length : 0} words · ${[...a].length} characters`,
  ],
  [
    "Percentage",
    "Everyday",
    "%",
    "Make percentages feel effortless.",
    [field("Percentage", 15, "number"), field("Of this number", 200, "number")],
    (a, b) => `${num(a)}% of ${num(b)} = ${(num(a) * num(b)) / 100}`,
  ],
  [
    "Item frequency",
    "Text",
    "≡",
    "See what keeps showing up.",
    [field("Items separated by commas", "apple, banana, apple", "textarea")],
    (a) => {
      const m = new Map();
      a.split(",")
        .map((x) => x.trim())
        .filter(Boolean)
        .forEach((x) => m.set(x, (m.get(x) || 0) + 1));
      return [...m].map(([k, v]) => `${k}: ${v}`).join("\n") || "No items entered.";
    },
  ],
  [
    "Countdown",
    "Everyday",
    "◷",
    "Make a little time for what matters.",
    [field("Seconds (1–3600)", 10, "number")],
    (a) => ({ seconds: integer(a, 1, 3600) }),
  ],
  [
    "Random number",
    "Everyday",
    "⚄",
    "Leave your next number to chance.",
    [field("Minimum", 1, "number"), field("Maximum", 100, "number")],
    (a, b) => {
      a = integer(a, -1e9, 1e9);
      b = integer(b, -1e9, 1e9);
      if (a > b) throw Error("Maximum must be at least the minimum.");
      return Math.floor(Math.random() * (b - a + 1)) + a;
    },
  ],
];

const active = tools[7];
const fields = document.querySelector("#fields");
active[4].forEach((f, j) => {
  const label = document.createElement("label");
  label.textContent = f.label;
  label.htmlFor = "field-" + j;
  const input = document.createElement(
    f.type === "textarea" ? "textarea" : f.type === "select" ? "select" : "input",
  );
  input.id = "field-" + j;
  input.name = "field-" + j;
  if (input.tagName === "INPUT") {
    input.type = f.type;
    if (f.type === "number") input.step = "any";
  }
  if (f.type === "select")
    for (const op of ["+", "−", "×", "/"]) {
      const o = document.createElement("option");
      o.textContent = op;
      input.append(o);
    }
  input.value = f.value;
  fields.append(label, input);
});
let timer;
const result = document.querySelector("#result"),
  stop = document.querySelector("#stop");
function halt() {
  clearInterval(timer);
  timer = null;
  stop.hidden = true;
}
document.querySelector("form").onsubmit = (e) => {
  e.preventDefault();
  halt();
  try {
    result.classList.remove("error");
    const r = active[5](...new FormData(e.target).values());
    if (r && typeof r === "object" && "seconds" in r) {
      const end = Date.now() + r.seconds * 1000;
      const tick = () => {
        const n = Math.max(0, Math.ceil((end - Date.now()) / 1000));
        result.textContent = n
          ? Math.floor(n / 60) + ":" + String(n % 60).padStart(2, "0") + " remaining"
          : "Time’s up!";
        if (n === 0) halt();
      };
      tick();
      timer = setInterval(tick, 200);
      stop.hidden = false;
    } else {
      if (typeof r === "number" && !Number.isFinite(r))
        throw Error("Result is too large. Try smaller numbers.");
      result.textContent = String(r);
    }
  } catch (err) {
    result.textContent = err.message;
    result.classList.add("error");
  }
};
stop.onclick = () => {
  halt();
  result.textContent += " — stopped";
};
window.addEventListener("pagehide", halt);
