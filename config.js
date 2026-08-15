// ============================================================
// EDIT THIS FILE — everything you need to personalize is here.
// ============================================================

const CONFIG = {
  // Her name / the question shown at the very top (optional, leave as-is to skip)
  questionText: "Will you go on a date with me?",

  // --- EMAIL DELIVERY (Formspree) ---
  // 1. Go to https://formspree.io and make a free account.
  // 2. Create a new form, it gives you an endpoint like:
  //    https://formspree.io/f/abcdEFGH
  // 3. Paste that full URL below.
  formspreeEndpoint: "https://formspree.io/f/xvkpbaeg",

  // Time slots she can choose from
  timeSlots: [ "6:00 PM", "7:00 PM", "8:00 PM", "9:00 PM"],

  // --- ACTIVITY OPTIONS ---
  // Edit, remove, or add to this list freely. "icon" is any emoji.
  activities: [
    { icon: "☕", title: "Coffee & catch up", desc: "Something cozy, good coffee, better conversation." },
    { icon: "🍝", title: "Dinner out", desc: "Wherever has good food and no rush to leave." },
    { icon: "🎬", title: "Movie night", desc: "Something at the cinema — your pick." },
    { icon: "🚶", title: "A long walk", desc: "Somewhere nice to walk and talk." },
    { icon: "🍦", title: "Dessert run", desc: "Ice cream, cake, whatever's got sugar in it." },
    { icon: "🎳", title: "Something active", desc: "Bowling, arcade, mini golf — a little competition." },
  ],
};
