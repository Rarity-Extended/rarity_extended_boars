let { rarityAddr, attributesAddr, skillsAddr, randomCodexAddr } = require("../registry.json");

async function main() {
    //Compile
    await hre.run("clean");
    await hre.run("compile");

    //Deploy loots
    this.Mushroom = await ethers.getContractFactory("Mushroom");
    this.mushroom = await this.Mushroom.deploy(rarityAddr);
    await this.mushroom.deployed();
    console.log("Deployed Mushroom to:", this.mushroom.address);

    this.Berries = await ethers.getContractFactory("Berries");
    this.berries = await this.Berries.deploy(rarityAddr);
    await this.berries.deployed();
    console.log("Deployed Berries to:", this.berries.address);

    this.Wood = await ethers.getContractFactory("Wood");
    this.wood = await this.Wood.deploy(rarityAddr);
    await this.wood.deployed();
    console.log("Deployed Wood to:", this.wood.address);

    this.Leather = await ethers.getContractFactory("Leather");
    this.leather = await this.Leather.deploy(rarityAddr);
    await this.leather.deployed();
    console.log("Deployed Leather to:", this.leather.address);

    this.Meat = await ethers.getContractFactory("Meat");
    this.meat = await this.Meat.deploy(rarityAddr);
    await this.meat.deployed();
    console.log("Deployed Meat to:", this.meat.address);

    this.Tusks = await ethers.getContractFactory("Tusks");
    this.tusks = await this.Tusks.deploy(rarityAddr);
    await this.tusks.deployed();
    console.log("Deployed Tusks to:", this.tusks.address);

    //Deploy
    this.BoarAdventure = await ethers.getContractFactory("boarAdventure");
    this.boarAdventure = await this.BoarAdventure.deploy(
        rarityAddr, 
        attributesAddr, 
        skillsAddr, 
        randomCodexAddr, 
        this.mushroom.address, 
        this.berries.address, 
        this.wood.address, 
        this.leather.address, 
        this.meat.address, 
        this.tusks.address
    );
    await this.boarAdventure.deployed();
    console.log("Deployed BA to:", this.boarAdventure.address);

    //Setting minter
    await (await this.mushroom.setMinter(this.boarAdventure.address)).wait();
    await (await this.berries.setMinter(this.boarAdventure.address)).wait();
    await (await this.wood.setMinter(this.boarAdventure.address)).wait();
    await (await this.leather.setMinter(this.boarAdventure.address)).wait();
    await (await this.meat.setMinter(this.boarAdventure.address)).wait();
    await (await this.tusks.setMinter(this.boarAdventure.address)).wait();
    console.log("Minter setted up successfully to:", this.boarAdventure.address);

    //Verify
    await hre.run("verify:verify", {
        address: this.boarAdventure.address,
        constructorArguments: [
            rarityAddr, 
            attributesAddr, 
            skillsAddr, 
            randomCodexAddr, 
            this.mushroom.address, 
            this.berries.address, 
            this.wood.address, 
            this.leather.address, 
            this.meat.address, 
            this.tusks.address
        ],
    });

    await hre.run("verify:verify", {
        address: this.mushroom.address,
        constructorArguments: [rarityAddr]
    });
    await hre.run("verify:verify", {
        address: this.berries.address,
        constructorArguments: [rarityAddr]
    });
    await hre.run("verify:verify", {
        address: this.wood.address,
        constructorArguments: [rarityAddr]
    });
    await hre.run("verify:verify", {
        address: this.leather.address,
        constructorArguments: [rarityAddr]
    });
    await hre.run("verify:verify", {
        address: this.meat.address,
        constructorArguments: [rarityAddr]
    });
    await hre.run("verify:verify", {
        address: this.tusks.address,
        constructorArguments: [rarityAddr]
    });
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });