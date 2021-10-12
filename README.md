## ExtendedAdventures

- **boar adventure:** fork from ['the cellar'](https://ftmscan.com/address/0x2A0F1cB17680161cF255348dDFDeE94ea8Ca196A). Boar population increases when someone calls `reproduce()`, and decreases when `kill()` is called. You can simulate kill function calling `simulate_kill()`. Rewards from reproduce are eligible (passed via parm), rewards for kill are random. In both cases, rewards are boosted or decreased, based in a balancer mechanism using `expected_boars` variable.
