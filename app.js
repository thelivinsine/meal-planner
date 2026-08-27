/* Mise — weekly meal planner. Vanilla JS, no dependencies.
   Data model: RECIPES is the fixed catalogue. state.plan maps "YYYY-MM-DD|Meal" -> recipe id. */

// ---------------------------------------------------------------- catalogue

const RECIPES = [
  {
    id: 'overnight-oats',
    name: 'Overnight Oats with Berries',
    tags: ['breakfast', 'vegetarian', 'quick'],
    minutes: 10,
    ingredients: ['80g rolled oats', '200ml milk or oat milk', '3 tbsp yoghurt', '1 tbsp maple syrup', '150g mixed berries', 'Pinch of salt'],
    steps: ['Stir the oats, milk, yoghurt, syrup and salt together in a jar.', 'Cover and refrigerate overnight, or at least 4 hours.', 'Top with berries just before eating.']
  },
  {
    id: 'spinach-feta-omelette',
    name: 'Spinach and Feta Omelette',
    tags: ['breakfast', 'vegetarian', 'quick'],
    minutes: 12,
    ingredients: ['3 eggs', '60g spinach', '40g feta', '1 tsp butter', 'Black pepper', 'Salt'],
    steps: ['Beat the eggs with a pinch of salt and plenty of pepper.', 'Wilt the spinach in the buttered pan, then pour in the eggs.', 'Scatter over the feta, fold once the base is set, and slide onto a plate.']
  },
  {
    id: 'banana-pb-smoothie',
    name: 'Banana Peanut Butter Smoothie',
    tags: ['breakfast', 'vegan', 'quick'],
    minutes: 5,
    ingredients: ['1 frozen banana', '1 tbsp peanut butter', '250ml oat milk', '1 tbsp oats', '1 tsp cocoa powder', 'Ice'],
    steps: ['Put everything in a blender.', 'Blend until completely smooth, about 45 seconds.', 'Pour into a tall glass and drink cold.']
  },
  {
    id: 'shakshuka',
    name: 'Shakshuka',
    tags: ['breakfast', 'vegetarian'],
    minutes: 30,
    ingredients: ['1 onion, sliced', '1 red pepper, sliced', '2 garlic cloves', '400g tin chopped tomatoes', '1 tsp cumin', '1 tsp paprika', '4 eggs', 'Parsley'],
    steps: ['Soften the onion and pepper in oil for 8 minutes, then add the garlic and spices.', 'Pour in the tomatoes and simmer for 10 minutes until thick.', 'Make four wells, crack in the eggs, cover and cook until just set.', 'Scatter with parsley and serve with bread.']
  },
  {
    id: 'buttermilk-pancakes',
    name: 'Buttermilk Pancakes',
    tags: ['breakfast', 'vegetarian'],
    minutes: 25,
    ingredients: ['200g plain flour', '2 tsp baking powder', '1 tbsp sugar', '300ml buttermilk', '1 egg', '30g melted butter', 'Maple syrup'],
    steps: ['Whisk the dry ingredients in one bowl and the wet in another.', 'Fold together until just combined; lumps are fine.', 'Cook ladlefuls in a buttered pan until bubbles appear, then flip.', 'Stack and pour over maple syrup.']
  },
  {
    id: 'avocado-toast',
    name: 'Avocado Toast with Chilli',
    tags: ['breakfast', 'vegan', 'quick'],
    minutes: 10,
    ingredients: ['2 slices sourdough', '1 ripe avocado', 'Half a lemon', 'Chilli flakes', 'Olive oil', 'Flaky salt'],
    steps: ['Toast the sourdough well.', 'Mash the avocado with lemon juice and salt.', 'Spread thickly, then finish with olive oil and chilli flakes.']
  },
  {
    id: 'chickpea-curry',
    name: 'Chickpea Curry',
    tags: ['dinner', 'vegan'],
    minutes: 35,
    ingredients: ['2 tins chickpeas', '1 onion, diced', '3 garlic cloves', 'Thumb of ginger', '2 tbsp curry powder', '400ml coconut milk', '400g tin chopped tomatoes', 'Coriander'],
    steps: ['Fry the onion until golden, then add the garlic, ginger and curry powder.', 'Add the tomatoes and cook down for 5 minutes.', 'Stir in the chickpeas and coconut milk and simmer for 20 minutes.', 'Season well and finish with coriander. Serve with rice.']
  },
  {
    id: 'aglio-e-olio',
    name: 'Spaghetti Aglio e Olio',
    tags: ['dinner', 'vegetarian', 'pasta', 'quick'],
    minutes: 20,
    ingredients: ['320g spaghetti', '6 garlic cloves, thinly sliced', '80ml olive oil', '1 tsp chilli flakes', 'Parsley', 'Parmesan'],
    steps: ['Boil the spaghetti in well-salted water, reserving a mug of the water.', 'Gently colour the garlic in the oil with the chilli — do not let it brown.', 'Toss the drained pasta through with a splash of pasta water until glossy.', 'Add parsley and parmesan off the heat.']
  },
  {
    id: 'mushroom-pasta',
    name: 'Creamy Mushroom Pasta',
    tags: ['dinner', 'vegetarian', 'pasta'],
    minutes: 30,
    ingredients: ['320g tagliatelle', '400g mixed mushrooms', '2 garlic cloves', '150ml double cream', '30g parmesan', 'Thyme', 'Butter'],
    steps: ['Fry the mushrooms hard in butter until deeply browned, then add garlic and thyme.', 'Pour in the cream and let it bubble for 2 minutes.', 'Toss with the cooked pasta and a little pasta water.', 'Finish with parmesan and black pepper.']
  },
  {
    id: 'puttanesca',
    name: 'Pasta Puttanesca',
    tags: ['dinner', 'pasta'],
    minutes: 25,
    ingredients: ['320g linguine', '4 anchovy fillets', '2 garlic cloves', '400g tin chopped tomatoes', '80g black olives', '1 tbsp capers', 'Chilli flakes'],
    steps: ['Melt the anchovies into hot oil with the garlic and chilli.', 'Add the tomatoes, olives and capers; simmer 15 minutes.', 'Toss with the cooked linguine and serve.']
  },
  {
    id: 'chicken-tikka-masala',
    name: 'Chicken Tikka Masala',
    tags: ['dinner', 'chicken'],
    minutes: 45,
    ingredients: ['600g chicken thighs, diced', '150g yoghurt', '2 tbsp garam masala', '1 onion', '3 garlic cloves', '400g tin chopped tomatoes', '100ml cream', 'Coriander'],
    steps: ['Marinate the chicken in yoghurt and half the spice for 20 minutes.', 'Brown the chicken in batches, then set aside.', 'Soften the onion and garlic, add the rest of the spice and the tomatoes.', 'Return the chicken, simmer 15 minutes, stir in cream and coriander.']
  },
  {
    id: 'thai-green-curry',
    name: 'Thai Green Curry with Tofu',
    tags: ['dinner', 'vegan'],
    minutes: 30,
    ingredients: ['400g firm tofu, cubed', '3 tbsp green curry paste', '400ml coconut milk', '150g green beans', '1 aubergine, diced', '1 tbsp soy sauce', 'Thai basil', 'Lime'],
    steps: ['Fry the tofu until golden on all sides and set aside.', 'Cook the paste in a little oil for a minute, then add the coconut milk.', 'Simmer the aubergine and beans until tender, 10 minutes.', 'Return the tofu, season with soy and lime, and finish with basil.']
  },
  {
    id: 'beef-chilli',
    name: 'Beef Chilli',
    tags: ['dinner', 'beef', 'batch-cook'],
    minutes: 60,
    ingredients: ['500g beef mince', '1 onion', '2 garlic cloves', '2 tbsp smoked paprika', '1 tbsp cumin', '400g tin kidney beans', '400g tin chopped tomatoes', '1 square dark chocolate'],
    steps: ['Brown the mince hard, then remove and soften the onion and garlic.', 'Return the mince with the spices and cook for 2 minutes.', 'Add the tomatoes and beans and simmer gently for 40 minutes.', 'Stir in the chocolate at the end and season generously.']
  },
  {
    id: 'roast-salmon',
    name: 'Roast Salmon with Lemon and Dill',
    tags: ['dinner', 'fish', 'quick'],
    minutes: 25,
    ingredients: ['2 salmon fillets', '1 lemon', 'Small bunch dill', '400g new potatoes', 'Olive oil', 'Salt'],
    steps: ['Boil the potatoes until tender.', 'Roast the salmon at 200C for 12 minutes with oil, salt and lemon slices.', 'Toss the potatoes with dill and lemon juice and serve alongside.']
  },
  {
    id: 'margherita-flatbread',
    name: 'Margherita Flatbread',
    tags: ['dinner', 'vegetarian', 'quick'],
    minutes: 20,
    ingredients: ['2 flatbreads', '150g passata', '1 ball mozzarella', 'Basil', 'Olive oil', 'Oregano'],
    steps: ['Heat the oven as high as it goes.', 'Spread passata over the flatbreads, season, and tear over the mozzarella.', 'Bake for 8 minutes until blistered, then add basil and oil.']
  },
  {
    id: 'lentil-shepherds-pie',
    name: 'Lentil Shepherds Pie',
    tags: ['dinner', 'vegan', 'batch-cook'],
    minutes: 55,
    ingredients: ['300g green lentils', '2 carrots, diced', '1 onion', '2 tbsp tomato puree', '1 tbsp soy sauce', '800g potatoes', 'Olive oil', 'Thyme'],
    steps: ['Simmer the lentils with the carrots, onion, puree, soy and thyme until thick, 25 minutes.', 'Boil and mash the potatoes with plenty of oil and salt.', 'Spread the mash over the lentils in a dish and rough up the top.', 'Bake at 200C for 20 minutes until crisp.']
  },
  {
    id: 'miso-ramen',
    name: 'Miso Ramen with Soft Egg',
    tags: ['dinner', 'vegetarian'],
    minutes: 30,
    ingredients: ['2 nests ramen noodles', '3 tbsp white miso', '1 litre vegetable stock', '2 eggs', '150g sweetcorn', '2 spring onions', 'Sesame oil', 'Nori'],
    steps: ['Boil the eggs for 7 minutes, then cool in cold water and peel.', 'Whisk the miso into the hot stock — do not let it boil hard.', 'Cook the noodles and divide between bowls, then pour over the broth.', 'Top with halved eggs, corn, spring onion, sesame oil and nori.']
  },
  {
    id: 'greek-salad-halloumi',
    name: 'Greek Salad with Halloumi',
    tags: ['lunch', 'vegetarian', 'salad', 'quick'],
    minutes: 15,
    ingredients: ['225g halloumi', '4 tomatoes', '1 cucumber', 'Half a red onion', '80g olives', 'Oregano', 'Olive oil', 'Red wine vinegar'],
    steps: ['Fry the halloumi slices until golden on both sides.', 'Chop the vegetables roughly and toss with olives, oil, vinegar and oregano.', 'Lay the warm halloumi over the top and eat straight away.']
  },
  {
    id: 'tomato-basil-soup',
    name: 'Tomato and Basil Soup',
    tags: ['lunch', 'vegan', 'soup'],
    minutes: 30,
    ingredients: ['800g tin chopped tomatoes', '1 onion', '2 garlic cloves', '1 tsp sugar', '500ml vegetable stock', 'Large bunch basil', 'Olive oil'],
    steps: ['Soften the onion and garlic in oil for 10 minutes without colouring.', 'Add the tomatoes, sugar and stock and simmer for 15 minutes.', 'Blend with most of the basil until silky, then season.', 'Serve with the remaining basil torn over.']
  },
  {
    id: 'turkey-club',
    name: 'Turkey Club Sandwich',
    tags: ['lunch', 'quick'],
    minutes: 10,
    ingredients: ['3 slices bread', '120g roast turkey', '2 rashers bacon', '1 tomato', 'Lettuce', 'Mayonnaise'],
    steps: ['Toast the bread and crisp the bacon.', 'Layer turkey, bacon, tomato and lettuce with mayonnaise across two tiers.', 'Press down, cut into quarters and pin with cocktail sticks.']
  },
  {
    id: 'quinoa-tabbouleh',
    name: 'Quinoa Tabbouleh Bowl',
    tags: ['lunch', 'vegan', 'salad'],
    minutes: 20,
    ingredients: ['150g quinoa', 'Large bunch parsley', 'Small bunch mint', '2 tomatoes', 'Half a cucumber', '1 lemon', 'Olive oil', 'Spring onions'],
    steps: ['Cook the quinoa, then spread out to cool.', 'Chop the herbs and vegetables finely.', 'Toss everything with plenty of lemon juice, oil and salt.']
  },
  {
    id: 'tuna-nicoise',
    name: 'Tuna Nicoise Salad',
    tags: ['lunch', 'fish', 'salad'],
    minutes: 20,
    ingredients: ['2 tins tuna', '300g new potatoes', '150g green beans', '2 eggs', '80g olives', 'Baby gem lettuce', 'Dijon mustard', 'Olive oil'],
    steps: ['Boil the potatoes, adding the beans for the last 3 minutes; boil the eggs for 8.', 'Whisk a dressing from mustard, oil and a little vinegar.', 'Arrange everything on a platter and spoon over the dressing.']
  },
  {
    id: 'sweet-potato-tacos',
    name: 'Sweet Potato and Black Bean Tacos',
    tags: ['lunch', 'vegan'],
    minutes: 25,
    ingredients: ['2 sweet potatoes, cubed', '400g tin black beans', '1 tsp smoked paprika', '1 tsp cumin', '8 corn tortillas', '1 lime', 'Red cabbage', 'Coriander'],
    steps: ['Roast the sweet potato with the spices and oil at 220C for 20 minutes.', 'Warm the beans through with a squeeze of lime.', 'Char the tortillas briefly, then fill with potato, beans and shredded cabbage.', 'Finish with coriander and more lime.']
  },
  {
    id: 'egg-fried-rice',
    name: 'Egg Fried Rice',
    tags: ['lunch', 'vegetarian', 'quick'],
    minutes: 15,
    ingredients: ['500g cooked cold rice', '3 eggs', '150g frozen peas', '3 spring onions', '2 tbsp soy sauce', '1 tsp sesame oil', 'Neutral oil'],
    steps: ['Scramble the eggs in a very hot wok and set aside.', 'Fry the rice hard for 4 minutes so it starts to crisp, then add the peas.', 'Return the egg, add soy, sesame oil and spring onions, and toss through.']
  },
  {
    id: 'minestrone',
    name: 'Minestrone',
    tags: ['lunch', 'vegetarian', 'soup', 'batch-cook'],
    minutes: 40,
    ingredients: ['1 onion', '2 carrots', '2 celery sticks', '400g tin cannellini beans', '400g tin chopped tomatoes', '100g small pasta', '1 litre vegetable stock', 'Parmesan rind', 'Basil'],
    steps: ['Sweat the onion, carrot and celery slowly in oil for 12 minutes.', 'Add the tomatoes, stock and parmesan rind and simmer 15 minutes.', 'Add the pasta and beans and cook until the pasta is done.', 'Season hard and serve with basil and grated parmesan.']
  }
];

