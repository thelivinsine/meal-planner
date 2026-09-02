/* Mise — weekly meal planner. Vanilla JS, no dependencies.
   Data model: RECIPES is the fixed catalogue. state.plan maps "YYYY-MM-DD|Meal" -> recipe id. */

// ---------------------------------------------------------------- catalogue

const RECIPES = [
  {
    id: 'overnight-oats',
    name: 'Overnight Oats with Berries',
    tags: ['balanced', 'breakfast', 'vegetarian', 'quick'],
    minutes: 10,
    ingredients: ['80g rolled oats', '200ml milk or oat milk', '3 tbsp yoghurt', '1 tbsp maple syrup', '150g mixed berries', 'Pinch of salt'],
    steps: ['Stir the oats, milk, yoghurt, syrup and salt together in a jar.', 'Cover and refrigerate overnight, or at least 4 hours.', 'Top with berries just before eating.']
  },
  {
    id: 'spinach-feta-omelette',
    name: 'Spinach and Feta Omelette',
    tags: ['high-protein', 'breakfast', 'vegetarian', 'quick'],
    minutes: 12,
    ingredients: ['3 eggs', '60g spinach', '40g feta', '1 tsp butter', 'Black pepper', 'Salt'],
    steps: ['Beat the eggs with a pinch of salt and plenty of pepper.', 'Wilt the spinach in the buttered pan, then pour in the eggs.', 'Scatter over the feta, fold once the base is set, and slide onto a plate.']
  },
  {
    id: 'banana-pb-smoothie',
    name: 'Banana Peanut Butter Smoothie',
    tags: ['balanced', 'breakfast', 'vegan', 'quick'],
    minutes: 5,
    ingredients: ['1 frozen banana', '1 tbsp peanut butter', '250ml oat milk', '1 tbsp oats', '1 tsp cocoa powder', 'Ice'],
    steps: ['Put everything in a blender.', 'Blend until completely smooth, about 45 seconds.', 'Pour into a tall glass and drink cold.']
  },
  {
    id: 'shakshuka',
    name: 'Shakshuka',
    tags: ['high-protein', 'breakfast', 'vegetarian'],
    minutes: 30,
    ingredients: ['1 onion, sliced', '1 red pepper, sliced', '2 garlic cloves', '400g tin chopped tomatoes', '1 tsp cumin', '1 tsp paprika', '4 eggs', 'Parsley'],
    steps: ['Soften the onion and pepper in oil for 8 minutes, then add the garlic and spices.', 'Pour in the tomatoes and simmer for 10 minutes until thick.', 'Make four wells, crack in the eggs, cover and cook until just set.', 'Scatter with parsley and serve with bread.']
  },
  {
    id: 'buttermilk-pancakes',
    name: 'Buttermilk Pancakes',
    tags: ['balanced', 'breakfast', 'vegetarian'],
    minutes: 25,
    ingredients: ['200g plain flour', '2 tsp baking powder', '1 tbsp sugar', '300ml buttermilk', '1 egg', '30g melted butter', 'Maple syrup'],
    steps: ['Whisk the dry ingredients in one bowl and the wet in another.', 'Fold together until just combined; lumps are fine.', 'Cook ladlefuls in a buttered pan until bubbles appear, then flip.', 'Stack and pour over maple syrup.']
  },
  {
    id: 'avocado-toast',
    name: 'Avocado Toast with Chilli',
    tags: ['balanced', 'breakfast', 'vegan', 'quick'],
    minutes: 10,
    ingredients: ['2 slices sourdough', '1 ripe avocado', 'Half a lemon', 'Chilli flakes', 'Olive oil', 'Flaky salt'],
    steps: ['Toast the sourdough well.', 'Mash the avocado with lemon juice and salt.', 'Spread thickly, then finish with olive oil and chilli flakes.']
  },
  {
    id: 'chickpea-curry',
    name: 'Chickpea Curry',
    tags: ['indian', 'high-protein', 'dinner', 'vegan'],
    minutes: 35,
    ingredients: ['2 tins chickpeas', '1 onion, diced', '3 garlic cloves', 'Thumb of ginger', '2 tbsp curry powder', '400ml coconut milk', '400g tin chopped tomatoes', 'Coriander'],
    steps: ['Fry the onion until golden, then add the garlic, ginger and curry powder.', 'Add the tomatoes and cook down for 5 minutes.', 'Stir in the chickpeas and coconut milk and simmer for 20 minutes.', 'Season well and finish with coriander. Serve with rice.']
  },
  {
    id: 'aglio-e-olio',
    name: 'Spaghetti Aglio e Olio',
    tags: ['balanced', 'dinner', 'vegetarian', 'pasta', 'quick'],
    minutes: 20,
    ingredients: ['320g spaghetti', '6 garlic cloves, thinly sliced', '80ml olive oil', '1 tsp chilli flakes', 'Parsley', 'Parmesan'],
    steps: ['Boil the spaghetti in well-salted water, reserving a mug of the water.', 'Gently colour the garlic in the oil with the chilli — do not let it brown.', 'Toss the drained pasta through with a splash of pasta water until glossy.', 'Add parsley and parmesan off the heat.']
  },
  {
    id: 'mushroom-pasta',
    name: 'Creamy Mushroom Pasta',
    tags: ['balanced', 'dinner', 'vegetarian', 'pasta'],
    minutes: 30,
    ingredients: ['320g tagliatelle', '400g mixed mushrooms', '2 garlic cloves', '150ml double cream', '30g parmesan', 'Thyme', 'Butter'],
    steps: ['Fry the mushrooms hard in butter until deeply browned, then add garlic and thyme.', 'Pour in the cream and let it bubble for 2 minutes.', 'Toss with the cooked pasta and a little pasta water.', 'Finish with parmesan and black pepper.']
  },
  {
    id: 'puttanesca',
    name: 'Pasta Puttanesca',
    tags: ['balanced', 'dinner', 'pasta'],
    minutes: 25,
    ingredients: ['320g linguine', '4 anchovy fillets', '2 garlic cloves', '400g tin chopped tomatoes', '80g black olives', '1 tbsp capers', 'Chilli flakes'],
    steps: ['Melt the anchovies into hot oil with the garlic and chilli.', 'Add the tomatoes, olives and capers; simmer 15 minutes.', 'Toss with the cooked linguine and serve.']
  },
  {
    id: 'chicken-tikka-masala',
    name: 'Chicken Tikka Masala',
    tags: ['indian', 'high-protein', 'dinner', 'chicken'],
    minutes: 45,
    ingredients: ['600g chicken thighs, diced', '150g yoghurt', '2 tbsp garam masala', '1 onion', '3 garlic cloves', '400g tin chopped tomatoes', '100ml cream', 'Coriander'],
    steps: ['Marinate the chicken in yoghurt and half the spice for 20 minutes.', 'Brown the chicken in batches, then set aside.', 'Soften the onion and garlic, add the rest of the spice and the tomatoes.', 'Return the chicken, simmer 15 minutes, stir in cream and coriander.']
  },
  {
    id: 'thai-green-curry',
    name: 'Thai Green Curry with Tofu',
    tags: ['high-protein', 'dinner', 'vegan'],
    minutes: 30,
    ingredients: ['400g firm tofu, cubed', '3 tbsp green curry paste', '400ml coconut milk', '150g green beans', '1 aubergine, diced', '1 tbsp soy sauce', 'Thai basil', 'Lime'],
    steps: ['Fry the tofu until golden on all sides and set aside.', 'Cook the paste in a little oil for a minute, then add the coconut milk.', 'Simmer the aubergine and beans until tender, 10 minutes.', 'Return the tofu, season with soy and lime, and finish with basil.']
  },
  {
    id: 'beef-chilli',
    name: 'Beef Chilli',
    tags: ['high-protein', 'dinner', 'beef', 'batch-cook'],
    minutes: 60,
    ingredients: ['500g beef mince', '1 onion', '2 garlic cloves', '2 tbsp smoked paprika', '1 tbsp cumin', '400g tin kidney beans', '400g tin chopped tomatoes', '1 square dark chocolate'],
    steps: ['Brown the mince hard, then remove and soften the onion and garlic.', 'Return the mince with the spices and cook for 2 minutes.', 'Add the tomatoes and beans and simmer gently for 40 minutes.', 'Stir in the chocolate at the end and season generously.']
  },
  {
    id: 'roast-salmon',
    name: 'Roast Salmon with Lemon and Dill',
    tags: ['high-protein', 'dinner', 'fish', 'quick'],
    minutes: 25,
    ingredients: ['2 salmon fillets', '1 lemon', 'Small bunch dill', '400g new potatoes', 'Olive oil', 'Salt'],
    steps: ['Boil the potatoes until tender.', 'Roast the salmon at 200C for 12 minutes with oil, salt and lemon slices.', 'Toss the potatoes with dill and lemon juice and serve alongside.']
  },
  {
    id: 'margherita-flatbread',
    name: 'Margherita Flatbread',
    tags: ['balanced', 'dinner', 'vegetarian', 'quick'],
    minutes: 20,
    ingredients: ['2 flatbreads', '150g passata', '1 ball mozzarella', 'Basil', 'Olive oil', 'Oregano'],
    steps: ['Heat the oven as high as it goes.', 'Spread passata over the flatbreads, season, and tear over the mozzarella.', 'Bake for 8 minutes until blistered, then add basil and oil.']
  },
  {
    id: 'lentil-shepherds-pie',
    name: 'Lentil Shepherds Pie',
    tags: ['high-protein', 'dinner', 'vegan', 'batch-cook'],
    minutes: 55,
    ingredients: ['300g green lentils', '2 carrots, diced', '1 onion', '2 tbsp tomato puree', '1 tbsp soy sauce', '800g potatoes', 'Olive oil', 'Thyme'],
    steps: ['Simmer the lentils with the carrots, onion, puree, soy and thyme until thick, 25 minutes.', 'Boil and mash the potatoes with plenty of oil and salt.', 'Spread the mash over the lentils in a dish and rough up the top.', 'Bake at 200C for 20 minutes until crisp.']
  },
  {
    id: 'miso-ramen',
    name: 'Miso Ramen with Soft Egg',
    tags: ['high-protein', 'dinner', 'vegetarian'],
    minutes: 30,
    ingredients: ['2 nests ramen noodles', '3 tbsp white miso', '1 litre vegetable stock', '2 eggs', '150g sweetcorn', '2 spring onions', 'Sesame oil', 'Nori'],
    steps: ['Boil the eggs for 7 minutes, then cool in cold water and peel.', 'Whisk the miso into the hot stock — do not let it boil hard.', 'Cook the noodles and divide between bowls, then pour over the broth.', 'Top with halved eggs, corn, spring onion, sesame oil and nori.']
  },
  {
    id: 'greek-salad-halloumi',
    name: 'Greek Salad with Halloumi',
    tags: ['high-protein', 'lunch', 'vegetarian', 'salad', 'quick'],
    minutes: 15,
    ingredients: ['225g halloumi', '4 tomatoes', '1 cucumber', 'Half a red onion', '80g olives', 'Oregano', 'Olive oil', 'Red wine vinegar'],
    steps: ['Fry the halloumi slices until golden on both sides.', 'Chop the vegetables roughly and toss with olives, oil, vinegar and oregano.', 'Lay the warm halloumi over the top and eat straight away.']
  },
  {
    id: 'tomato-basil-soup',
    name: 'Tomato and Basil Soup',
    tags: ['balanced', 'lunch', 'vegan', 'soup'],
    minutes: 30,
    ingredients: ['800g tin chopped tomatoes', '1 onion', '2 garlic cloves', '1 tsp sugar', '500ml vegetable stock', 'Large bunch basil', 'Olive oil'],
    steps: ['Soften the onion and garlic in oil for 10 minutes without colouring.', 'Add the tomatoes, sugar and stock and simmer for 15 minutes.', 'Blend with most of the basil until silky, then season.', 'Serve with the remaining basil torn over.']
  },
  {
    id: 'turkey-club',
    name: 'Turkey Club Sandwich',
    tags: ['high-protein', 'lunch', 'quick'],
    minutes: 10,
    ingredients: ['3 slices bread', '120g roast turkey', '2 rashers bacon', '1 tomato', 'Lettuce', 'Mayonnaise'],
    steps: ['Toast the bread and crisp the bacon.', 'Layer turkey, bacon, tomato and lettuce with mayonnaise across two tiers.', 'Press down, cut into quarters and pin with cocktail sticks.']
  },
  {
    id: 'quinoa-tabbouleh',
    name: 'Quinoa Tabbouleh Bowl',
    tags: ['balanced', 'lunch', 'vegan', 'salad'],
    minutes: 20,
    ingredients: ['150g quinoa', 'Large bunch parsley', 'Small bunch mint', '2 tomatoes', 'Half a cucumber', '1 lemon', 'Olive oil', 'Spring onions'],
    steps: ['Cook the quinoa, then spread out to cool.', 'Chop the herbs and vegetables finely.', 'Toss everything with plenty of lemon juice, oil and salt.']
  },
  {
    id: 'tuna-nicoise',
    name: 'Tuna Nicoise Salad',
    tags: ['high-protein', 'lunch', 'fish', 'salad'],
    minutes: 20,
    ingredients: ['2 tins tuna', '300g new potatoes', '150g green beans', '2 eggs', '80g olives', 'Baby gem lettuce', 'Dijon mustard', 'Olive oil'],
    steps: ['Boil the potatoes, adding the beans for the last 3 minutes; boil the eggs for 8.', 'Whisk a dressing from mustard, oil and a little vinegar.', 'Arrange everything on a platter and spoon over the dressing.']
  },
  {
    id: 'sweet-potato-tacos',
    name: 'Sweet Potato and Black Bean Tacos',
    tags: ['balanced', 'lunch', 'vegan'],
    minutes: 25,
    ingredients: ['2 sweet potatoes, cubed', '400g tin black beans', '1 tsp smoked paprika', '1 tsp cumin', '8 corn tortillas', '1 lime', 'Red cabbage', 'Coriander'],
    steps: ['Roast the sweet potato with the spices and oil at 220C for 20 minutes.', 'Warm the beans through with a squeeze of lime.', 'Char the tortillas briefly, then fill with potato, beans and shredded cabbage.', 'Finish with coriander and more lime.']
  },
  {
    id: 'egg-fried-rice',
    name: 'Egg Fried Rice',
    tags: ['high-protein', 'lunch', 'vegetarian', 'quick'],
    minutes: 15,
    ingredients: ['500g cooked cold rice', '3 eggs', '150g frozen peas', '3 spring onions', '2 tbsp soy sauce', '1 tsp sesame oil', 'Neutral oil'],
    steps: ['Scramble the eggs in a very hot wok and set aside.', 'Fry the rice hard for 4 minutes so it starts to crisp, then add the peas.', 'Return the egg, add soy, sesame oil and spring onions, and toss through.']
  },
  {
    id: 'minestrone',
    name: 'Minestrone',
    tags: ['balanced', 'lunch', 'vegetarian', 'soup', 'batch-cook'],
    minutes: 40,
    ingredients: ['1 onion', '2 carrots', '2 celery sticks', '400g tin cannellini beans', '400g tin chopped tomatoes', '100g small pasta', '1 litre vegetable stock', 'Parmesan rind', 'Basil'],
    steps: ['Sweat the onion, carrot and celery slowly in oil for 12 minutes.', 'Add the tomatoes, stock and parmesan rind and simmer 15 minutes.', 'Add the pasta and beans and cook until the pasta is done.', 'Season hard and serve with basil and grated parmesan.']
  },
  {
    id: 'paneer-bhurji',
    name: 'Paneer Bhurji with Roti',
    tags: ['indian', 'high-protein', 'breakfast', 'vegetarian', 'quick'],
    minutes: 20,
    ingredients: ['250g paneer, crumbled', '1 onion, finely chopped', '1 tomato, chopped', '1 green chilli', '1 tsp ginger, grated', '1/2 tsp turmeric', '1 tsp garam masala', '2 tbsp peas', 'Coriander', '2 wholewheat rotis'],
    steps: ['Fry the onion, chilli and ginger in a little oil until soft.', 'Add the tomato, turmeric and garam masala and cook until the tomato collapses.', 'Stir in the peas and the crumbled paneer and warm through for 3 minutes — do not overcook or it goes rubbery.', 'Finish with coriander and eat with hot rotis.']
  },
  {
    id: 'moong-dal-chilla',
    name: 'Moong Dal Chilla',
    tags: ['indian', 'high-protein', 'breakfast', 'vegan', 'quick'],
    minutes: 20,
    ingredients: ['150g split yellow moong dal, soaked 4 hours', '1 green chilli', '1 tsp ginger', '1/2 tsp cumin seeds', 'Handful of coriander', '1 small onion, chopped', 'Salt', 'Oil for the pan'],
    steps: ['Drain the dal and blend with the chilli, ginger and a splash of water into a pourable batter.', 'Stir in the cumin, onion, coriander and salt.', 'Ladle onto a hot oiled pan, spread thin, and cook 2 minutes a side until golden.', 'Serve with green chutney or plain yoghurt.']
  },
  {
    id: 'egg-bhurji-toast',
    name: 'Masala Egg Bhurji on Toast',
    tags: ['indian', 'high-protein', 'breakfast', 'quick'],
    minutes: 12,
    ingredients: ['4 eggs', '1 small onion, chopped', '1 tomato, chopped', '1 green chilli', '1/2 tsp turmeric', '1/2 tsp red chilli powder', '2 slices wholegrain bread', 'Coriander', 'Salt'],
    steps: ['Soften the onion and chilli in oil, then add the tomato and spices.', 'Beat the eggs with salt and pour in, stirring over a low heat until just set.', 'Pile onto toast and scatter with coriander.']
  },
  {
    id: 'protein-poha',
    name: 'Poha with Peanuts and Sprouts',
    tags: ['indian', 'high-protein', 'breakfast', 'vegan'],
    minutes: 20,
    ingredients: ['150g thick poha (flattened rice)', '100g mixed sprouts', '40g roasted peanuts', '1 onion, chopped', '1 tsp mustard seeds', '10 curry leaves', '1/2 tsp turmeric', '1 green chilli', 'Lemon', 'Coriander'],
    steps: ['Rinse the poha in a sieve until just soft, then leave to drain.', 'Pop the mustard seeds in oil with the curry leaves and chilli, then fry the onion.', 'Add the sprouts and turmeric and cook 4 minutes until the sprouts lose their rawness.', 'Fold in the poha and peanuts, warm through, and finish with lemon and coriander.']
  },
  {
    id: 'masala-dahi-bowl',
    name: 'Masala Yoghurt Bowl with Roasted Chana',
    tags: ['indian', 'high-protein', 'breakfast', 'vegetarian', 'quick'],
    minutes: 8,
    ingredients: ['300g thick Greek or hung yoghurt', '60g roasted chana (chickpeas)', '1/2 cucumber, diced', '1 tomato, diced', '1/2 tsp roasted cumin powder', 'Pinch of black salt', 'Mint', 'Chilli flakes'],
    steps: ['Whisk the yoghurt smooth with the cumin and black salt.', 'Stir through the cucumber and tomato.', 'Top with the roasted chana, mint and chilli flakes just before eating so the chana stays crunchy.']
  },
  {
    id: 'idli-protein-sambar',
    name: 'Idli with High-Protein Sambar',
    tags: ['indian', 'high-protein', 'breakfast', 'vegan'],
    minutes: 35,
    ingredients: ['6 idlis', '150g toor dal', '100g mixed sprouts', '1 tbsp sambar powder', '1 tomato', '1 carrot, diced', '1 tsp tamarind paste', '1 tsp mustard seeds', '10 curry leaves', 'Salt'],
    steps: ['Pressure cook the toor dal until soft and whisk it loose.', 'Simmer the tomato, carrot, sprouts, sambar powder and tamarind in water for 10 minutes.', 'Add the dal, season, and simmer 5 minutes more.', 'Temper mustard seeds and curry leaves in oil, pour over, and serve with the idlis.']
  },
  {
    id: 'keema-paratha',
    name: 'Chicken Keema Paratha',
    tags: ['indian', 'high-protein', 'breakfast', 'chicken'],
    minutes: 40,
    ingredients: ['300g chicken mince', '2 wholewheat paratha doughs', '1 onion, finely chopped', '1 tsp ginger-garlic paste', '1 tsp garam masala', '1/2 tsp red chilli powder', 'Coriander', 'Salt', 'Ghee for cooking'],
    steps: ['Fry the onion and ginger-garlic paste, then add the mince and spices.', 'Cook hard until the mince is dry and crumbly — wet filling tears the paratha.', 'Roll the dough, stuff with cooled keema, seal and roll out gently.', 'Cook on a hot tawa with a little ghee until brown in patches on both sides.']
  },
  {
    id: 'paneer-upma',
    name: 'Rava Upma with Paneer',
    tags: ['indian', 'high-protein', 'breakfast', 'vegetarian', 'quick'],
    minutes: 25,
    ingredients: ['150g coarse rava (semolina)', '200g paneer, cubed', '1 onion, chopped', '1 tsp mustard seeds', '1 tbsp urad dal', '10 curry leaves', '2 green chillies', '50g peas', '500ml hot water', 'Lemon'],
    steps: ['Dry roast the rava until it smells nutty, then set aside.', 'Temper mustard seeds, urad dal and curry leaves in oil; add the onion, chillies and peas.', 'Pour in the hot water, salt it, then rain in the rava while stirring to avoid lumps.', 'Fold in the paneer cubes off the heat, cover for 2 minutes, and finish with lemon.']
  },
  {
    id: 'rajma-brown-rice',
    name: 'Rajma with Brown Rice',
    tags: ['indian', 'high-protein', 'lunch', 'vegan', 'batch-cook'],
    minutes: 50,
    ingredients: ['300g cooked red kidney beans', '2 onions, blended', '3 tomatoes, blended', '1 tbsp ginger-garlic paste', '1 tsp cumin seeds', '1 tsp coriander powder', '1 tsp garam masala', '1/2 tsp turmeric', '200g brown rice', 'Coriander'],
    steps: ['Fry the cumin, then the onion paste, until it turns properly brown — this is where the flavour comes from.', 'Add the ginger-garlic paste and the tomato and cook until the oil separates.', 'Stir in the spices and the beans with a mug of water and simmer 20 minutes, mashing a few beans to thicken.', 'Serve over brown rice with coriander.']
  },
  {
    id: 'punjabi-chole',
    name: 'Punjabi Chole',
    tags: ['indian', 'high-protein', 'lunch', 'vegan', 'batch-cook'],
    minutes: 45,
    ingredients: ['400g cooked chickpeas', '2 onions, chopped', '2 tomatoes, blended', '1 tbsp ginger-garlic paste', '1 tbsp chole masala', '1 tsp amchur (dried mango powder)', '1 black tea bag', '1 green chilli', 'Coriander'],
    steps: ['Simmer the chickpeas with the tea bag for 10 minutes for the dark colour, then remove the bag.', 'Brown the onion well, add the ginger-garlic paste and tomato, and cook until thick.', 'Add the chole masala, amchur and chickpeas with their water and simmer 15 minutes.', 'Crush some chickpeas against the pan to thicken, then finish with chilli and coriander.']
  },
  {
    id: 'dal-tadka-protein',
    name: 'Toor and Masoor Dal Tadka',
    tags: ['indian', 'high-protein', 'lunch', 'vegan', 'batch-cook'],
    minutes: 35,
    ingredients: ['150g toor dal', '100g masoor dal', '1/2 tsp turmeric', '1 tomato, chopped', '1 tbsp ghee or oil', '1 tsp cumin seeds', '4 garlic cloves, sliced', '2 dried red chillies', '1 tsp red chilli powder', 'Coriander'],
    steps: ['Cook both dals with the turmeric, tomato and salt until completely soft, then whisk.', 'Heat the ghee and fry the cumin, garlic and dried chillies until the garlic is golden.', 'Kill the heat, stir in the chilli powder, and pour the tadka over the dal.', 'Serve with rice or roti and plenty of coriander.']
  },
  {
    id: 'paneer-tikka-salad',
    name: 'Paneer Tikka Salad',
    tags: ['indian', 'high-protein', 'lunch', 'vegetarian', 'salad'],
    minutes: 30,
    ingredients: ['250g paneer, cubed', '4 tbsp thick yoghurt', '1 tsp tandoori masala', '1/2 tsp turmeric', '1 tsp ginger-garlic paste', '1 pepper and 1 red onion, in chunks', '100g salad leaves', 'Lemon', 'Chaat masala'],
    steps: ['Mix the yoghurt with the spices and ginger-garlic paste, then coat the paneer, pepper and onion. Rest 15 minutes.', 'Grill or pan-sear on high heat until charred at the edges.', 'Pile onto the leaves, squeeze over lemon and dust with chaat masala.']
  },
  {
    id: 'sprouted-moong-chaat',
    name: 'Sprouted Moong Chaat',
    tags: ['indian', 'high-protein', 'lunch', 'vegan', 'salad', 'quick'],
    minutes: 15,
    ingredients: ['250g mixed sprouts', '100g boiled black chana', '1 onion, finely chopped', '1 tomato, chopped', '1 boiled potato, diced', '1 tsp chaat masala', '1/2 tsp roasted cumin powder', '2 tbsp green chutney', 'Lemon', 'Coriander'],
    steps: ['Steam the sprouts for 4 minutes so they are tender but still bite back.', 'Toss with the chana, onion, tomato and potato.', 'Add the chutney, spices, lemon and coriander and mix hard. Eat straight away while crisp.']
  },
  {
    id: 'egg-curry',
    name: 'Anda Curry',
    tags: ['indian', 'high-protein', 'lunch'],
    minutes: 35,
    ingredients: ['6 eggs, hard boiled', '2 onions, blended', '2 tomatoes, blended', '1 tbsp ginger-garlic paste', '1 tsp garam masala', '1 tsp coriander powder', '1/2 tsp turmeric', '1/2 tsp red chilli powder', 'Coriander'],
    steps: ['Halve the peeled eggs and sear them cut-side down in a little oil until lightly golden, then lift out.', 'Brown the onion paste well, add the ginger-garlic paste, then the tomato and spices.', 'Cook until the oil separates, add a mug of water and simmer 10 minutes.', 'Slide the eggs back in, warm through 3 minutes, and finish with coriander.']
  },
  {
    id: 'soya-keema-pav',
    name: 'Soya Keema Pav',
    tags: ['indian', 'high-protein', 'lunch', 'vegan'],
    minutes: 30,
    ingredients: ['150g soya granules', '1 onion, chopped', '2 tomatoes, chopped', '1 tbsp ginger-garlic paste', '1 tbsp pav bhaji masala', '50g peas', '4 pav buns', 'Lemon', 'Coriander'],
    steps: ['Soak the soya granules in hot water for 10 minutes, then squeeze them dry — this is what keeps them from going spongy.', 'Fry the onion and ginger-garlic paste, add the tomato and pav bhaji masala and cook down.', 'Stir in the soya and peas with a splash of water and cook 10 minutes.', 'Toast the pav and serve with lemon and coriander.']
  },
  {
    id: 'curd-rice-chana',
    name: 'Curd Rice with Roasted Chana',
    tags: ['indian', 'high-protein', 'lunch', 'vegetarian', 'quick'],
    minutes: 15,
    ingredients: ['200g cooked rice, cooled', '300g thick yoghurt', '60g roasted chana', '1 tsp mustard seeds', '1 tbsp urad dal', '10 curry leaves', '1 green chilli', '1 tsp ginger, grated', 'Pomegranate seeds'],
    steps: ['Mash the rice lightly into the yoghurt with salt and the ginger.', 'Temper mustard seeds, urad dal, curry leaves and chilli in oil and stir in.', 'Top with the roasted chana and pomegranate. Serve cool, not cold.']
  },
  {
    id: 'kerala-fish-curry',
    name: 'Kerala Fish Curry',
    tags: ['indian', 'high-protein', 'lunch', 'fish'],
    minutes: 30,
    ingredients: ['500g firm white fish, in chunks', '1 onion, sliced', '1 tsp ginger, julienned', '2 tsp Kashmiri chilli powder', '1/2 tsp turmeric', '1 tsp fenugreek seeds', '200ml thin coconut milk', '1 tsp tamarind paste', '10 curry leaves'],
    steps: ['Fry the fenugreek, curry leaves, onion and ginger in coconut oil until soft.', 'Add the chilli and turmeric with a splash of water so they cook without burning.', 'Pour in the coconut milk and tamarind and bring to a bare simmer.', 'Slide in the fish and cook 6 minutes without stirring, just shaking the pan.']
  },
  {
    id: 'palak-paneer',
    name: 'Palak Paneer',
    tags: ['indian', 'high-protein', 'dinner', 'vegetarian'],
    minutes: 35,
    ingredients: ['300g paneer, cubed', '400g spinach', '1 onion, chopped', '2 garlic cloves', '1 tsp ginger', '1 green chilli', '1 tsp cumin seeds', '1/2 tsp garam masala', '3 tbsp yoghurt', 'Salt'],
    steps: ['Blanch the spinach for 60 seconds, refresh in cold water, then blend — the cold water keeps it green.', 'Fry the cumin, onion, garlic, ginger and chilli until soft and pale gold.', 'Add the spinach puree and garam masala and cook 5 minutes only.', 'Stir in the yoghurt off the heat, then the paneer, and warm through gently.']
  },
  {
    id: 'lighter-butter-chicken',
    name: 'Lighter Butter Chicken',
    tags: ['indian', 'high-protein', 'dinner', 'chicken'],
    minutes: 45,
    ingredients: ['600g chicken thigh, diced', '4 tbsp thick yoghurt', '1 tbsp ginger-garlic paste', '2 tsp tandoori masala', '400g tin chopped tomatoes', '20g cashews', '1 tsp Kashmiri chilli powder', '1 tsp kasuri methi', '1 tbsp butter', '50ml milk'],
    steps: ['Marinate the chicken in the yoghurt, ginger-garlic paste and tandoori masala for 20 minutes.', 'Sear it hard in a dry hot pan until charred in places, then set aside.', 'Simmer the tomatoes with the cashews and chilli powder for 15 minutes, then blend smooth.', 'Return the chicken, add the butter, milk and crushed kasuri methi, and simmer 5 minutes. Cream is swapped for cashews and milk here, so the protein carries the dish.']
  },
  {
    id: 'chicken-chettinad',
    name: 'Chicken Chettinad',
    tags: ['indian', 'high-protein', 'dinner', 'chicken'],
    minutes: 50,
    ingredients: ['700g chicken on the bone', '1 tbsp coriander seeds', '1 tsp fennel seeds', '4 dried red chillies', '3 tbsp grated coconut', '2 onions, chopped', '1 tbsp ginger-garlic paste', '2 tomatoes', '10 curry leaves', '1/2 tsp turmeric'],
    steps: ['Dry roast the coriander, fennel, chillies and coconut until fragrant, then grind to a paste with water.', 'Fry the curry leaves and onion until deep brown, then the ginger-garlic paste.', 'Add the tomato and turmeric, cook down, then stir in the ground masala.', 'Add the chicken, coat well, add a little water and simmer covered for 25 minutes.']
  },
  {
    id: 'tandoori-chicken',
    name: 'Tandoori Chicken',
    tags: ['indian', 'high-protein', 'dinner', 'chicken'],
    minutes: 40,
    ingredients: ['800g chicken drumsticks and thighs, slashed', '200g thick yoghurt', '1 tbsp ginger-garlic paste', '2 tsp Kashmiri chilli powder', '1 tsp garam masala', '1 tsp roasted cumin powder', 'Juice of 1 lemon', '1 tbsp mustard oil', 'Chaat masala to finish'],
    steps: ['Rub the chicken with lemon, salt and half the chilli powder and rest 15 minutes.', 'Mix the yoghurt with the remaining spices and oil and coat the chicken thoroughly.', 'Roast at 220C for 25 minutes, turning once, until charred at the edges and cooked through.', 'Dust with chaat masala and squeeze over more lemon.']
  },
  {
    id: 'dal-makhani-protein',
    name: 'Dal Makhani',
    tags: ['indian', 'high-protein', 'dinner', 'vegetarian', 'batch-cook'],
    minutes: 60,
    ingredients: ['200g whole black urad dal, soaked overnight', '80g red kidney beans, soaked overnight', '1 tbsp ginger-garlic paste', '2 tomatoes, blended', '1 tsp Kashmiri chilli powder', '1 tsp garam masala', '1 tbsp butter', '100ml milk', '1 tsp kasuri methi'],
    steps: ['Pressure cook the dal and beans with salt until collapsing soft.', 'Fry the ginger-garlic paste, add the tomato and chilli powder, and cook until thick.', 'Add the cooked dal and simmer low for 25 minutes, mashing against the pan now and then.', 'Finish with butter, milk, garam masala and crushed kasuri methi. Milk replaces most of the cream, keeping the protein high.']
  },
  {
    id: 'kadai-paneer',
    name: 'Kadai Paneer',
    tags: ['indian', 'high-protein', 'dinner', 'vegetarian', 'quick'],
    minutes: 25,
    ingredients: ['300g paneer, in fingers', '1 tbsp coriander seeds', '3 dried red chillies', '1 onion, in petals', '1 green pepper, in strips', '2 tomatoes, chopped', '1 tsp ginger, julienned', '1/2 tsp garam masala', '2 tbsp yoghurt', 'Coriander'],
    steps: ['Crush the coriander seeds and dried chillies coarsely — that rough grind is the point of kadai.', 'Sear the onion and pepper on high heat so they stay crisp, then set aside.', 'Cook the tomato and ginger with the crushed masala until jammy, then loosen with the yoghurt.', 'Return the vegetables, add the paneer and garam masala, toss 2 minutes and finish with coriander.']
  },
  {
    id: 'tandoori-fish-tikka',
    name: 'Tandoori Fish Tikka',
    tags: ['indian', 'high-protein', 'dinner', 'fish', 'quick'],
    minutes: 25,
    ingredients: ['600g firm white fish, in large cubes', '4 tbsp hung yoghurt', '1 tbsp gram flour', '1 tsp ginger-garlic paste', '1 tsp Kashmiri chilli powder', '1/2 tsp turmeric', '1 tsp ajwain', 'Juice of 1 lemon', 'Chaat masala'],
    steps: ['Toast the gram flour in a dry pan for a minute, then mix with the yoghurt, spices and lemon.', 'Coat the fish and rest 15 minutes — no longer, or the lemon starts cooking it.', 'Grill at high heat for 8 minutes, turning once, until the edges char.', 'Dust with chaat masala and serve with onion rings.']
  },
  {
    id: 'soya-chunk-biryani',
    name: 'Soya Chunk Biryani',
    tags: ['indian', 'high-protein', 'dinner', 'vegan', 'batch-cook'],
    minutes: 55,
    ingredients: ['200g soya chunks', '300g basmati rice', '2 onions, sliced', '1 tbsp ginger-garlic paste', '4 tbsp coconut yoghurt', '1 tbsp biryani masala', '2 bay leaves, 4 cloves, 1 cinnamon stick', 'Mint and coriander', 'Pinch of saffron in warm water'],
    steps: ['Fry the onions slowly until crisp and brown, then lift half out for the top.', 'Add the ginger-garlic paste, biryani masala, yoghurt and soaked squeezed soya chunks and cook 10 minutes.', 'Boil the rice with the whole spices until 70 per cent done and drain.', 'Layer rice over the soya with mint, coriander, saffron water and the fried onions, cover tightly and steam 20 minutes on a low heat.']
  }
];

