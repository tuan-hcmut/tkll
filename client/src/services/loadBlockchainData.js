import Marketplace from "../abis/Marketplace.json";
// Load account

const loadBlockchainData = async () => {
  const web3 = window.web3;
  const accounts = await web3.eth.getAccounts();
  const ethRemaining = await web3.eth.getBalance(accounts[0]);

  const userData = {
    account: accounts[0],
    ethRemaining: (ethRemaining / 1000000000000000000).toFixed(2),
    energyRemaining: 0,
  };

  const networkId = await web3.eth.net.getId();
  const networkData = Marketplace.networks[networkId];
  if (networkData) {
    const marketplace = new web3.eth.Contract(Marketplace.abi, networkData.address);
    const productCount = await marketplace.methods.productCount().call();

    const market = {
      marketplace: marketplace,
      productCount: productCount,
    };

    // Load products
    let products = [];
    for (var i = productCount; i >= 1; i--) {
      const product = await marketplace.methods.products(i).call();
      products.push(product);
    }

    while (products.length > 13) {
      products.pop();
    }

    return { userData, market, products };
  } else {
    window.alert("Marketplace contract not deployed to detected network.");
  }
};

export { loadBlockchainData };
