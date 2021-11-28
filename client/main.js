Moralis.initialize("nBvAd471ytECS7kF5PciYlVFce8rCfa3IGT3BCf2"); // Application from Moralis.io
Moralis.serverURL = "https://b7md5421wsoj.usemoralis.com:2053/server"; // Server URL from Moralis.io 
const CONTRACT_ADDRESS = "0x2e2F28C63532d0444dEe26d83BA1CD1cCE26f2e2";


async function init() {
    try {
        let user = Moralis.User.current();
        if (!user) {
            $("#login_button").click( async () => {
                user = await Moralis.Web3.authenticate();
            });
        }
        renderGame();
    } catch (error) {
        console.log(error);
    }
}

async function renderGame() {
    $("#login_button").hide();

    // Get and render the properties from Smart Contract
    let petId = 0;
    window.web3 = await Moralis.Web3.enableWeb3();
    let abi = await getAbi();
    let contract = new web3.eth.Contract(abi, CONTRACT_ADDRESS);
    let data = await contract.methods.getTokenDetails(petId).call({from: ethereum.selectedAddress});
    console.log(data);
    renderPet(0, data);
    $("#game").show();
}

function renderPet(id, data) {
    $("#pet_id").html(id);
    $("#pet_damage").html(data.damage);
    $("#pet_magic").html(data.magic);
    $("#pet_endurance").html(data.endurance);

    let deathTime = new Date( (parseInt(data.lastMeal) + parseInt(data.endurance)) * 1000);
    let now = new Date();
    if(now > deathTime) {
        deathTime = "<b>DEAD</b>";
    }

    $("#pet_starvation_time").html(deathTime);

}

function getAbi() {
    return new Promise( (res) => {
        $.getJSON("Token.json", ( (json) => {
            res(json.abi);
       }))
    })
}

init();