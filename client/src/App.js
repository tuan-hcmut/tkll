import React, { useEffect, useState, useContext } from "react";
import Web3 from "web3";
import "./App.scss";
import Navbar from "./components/Navbar";
import Action from "./components/Action";
import UserInfor from "./components/UserInfor";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loading from "./components/common/Loading";
import GeneralContext from "./context/generalProvider";
import { loadBlockchainData } from "./services/loadBlockchainData";

const App = () => {
  const { socket } = useContext(GeneralContext);
  const [userInfor, setUserInfor] = useState({
    account: null,
    ethRemaining: null,
    energyRemaining: null,
    message: "",
  });

  const [market, setMarket] = useState({
    marketplace: null,
    productCount: null,
  });

  const [loading, setLoading] = useState({ loading: false });
  const [products, setProducts] = useState({ products: [] });

  useEffect(() => {
    socket.on("out-of-energy", (data) => {
      console.log(data);
      // toast.error("Out of energy. Please buy energy!!!!");
      setUserInfor(data);
    });

    socket.on("current-user", (data) => {
      console.log(data);
      setUserInfor(data);
    });

    const loadWeb3 = async () => {
      if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
        await window.ethereum.enable();
      } else if (window.web3) {
        window.web3 = new Web3(window.web3.currentProvider);
      } else {
        window.alert("Non-Ethereum browser detected. You should consider trying MetaMask!");
      }

      ////// get all data we need ////////
      const { userData, market, products } = await loadBlockchainData();
      socket.emit("data-register", userData);

      setProducts({
        products: [...products],
      });

      setMarket({
        marketplace: market.marketplace,
        productCount: market.productCount,
      });

      localStorage.setItem("id", userData.account.toString());
    };

    loadWeb3();
  }, []);

  const createProduct = async (name, price) => {
    setLoading({
      loading: true,
    });

    market.marketplace.methods
      .createProduct(name, price)
      .send({ from: userInfor.account })
      .once("receipt", async (receipt) => {
        toast.success(`You have been created product success!!!`);
        const { market, products } = await loadBlockchainData();
        setProducts({
          products: [...products],
        });

        setMarket({
          marketplace: market.marketplace,
          productCount: market.productCount,
        });

        setLoading({
          loading: false,
        });
      });
  };

  const purchaseProduct = (id, price) => {
    if (id === undefined || price === undefined) return;
    setLoading({
      loading: true,
    });

    market.marketplace.methods
      .purchaseProduct(id)
      .send({ from: userInfor.account, value: price })
      .once("receipt", async (receipt) => {
        toast.success(`Buy success!!!`);
        const { market, products } = await loadBlockchainData();
        setProducts({
          products: [...products],
        });

        setMarket({
          marketplace: market.marketplace,
          productCount: market.productCount,
        });

        setLoading({
          loading: false,
        });

        socket.emit("buy-more-energy", {
          energy: (parseInt(price) / 1000000000000000000) * 50,
          account: localStorage.getItem("id"),
          eth: price,
        });
      });
  };

  return (
    <div className="sky-bg w-screen h-screen">
      <ToastContainer className={"!text-2xl !font-semibold !text-white"} position="top-center" />
      <Navbar account={userInfor.account} />
      <div className="w-[100%] h-[100%]">
        <main role="main" className="h-[100%]">
          {loading.loading ? (
            <Loading />
          ) : (
            <div className="flex w-[100%] pt-[5rem]">
              <UserInfor userInfor={userInfor} createProduct={createProduct} />
              <Action purchaseProduct={purchaseProduct} products={products.products} />
            </div>
          )}
        </main>
      </div>

      <div className="sun"></div>
      <div className="mercury"></div>
      <div className="venus"></div>
      <div className="earth"></div>
      <div className="mars"></div>
      <div className="jupiter"></div>
      <div className="saturn"></div>
      <div className="uranus"></div>
      <div className="neptune"></div>
      <div className="urasteroids-beltanus"></div>
    </div>
  );
};

export default App;
