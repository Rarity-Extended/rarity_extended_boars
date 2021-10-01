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
        await this.rarity.summon(4);

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
                wisdom: 4,
                charisma: 2,
            }
        });

        //Mock skills
        this.Skills = await smock.mock('rarity_skills');
        this.skills = await this.Skills.deploy(this.rarity.address, this.attributes.address, ethers.constants.AddressZero); //Using zero address to evade mock "Codex skills"

        await this.skills.setVariable('skills', {
            0: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 3, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        });

        await this.skills.setVariable('skills', {
            1: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
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
        this.boarAdventure = await this.BoarAdventure.deploy(this.rarity.address, this.attributes.address, this.skills.address, this.randomCodex.address, this.mushroom.address, this.berries.address, this.wood.address, this.leather.address, this.meat.address, this.tusks.address);
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
        let boar_population_after = 0;
        let boar_population_before = Number(ethers.utils.formatUnits(await this.boarAdventure.boar_population(), "wei"));

        await this.boarAdventure.reproduce(0, 1);
        // expect(await this.mushroom.balanceOf(0)).equal(sim);
        boar_population_after = Number(ethers.utils.formatUnits(await this.boarAdventure.boar_population(), "wei"));
        expect(boar_population_after).greaterThan(boar_population_before);
        boar_population_before = boar_population_after;
        await expect(this.boarAdventure.reproduce(0, 1)).to.be.reverted;
        // console.log(boar_population_before);

        // console.log(ethers.utils.formatUnits(await this.boarAdventure.boost_reward_for_reproduce()));

        await this.boarAdventure.reproduce(1, 2);
        // expect(await this.berries.balanceOf(1)).equal(sim1);
        boar_population_after = Number(ethers.utils.formatUnits(await this.boarAdventure.boar_population(), "wei"));
        expect(boar_population_after).greaterThan(boar_population_before);
        boar_population_before = boar_population_after;
        await expect(this.boarAdventure.reproduce(1, 2)).to.be.reverted;
        // console.log(boar_population_before);

        await this.boarAdventure.reproduce(2, 3);
        // expect(await this.wood.balanceOf(2)).equal(sim2);
        boar_population_after = Number(ethers.utils.formatUnits(await this.boarAdventure.boar_population(), "wei"));
        expect(boar_population_after).greaterThan(boar_population_before);
        boar_population_before = boar_population_after;
        await expect(this.boarAdventure.reproduce(2, 3)).to.be.reverted;
        // console.log(boar_population_before);
    });

    it("Should kill successfully...", async function () {
        let boar_population_before = await this.boarAdventure.boar_population();
        let sim = await this.boarAdventure.simulate_kill(0);
        // console.log("reward qty:", ethers.utils.formatUnits(sim.reward, "wei"), "reward type:", sim.reward_type);

        // console.log(ethers.utils.formatUnits(await this.boarAdventure.boost_reward_for_kill()));

        await expect(this.boarAdventure.kill(0)).to.be.reverted;
        await network.provider.send("evm_increaseTime", [172800]);
        await this.boarAdventure.kill(0);
        expect(boar_population_before - 1).equal(await this.boarAdventure.boar_population());
    });

    it("rERC20", async function () {

    });
});