const RECIPE_BY_ID = new Map(RECIPES.map(function (r) { return [r.id, r]; }));

// ---------------------------------------------------------------- constants

const STORAGE_KEY = 'p5:mealplanner';
const MEALS = ['Breakfast', 'Lunch', 'Dinner'];
const DAY_NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const KEEP_WEEKS = 4; // plan entries older than this are dropped on load

// ---------------------------------------------------------------- dates

function isoOf(date) {
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return date.getFullYear() + '-' + m + '-' + d;
}

function dateOf(iso) {
  const p = iso.split('-');
  return new Date(Number(p[0]), Number(p[1]) - 1, Number(p[2]));
}

// Monday of the week containing `date`. getDay() is 0 for Sunday, so shift by 6.
function mondayOf(date) {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
  return d;
}

function addDays(date, n) {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  d.setDate(d.getDate() + n);
  return d;
}

function weekDates(mondayIso) {
  const start = dateOf(mondayIso);
  return DAY_NAMES.map(function (_, i) { return addDays(start, i); });
}

const fmtDayMonth = new Intl.DateTimeFormat(undefined, { day: 'numeric', month: 'short' });
const fmtRangeMonth = new Intl.DateTimeFormat(undefined, { day: 'numeric', month: 'long' });

function weekRangeLabel(mondayIso) {
  const days = weekDates(mondayIso);
  const first = days[0];
  const last = days[6];
  const sameYear = first.getFullYear() === last.getFullYear();
  const tail = fmtRangeMonth.format(last) + (sameYear ? ' ' + last.getFullYear() : '');
  const head = sameYear && first.getMonth() === last.getMonth()
    ? String(first.getDate())
    : fmtRangeMonth.format(first) + (sameYear ? '' : ' ' + first.getFullYear());
  return head + ' – ' + tail;
}

