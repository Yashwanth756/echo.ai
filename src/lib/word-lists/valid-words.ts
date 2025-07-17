
// This is a larger list of 5-letter words for validating user guesses
// In a production game, this would be much more comprehensive
// This is just a subset for demonstration purposes

export const validFiveLetterWords = [
  ...new Set([
    "about", "above", "abuse", "actor", "adapt", "admit", "adopt", "adult", "after", "again",
    "agent", "agree", "ahead", "alarm", "album", "alert", "alike", "alive", "allow", "alone",
    "along", "alter", "among", "anger", "angle", "angry", "ankle", "apart", "apple", "apply",
    "arise", "armor", "array", "arrow", "asset", "avoid", "award", "aware", "awful", "badge",
    "badly", "basic", "basis", "beach", "beard", "beast", "begin", "being", "below", "bench",
    "birth", "black", "blade", "blame", "blank", "blast", "blaze", "bleed", "blend", "bless",
    "blind", "block", "blood", "bloom", "blues", "bluff", "board", "boast", "boost", "booth",
    "bosom", "bound", "bower", "brace", "brain", "brake", "brand", "brave", "bread", "break",
    "breed", "brief", "bring", "broad", "broom", "brown", "brush", "build", "built", "burst",
    "champ", "chart", "chase", "cheap", "check", "chest", "chief", "child", "chill", "choke",
    "clear", "clerk", "click", "cliff", "climb", "clock", "close", "cloth", "cloud", "clown",
    "clump", "coast", "color", "comma", "coral", "count", "court", "cover", "crack", "craft",
    "crane", "crash", "crawl", "crazy", "cream", "crime", "cross", "crowd", "crown", "crush",
    "daily", "dance", "dated", "dealt", "death", "debit", "debut", "decay", "delay", "depth",
    "devil", "diary", "dirty", "ditch", "dodge", "doing", "doubt", "dozen", "draft", "drain",
    "drama", "drank", "dream", "dress", "drift", "drill", "drink", "drive", "drone", "drown",
    "druid", "drunk", "dryly", "duchy", "dully", "dummy", "dusty", "dying", "eager", "early",
    "earth", "easel", "eaten", "eight", "elbow", "elder", "elect", "elven", "empty", "ended",
    "enemy", "enjoy", "enter", "entry", "equal", "error", "essay", "event", "exact", "exalt",
    "excel", "exist", "extra", "fable", "faced", "facet", "faint", "fairy", "faith", "false",
    "fancy", "fatal", "feast", "fence", "ferry", "fetch", "fever", "field", "fiend", "fiery",
    "fifth", "fifty", "fight", "final", "first", "fishy", "fixed", "fizzy", "flake", "flame",
    "flank", "flash", "flask", "fleet", "flesh", "flick", "flint", "float", "flock", "flood",
    "floor", "flora", "flour", "flown", "fluid", "flush", "flute", "focal", "focus", "foggy",
    "force", "forge", "found", "frame", "frank", "fraud", "fresh", "front", "frost", "froze",
    "fruit", "fully", "funny", "ghost", "ghoul", "giant", "giddy", "gifts", "given", "giver",
    "gleam", "glean", "glide", "glint", "gloat", "globe", "gloom", "glory", "gloss", "glove",
    "glyph", "gnash", "gnome", "goats", "godly", "going", "golem", "golly", "goner", "goody",
    "gooey", "goofy", "goose", "gorge", "gouge", "grace", "grade", "graft", "grain", "grand",
    "grant", "grape", "graph", "grasp", "grass", "grate", "grave", "gravy", "graze", "great",
    "greed", "green", "greet", "grief", "grill", "grime", "grimy", "grind", "gripe", "groan",
    "groin", "groom", "group", "grove", "growl", "grown", "gruff", "grump", "grunt", "guard",
    "guess", "guest", "guide", "guild", "guile", "guilt", "guise", "gulch", "gully", "gumbo",
    "gummy", "gunny", "guppy", "gushy", "gusty", "gutsy", "habit", "hairy", "hammer", "happy"
  ])
];

// Using a Set to remove any duplicate words and ensure O(1) lookup time

