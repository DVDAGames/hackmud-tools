/**
 * @method harvest
 * @description Take most T1 NPC Corp locations and harvest user locs from them
 * @param {Object} h hackmud script context
 * @param {Object} a arguments for script
 *  - t: {Scriptor} hackmud user.loc to hit: #s.user.loc
 */
function(h, { t }) { //t: #s.user.loc

  // security_level: 4
  // chars: 934

  // NOTE: Should remove JSDoc Comments to upload

  let
    r, // response

    m, // regex matches

    y, // did we have a password match

    // max attempts for non-corrupted navigation string
    k = 2,

    // starting attempts for non-corrupted navigation string
    n = 0,

    // key for sending our prospective project names
    s = 'project',

    //bruteforce object to store our key:vale pairs
    b = {},

    // logging array
    l = [],

    // potential password keys
    p = ['password', 'pass', 'p'],

    // potential passwords
    // add more as they come up
    c = ['thenumberone', 'plantowin', 'supercalifragilisticexpialidocious',
    'endtheworld', 'knowyourteam'],

    // common project names
    // ad more as they come up
    q = ['ragnaroxx.sh', '101010', 'dev_nul', 'giant_spidr', 'ESCHATOLOGI.EXE',
        'judgeme_nt', 'H0meEntert4inment', 'Free_BFG', 'tmp', 'delete_first',
        'semordnilap.sh', 'ende.exe'
    ],

    // execute a call to our target
    x = z => t.call(z),

    // extend our bruteforce parameters with a new Object
    o = z => Object.assign({}, z, b),

    // log to our logging array
    g = z => l.push(z),

    // RegEx for checking if our password key is right
    e = /Incorrect password/im,

    // RegEx for checking if our password is right
    a = /Authenticated/im
  ;

  // get navigation keys
  // we run this multiple times in case corruption characters mess up our RegEx
  while(!m || k < n) {
    // execute a call with no parameters
    r = x({});

    // find the key for navigation and the navigation property for the user directory
    m = r.match(/with (\S*?):\"(\S*?)\"$/m);

    // increase our kill counter
    n++
  }

  //die if too much corruption to read things
  if (n >= k && !m) return {
    ok: !!0,
    msg: "ERROR: Too much corruption. Please try running user.harvest again."
  }

  // store proper navigation for directory that we got from the initial target call
  b[m[1]] = m[2];

  // iterate through our potential password keys
  y = p.some(i => {
    // call our target with our password key
    r = x(o({ [i] : 'p' }))

    // if we didn't get the "Incorrect password" message, kill this iteration of the loop
    if (!r.match(e)) return !!0

    // itereate through potential passwords
    return c.some(j => {
      // send password attempt to target
      r = x(o({ [i] : j }))

      // if we didn't authenticate, kill this iteration of the loop
      if (!r.match(a)) return !!0

      // otherwise, save off our password to our bruteforce parameters
      b[i] = j

      // return true, killing the Array.some
      return !!1
    })
  })

  // die if we never got a password authentication
  if (!y) return {
    ok: !!0,
    msg: "ERROR: Password not in DB. Please run user.harvest against another target."
  }

  // itereate through potential project names
  q.forEach(i => {

    // call the user.scrape scriptor to attempt to scrape safe, valid users
    r = #s.user.scrape({ t, a: o({ [s] : i}) })

    // if we received an okay from the scraper, iterate, and add the results to our logging array
    if (r.ok) r.l.forEach(i => g(i))
  })

  // return our logging array with a list of foratted user.sh { t: #s.user.loc } calls for copying and pasting
  return { ok: !!1, l }
}