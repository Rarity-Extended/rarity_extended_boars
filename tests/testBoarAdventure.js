const { expect } = require("chai");
const { smock } = require("@defi-wonderland/smock");

describe("BoarAdventure", function () {
    before(async function () {
        //Preparing the env
        [this.deployerSigner] = await ethers.getSigners();

        //Mock rarity
        this.Rarity = await smock.mock('rarity');
        this.rarity = await this.Rarity.deploy();
        await this.rarity.summon(1);
        await this.rarity.summon(2);
        await this.rarity.summon(3);


        //Mock attr
        this.Attributes = await smock.mock('rarity_attributes');
        this.attributes = await this.Attributes.deploy(this.rarity.address);

        await this.attributes.setVariable('ability_scores', {
            0: {
                strength: 1,
                dexterity: 1,
                constitution: 1,
                intelligence: 16,
                wisdom: 16,
                charisma: 16,
            }
        });

        await this.attributes.setVariable('ability_scores', {
            1: {
                strength: 1,
                dexterity: 1,
                constitution: 1,
                intelligence: 8,
                wisdom: 8,
                charisma: 8,
            }
        });

        //Deploy randomCodex
        this.RandomCodex = await ethers.getContractFactory("codex");
        this.randomCodex = await this.RandomCodex.deploy();
        await this.randomCodex.deployed();

        //Deploy loots
        this.Mushroom = await ethers.getContractFactory("Mushroom");
        this.mushroom = await this.Mushroom.deploy(this.rarity.address);
        await this.mushroom.deployed();
        this.Berries = await ethers.getContractFactory("Berries");
        this.berries = await this.Berries.deploy(this.rarity.address);
        await this.berries.deployed();
        this.Wood = await ethers.getContractFactory("Wood");
        this.wood = await this.Wood.deploy(this.rarity.address);
        await this.wood.deployed();
        this.Leather = await ethers.getContractFactory("Leather");
        this.leather = await this.Leather.deploy(this.rarity.address);
        await this.leather.deployed();
        this.Meat = await ethers.getContractFactory("Meat");
        this.meat = await this.Meat.deploy(this.rarity.address);
        await this.meat.deployed();
        this.Tusks = await ethers.getContractFactory("Tusks");
        this.tusks = await this.Tusks.deploy(this.rarity.address);
        await this.tusks.deployed();

        //Deploy boarAdventure
        this.BoarAdventure = await ethers.getContractFactory("boarAdventure");
        this.boarAdventure = await this.BoarAdventure.deploy(this.rarity.address, this.attributes.address, this.randomCodex.address, this.mushroom.address, this.berries.address, this.wood.address, this.leather.address, this.meat.address, this.tusks.address);
        await this.boarAdventure.deployed();

        //Setting minter
        await this.mushroom.setMinter(this.boarAdventure.address);
        await this.berries.setMinter(this.boarAdventure.address);
        await this.wood.setMinter(this.boarAdventure.address);
        await this.leather.setMinter(this.boarAdventure.address);
        await this.meat.setMinter(this.boarAdventure.address);
        await this.tusks.setMinter(this.boarAdventure.address);
    });

    it("Should reproduce successfully...", async function () {
        let sim = await this.boarAdventure.simulate_reproduce(0);
        // console.log("reward qty:", ethers.utils.formatUnits(sim, "wei"));

        let sim1 = await this.boarAdventure.simulate_reproduce(1);
        // console.log("reward qty:", ethers.utils.formatUnits(sim1, "wei"));

        let sim2 = await this.boarAdventure.simulate_reproduce(2);
        // console.log("reward qty:", ethers.utils.formatUnits(sim2, "wei"));

        await this.boarAdventure.reproduce(0, 1);
        expect(await this.mushroom.balanceOf(0)).equal(sim);
        await expect(this.boarAdventure.reproduce(0, 1)).to.be.reverted;

        await this.boarAdventure.reproduce(1, 2);
        expect(await this.berries.balanceOf(1)).equal(sim1);
        await expect(this.boarAdventure.reproduce(1, 2)).to.be.reverted;

        await this.boarAdventure.reproduce(2, 3);
        expect(await this.wood.balanceOf(2)).equal(sim2);
        await expect(this.boarAdventure.reproduce(2, 3)).to.be.reverted;
    });

    it("Should kill successfully...", async function () {
        let sim = await this.boarAdventure.simulate_kill(0);
        console.log("reward qty:", ethers.utils.formatUnits(sim.reward, "wei"), "reward type:", sim.reward_type);

        await expect(this.boarAdventure.kill(0)).to.be.reverted;
        await network.provider.send("evm_increaseTime", [172800]);
        await this.boarAdventure.kill(0);
    });

    it("rERC20", async function () {
        
    });
});