const RECIPE_BY_ID = new Map(RECIPES.map(function (r) { return [r.id, r]; }));

// ---------------------------------------------------------------- constants

const STORAGE_KEY = 'p5:mealplanner';
const MEALS = ['Breakfast', 'Lunch', 'Dinner'];
const DAY_NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

// Filter chips, grouped by what the tag actually tells you. Anything in the catalogue
// that isn't listed here still shows up, under "More" - so a new tag can't go missing.
const TAG_GROUPS = [
  { label: 'Macros', tags: ['high-protein', 'balanced'] },
  { label: 'Meal', tags: ['breakfast', 'lunch', 'dinner'] },
  { label: 'Diet', tags: ['vegetarian', 'vegan'] },
  { label: 'Cuisine & style', tags: ['indian', 'pasta', 'salad', 'soup', 'quick', 'batch-cook'] },
  { label: 'Main protein', tags: ['chicken', 'beef', 'fish'] }
];

// The groups as they are actually drawn: TAG_GROUPS in order with any tag no recipe
// carries dropped, plus a "More" group holding whatever TAG_GROUPS forgot. Resolved once,
// because three toolbars and the matcher all need the same answer — and the matcher needs
// the *grouping*, not just the tags: ticking two boxes in one group widens the list, one
// box in each narrows it.
const FILTER_GROUPS = (function () {
  const all = [];
  RECIPES.forEach(function (r) {
    r.tags.forEach(function (t) { if (all.indexOf(t) === -1) all.push(t); });
  });
  const named = [];
  const groups = TAG_GROUPS.map(function (g) {
    const tags = g.tags.filter(function (t) { named.push(t); return all.indexOf(t) !== -1; });
    return { label: g.label, tags: tags };
  }).filter(function (g) { return g.tags.length > 0; });
  const rest = all.filter(function (t) { return named.indexOf(t) === -1; }).sort();
  if (rest.length) groups.push({ label: 'More', tags: rest });
  return groups;
})();