function slotKey(iso, meal) { return iso + '|' + meal; }

// ---------------------------------------------------------------- state

const state = {
  view: 'week',
  weekStart: isoOf(mondayOf(new Date())),
  plan: {},
  bookmarks: [],
  search: '',
  tags: []
};

const ISO_RE = /^\d{4}-\d{2}-\d{2}$/;

function loadState() {
  let raw = null;
  try {
    raw = localStorage.getItem(STORAGE_KEY);
  } catch (err) {
    console.warn('localStorage unavailable, running without persistence.', err);
    return;
  }
  if (!raw) return;

  let saved;
  try {
    saved = JSON.parse(raw);
  } catch (err) {
    console.warn('Stored data was not valid JSON — starting fresh.', err);
    return;
  }
  if (!saved || typeof saved !== 'object') return;

  // Only accept entries that still make sense: a real date, a real meal, a recipe we still have.
  const cutoff = isoOf(addDays(dateOf(state.weekStart), -7 * KEEP_WEEKS));
  if (saved.plan && typeof saved.plan === 'object') {
    Object.keys(saved.plan).forEach(function (key) {
      const parts = String(key).split('|');
      const iso = parts[0];
      const meal = parts[1];
      const id = saved.plan[key];
      if (!ISO_RE.test(iso) || MEALS.indexOf(meal) === -1) return;
      if (!RECIPE_BY_ID.has(id) || iso < cutoff) return;
      state.plan[key] = id;
    });
  }
  if (Array.isArray(saved.bookmarks)) {
    state.bookmarks = saved.bookmarks.filter(function (id) { return RECIPE_BY_ID.has(id); });
  }
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      plan: state.plan,
      bookmarks: state.bookmarks
    }));
  } catch (err) {
    console.warn('Could not save — changes will be lost on refresh.', err);
    toast('Could not save your changes in this browser.');
  }
}

