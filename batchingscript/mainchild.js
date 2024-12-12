/** @param {NS} ns */
export async function main(ns) {
  while (ns.isRunning("prepserv.js", ns.args[1])) {
    await ns.sleep(10000)
  }
  let currentServer = ns.args[0]
  let scriptRam = 2
  let maxRam = ns.getServerMaxRam(currentServer)
  while (true) {
    let usedRam = ns.getServerUsedRam(currentServer)
    if (currentServer == "home") { usedRam += 5 }
    while (usedRam < scriptRam) {
      let usedRam = ns.getServerUsedRam(currentServer)
      let threads = Math.floor((maxRam - usedRam) / scriptRam)
      await ns.sleep(100)
      let currentTarget = ns.args[1]

      // --- get thread info ---

      // threads available
      threads = Math.floor((maxRam - usedRam) / scriptRam)

      // grow threads needed
      let growthAmount = 3
      var growThreads = Math.ceil(ns.growthAnalyze(currentTarget, growthAmount)) + 2
      let growSecurity = ns.growthAnalyzeSecurity(growThreads, currentTarget)

      // hack threads needed
      let targetMoney = ns.getServerMaxMoney(currentTarget) / growthAmount
      var hackThreads = Math.floor(targetMoney / ns.hackAnalyze(currentTarget))
      let hackSecurity = ns.hackAnalyzeSecurity(hackThreads, currentTarget)

      // weaken threads needed
      var weakThreads = Math.ceil(growSecurity / ns.weakenAnalyze(1)) + 2
      var wekaThreads = Math.ceil(hackSecurity / ns.weakenAnalyze(1)) + 2

      // --- run batches ---

      // get thread counts, than scale down based on available ram
      let totalThreads = weakThreads + growThreads + wekaThreads + hackThreads
      if (totalThreads > threads) {
        if (weakThreads > 0) {
          weakThreads = Math.ceil(weakThreads * threads / totalThreads)
        }
        if (growThreads > 0) {
          growThreads = Math.ceil(growThreads * threads / totalThreads)
        }
        if (wekaThreads > 0) {
          wekaThreads = Math.ceil(wekaThreads * threads / totalThreads)
        }
        if (hackThreads > 0) {
          hackThreads = Math.ceil(hackThreads * threads / totalThreads)
        }
      }

      // weak batch - part 1
      if (weakThreads > 0) {
        ns.exec("main/weak.js", currentServer, weakThreads, 0, currentTarget);
      }

      // grow batch
      if (growThreads > 0) {
        ns.exec("_grow.js", currentServer, growThreads, 20, currentTarget);
      }

      // weak batch 2 electric boogaloo
      if (wekaThreads > 0) {
        ns.exec("_weak.js", currentServer, wekaThreads, 40, currentTarget);
      }

      // hack batch
      if (hackThreads > 0) {
        ns.exec("_hack.js", currentServer, hackThreads, 80, currentTarget);
      }
    }
  }
}