// PARKED, along with the markup it filled — see the comment where .view-head used to be
// in index.html. Nothing reads these two now; they are kept whole because the greeting
// may come back and re-deriving it from the git log is worse than a dead constant.
//
// One of these was the Week heading. Picked once per load rather than per render, so it
// stays put while you are using the app and is a different line when you come back —
// which is the whole point of it: a fixed "Your week" is a label, this is a greeting.
// One line, no subtitle under it; the week bar below says which week it means.
const WEEK_GREETINGS = [
  'Let’s plan your week',
  'What’s cooking this week?',
  'Seven days, twenty-one meals',
  'Fill the week, one meal at a time',
  'Right then — what are we eating?',
  'Your week, sorted',
  'Time to fill the table',
  'A week’s worth of dinners awaits'
];
const WEEK_GREETING = WEEK_GREETINGS[Math.floor(Math.random() * WEEK_GREETINGS.length)];

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
function slotKey(iso, meal) { return iso + '|' + meal; }

// The app shows one day at a time at every width -- this is which one. Today when the
// week on screen contains it, Monday otherwise. Not persisted: it means nothing next session.
function defaultFocusDay(mondayIso) {
  const i = Math.round((dateOf(isoOf(new Date())) - dateOf(mondayIso)) / 86400000);
  return i >= 0 && i <= 6 ? i : 0;
}