function isBookmarked(id) { return state.bookmarks.indexOf(id) !== -1; }

// ---------------------------------------------------------------- elements

const el = {
  navButtons: document.querySelectorAll('#nav .nav-btn'),
  views: {
    week: document.getElementById('view-week'),
    recipes: document.getElementById('view-recipes'),
    saved: document.getElementById('view-saved')
  },
  weekGrid: document.getElementById('week-grid'),
  weekRange: document.getElementById('week-range'),
  search: document.getElementById('search'),
  tagFilters: document.getElementById('tag-filters'),
  recipeGrid: document.getElementById('recipe-grid'),
  recipesEmpty: document.getElementById('recipes-empty'),
  recipesCount: document.getElementById('recipes-count'),
  savedGrid: document.getElementById('saved-grid'),
  savedEmpty: document.getElementById('saved-empty'),
  savedCount: document.getElementById('saved-count'),
  detail: document.getElementById('detail'),
  detailBody: document.getElementById('detail-body'),
  picker: document.getElementById('picker'),
  pickerRecipe: document.getElementById('picker-recipe'),
  pickerDay: document.getElementById('picker-day'),
  pickerMeals: document.getElementById('picker-meals'),
  pickerNote: document.getElementById('picker-note'),
  pickerConfirm: document.getElementById('picker-confirm'),
  toast: document.getElementById('toast')
};

