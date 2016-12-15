/**
 * @method scrape
 * @description Hit T1 NPC project page, check levels of script locations,
 * format them for user.sh, and return the list of locations
 * @param {Object} h hackmud script context
 * @param {Object} a arguments for script
 *  - t: {Scriptor} hackmud user.loc to hit: #s.user.loc
 *  - a: {Object} arguments for T1 NPC Corp directory page
 *    - [nav]: {String} this key may be a number of possible strings
 *    - [pass]: {String} this key may be a number of possible strings
 *    - [proj]: {String} this key may be a number of possible strings
 */
function(h, { t, a }) { //t: #s.user.loc, a: {}

  // security_level: 4
  // chars: 197

  // NOTE: Should remove JSDoc Comments to upload

  let
    r, //response

    // logging array
    l = [],

    // security level
    g = [4]
  ;

  // call target with passed arguments
  r = t.call(a)

  // if we were not given an array, die
  if (!Array.isArray(r)) return { ok: !!0 }

  // iterate through response array
  r.forEach(u => {
    // if the user loc has a FULLSEC script level
    // NOTE:  we ignore any corrupted locations because there are generally enough
    // results without them when paired with our user.harvest script
    if (g.includes(#s.scripts.get_level({ name: `${u}`}))) {
      // push user info into our logging array, formatted for user.sh script
      l.push(`user.sh {t: #s.${u} }`)
    }
  })

  //return success and array of user locs
  return { ok: !!1, l }
}