// ---------------------------------------------------------------- state

const state = {
  view: 'week',
  weekStart: isoOf(mondayOf(new Date())),
  focusDay: defaultFocusDay(isoOf(mondayOf(new Date()))),
  plan: {},
  bookmarks: [],
  // Persisted alongside the plan. View, week, search and filters stay per-session on
  // purpose, but a theme the user picked and then lost on reload is just a bug — and so
  // is a layout they chose. 'tile' or 'list', shared by all three lists: it is a
  // preference about how a recipe card is drawn, not about any one view.
  theme: 'light',
  cardView: 'tile'
};

// Search text and ticked filters, one set per list. Deliberately not shared: a search
// typed on Recipes has nothing to do with what you are looking for in Saved, and the
// slot picker's set arrives pre-filled with the meal it was opened for. Per-session,
// like the view and the week — none of it is worth restoring next visit.
const surface = {
  recipes: { search: '', tags: [], filtersOpen: true },
  saved: { search: '', tags: [], filtersOpen: true },
  slot: { search: '', tags: [], filtersOpen: true }
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
  if (saved.theme === 'dark' || saved.theme === 'light') state.theme = saved.theme;
  if (saved.cardView === 'tile' || saved.cardView === 'list') state.cardView = saved.cardView;
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      plan: state.plan,
      bookmarks: state.bookmarks,
      theme: state.theme,
      cardView: state.cardView
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
  dayStrip: document.getElementById('day-strip'),
  weekGrid: document.getElementById('week-grid'),
  weekRange: document.getElementById('week-range'),
  dayTitle: document.getElementById('day-title'),
  glanceBody: document.getElementById('glance-body'),
  tipBody: document.getElementById('tip-body'),
  // One toolbar component, three places to put it. Keyed by the same names as `surface`.
  tools: {
    recipes: document.getElementById('tools-recipes'),
    saved: document.getElementById('tools-saved'),
    slot: document.getElementById('tools-slot')
  },
  recipeGrid: document.getElementById('recipe-grid'),
  recipesEmpty: document.getElementById('recipes-empty'),
  recipesCount: document.getElementById('recipes-count'),
  savedGrid: document.getElementById('saved-grid'),
  savedEmpty: document.getElementById('saved-empty'),
  savedCount: document.getElementById('saved-count'),
  detail: document.getElementById('detail'),
  detailTools: document.getElementById('detail-tools'),
  detailBody: document.getElementById('detail-body'),
  picker: document.getElementById('picker'),
  pickerRecipe: document.getElementById('picker-recipe'),
  pickerDays: document.getElementById('picker-days'),
  pickerMeals: document.getElementById('picker-meals'),
  pickerNote: document.getElementById('picker-note'),
  pickerConfirm: document.getElementById('picker-confirm'),
  page: document.querySelector('.page'),
  slotPicker: document.getElementById('slot-picker'),
  slotPickerTitle: document.getElementById('slot-picker-title'),
  slotPickerGrid: document.getElementById('slot-picker-grid'),
  slotPickerEmpty: document.getElementById('slot-picker-empty'),
  themeToggle: document.getElementById('theme-toggle'),
  themeColor: document.querySelector('meta[name="theme-color"]'),
  toast: document.getElementById('toast')
};