// ---------------------------------------------------------------- helpers

function escapeHtml(text) {
  return String(text).replace(/[&<>"']/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
  });
}

let toastTimer = null;
function toast(message) {
  el.toast.textContent = message;
  el.toast.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(function () { el.toast.hidden = true; }, 2600);
}

function tagsHtml(tags) {
  return tags.map(function (t) { return '<span class="tag">' + escapeHtml(t) + '</span>'; }).join('');
}

// ---------------------------------------------------------------- rendering

function setView(view) {
  state.view = view;
  Object.keys(el.views).forEach(function (name) {
    el.views[name].hidden = name !== view;
  });
  el.navButtons.forEach(function (btn) {
    if (btn.dataset.view === view) btn.setAttribute('aria-current', 'page');
    else btn.removeAttribute('aria-current');
  });
  window.scrollTo(0, 0);
  render();
}

function render() {
  if (state.view === 'week') renderWeek();
  if (state.view === 'recipes') renderRecipes();
  if (state.view === 'saved') renderSaved();
}

function renderWeek() {
  const todayIso = isoOf(new Date());
  el.weekRange.textContent = weekRangeLabel(state.weekStart);

  el.weekGrid.innerHTML = weekDates(state.weekStart).map(function (date, i) {
    const iso = isoOf(date);
    const slots = MEALS.map(function (meal) {
      const id = state.plan[slotKey(iso, meal)];
      const recipe = id ? RECIPE_BY_ID.get(id) : null;
      const body = recipe
        ? '<div class="slot-filled">' +
            '<button type="button" class="slot-recipe" data-action="open-recipe" data-id="' + recipe.id + '">' +
              escapeHtml(recipe.name) +
              '<span class="slot-time">' + recipe.minutes + ' min</span>' +
            '</button>' +
            '<button type="button" class="icon-btn slot-clear" data-action="clear-slot" data-iso="' + iso + '" data-meal="' + meal + '" ' +
              'aria-label="Clear ' + meal + ' on ' + DAY_NAMES[i] + '" title="Clear">&times;</button>' +
          '</div>'
        : '<button type="button" class="slot-add" data-action="slot-add" data-iso="' + iso + '" data-meal="' + meal + '">+ Add</button>';
      return '<div class="slot"><p class="slot-label">' + meal + '</p>' + body + '</div>';
    }).join('');

    return '<article class="day' + (iso === todayIso ? ' is-today' : '') + '">' +
        '<div class="day-head">' +
          '<h2 class="day-name">' + DAY_NAMES[i].slice(0, 3) + '</h2>' +
          '<p class="day-date">' + escapeHtml(fmtDayMonth.format(date)) + '</p>' +
        '</div>' + slots +
      '</article>';
  }).join('');
}

