/** @param {NS} ns */
export async function main(ns) {
  // --- prep ---

  // get list of targets (stolen from https://github.com/bitburner-official/bitburner-scripts/blob/master/opened_servers.js)
  function scan(ns, parent, server, list) {
    const children = ns.scan(server);
    for (let child of children) {
      if (parent == child) {
        continue;
      }
      list.push(child);

      scan(ns, server, child, list);
    }
  }

  let t = [];
  scan(ns, '', 'home', t);

  let targets = t.filter(s => ns.hasRootAccess(s)).filter(s => ns.getServerMaxMoney(s) > 0);
  let servers = ["home"]

  let currentServer = ns.getHostname()
  let usedRam = ns.getServerUsedRam(currentServer)
  if (currentServer == "home") { usedRam += 5 }
  let scriptRam = 2.3
  let maxRam = ns.getServerMaxRam(currentServer)
  let threads = Math.floor((maxRam - usedRam) / scriptRam)

  for (var i = 0; i < targets.length; i++) {
    ns.run("prepserv.js", Math.ceil(threads / (targets.length + 1)), targets[i])
  }
  
  await ns.sleep(1000)
  // wait until all servers are prepared
  for (var i = 0; i < targets.length; i++) {
    for (var s = 0; s < servers.length; s++) {
      ns.run("mainchild.js", 1, servers[s], targets[i])
    }
  }
}
