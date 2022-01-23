let {
    rarityAddr,
    attributesAddr,
    skillsAddr,
    randomCodexAddr,
    extendedMultisig,
    mushroomAddress,
    berriesAddress,
    woodAddress,
    leatherAddress,
    meatAddress,
    tusksAddress
} = require("../registry.json");

async function main() {
    //Compile
    await hre.run("clean");
    await hre.run("compile");

    [this.deployer] = await ethers.getSigners();

    //Deploy
    this.BoarAdventure = await ethers.getContractFactory("boarAdventure");
    this.boarAdventure = await this.BoarAdventure.deploy(
        rarityAddr,
        attributesAddr,
        skillsAddr,
        randomCodexAddr,
        mushroomAddress,
        berriesAddress,
        woodAddress,
        leatherAddress,
        meatAddress,
        tusksAddress
    );
    await this.boarAdventure.deployed();
    console.log("Deployed BAV2 to:", this.boarAdventure.address);

    this.LOOT = new ethers.Contract(mushroomAddress, [
        'function setMinter(address _minter) external',
    ], this.deployer);

    //Setting minter
    await this.LOOT.attach(mushroomAddress).setMinter(this.boarAdventure.address);
    await this.LOOT.attach(berriesAddress).setMinter(this.boarAdventure.address);
    await this.LOOT.attach(woodAddress).setMinter(this.boarAdventure.address);
    await this.LOOT.attach(leatherAddress).setMinter(this.boarAdventure.address);
    await this.LOOT.attach(meatAddress).setMinter(this.boarAdventure.address);
    await this.LOOT.attach(tusksAddress).setMinter(this.boarAdventure.address);
    console.log("Minter setted up successfully to:", this.boarAdventure.address);

    //Verify
    await hre.run("verify:verify", {
        address: this.boarAdventure.address,
        constructorArguments: [
            rarityAddr,
            attributesAddr,
            skillsAddr,
            randomCodexAddr,
            mushroomAddress,
            berriesAddress,
            woodAddress,
            leatherAddress,
            meatAddress,
            tusksAddress
        ],
    });

    //Setting extended
    await (await this.boarAdventure.setExtended(extendedMultisig)).wait();
    console.log("Extended setted up successfully to:", extendedMultisig);

}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });