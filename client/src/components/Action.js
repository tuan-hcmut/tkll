import React, { useState } from "react";
import { BsCash } from "react-icons/bs";
import Button from "@mui/material/Button";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

const Action = (props) => {
  const { products, purchaseProduct } = props;
  return (
    <div id="content col-8" className="w-[60%] flex justify-center z-10">
      <div className="bg-white pr-[2rem] pt-[4rem] pb-[4rem] flex flex-col gap-10 w-[60rem] rounded">
        <div className="w-[100%]">
          <div className="flex gap-2 text-3xl text-color-blue font-semibold items-center justify-center">
            <BsCash />
            <h1>Buy Product</h1>
          </div>
        </div>

        <div className="flex w-[100%]">
          <div className="w-[10%] font-bold text-2xl text-center">Id</div>
          <div className="w-[10%] font-bold text-2xl text-center">Name</div>
          <div className="w-[10%] font-bold text-2xl text-center">Price</div>
          <div className="w-[60%] font-bold text-2xl text-center">Owner</div>
          <div className="w-[10%] font-bold text-2xl text-center">Action</div>
        </div>

        <div className="flex flex-col gap-3">
          {products.length === 13 &&
            products.map((product, key) => {
              return (
                <div className="flex w-[100%] items-center">
                  <div className="w-[10%] font-normal text-xl text-center text-ellipsis overflow-hidden">
                    {product.id ? product.id.toString() : "undefined"}
                  </div>
                  <div className="w-[10%] font-normal text-xl text-center text-ellipsis overflow-hidden">{product.name}</div>
                  <div className="w-[10%] font-normal text-xl text-center text-ellipsis overflow-hidden">
                    {window.web3.utils.fromWei(product.price ? product.price.toString() : "0", "Ether")} Eth
                  </div>
                  <div className="w-[60%] font-normal text-xl text-center text-ellipsis overflow-hidden">{product.owner}</div>
                  <div className="w-[10%] font-bold text-2xl text-center">
                    {!product.purchased ? (
                      <Button
                        variant="contained"
                        endIcon={<ShoppingCartIcon />}
                        name={product.id}
                        value={product.price}
                        onClick={(event) => {
                          purchaseProduct(event.target.name, event.target.value);
                        }}
                      >
                        Buy
                      </Button>
                    ) : (
                      <Button variant="contained" disabled endIcon={<ShoppingCartIcon />}>
                        Buy
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};
export default Action;