function cardHtml(recipe) {
  const saved = isBookmarked(recipe.id);
  return '<article class="card">' +
      '<button type="button" class="card-open" data-action="open-recipe" data-id="' + recipe.id + '">' +
        '<div class="card-top">' +
          '<h2 class="card-name">' + escapeHtml(recipe.name) + '</h2>' +
          '<span class="card-time">' + recipe.minutes + ' min</span>' +
        '</div>' +
        '<div class="card-tags">' + tagsHtml(recipe.tags) + '</div>' +
      '</button>' +
      '<div class="card-actions">' +
        '<button type="button" class="btn btn-primary" data-action="add-to-week" data-id="' + recipe.id + '">Add to week</button>' +
        '<button type="button" class="icon-btn bookmark" data-action="bookmark" data-id="' + recipe.id + '" ' +
          'aria-pressed="' + saved + '" aria-label="' + (saved ? 'Remove ' : 'Save ') + escapeHtml(recipe.name) + '" ' +
          'title="' + (saved ? 'Remove from Saved' : 'Save') + '">' + (saved ? '&#9733;' : '&#9734;') + '</button>' +
      '</div>' +
    '</article>';
}

function matchingRecipes() {
  const q = state.search.trim().toLowerCase();
  return RECIPES.filter(function (r) {
    const tagsOk = state.tags.length === 0 || state.tags.some(function (t) { return r.tags.indexOf(t) !== -1; });
    if (!tagsOk) return false;
    if (!q) return true;
    return r.name.toLowerCase().indexOf(q) !== -1 ||
      r.tags.some(function (t) { return t.indexOf(q) !== -1; }) ||
      r.ingredients.some(function (ing) { return ing.toLowerCase().indexOf(q) !== -1; });
  });
}

