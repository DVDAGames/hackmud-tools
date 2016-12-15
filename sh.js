/**
 * @method sh
 * @description take any T1 sequence of hackmud locks and crack them
 * @param {Object} h hackmud script context
 * @param {Object} a arguments for script
 *  - t: {Scriptor} hackmud user.loc to hit: #s.user.loc
 */
function(h, { t }) { //t: #s.user.loc

  // security_level: 4
  // chars: 1228

  // NOTE: Should remove JSDoc Comments to upload

  // charge 5KGC for each run
  let go = #s.escrow.charge({ cost: '5KGC', is_unlim: false})

  // is user hasn't authorized script's escrow yet, exit for confirmation
  if(go) return go

  let
    /**
     * @const r
     * @description container var for response from target
     */
    r,

    /**
     * @const b
     * @description Object storing our successful bruteforce args
     */
    b = {},

    /**
     * @const d
     * @description Array of potential color names in their order
     */
    d = ['red', 'orange', 'yellow', 'lime', 'green', 'cyan', 'blue', 'purple'],

    /**
     * @const e
     * @description RegExp for ERROR message
     */
    e = /ERROR/gm,

    /**
     * @const p
     * @description Array containing EZ lock commands
     */
    p = ['open', 'unlock', 'release'],

    /**
     * @const m
     * @description Object mapping color options for CORE locks
     */
    m = {
      [d[0]]: {
        c: d[4],
        t: [d[3], d[5]]
      },
      [d[1]]: {
        c: d[5],
        t: [d[4], d[6]]
      },
      [d[2]]: {
        c: d[6],
        t: [d[5], d[7]]
      },
      [d[3]]: {
        c: d[7],
        t: [d[6], d[0]]
      },
      [d[4]]: {
        c: d[0],
        t: [d[7], d[1]]
      },
      [d[5]]: {
        c: d[1],
        t: [d[0], d[2]]
      },
      [d[6]]: {
        c: d[2],
        t: [d[1], d[3]]
      },
      [d[7]]: {
        c: d[3],
        t: [d[2], d[4]]
      }
    },

    /**
     * @const k
     * @description generated Array from color object
     */
    k = Object.keys(m),

    /**
     * @const c
     * @description Object containing lock types and potential solutions
     */
    c = {
      EZ_21: p,
      EZ_35: p,
      digit: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      EZ_40: p,
      ez_prime: [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97],
      c001: k,
      color_digit() { return (b.c001) ? [b.c001.length] : [] },
      c002: k,
      c002_complement() { return (b.c002) ? [m[b.c002].c] : [] },
      c003: k,
      c003_triad_1() { return (b.c003) ? m[b.c003].t : [] },
      c003_triad_2() { return (b.c003) ? m[b.c003].t : [] }
    },

    /**
     * @method f
     * @description call our target with parameters
     * @param {Object} z parameters to send to target.call
     */
    f = z => t.call(z),

    /**
     * @method o
     * @description shorthand Object.assing w/o mutation and using our bruteforce
     * @param {Object} z parameters to merge with bruteforce
     */
    o = z => Object.assign({}, z, b),

    /**
     * @method j
     * @description go through lock options and bruteforce
     */
    j = () => {
      // iterate through lock types
      Object.keys(c).forEach(k => {
        // if we haven't already brute forced this lock
        if(!b[k]) {
          // make request passing only our bruteforced options
          r = f(o({}))

          // if the response mentions this iteration's lock
          if (r.includes(`!${k}!`)) {
            // if we already have this one bruteforced, exit
            // we need this check again because we set b[k] below
            if (b[k]) return

            // iterate through the potential values for this key
            // if it is a function, retrieve it's value
            ((typeof c[k] === 'function') ? c[k]() : c[k]).some(q => {
              // if we've already bruteforced this key, exit
              if (b[k]) return

              // make request with test data and bruteforced data
              r = f(o({ [k]: q }))

              // if our key wasn't found in the response
              if (!r.includes(`+${q}+`) && !r.includes(`+"${q}"+`)) {
                // store our bruteforced value
                b[k] = q

                //short circuit the Array.some()
                return 1
              }

              // continue Array.some()
              return
            });
          }
        }
      })

      // return response
      return r
    }
  ;

  // kill any clever w4rn_messages
  f({})

  // start cracking
  r = j()

  // keep cracking
  while(e.test(r)) {
    r = j()
  }

  // first run is on the house because this requires confirmation the first time it is run
  // if this is the first time it's been run, call the confirmation message'
  if(go) #dbreturn go

  // return status, bruteforced options, and last response
  return { ok: !!1, b, r }
}