// ---------------------------------------------------------------- theme

// The inline script in <head> has already painted the stored theme, so this only has
// to keep the toggle's own labelling honest after a change.
function applyTheme() {
  document.documentElement.dataset.theme = state.theme;
  const dark = state.theme === 'dark';
  el.themeToggle.setAttribute('aria-pressed', String(dark));
  el.themeToggle.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
  // Browser chrome follows the page. Read --bg back off the element rather than keeping a
  // copy of the two hexes here: the tokens are the one place a colour is written, and a
  // third copy is a third thing to forget when the palette next moves.
  if (el.themeColor) {
    el.themeColor.content =
      getComputedStyle(document.documentElement).getPropertyValue('--bg').trim();
  }
}

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

// "Thu breakfast" - names a slot on a button without spelling out the whole date.
function slotLabel(iso, meal) {
  const date = dateOf(iso);
  return DAY_NAMES[(date.getDay() + 6) % 7].slice(0, 3) + ' ' + meal.toLowerCase();
}

// What a card shows, which is not everything a recipe carries. Three at most — a fourth
// row of tags outweighed the recipe's own name — and never `quick`, because the minutes
// beside the name already say so. Still filterable: this trims the display, not the tag.
// The detail sheet gets the full set; it has the room and you opened it to read.
const CARD_TAG_LIMIT = 3;
function cardTags(recipe) {
  return recipe.tags.filter(function (t) { return t !== 'quick'; }).slice(0, CARD_TAG_LIMIT);
}

function tagsHtml(tags) {
  return tags.map(function (t) { return '<span class="tag">' + escapeHtml(t) + '</span>'; }).join('');
}

// Inline SVG rather than the &#9733; / &times; glyphs the first build used: these take
// currentColor, scale with the button, and do not depend on a font shipping the
// character. Same 24px grid, same stroke weight, one visual family.
// The save control is a bookmark, and it is the *same path* as the Saved icon in the
// sidebar — one shape for one idea, so the button that saves a recipe and the view that
// holds it are visibly the same thing. It was a star, which said "rate this" rather than
// "keep this", and left the sidebar as the only bookmark in the app. Change one, change
// the other: the sidebar copy lives inline in `index.html`.
const BOOKMARK_PATH = 'M6.5 3.5h11a1 1 0 0 1 1 1v16l-6.5-4-6.5 4v-16a1 1 0 0 1 1-1z';
const ICON = {
  saveOn: '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">' +
    '<path d="' + BOOKMARK_PATH + '"></path></svg>',
  saveOff: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" ' +
    'stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<path d="' + BOOKMARK_PATH + '"></path></svg>',
  close: '<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" ' +
    'stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"></path></svg>',
  calendarPlus: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" ' +
    'stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<path d="M4 6.5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2V11H4z"></path>' +
    '<path d="M4 11v8.5a2 2 0 0 0 2 2h5M8 2.6v3.6M16 2.6v3.6"></path>' +
    '<path d="M17.5 14v6M14.5 17h6"></path></svg>'
};

// Time of day, drawn beside each meal name. Two suns and a moon: enough to read the
// day's shape without the words, which is the whole job.
const SUN = '<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" ' +
  'stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="3.9"></circle>' +
  '<path d="M12 3v2.2M12 18.8V21M3 12h2.2M18.8 12H21M5.6 5.6l1.6 1.6M16.8 16.8l1.6 1.6M18.4 5.6L16.8 7.2M7.2 16.8l-1.6 1.6"></path></svg>';
const MEAL_ICON = {
  Breakfast: SUN,
  Lunch: SUN,
  Dinner: '<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" ' +
    'stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<path d="M20 14.2A8.4 8.4 0 0 1 9.8 4a8.4 8.4 0 1 0 10.2 10.2z"></path></svg>'
};

// ---------------------------------------------------------------- rendering

