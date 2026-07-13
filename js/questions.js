// Foundation School Examination — Our Identity in Christ and Scripture Memorization
// All exam content lives here so the rendering logic in exam.js stays generic.

const EXAM_META = {
  church: "Love Country Church",
  title: "Foundation School Examination",
  course: "Our Identity in Christ and Scripture Memorization",
  timeAllowedMinutes: 120,
  essaysRequired: 4
};

const SECTION_A = [
  { q: "According to the class on Identity in Christ, the Israelites limited themselves by perceiving themselves as", options: ["Giants", "Grasshoppers", "Warriors", "Kings"] },
  { q: "Salvation is compared to", options: ["A physical relocation", "A software update on a phone", "A change in clothing", "A new job"] },
  { q: "The primary reason many believers live below their potential is", options: ["Lack of money", "Ignorance of their identity in Christ", "Insufficient prayer time", "Poor health"] },
  { q: "Approval addiction primarily stems from", options: ["Excessive confidence", "Identity ignorance", "Strong family support", "Over-familiarity with Scripture"] },
  { q: "The Bible is described as the believer's", options: ["Sword", "Mirror", "Map", "Shield"] },
  { q: "Which scripture is cited to show that Christ became sin so we might become the righteousness of God?", options: ["Romans 8:28", "2 Corinthians 5:21", "John 10:10", "Philippians 4:13"] },
  { q: "Believers are described as kings and priests who rule primarily by", options: ["Physical strength", "Their words", "Political influence", "Financial resources"] },
  { q: "As ambassadors of Christ, believers represent", options: ["Their local church", "Heaven on Earth", "Their family lineage", "Their national government"] },
  { q: "The role of a believer as \u201cthe light of the world\u201d implies bringing", options: ["Entertainment", "Development, progress, and solutions", "Criticism", "Division"] },
  { q: "Your life will rise or fall to the level of", options: ["Your financial status", "What you believe about yourself", "The opinions of others", "Your educational qualification"] },
  { q: "Scripture memorization is defined as", options: ["Reading the Bible daily", "Committing key scriptures to memory for use when necessary", "Listening to sermons", "Writing Bible verses in a journal"] },
  { q: "One key reason for memorizing Scripture is that it", options: ["Guarantees financial breakthrough", "Helps in defeating the devil, as Jesus did in Matthew 4", "Replaces the need for prayer", "Makes preaching unnecessary"] },
  { q: "An idle mind tends to drift toward", options: ["Godly thoughts automatically", "Wrong thoughts", "Creative ideas only", "Political discussions"] },
  { q: "Scriptures in prayer are compared to", options: ["Decorations", "Bullets", "Background music", "Introductions"] },
  { q: "Which type of memorization involves knowing both the wording and the reference?", options: ["Verse Memorization", "Text Memorization", "Text and Verse Memorization", "Paraphrase Memorization"] },
  { q: "\u201cJoshua 1:8\u201d is listed among the", options: ["Optional scriptures", "Must-know scriptures", "New Testament only scriptures", "Least important verses"] },
  { q: "Continuous meditation on Scripture develops", options: ["Physical fitness", "Wisdom, insight, and spiritual understanding", "Social popularity", "Business acumen"] },
  { q: "Knowing God's opinion of you frees you from", options: ["The need to read the Bible", "Needing human approval", "Attending church", "Praying daily"] },
  { q: "Righteousness in Christ is", options: ["Based primarily on good behavior", "Not changed by occasional sinning", "Earned through works", "Temporary"] },
  { q: "Believers should speak", options: ["According to circumstances", "What God says about them", "Only positive secular affirmations", "Their problems repeatedly"] }
];

const SECTION_B = [
  "The Israelites saw themselves as ____________________ in the eyes of their enemies, even though they were feared.",
  "Becoming born again changes your _________________ nature.",
  "Your words reveal what you _________________ about yourself.",
  "The Word of God is your spiritual ____________________.",
  "You are an heir of God and a joint __________________ with Christ.",
  "Christ became sin so that we might become the ___________________ of God in Him.",
  "God\u2019s love is not based on your ________________________.",
  "Kings rule by ___________________________.",
  "As Christ\u2019s ambassador, you carry divine ___________________ and provision.",
  "You are the ________________________ of the world.",
  "Bible memorization requires discipline and cooperation with the ________________.",
  "You cannot meditate on what you cannot ______________________.",
  "Jesus defeated Satan by _______________________ from _________________.",
  "Scriptures are the _____________________ of prayer.",
  "Knowing Scripture makes ________________________ easier for ministers.",
  "Continuous meditation on Scripture _____________________ and sharpens the mind.",
  "Verse memorization involves knowing the _____________ and what it generally talks about.",
  "Paraphrase memorization focuses on the ________________ without word-for-word quoting.",
  "Your life will rise or fall to the level of what you _______________________ about yourself.",
  "Believers must intentionally store God's Word in their ___________________________."
];

const SECTION_C = [
  {
    a: "Discuss how wrong self-perception can limit a believer\u2019s experience, using the example of the Israelites and at least three (3) key truths about identity in Christ to support your answer. (12 marks)",
    b: "Explain two practical ways a believer can apply the truth of being \u201ca King\u201d and \u201can Ambassador of Christ\u201d in daily life. (8 marks)"
  },
  {
    a: "Explain the relationship between knowing one\u2019s identity in Christ and freedom from approval addiction. Include the role of the Word of God as a mirror in your explanation. (12 marks)",
    b: "Why is it important for a believer to speak according to their identity in Christ rather than according to circumstances? Provide two scriptural or practical examples. (8 marks)"
  },
  {
    a: "Outline and discuss at least four (4) major reasons why Scripture memorization is essential for victorious Christian living. (12 marks)",
    b: "Differentiate between the four types of Scripture memorization and explain which type would be most beneficial for effective preaching and why. (8 marks)"
  },
  {
    a: "Describe the transformative effect of salvation on a believer\u2019s identity and how failure to understand this new identity leads to living below potential. (12 marks)",
    b: "Using at least three (3) must-know scriptures, explain how memorized Scripture can help a believer overcome temptation and strengthen prayer. (8 marks)"
  },
  {
    a: "Analyze how a believer\u2019s role as \u201cthe Light of the World\u201d and \u201cRighteous in Christ\u201d equips them to influence their environment positively. (12 marks)",
    b: "Discuss two practical strategies for ensuring that Scripture memorization leads to genuine meditation and application rather than mere intellectual knowledge. (8 marks)"
  },
  {
    a: "Provide a comprehensive explanation of how the six key truths about identity in Christ collectively empower a believer to live a victorious life. (12 marks)",
    b: "Evaluate the connection between Scripture memorization and defeating the devil, drawing lessons from the example of Jesus. (8 marks)"
  }
];