function renderTagFilters() {
  const all = [];
  RECIPES.forEach(function (r) {
    r.tags.forEach(function (t) { if (all.indexOf(t) === -1) all.push(t); });
  });
  all.sort();
  el.tagFilters.innerHTML = all.map(function (t) {
    return '<button type="button" class="chip" data-action="tag" data-tag="' + t + '" ' +
      'aria-pressed="' + (state.tags.indexOf(t) !== -1) + '">' + escapeHtml(t) + '</button>';
  }).join('');
}

function renderRecipes() {
  const list = matchingRecipes();
  el.recipeGrid.innerHTML = list.map(cardHtml).join('');
  el.recipesEmpty.hidden = list.length > 0;
  el.recipesCount.textContent = list.length === RECIPES.length
    ? RECIPES.length + ' recipes'
    : list.length + ' of ' + RECIPES.length + ' recipes';
  el.tagFilters.querySelectorAll('.chip').forEach(function (chip) {
    chip.setAttribute('aria-pressed', String(state.tags.indexOf(chip.dataset.tag) !== -1));
  });
}

function renderSaved() {
  const list = state.bookmarks.map(function (id) { return RECIPE_BY_ID.get(id); }).filter(Boolean);
  el.savedGrid.innerHTML = list.map(cardHtml).join('');
  el.savedEmpty.hidden = list.length > 0;
  el.savedCount.textContent = list.length === 1 ? '1 recipe' : list.length + ' recipes';
}

// ---------------------------------------------------------------- detail dialog

function openDetail(id) {
  const recipe = RECIPE_BY_ID.get(id);
  if (!recipe) return;
  const saved = isBookmarked(id);

  el.detailBody.innerHTML =
    '<h2 class="sheet-title" id="detail-name">' + escapeHtml(recipe.name) + '</h2>' +
    '<div class="detail-meta">' + tagsHtml(recipe.tags) + '<span class="tag">' + recipe.minutes + ' min</span></div>' +
    '<div class="sheet-actions" style="margin-top:0">' +
      '<button type="button" class="btn btn-primary" data-action="add-to-week" data-id="' + recipe.id + '">Add to week</button>' +
      '<button type="button" class="btn btn-quiet" data-action="bookmark" data-id="' + recipe.id + '" aria-pressed="' + saved + '">' +
        (saved ? '&#9733; Saved' : '&#9734; Save') + '</button>' +
    '</div>' +
    '<div class="detail-block"><p class="detail-h">Ingredients</p><ul>' +
      recipe.ingredients.map(function (i) { return '<li>' + escapeHtml(i) + '</li>'; }).join('') +
    '</ul></div>' +
    '<div class="detail-block"><p class="detail-h">Method</p><ol>' +
      recipe.steps.map(function (s) { return '<li>' + escapeHtml(s) + '</li>'; }).join('') +
    '</ol></div>';

  el.detail.showModal();
}

// ---------------------------------------------------------------- add-to-week dialog

const picker = { id: null, iso: null, meal: 'Dinner' };

function openPicker(recipeId, iso, meal) {
  const recipe = RECIPE_BY_ID.get(recipeId);
  if (!recipe) return;
  picker.id = recipeId;
  picker.iso = iso || state.weekStart;
  picker.meal = meal || 'Dinner';

  el.pickerRecipe.textContent = recipe.name;
  el.pickerDay.innerHTML = weekDates(state.weekStart).map(function (date, i) {
    const dayIso = isoOf(date);
    return '<option value="' + dayIso + '"' + (dayIso === picker.iso ? ' selected' : '') + '>' +
      DAY_NAMES[i] + ' — ' + escapeHtml(fmtDayMonth.format(date)) + '</option>';
  }).join('');
  el.pickerMeals.innerHTML = MEALS.map(function (m) {
    return '<button type="button" class="chip" data-action="picker-meal" data-meal="' + m + '" ' +
      'aria-pressed="' + (m === picker.meal) + '">' + m + '</button>';
  }).join('');

  refreshPickerNote();
  el.picker.showModal();
}

