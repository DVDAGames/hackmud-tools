function(h, { t }) {
  //t: #s.user.loc
  let
    //initiaze empty vars for later use
    r,

    // empty object to store our successful bruteforce args
    b = {},

    // store color names so we don't have to type them multiple times
    d = ['red', 'orange', 'yellow', 'lime', 'green', 'cyan', 'blue', 'purple'],

    // we'll use this regex to check for errors
    e = /ERROR/gm,

    // unlock commands
    p = ['open', 'unlock', 'release'],

    // core lock color mapping
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
        t: [d[6], d[1]]
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

    // core lock colors as array
    k = Object.keys(m),

    // lock types
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

    // attempt to bruteforce
    f = z => t.call(z),

    // shorthand object.assign that includes our bruteforced data
    o = z => Object.assign({}, z, b),

    // our actual bruteforcing logic
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

  // start cracking
  r = j()

  // keep cracking
  while(e.test(r)) {
    r = j()
  }

  // return status, bruteforced options, and last response
  return { ok: !!1, b, r }
}