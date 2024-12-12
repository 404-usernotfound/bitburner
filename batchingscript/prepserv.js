/** @param {NS} ns */
export async function main(ns) {
  while (ns.getServerMinSecurityLevel(ns.args[0]) !== ns.getServerSecurityLevel(ns.args[0])) {
    await ns.weaken(ns.args[0])
  }
  while (ns.getServerMaxMoney(ns.args[0]) !== ns.getServerMoneyAvailable(ns.args[0])) {
    await ns.grow(ns.args[0])
  }
  while (ns.getServerMinSecurityLevel(ns.args[0]) !== ns.getServerSecurityLevel(ns.args[0])) {
    await ns.weaken(ns.args[0])
  }
  ns.toast(ns.args[0]+" fully prepared!")
  ns.tprint(ns.args[0]+" fully prepared!")
}