function refreshPickerNote() {
  const existingId = state.plan[slotKey(picker.iso, picker.meal)];
  const existing = existingId ? RECIPE_BY_ID.get(existingId) : null;
  if (existing && existing.id !== picker.id) {
    el.pickerNote.textContent = 'That slot currently holds ' + existing.name + '. Adding will replace it.';
    el.pickerNote.hidden = false;
    el.pickerConfirm.textContent = 'Replace';
  } else {
    el.pickerNote.hidden = true;
    el.pickerConfirm.textContent = 'Add';
  }
}

function confirmPicker() {
  const recipe = RECIPE_BY_ID.get(picker.id);
  if (!recipe) return;
  state.plan[slotKey(picker.iso, picker.meal)] = picker.id;
  saveState();
  el.picker.close();
  const dayName = DAY_NAMES[(dateOf(picker.iso).getDay() + 6) % 7];
  toast(recipe.name + ' → ' + dayName + ' ' + picker.meal.toLowerCase());
  if (state.view === 'week') renderWeek();
}

// ---------------------------------------------------------------- events

document.addEventListener('click', function (event) {
  const target = event.target.closest('[data-action]');
  if (!target) return;
  const action = target.dataset.action;

  if (action === 'nav') {
    setView(target.dataset.view);
    return;
  }

  if (action === 'week-shift') {
    state.weekStart = isoOf(addDays(dateOf(state.weekStart), 7 * Number(target.dataset.delta)));
    renderWeek();
    return;
  }

  if (action === 'week-today') {
    state.weekStart = isoOf(mondayOf(new Date()));
    renderWeek();
    return;
  }

  if (action === 'open-recipe') {
    openDetail(target.dataset.id);
    return;
  }

  if (action === 'bookmark') {
    const id = target.dataset.id;
    const at = state.bookmarks.indexOf(id);
    if (at === -1) state.bookmarks.push(id);
    else state.bookmarks.splice(at, 1);
    saveState();
    // The same recipe can appear on a card and inside the open dialog — redraw both.
    render();
    if (el.detail.open) openDetail(id);
    return;
  }

  if (action === 'add-to-week') {
    openPicker(target.dataset.id, null, null);
    return;
  }

  if (action === 'slot-add') {
    // Nothing to add yet from an empty slot, so send them to the catalogue.
    setView('recipes');
    toast('Pick a recipe, then choose ' + target.dataset.meal.toLowerCase() + ' on that day.');
    return;
  }

  if (action === 'clear-slot') {
    delete state.plan[slotKey(target.dataset.iso, target.dataset.meal)];
    saveState();
    renderWeek();
    return;
  }

  if (action === 'picker-meal') {
    picker.meal = target.dataset.meal;
    el.pickerMeals.querySelectorAll('.chip').forEach(function (chip) {
      chip.setAttribute('aria-pressed', String(chip.dataset.meal === picker.meal));
    });
    refreshPickerNote();
    return;
  }

  if (action === 'picker-confirm') { confirmPicker(); return; }
  if (action === 'picker-cancel') { el.picker.close(); return; }
  if (action === 'tag') {
    const tag = target.dataset.tag;
    const at = state.tags.indexOf(tag);
    if (at === -1) state.tags.push(tag);
    else state.tags.splice(at, 1);
    renderRecipes();
    return;
  }
});

el.pickerDay.addEventListener('change', function () {
  picker.iso = el.pickerDay.value;
  refreshPickerNote();
});

el.search.addEventListener('input', function () {
  state.search = el.search.value;
  renderRecipes();
});

// Click on the backdrop (outside the panel) closes either dialog.
[el.detail, el.picker].forEach(function (dialog) {
  dialog.addEventListener('click', function (event) {
    if (event.target === dialog) dialog.close();
  });
});

// ---------------------------------------------------------------- start

loadState();
renderTagFilters();
setView('week');
