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
  pickerDays: document.getElementById('picker-days'),
  pickerMeals: document.getElementById('picker-meals'),
  pickerNote: document.getElementById('picker-note'),
  pickerConfirm: document.getElementById('picker-confirm'),
  slotPicker: document.getElementById('slot-picker'),
  slotPickerTitle: document.getElementById('slot-picker-title'),
  slotPickerGrid: document.getElementById('slot-picker-grid'),
  slotPickerEmpty: document.getElementById('slot-picker-empty'),
  slotSearch: document.getElementById('slot-search'),
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
  closeSlotPicker();
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
    const when = iso === todayIso ? 'is-today' : (iso < todayIso ? 'is-past' : 'is-upcoming');
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

    return '<article class="day ' + when + '">' +
        '<div class="day-head">' +
          '<h2 class="day-name">' + DAY_NAMES[i].slice(0, 3) +
            (iso === todayIso ? ' <span class="day-flag">Today</span>' : '') + '</h2>' +
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

// search: free text; tags: array of tags to require any of (empty = all recipes).
function matchingRecipes(search, tags) {
  const q = search.trim().toLowerCase();
  return RECIPES.filter(function (r) {
    const tagsOk = tags.length === 0 || tags.some(function (t) { return r.tags.indexOf(t) !== -1; });
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
  const list = matchingRecipes(state.search, state.tags);
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

// ------------------------------------------------- inline slot picker (week view)
// Opened from a slot's "+ Add": the day and meal are already chosen, so all that's
// left is picking a recipe. One tap fills the slot and the panel closes again.

const slotPick = { iso: null, meal: null, search: '' };

function openSlotPicker(iso, meal) {
  slotPick.iso = iso;
  slotPick.meal = meal;
  slotPick.search = '';
  el.slotSearch.value = '';

  const date = dateOf(iso);
  const dayName = DAY_NAMES[(date.getDay() + 6) % 7].slice(0, 3);
  const existingId = state.plan[slotKey(iso, meal)];
  const existing = existingId ? RECIPE_BY_ID.get(existingId) : null;
  el.slotPickerTitle.textContent = (existing ? 'Replace ' : 'Choose ') + meal.toLowerCase() +
    ' — ' + dayName + ' ' + fmtDayMonth.format(date);

  renderSlotPicker();
  el.slotPicker.hidden = false;
  el.slotPicker.scrollIntoView({ block: 'nearest' });
  el.slotSearch.focus();
}

function closeSlotPicker() {
  slotPick.iso = null;
  el.slotPicker.hidden = true;
}

function renderSlotPicker() {
  const list = matchingRecipes(slotPick.search, []);
  el.slotPickerGrid.innerHTML = list.map(function (r) {
    return '<button type="button" class="pick" data-action="pick-for-slot" data-id="' + r.id + '">' +
        '<span class="pick-name">' + escapeHtml(r.name) + '</span>' +
        '<span class="pick-meta">' + r.minutes + ' min</span>' +
        '<span class="card-tags">' + tagsHtml(r.tags) + '</span>' +
      '</button>';
  }).join('');
  el.slotPickerEmpty.hidden = list.length > 0;
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
  const target = event.target.closest('[data-action]');
  if (!target) return;
  const action = target.dataset.action;

  if (action === 'nav') {
    setView(target.dataset.view);
    return;
  }

  if (action === 'week-shift') {
    state.weekStart = isoOf(addDays(dateOf(state.weekStart), 7 * Number(target.dataset.delta)));
    closeSlotPicker();
    renderWeek();
    return;
  }

  if (action === 'week-today') {
    state.weekStart = isoOf(mondayOf(new Date()));
    closeSlotPicker();
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
    openSlotPicker(target.dataset.iso, target.dataset.meal);
    return;
  }

  if (action === 'pick-for-slot') {
    const recipe = RECIPE_BY_ID.get(target.dataset.id);
    if (!recipe || !slotPick.iso) return;
    const dayName = DAY_NAMES[(dateOf(slotPick.iso).getDay() + 6) % 7];
    const meal = slotPick.meal;
    state.plan[slotKey(slotPick.iso, meal)] = recipe.id;
    saveState();
    closeSlotPicker();
    renderWeek();
    toast(recipe.name + ' → ' + dayName + ' ' + meal.toLowerCase());
    return;
  }

  if (action === 'slot-picker-close') { closeSlotPicker(); return; }

  if (action === 'clear-slot') {
    delete state.plan[slotKey(target.dataset.iso, target.dataset.meal)];
    saveState();
    renderWeek();
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
  if (action === 'tag') {
    const tag = target.dataset.tag;
    const at = state.tags.indexOf(tag);
    if (at === -1) state.tags.push(tag);
    else state.tags.splice(at, 1);
    renderRecipes();
    return;
  }
});

el.search.addEventListener('input', function () {
  state.search = el.search.value;
  renderRecipes();
});

el.slotSearch.addEventListener('input', function () {
  slotPick.search = el.slotSearch.value;
  renderSlotPicker();
});

// Escape closes the inline picker, matching what it does in the dialogs.
document.addEventListener('keydown', function (event) {
  if (event.key === 'Escape' && !el.slotPicker.hidden) closeSlotPicker();
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
