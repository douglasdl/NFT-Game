Moralis.initialize("nBvAd471ytECS7kF5PciYlVFce8rCfa3IGT3BCf2"); // Application from Moralis.io
Moralis.serverURL = "https://b7md5421wsoj.usemoralis.com:2053/server"; // Server URL from Moralis.io 
//const CONTRACT_ADDRESS = "0x2e2F28C63532d0444dEe26d83BA1CD1cCE26f2e2";
//const CONTRACT_ADDRESS = "0xad24999C108E173B6e3ffFbD90774E0DC892eC40";
//const CONTRACT_ADDRESS = "0x5D9e4E4DD61870F85aDaBdcCCFA51106e7ed9AF9";
//const CONTRACT_ADDRESS = "0x4Ac407F97F2B636F8558cBC4A5feF73715400b15";
//const CONTRACT_ADDRESS = "0x4573BA9388EF4cd303771baa880AF8a0fdDFf523";
const CONTRACT_ADDRESS = "0xEA9eB23A829BD0a648b2088D019Aee63e621e7E5";

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
    let array = await contract.methods.getAllTokensFor(ethereum.selectedAddress).call({from: ethereum.selectedAddress});
    let data = await contract.methods.getTokenDetails(petId).call({from: ethereum.selectedAddress});
    console.log(array);
    console.log(data);
    renderPet(0, data);
    $("#game").show();
}

function renderPet(id, data) {
    $("#pet_id").html(id);
    $("#pet_damage").html(data.damage);
    $("#pet_magic").html(data.magic);
    $("#pet_endurance").html(data.endurance);
    $("#feed_button").attr("data-pet-id", id);

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

async function feed(petId) {
    let abi = await getAbi();
    let contract = new web3.eth.Contract(abi, CONTRACT_ADDRESS);
    alert(ethereum.selectedAddress);
    //contract.methods.feed(petId).send({from: ethereum.selectedAddress}).on("receipt", ( () => {
    contract.methods.feed(petId).send({from: ethereum.selectedAddress}).on("receipt", ( () => {
        alert("Feeded");
        renderGame();
    }));

    

        // alert("Gengar!")
        // //console.log(contract.methods.feed(petId));
        // console.log("Feeding...")
        // renderGame();
    //}))
}

$("#feed_button").click( () => {
    let petId = $(this).attr("data-pet-id");
    feed(petId);
});

init();