const { expect } = require("chai");
const { smock } = require("@defi-wonderland/smock");

describe("BoarAdventure", function () {

    before(async function () {
        //Preparing the env
        [this.deployerSigner, this.anotherSigner, this.anotherSigner2] = await ethers.getSigners();

        //Mock rarity
        this.Rarity = await smock.mock('rarity');
        this.rarity = await this.Rarity.deploy();
        await this.rarity.summon(5);
        await this.rarity.summon(2);
        await this.rarity.summon(4);
        await this.rarity.connect(this.anotherSigner).summon(4);

        //Mock attr
        this.Attributes = await smock.mock('rarity_attributes');
        this.attributes = await this.Attributes.deploy(this.rarity.address);

        //#0
        await this.rarity.setVariable('level', {
            0: 5
        });

        //#0
        await this.attributes.setVariable('ability_scores', {
            0: {
                strength: 16,
                dexterity: 16,
                constitution: 16,
                intelligence: 16,
                wisdom: 16,
                charisma: 16,
            }
        });

        //#1
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

    it("Should change_expected_boars successfully...", async function () {
        let boars_to_add = 10000;

        let expected_boars_before = ethers.utils.formatUnits(
            await this.boarAdventure.expected_boars(),
            "wei"
        );

        await this.boarAdventure.change_expected_boars(Number(expected_boars_before) + boars_to_add);

        let expected_boars_after = ethers.utils.formatUnits(
            await this.boarAdventure.expected_boars(),
            "wei"
        );

        expect(Number(expected_boars_after)).equal(Number(expected_boars_before) + boars_to_add);

        await expect(this.boarAdventure.connect(this.anotherSigner)
            .change_expected_boars(boars_to_add))
            .to.be.revertedWith('!owner');

    });

    it("Should calculate percentaje successfully...", async function () {
        let calculate_percentaje = ethers.utils.formatUnits(
            await this.boarAdventure.calculate_percentaje(
                ethers.utils.parseUnits("1000"),
                ethers.utils.parseUnits("20")
            )
        );
        expect(Number(calculate_percentaje)).equal(2);
        let apply_percentaje = ethers.utils.formatUnits(
            await this.boarAdventure.apply_percentaje(
                ethers.utils.parseUnits("20"),
                ethers.utils.parseUnits("1000")
            )
        );
        expect(Number(apply_percentaje)).equal(200);
    });

    it("Should reproduce with summoner#0 successfully...", async function () {
        let summId = 0;

        /*First */
        let balanceRewardsBefore = Number(
            ethers.utils.formatUnits(
                await this.mushroom.balanceOf(summId),
                "ether")
        );
        let boar_population_before = Number(
            ethers.utils.formatUnits(
                await this.boarAdventure.boar_population(),
                "wei")
        );
        await this.boarAdventure.reproduce(summId, 1);
        let balanceRewardsAfter = Number(
            ethers.utils.formatUnits(
                await this.mushroom.balanceOf(summId),
                "ether")
        );
        let boar_population_after = Number(
            ethers.utils.formatUnits(
                await this.boarAdventure.boar_population(),
                "wei")
        );

        // console.log("boar pop", boar_population_after);

        expect(boar_population_after).greaterThan(boar_population_before);
        expect(balanceRewardsAfter).greaterThan(balanceRewardsBefore);
        await expect(this.boarAdventure.reproduce(summId, 1)).to.be.reverted;
    });

    it("Should reproduce with summoner#1 successfully...", async function () {
        let summId = 1;

        /*Second */
        let balanceRewardsBefore = Number(
            ethers.utils.formatUnits(
                await this.berries.balanceOf(summId),
                "ether")
        );
        let boar_population_before = Number(
            ethers.utils.formatUnits(
                await this.boarAdventure.boar_population(),
                "wei")
        );
        await this.boarAdventure.reproduce(summId, 2);
        let balanceRewardsAfter = Number(
            ethers.utils.formatUnits(
                await this.berries.balanceOf(summId),
                "ether")
        );
        let boar_population_after = Number(
            ethers.utils.formatUnits(
                await this.boarAdventure.boar_population(),
                "wei")
        );

        expect(boar_population_after).greaterThan(boar_population_before);
        expect(balanceRewardsAfter).greaterThan(balanceRewardsBefore);
        await expect(this.boarAdventure.reproduce(summId, 2)).to.be.reverted;
    });

    it("Should reproduce with summoner#2 successfully...", async function () {
        let summId = 2;

        /*Third */
        let balanceRewardsBefore = Number(
            ethers.utils.formatUnits(
                await this.wood.balanceOf(summId),
                "ether")
        );
        let boar_population_before = Number(
            ethers.utils.formatUnits(
                await this.boarAdventure.boar_population(),
                "wei")
        );
        await this.boarAdventure.reproduce(summId, 3);
        let balanceRewardsAfter = Number(
            ethers.utils.formatUnits(
                await this.wood.balanceOf(summId),
                "ether")
        );
        let boar_population_after = Number(
            ethers.utils.formatUnits(
                await this.boarAdventure.boar_population(),
                "wei")
        );

        expect(boar_population_after).greaterThan(boar_population_before);
        expect(balanceRewardsAfter).greaterThan(balanceRewardsBefore);
        await expect(this.boarAdventure.reproduce(summId, 3)).to.be.reverted;
    });

    it("Should kill successfully...", async function () {
        let boar_population_before = await this.boarAdventure.boar_population();
        let leather_before = Number(ethers.utils.formatUnits(await this.leather.balanceOf(0)));
        let meat_before = Number(ethers.utils.formatUnits(await this.meat.balanceOf(0)));
        let tusks_before = Number(ethers.utils.formatUnits(await this.tusks.balanceOf(0)));

        await expect(this.boarAdventure.kill(0)).to.be.reverted;
        await network.provider.send("evm_increaseTime", [172800]); //Time travel, because called "reproduce" in above tests
        await this.boarAdventure.kill(0);
        let leather_after = Number(ethers.utils.formatUnits(await this.leather.balanceOf(0)));
        let meat_after = Number(ethers.utils.formatUnits(await this.meat.balanceOf(0)));
        let tusks_after = Number(ethers.utils.formatUnits(await this.tusks.balanceOf(0)));

        expect(boar_population_before - 1).equal(await this.boarAdventure.boar_population());
        expect(leather_after).greaterThanOrEqual(leather_before);
        expect(meat_after).greaterThanOrEqual(meat_before);
        expect(tusks_after).greaterThanOrEqual(tusks_before);
    });

    it("Reward boost UP and DOWN should work successfully...", async function () {
        let reward = ethers.utils.parseUnits("5");
        let expected_boars = 0;

        for (let i = 0; i < 50; i++) {

            expected_boars = ethers.utils.formatUnits(await this.boarAdventure.expected_boars(), "wei");
            let reward_for_reproduce = ethers.utils.formatUnits(await this.boarAdventure.boost_reward_for_reproduce(reward), "wei");
            let reward_for_kill = ethers.utils.formatUnits(await this.boarAdventure.boost_reward_for_kill(reward), "wei");
            await this.boarAdventure.change_expected_boars(Number(expected_boars) - 100);

        }

    });

    it("Should setMinter rERC20 successfully...", async function () {
        let summDst = 2;

        await expect(
            this.mushroom.connect(this.anotherSigner)
                .setMinter(this.anotherSigner2.address)
        ).to.be.revertedWith('!owner');
        await this.mushroom.setMinter(this.anotherSigner2.address);
        await this.mushroom.connect(this.anotherSigner2).mint(summDst, ethers.utils.parseUnits("200000"));
    });

    it("Should approve rERC20 successfully...", async function () {
        await expect(
            this.mushroom.connect(this.anotherSigner)
                .approve(2, 3, ethers.utils.parseUnits("10000")))
            .to.be.revertedWith('!owner');
        await this.mushroom.approve(2, 3, ethers.utils.parseUnits("10000"));
    });

    it("Should transfer rERC20 successfully...", async function () {
        await expect(
            this.mushroom.connect(this.anotherSigner)
                .transfer(2, 3, ethers.utils.parseUnits("1000")))
            .to.be.revertedWith('!owner');
        await this.mushroom.transfer(2, 3, ethers.utils.parseUnits("1000"));
    });

    it("Should transferFrom rERC20 successfully...", async function () {
        await expect(
            this.mushroom.connect(this.anotherSigner)
                .transferFrom(2, 2, 3, ethers.utils.parseUnits("1000")))
            .to.be.revertedWith('!owner');
        await expect(
            this.mushroom.connect(this.anotherSigner)
                .transferFrom(3, 2, 3, ethers.utils.parseUnits("100000")))
            .to.be.revertedWith('reverted with panic code 0x11 (Arithmetic operation underflowed or overflowed outside of an unchecked block)');
        await this.mushroom.transferFrom(2, 2, 3, ethers.utils.parseUnits("1000"));
        expect(Number(ethers.utils.formatUnits(await this.mushroom.balanceOf(3)))).equal(2000);
    });

});