function setView(view) {
  state.view = view;
  closeSlotPicker();
  closeDrops(document);
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

// The meta line under a recipe name: how long it takes, then what it is. The macro tag
// every recipe carries plus a diet tag when there is one - two facts, not all six.
function metaLine(recipe) {
  const parts = [recipe.minutes + ' min'];
  ['high-protein', 'balanced'].forEach(function (t) {
    if (recipe.tags.indexOf(t) !== -1) parts.push(t === 'high-protein' ? 'High protein' : 'Balanced');
  });
  ['vegan', 'vegetarian'].forEach(function (t) {
    if (parts.length < 3 && recipe.tags.indexOf(t) !== -1) parts.push(t === 'vegan' ? 'Vegan' : 'Vegetarian');
  });
  return parts.join(' · ');
}

// What is planned for one day, in meal order, with the gaps dropped.
function plannedOn(iso) {
  return MEALS.map(function (meal) { return RECIPE_BY_ID.get(state.plan[slotKey(iso, meal)]); })
    .filter(Boolean);
}

// Read off the one macro tag every recipe carries. Deliberately blunt: it is a nudge in
// a side panel, not nutrition advice.
function balanceOf(list) {
  const protein = list.filter(function (r) { return r.tags.indexOf('high-protein') !== -1; }).length;
  if (list.length === 0) return { text: 'Nothing planned yet', tone: 'quiet' };
  if (list.length === 1) return { text: 'One meal in', tone: 'quiet' };
  if (protein === 0) return { text: 'Light on protein', tone: 'warn' };
  if (protein === list.length) return { text: 'Protein-heavy', tone: 'warn' };
  return { text: 'Great balance', tone: 'good' };
}

// One tip, whichever fits the day first. Derived from the plan rather than picked at
// random, so it says something about the day you are actually looking at.
function tipFor(list) {
  const has = function (tag) { return list.some(function (r) { return r.tags.indexOf(tag) !== -1; }); };
  const minutes = list.reduce(function (n, r) { return n + r.minutes; }, 0);
  if (list.length === 0) return 'Nothing down for this day yet. Dinner is usually the one worth deciding first.';
  if (list.length < MEALS.length) return 'Still slots to fill. A ten-minute breakfast covers one without much thought.';
  if (!has('vegetarian') && !has('vegan')) return 'Every meal here is meat or fish. Swapping one for a vegetarian recipe evens the day out.';
  if (list.every(function (r) { return r.tags.indexOf('high-protein') !== -1; })) {
    return 'Protein in all three slots. A balanced recipe in one of them stops the day reading the same all through.';
  }
  if (minutes > 90) return 'Over an hour and a half at the stove today. A quick or batch-cook recipe in one slot buys the evening back.';
  return 'The day is full and balanced. Add a side of greens or a fresh salad to round it off.';
}

function renderWeek() {
  const todayIso = isoOf(new Date());
  const days = weekDates(state.weekStart);
  const focusDate = days[state.focusDay];
  const focusIso = isoOf(focusDate);

  // "Aug 31 - Sep 6", with a way back once you have paged away from the current week.
  // The arrows either side of it are static markup; only the label changes.
  const onThisWeek = state.weekStart === isoOf(mondayOf(new Date()));
  el.weekRange.innerHTML =
    '<span class="weekbar-dates">' + escapeHtml(fmtDayMonth.format(days[0])) + ' – ' +
      escapeHtml(fmtDayMonth.format(days[6])) + '</span>' +
    (onThisWeek ? '' : '<button type="button" class="btn btn-quiet btn-sm week-today" ' +
      'data-action="week-today">Today</button>');

  // Weekday over date, seven across: which day you are looking at, and which of the
  // others already have something in them.
  el.dayStrip.innerHTML = days.map(function (date, i) {
    const iso = isoOf(date);
    const planned = MEALS.some(function (meal) { return state.plan[slotKey(iso, meal)]; });
    return '<button type="button" class="day-chip' + (iso === todayIso ? ' is-today' : '') +
        (iso < todayIso ? ' is-past' : '') + (planned ? ' has-meals' : '') +
        '" data-action="week-day" data-i="' + i + '" aria-pressed="' + (i === state.focusDay) + '">' +
        '<span class="day-chip-name">' + DAY_NAMES[i].slice(0, 3) + '</span>' +
        '<span class="day-chip-date">' + date.getDate() + '</span>' +
        '<span class="sr-only">' + escapeHtml(fmtDayMonth.format(date)) +
          (iso === todayIso ? ', today' : '') + (planned ? ', has meals' : '') + '</span>' +
        (iso === todayIso ? '<span class="day-dot" aria-hidden="true"></span>' : '') +
      '</button>';
  }).join('');

  el.dayTitle.textContent = DAY_NAMES[state.focusDay] + ', ' + fmtDayMonth.format(focusDate);

  // One card per meal. No day card around them: the heading above already names the
  // day, and a card holding cards is the nesting this layout exists to avoid.
  // Only a class the CSS actually matches: a day gone by is quieter, and today needs
  // no marker here because the strip above already carries it.
  el.weekGrid.className = focusIso < todayIso ? 'meals is-past' : 'meals';
  el.weekGrid.innerHTML = MEALS.map(function (meal) {
    const id = state.plan[slotKey(focusIso, meal)];
    const recipe = id ? RECIPE_BY_ID.get(id) : null;
    const saved = recipe && isBookmarked(recipe.id);

    const head = '<div class="meal-head">' +
        '<span class="meal-icon" aria-hidden="true">' + MEAL_ICON[meal] + '</span>' +
        '<h3 class="meal-name">' + meal + '</h3>' +
        (recipe
          ? '<button type="button" class="icon-btn meal-clear" data-action="clear-slot" ' +
              'data-iso="' + focusIso + '" data-meal="' + meal + '" ' +
              'aria-label="Clear ' + meal.toLowerCase() + ' on ' + DAY_NAMES[state.focusDay] + '" ' +
              'title="Clear">' + ICON.close + '</button>'
          : '') +
      '</div>';

    const body = recipe
      ? '<div class="meal-row">' +
          '<button type="button" class="meal-open" data-action="open-recipe" data-id="' + recipe.id + '" ' +
            'data-iso="' + focusIso + '" data-meal="' + meal + '">' +
            '<span class="meal-recipe">' + escapeHtml(recipe.name) + '</span>' +
            '<span class="meal-meta">' + escapeHtml(metaLine(recipe)) + '</span>' +
          '</button>' +
          '<button type="button" class="icon-btn bookmark" data-action="bookmark" data-id="' + recipe.id + '" ' +
            'aria-pressed="' + saved + '" aria-label="' + (saved ? 'Remove ' : 'Save ') + escapeHtml(recipe.name) + '" ' +
            'title="' + (saved ? 'Remove from Saved' : 'Save') + '">' + (saved ? ICON.saveOn : ICON.saveOff) + '</button>' +
        '</div>'
      : '<button type="button" class="meal-add" data-action="slot-add" data-iso="' + focusIso + '" ' +
          'data-meal="' + meal + '">' +
          '<span class="meal-add-mark" aria-hidden="true">+</span>Add a ' + meal.toLowerCase() +
        '</button>';

    return '<article class="meal' + (recipe ? ' is-filled' : '') + '">' + head + body + '</article>';
  }).join('');

  renderGlance(focusIso);
}

// The right column: both panels are read-only summaries of the day on the left, so they
// are rebuilt with it rather than kept in step by hand.
function renderGlance(iso) {
  const list = plannedOn(iso);
  const minutes = list.reduce(function (n, r) { return n + r.minutes; }, 0);
  const balance = balanceOf(list);

  el.glanceBody.innerHTML =
    '<p class="glance-count">' + list.length + ' / ' + MEALS.length + ' meals planned</p>' +
    '<div class="glance-bar"><span style="width: ' + Math.round(list.length / MEALS.length * 100) + '%"></span></div>' +
    // "0 min" rather than an em dash: the dash read as a rendering fault, and zero is
    // the honest answer when nothing is planned.
    '<div class="glance-row"><p class="glance-label">Estimated time</p>' +
      '<p class="glance-value' + (minutes ? '' : ' is-quiet') + '">' + minutes + ' min</p></div>' +
    '<div class="glance-row"><p class="glance-label">Dietary balance</p>' +
      '<p class="glance-value is-' + balance.tone + '">' + escapeHtml(balance.text) + '</p></div>';

  el.tipBody.textContent = tipFor(list);
}

// One card for every list of recipes in the app. Pass a slot ({ iso, meal }) and its
// primary button fills that slot instead of opening the day-and-meal dialog; opening the
// recipe from it carries the slot along too, so reading first costs nothing.
function cardHtml(recipe, slot) {
  const saved = isBookmarked(recipe.id);
  const slotAttrs = slot ? ' data-iso="' + slot.iso + '" data-meal="' + slot.meal + '"' : '';
  const addBtn = slot
    ? '<button type="button" class="btn btn-primary" data-action="fill-slot" data-id="' + recipe.id + '"' +
        slotAttrs + '>Add to ' + escapeHtml(slotLabel(slot.iso, slot.meal)) + '</button>'
    : '<button type="button" class="btn btn-primary" data-action="add-to-week" data-id="' + recipe.id + '">Add to week</button>';

  return '<article class="card">' +
      '<button type="button" class="card-open" data-action="open-recipe" data-id="' + recipe.id + '"' + slotAttrs + '>' +
        '<div class="card-top">' +
          '<h2 class="card-name">' + escapeHtml(recipe.name) + '</h2>' +
          '<span class="card-time">' + recipe.minutes + ' min</span>' +
        '</div>' +
        '<div class="card-tags">' + tagsHtml(cardTags(recipe)) + '</div>' +
      '</button>' +
      '<div class="card-actions">' + addBtn +
        '<button type="button" class="icon-btn bookmark" data-action="bookmark" data-id="' + recipe.id + '" ' +
          'aria-pressed="' + saved + '" aria-label="' + (saved ? 'Remove ' : 'Save ') + escapeHtml(recipe.name) + '" ' +
          'title="' + (saved ? 'Remove from Saved' : 'Save') + '">' + (saved ? ICON.saveOn : ICON.saveOff) + '</button>' +
      '</div>' +
    '</article>';
}

// list: what to search through — the whole catalogue on Recipes, your bookmarks on Saved.
// search: free text. tags: OR *within* a filter group, AND *across* groups — "breakfast"
// and "vegan" together means a vegan breakfast, and two macro boxes means either macro.
// It used to be one flat OR over every ticked tag, which made the slot picker's meal
// preset meaningless the moment a second box was ticked: asking for a vegan breakfast
// returned every vegan dinner too.
function matchingRecipes(list, search, tags) {
  const q = search.trim().toLowerCase();
  const wanted = FILTER_GROUPS.map(function (g) {
    return g.tags.filter(function (t) { return tags.indexOf(t) !== -1; });
  }).filter(function (g) { return g.length > 0; });

  return list.filter(function (r) {
    const tagsOk = wanted.every(function (group) {
      return group.some(function (t) { return r.tags.indexOf(t) !== -1; });
    });
    if (!tagsOk) return false;
    if (!q) return true;
    return r.name.toLowerCase().indexOf(q) !== -1 ||
      r.tags.some(function (t) { return t.indexOf(q) !== -1; }) ||
      r.ingredients.some(function (ing) { return ing.toLowerCase().indexOf(q) !== -1; });
  });
}

// ---------------------------------------------------------------- tools row

// Search, layout and filters, in that order, on one row — and one component draws it for
// Recipes, Saved and the week's slot picker, the same way cardHtml() draws every card.
// Three copies of a filter row is three places for a new tag to go missing.
//
// Drawn once at startup and then left alone: syncTools() writes the ticked boxes, the
// badges and the pressed layout button in place. A redraw would close whichever dropdown
// was open and take the caret out of the search field on every keystroke.
const VIEW_MODES = [
  { mode: 'tile', label: 'Tile view',
    icon: '<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" ' +
      'stroke-width="1.9" stroke-linejoin="round" aria-hidden="true">' +
      '<rect x="3.6" y="3.6" width="7.4" height="7.4" rx="1.7"></rect>' +
      '<rect x="13" y="3.6" width="7.4" height="7.4" rx="1.7"></rect>' +
      '<rect x="3.6" y="13" width="7.4" height="7.4" rx="1.7"></rect>' +
      '<rect x="13" y="13" width="7.4" height="7.4" rx="1.7"></rect></svg>' },
  { mode: 'list', label: 'List view',
    icon: '<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" ' +
      'stroke-width="1.9" stroke-linejoin="round" aria-hidden="true">' +
      '<rect x="3.6" y="4.4" width="16.8" height="5.6" rx="1.7"></rect>' +
      '<rect x="3.6" y="14" width="16.8" height="5.6" rx="1.7"></rect></svg>' }
];

// A native <details>, not a hand-rolled menu: it opens on click and on Enter or Space,
// it is announced as a disclosure, and it costs no script at all. `name` makes the group
// mutually exclusive, so opening one closes the last. What it does not do is close on a
// click elsewhere or on Escape — those two are wired by hand in the events section.
function dropHtml(name, group) {
  return '<details class="filter-drop" name="filters-' + name + '">' +
      '<summary class="filter-summary">' + escapeHtml(group.label) +
        '<span class="filter-badge" hidden></span></summary>' +
      '<div class="filter-menu" role="group" aria-label="' + escapeHtml(group.label) + '">' +
        group.tags.map(function (t) {
          return '<label class="filter-opt">' +
            '<input type="checkbox" data-action="tag" data-surface="' + name + '" ' +
              'data-tag="' + t + '">' + escapeHtml(t) + '</label>';
        }).join('') +
      '</div>' +
    '</details>';
}

function toolsHtml(name) {
  return '<div class="tool-bar">' +
      '<div class="search">' +
        '<label class="sr-only" for="search-' + name + '">Search recipes</label>' +
        '<input type="search" class="tool-search" id="search-' + name + '" ' +
          'data-surface="' + name + '" placeholder="Search by name or ingredient…" ' +
          'autocomplete="off">' +
      '</div>' +
      '<div class="view-toggle" role="group" aria-label="Card layout">' +
        VIEW_MODES.map(function (v) {
          return '<button type="button" class="icon-btn" data-action="card-view" ' +
            'data-mode="' + v.mode + '" aria-pressed="false" ' +
            'aria-label="' + v.label + '" title="' + v.label + '">' + v.icon + '</button>';
        }).join('') +
      '</div>' +
      '<button type="button" class="btn btn-quiet filter-toggle" data-action="filters-toggle" ' +
        'data-surface="' + name + '" aria-expanded="true" aria-controls="filter-row-' + name + '">' +
        'Filters<span class="filter-badge" hidden></span></button>' +
    '</div>' +
    // One row of dropdowns rather than five stacks of chips: sixteen tags in the open
    // used a third of the screen before a single recipe. The Clear button is never
    // hidden, even with nothing ticked — hiding it the moment it did its job would
    // delete the control just pressed and drop focus to <body>.
    '<div class="filter-row" id="filter-row-' + name + '">' +
      FILTER_GROUPS.map(function (g) { return dropHtml(name, g); }).join('') +
      '<button type="button" class="btn btn-quiet btn-sm filter-clear" ' +
        'data-action="clear-tags" data-surface="' + name + '">Clear</button>' +
    '</div>';
}

function setBadge(node, count) {
  node.textContent = count;
  node.hidden = count === 0;
}

// Everything about the row that depends on state, written in place.
function syncTools(name) {
  const root = el.tools[name];
  const s = surface[name];

  const row = root.querySelector('.filter-row');
  const toggle = root.querySelector('.filter-toggle');
  row.hidden = !s.filtersOpen;
  toggle.setAttribute('aria-expanded', String(s.filtersOpen));
  setBadge(toggle.querySelector('.filter-badge'), s.tags.length);

  root.querySelectorAll('.filter-drop').forEach(function (drop) {
    let ticked = 0;
    drop.querySelectorAll('input[type="checkbox"]').forEach(function (box) {
      box.checked = s.tags.indexOf(box.dataset.tag) !== -1;
      if (box.checked) ticked++;
    });
    setBadge(drop.querySelector('.filter-badge'), ticked);
  });

  root.querySelectorAll('[data-action="card-view"]').forEach(function (btn) {
    btn.setAttribute('aria-pressed', String(btn.dataset.mode === state.cardView));
  });

  // Only when it disagrees: writing .value on every keystroke moves the caret to the end.
  const input = root.querySelector('.tool-search');
  if (input.value !== s.search) input.value = s.search;
}

// Which list a toolbar steers. Every branch that changes a search or a filter ends here.
function renderFor(name) {
  if (name === 'slot') renderSlotPicker();
  else if (name === 'saved') renderSaved();
  else renderRecipes();
}

// A dropdown left open where it can no longer be seen is a summary .focus() cannot reach
// and a menu that comes back already open. Shut them on the way out.
function closeDrops(root) {
  root.querySelectorAll('.filter-drop[open]').forEach(function (drop) { drop.open = false; });
}

function renderRecipes() {
  const list = matchingRecipes(RECIPES, surface.recipes.search, surface.recipes.tags);
  // not list.map(cardHtml): map would pass the index as cardHtml's slot argument.
  el.recipeGrid.innerHTML = list.map(function (r) { return cardHtml(r); }).join('');
  el.recipeGrid.classList.toggle('is-list', state.cardView === 'list');
  el.recipesEmpty.hidden = list.length > 0;
  el.recipesCount.textContent = list.length === RECIPES.length
    ? RECIPES.length + ' recipes'
    : list.length + ' of ' + RECIPES.length + ' recipes';
  syncTools('recipes');
}

function renderSaved() {
  const shelf = state.bookmarks.map(function (id) { return RECIPE_BY_ID.get(id); }).filter(Boolean);
  const list = matchingRecipes(shelf, surface.saved.search, surface.saved.tags);
  el.savedGrid.innerHTML = list.map(function (r) { return cardHtml(r); }).join('');
  el.savedGrid.classList.toggle('is-list', state.cardView === 'list');
  el.savedEmpty.hidden = list.length > 0;
  // An empty shelf and a shelf nothing matches are two different dead ends, and only one
  // of them is answered by clearing a filter.
  el.savedEmpty.textContent = shelf.length === 0
    ? 'Nothing saved yet. Tap the bookmark on any recipe to keep it here.'
    : 'None of your saved recipes match. Try clearing a filter.';
  el.savedCount.textContent = list.length === shelf.length
    ? (shelf.length === 1 ? '1 recipe' : shelf.length + ' recipes')
    : list.length + ' of ' + shelf.length + ' recipes';
  syncTools('saved');
}

// ---------------------------------------------------------------- detail dialog

// Set when the detail sheet is opened from a week slot, so its primary button can fill
// that slot instead of asking for a day and meal that are already known.
let detailSlot = null;

function openDetail(id, slot) {
  const recipe = RECIPE_BY_ID.get(id);
  if (!recipe) return;
  const saved = isBookmarked(id);
  detailSlot = slot || null;

  // Both actions sit beside the close button as icons. When a slot is already in play
  // the add button fills it directly rather than opening the day-and-meal dialog: the
  // day and the meal are known, and asking again is the one thing this app never does.
  const where = detailSlot ? slotLabel(detailSlot.iso, detailSlot.meal) : '';
  el.detailTools.innerHTML =
    (detailSlot
      ? '<button type="button" class="icon-btn" data-action="fill-slot" data-id="' + recipe.id + '" ' +
          'data-iso="' + detailSlot.iso + '" data-meal="' + detailSlot.meal + '" ' +
          'aria-label="Add ' + escapeHtml(recipe.name) + ' to ' + escapeHtml(where) + '" ' +
          'title="Add to ' + escapeHtml(where) + '">' + ICON.calendarPlus + '</button>'
      : '<button type="button" class="icon-btn" data-action="add-to-week" data-id="' + recipe.id + '" ' +
          'aria-label="Add ' + escapeHtml(recipe.name) + ' to the week" title="Add to week">' +
          ICON.calendarPlus + '</button>') +
    '<button type="button" class="icon-btn bookmark" data-action="bookmark" data-id="' + recipe.id + '" ' +
      'aria-pressed="' + saved + '" aria-label="' + (saved ? 'Remove ' : 'Save ') + escapeHtml(recipe.name) + '" ' +
      'title="' + (saved ? 'Remove from Saved' : 'Save') + '">' + (saved ? ICON.saveOn : ICON.saveOff) + '</button>';

  el.detailBody.innerHTML =
    '<h2 class="sheet-title" id="detail-name">' + escapeHtml(recipe.name) + '</h2>' +
    '<div class="detail-meta">' + tagsHtml(recipe.tags) + '<span class="tag">' + recipe.minutes + ' min</span></div>' +
    '<div class="detail-block"><p class="detail-h">Ingredients</p><ul>' +
      recipe.ingredients.map(function (i) { return '<li>' + escapeHtml(i) + '</li>'; }).join('') +
    '</ul></div>' +
    '<div class="detail-block"><p class="detail-h">Method</p><ol>' +
      recipe.steps.map(function (s) { return '<li>' + escapeHtml(s) + '</li>'; }).join('') +
    '</ol></div>';

  el.detail.showModal();
}

// ------------------------------------------------- inline slot picker (week view)
// Opened from a slot's "+ Add": the day and meal are already chosen, so all that's
// left is picking a recipe. One tap fills the slot and the panel closes again.
//
// It takes the *day's* place rather than sitting under it: the day title and the three
// meal cards are hidden while it is open, and the week bar, the sidebar and the summary
// column all stay exactly where they were. Nothing below the fold, so nothing to scroll
// past to reach a recipe.

// ponytail: only empty slots offer "+ Add", so the heading is always "Choose". Replacing
// in place would need a swap button on filled slots — clear then add covers it for now.
const slotPick = { iso: null, meal: null, opener: null };

function openSlotPicker(iso, meal, opener) {
  slotPick.iso = iso;
  slotPick.meal = meal;
  slotPick.opener = opener;
  // The slot already knows which meal it is, so the list starts as the recipes for that
  // meal rather than all fifty — every recipe carries exactly one of the three tags. It
  // is a ticked box in the Meal group, not a hidden rule: the filter row opens with it
  // showing, so it explains the short list and can be turned off for a breakfast at
  // dinner. Reset on every open; last time's search is not this time's question.
  surface.slot.search = '';
  surface.slot.tags = [meal.toLowerCase()];
  surface.slot.filtersOpen = true;
  closeDrops(el.slotPicker);

  const date = dateOf(iso);
  const dayName = DAY_NAMES[(date.getDay() + 6) % 7].slice(0, 3);
  el.slotPickerTitle.textContent = 'Choose ' + meal.toLowerCase() +
    ' — ' + dayName + ' ' + fmtDayMonth.format(date);

  renderSlotPicker();
  // The day goes, the picker arrives in its place. `hidden` rather than a class: it is
  // the same swap the three views use, and it takes the meal cards' buttons out of the
  // tab order along with them, which is what "replaced" has to mean for a keyboard.
  el.dayTitle.hidden = true;
  el.weekGrid.hidden = true;
  el.slotPicker.hidden = false;
  // Back to the top, so the greeting and the week bar are what sits above the picker —
  // then measure from there. Both have to happen in this order or the height is taken
  // from wherever the page happened to be scrolled to.
  window.scrollTo(0, 0);
  sizeSlotPicker();
  // Focus the panel, not the search box. Typing is one way to use this and scanning the
  // cards is the other, so opening it with a caret blinking in a field picks the wrong
  // one — and on a phone it throws the keyboard up over the recipes. It still has to go
  // *somewhere*: the "+ Add" that was pressed has just been hidden along with the day,
  // and focus left on a hidden element drops to <body>. The panel is the thing that
  // replaced it, and from here Tab reaches the back link, then the search, then the
  // cards, in the order they are read.
  el.slotPicker.focus();
}

// The picker stops at the bottom of the screen instead of running the page on: its
// max-height is the gap between where it starts and the floor, and .pick-grid scrolls
// inside whatever that leaves. Measured rather than a vh figure, because what sits above
// it (a greeting that wraps, a week bar with a "Today" button) is not a fixed height.
// ponytail: the 260px floor gives up and lets the page scroll rather than draw a sliver
// of a card — a phone in landscape has nowhere near enough room. Raise it if that shows.
function sizeSlotPicker() {
  if (!slotPick.iso) return;
  // The floor is the page's own bottom padding, not the bottom of the window. That
  // padding sits *below* the picker and counts towards the document height, so
  // measuring to the window left the page 24px too tall at wide widths and about 50px
  // too tall at narrow ones — a scrollbar for nothing, which is the whole thing this
  // panel exists to avoid. It is also exactly the space reserved to clear the nav pill
  // under 1000px, so one measurement covers both layouts.
  const pad = parseFloat(getComputedStyle(el.page).paddingBottom) || 0;
  const room = window.innerHeight - pad - el.slotPicker.getBoundingClientRect().top;
  el.slotPicker.style.maxHeight = Math.max(260, room) + 'px';
  // Then ask the page whether it worked, rather than trusting the arithmetic. Sub-pixel
  // rounding left it 2px long at every width — invisible, and still a scrollbar, which
  // is the one thing this is for. Measuring the overshoot fixes it without a magic
  // number to keep in step with the CSS.
  const over = document.documentElement.scrollHeight - window.innerHeight;
  if (over > 0) el.slotPicker.style.maxHeight = Math.max(260, room - over) + 'px';
}

function closeSlotPicker() {
  if (!slotPick.iso) return;          // already shut, and nothing here is idempotent
  const opener = slotPick.opener;
  slotPick.iso = null;
  slotPick.opener = null;
  el.slotPicker.hidden = true;
  el.slotPicker.style.maxHeight = '';
  closeDrops(el.slotPicker);
  el.dayTitle.hidden = false;
  el.weekGrid.hidden = false;
  // Focus was inside the panel we just hid, so hand it back: to the slot that opened the
  // picker if it's still there, otherwise to the week itself. Both targets are visible
  // again by now — focusing a hidden element does nothing at all.
  if (!el.slotPicker.contains(document.activeElement) && document.activeElement !== document.body) return;
  if (opener && opener.isConnected) opener.focus();
  else el.weekGrid.focus();
}

function renderSlotPicker() {
  if (!slotPick.iso) return;   // nothing to fill, so nothing to draw
  const list = matchingRecipes(RECIPES, surface.slot.search, surface.slot.tags);
  const slot = { iso: slotPick.iso, meal: slotPick.meal };
  el.slotPickerGrid.innerHTML = list.map(function (r) {
    return cardHtml(r, slot);
  }).join('');
  el.slotPickerGrid.classList.toggle('is-list', state.cardView === 'list');
  el.slotPickerEmpty.hidden = list.length > 0;
  syncTools('slot');
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
  renderPickerDays();
  el.pickerMeals.innerHTML = MEALS.map(function (m) {
    return '<button type="button" class="chip" data-action="picker-meal" data-meal="' + m + '" ' +
      'aria-pressed="' + (m === picker.meal) + '">' + m + '</button>';
  }).join('');

  refreshPickerNote();
  el.picker.showModal();
}

function renderPickerDays() {
  const todayIso = isoOf(new Date());
  el.pickerDays.innerHTML = weekDates(state.weekStart).map(function (date, i) {
    const dayIso = isoOf(date);
    const past = dayIso < todayIso;
    return '<button type="button" class="chip day-chip' + (past ? ' is-past' : '') + '" ' +
        'data-action="picker-day" data-iso="' + dayIso + '" aria-pressed="' + (dayIso === picker.iso) + '">' +
        '<span class="day-chip-name">' + DAY_NAMES[i].slice(0, 3) + '</span>' +
        '<span class="day-chip-date">' + escapeHtml(fmtDayMonth.format(date)) + '</span>' +
      '</button>';
  }).join('');
}

function refreshPickerNote() {
  const existingId = state.plan[slotKey(picker.iso, picker.meal)];
  const existing = existingId ? RECIPE_BY_ID.get(existingId) : null;
  const notes = [];

  if (picker.iso < isoOf(new Date())) notes.push('That day has already passed.');
  if (existing && existing.id !== picker.id) {
    notes.push('That slot currently holds ' + existing.name + '. Adding will replace it.');
    el.pickerConfirm.textContent = 'Replace';
  } else {
    el.pickerConfirm.textContent = 'Add';
  }

  el.pickerNote.textContent = notes.join(' ');
  el.pickerNote.hidden = notes.length === 0;
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
  // The one thing a native <details> will not do: shut when you click past it. Before
  // any action, so a click on another dropdown's summary still opens that one.
  document.querySelectorAll('.filter-drop[open]').forEach(function (drop) {
    if (!drop.contains(event.target)) drop.open = false;
  });

  const target = event.target.closest('[data-action]');
  if (!target) return;
  const action = target.dataset.action;

  if (action === 'nav') {
    setView(target.dataset.view);
    return;
  }

  if (action === 'week-shift') {
    state.weekStart = isoOf(addDays(dateOf(state.weekStart), 7 * Number(target.dataset.delta)));
    state.focusDay = defaultFocusDay(state.weekStart);
    closeSlotPicker();
    renderWeek();
    return;
  }

  if (action === 'week-today') {
    state.weekStart = isoOf(mondayOf(new Date()));
    state.focusDay = defaultFocusDay(state.weekStart);
    closeSlotPicker();
    renderWeek();
    // This button only exists while you are off the current week, so pressing it deletes
    // it — focus would drop to <body>. The week's arrows need no such handling: they are
    // static markup and survive the redraw. Focus goes where the button was taking you.
    const again = el.dayStrip.querySelector('[data-i="' + state.focusDay + '"]');
    if (again) again.focus();
    return;
  }

  if (action === 'week-day') {
    state.focusDay = Number(target.dataset.i);
    closeSlotPicker();
    renderWeek();
    // renderWeek() rebuilt the strip, destroying the chip that was just pressed and
    // dropping focus to <body> — the same move closeSlotPicker() already makes. The
    // strip is on screen at every width now, so its replacement chip is where focus goes.
    const again = el.dayStrip.querySelector('[data-i="' + state.focusDay + '"]');
    if (again) again.focus();
    return;
  }

  if (action === 'theme') {
    state.theme = state.theme === 'dark' ? 'light' : 'dark';
    applyTheme();
    saveState();
    return;
  }

  if (action === 'open-recipe') {
    const iso = target.dataset.iso;
    openDetail(target.dataset.id, iso ? { iso: iso, meal: target.dataset.meal } : null);
    return;
  }

  if (action === 'bookmark') {
    const id = target.dataset.id;
    const at = state.bookmarks.indexOf(id);
    if (at === -1) state.bookmarks.push(id);
    else state.bookmarks.splice(at, 1);
    saveState();
    // The same recipe can appear on a card, in a week meal row, in the open picker and
    // inside the open dialog — redraw all of them.
    render();
    if (!el.slotPicker.hidden) renderSlotPicker();
    if (el.detail.open) openDetail(id, detailSlot);
    // Every one of those redraws replaced the button that was just pressed, dropping
    // focus to <body>. Put it back on the replacement, searching whatever is actually
    // on screen: the open dialog first, then the open picker, then the view. The picker
    // has to come before the view, because the day it replaced is still in the DOM with
    // its own bookmark buttons — hidden ones, and .focus() on a hidden element does
    // nothing at all. Bookmark a recipe from the picker while the same recipe is
    // planned in another meal that day and the hidden copy is the one found first.
    const scope = el.detail.open ? el.detail
      : !el.slotPicker.hidden ? el.slotPicker
      : document.querySelector('.view:not([hidden])');
    const again = scope && scope.querySelector('[data-action="bookmark"][data-id="' + id + '"]');
    if (again) again.focus();
    return;
  }

  if (action === 'add-to-week') {
    openPicker(target.dataset.id, null, null);
    return;
  }

  if (action === 'slot-add') {
    openSlotPicker(target.dataset.iso, target.dataset.meal, target);
    return;
  }

  if (action === 'fill-slot') {
    const recipe = RECIPE_BY_ID.get(target.dataset.id);
    const iso = target.dataset.iso;
    const meal = target.dataset.meal;
    if (!recipe || !iso || MEALS.indexOf(meal) === -1) return;
    state.plan[slotKey(iso, meal)] = recipe.id;
    saveState();
    el.detail.close();
    renderWeek();
    closeSlotPicker();
    toast(recipe.name + ' \u2192 ' + DAY_NAMES[(dateOf(iso).getDay() + 6) % 7] + ' ' + meal.toLowerCase());
    return;
  }

  if (action === 'slot-picker-close') { closeSlotPicker(); return; }

  if (action === 'clear-slot') {
    const meal = target.dataset.meal;
    delete state.plan[slotKey(target.dataset.iso, meal)];
    saveState();
    renderWeek();
    // The meal row that held this button is now an empty one, so focus goes to what
    // replaced it: the Add button for the same meal.
    const again = el.weekGrid.querySelector('[data-action="slot-add"][data-meal="' + meal + '"]');
    if (again) again.focus();
    return;
  }

  if (action === 'picker-day') {
    picker.iso = target.dataset.iso;
    el.pickerDays.querySelectorAll('.day-chip').forEach(function (chip) {
      chip.setAttribute('aria-pressed', String(chip.dataset.iso === picker.iso));
    });
    refreshPickerNote();
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
  // A checkbox, so the click that lands here is the one the browser fires on the input
  // itself — clicking the label's text or pressing Space both arrive the same way. The
  // toolbar is not redrawn, so the box keeps focus and the open menu stays open.
  if (action === 'tag') {
    const picked = surface[target.dataset.surface];
    const tag = target.dataset.tag;
    const at = picked.tags.indexOf(tag);
    if (at === -1) picked.tags.push(tag);
    else picked.tags.splice(at, 1);
    renderFor(target.dataset.surface);
    return;
  }

  if (action === 'clear-tags') {
    surface[target.dataset.surface].tags = [];
    renderFor(target.dataset.surface);
    return;
  }

  if (action === 'filters-toggle') {
    const owner = surface[target.dataset.surface];
    owner.filtersOpen = !owner.filtersOpen;
    if (!owner.filtersOpen) closeDrops(el.tools[target.dataset.surface]);
    syncTools(target.dataset.surface);
    return;
  }

  // One preference, all three lists — and the buttons themselves are never redrawn, so
  // the one just pressed keeps focus.
  if (action === 'card-view') {
    state.cardView = target.dataset.mode;
    saveState();
    render();
    if (!el.slotPicker.hidden) renderSlotPicker();
    return;
  }
});

// One listener for all three search fields: the toolbars are drawn by app.js, so there
// is nothing to bind to at load time and nothing to rebind if one is ever redrawn.
document.addEventListener('input', function (event) {
  const input = event.target.closest('.tool-search');
  if (!input) return;
  surface[input.dataset.surface].search = input.value;
  renderFor(input.dataset.surface);
});

// A rotated phone or a dragged window changes the room the picker was measured against.
// No-op unless it is open.
window.addEventListener('resize', sizeSlotPicker);

// Escape closes the inline picker, matching what it does in the dialogs — but an open
// filter dropdown gets it first, or picking a filter inside the picker and pressing
// Escape would take the whole panel down with the menu. Nothing can be open behind a
// hidden view: setView() and closeSlotPicker() shut them, so the summary this focuses
// is always on screen.
document.addEventListener('keydown', function (event) {
  if (event.key !== 'Escape') return;
  if (el.detail.open || el.picker.open) return;  // that Escape belongs to the dialog
  const drop = document.querySelector('.filter-drop[open]');
  if (drop) {
    drop.open = false;
    drop.querySelector('summary').focus();
    return;
  }
  if (el.slotPicker.hidden) return;
  closeSlotPicker();
});

el.detail.addEventListener('close', function () { detailSlot = null; });

// Click on the backdrop (outside the panel) closes either dialog.
[el.detail, el.picker].forEach(function (dialog) {
  dialog.addEventListener('click', function (event) {
    if (event.target === dialog) dialog.close();
  });
});

// ---------------------------------------------------------------- start

loadState();
applyTheme();
Object.keys(el.tools).forEach(function (name) {
  el.tools[name].innerHTML = toolsHtml(name);
});
setView('week');
