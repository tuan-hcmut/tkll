import React, { useState } from "react";
import UserImg from "../assets/images/user.png";
import { BsFillKeyFill } from "react-icons/bs";
import { FaEthereum } from "react-icons/fa";
import { SlEnergy } from "react-icons/sl";
import { IoMdAddCircle } from "react-icons/io";
import { SlNote } from "react-icons/sl";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

const UserInfor = (props) => {
  const { userInfor, createProduct } = props;
  const [inputInfor, setInputInfor] = useState({
    name: "",
    price: 0,
  });

  return (
    <div className="user-content w-[40%] flex justify-center z-20">
      <div className="w-[45rem] bg-white rounded flex flex-col gap-16 items-center pt-[1rem] pb-[1rem] ">
        <img src={UserImg} alt="user" className="w-[11rem] h-[10rem]" />
        <div className="flex flex-col gap-8 w-[90%] ">
          <div className="flex gap-8 text-2xl font-medium">
            <BsFillKeyFill className="text-yellow-700 text-4xl" />:
            <div className="overflow-hidden text-ellipsis">{userInfor.account || "Undefined"}</div>
          </div>

          <div className="flex gap-8 text-2xl font-medium">
            <FaEthereum className="text-yellow-700 text-4xl" />:<div>{userInfor.ethRemaining || "0"}</div>
          </div>

          <div className="flex gap-8 text-2xl font-medium">
            <SlEnergy className="text-yellow-700 text-4xl" />:
            <div>
              {!userInfor.energyRemaining ? (
                <span className="text-red-700 font-semibold text-3xl">Out of energy!!!</span>
              ) : (
                <span className="text-red-700 font-semibold text-3xl">{userInfor.energyRemaining}</span>
              )}
            </div>
          </div>
        </div>
        <div className="pb-[2rem] w-[100%] p-[2rem]">
          <div className="w-[100%] flex flex-col gap-8">
            <div className="flex gap-2 text-3xl text-color-blue font-semibold items-center">
              <IoMdAddCircle />
              <h1>Add Product:</h1>
            </div>
            <Box
              component="form"
              sx={{
                "& .MuiTextField-root": { width: "25ch" },
              }}
              noValidate
              autoComplete="off"
            >
              <div className="flex flex-col gap-8">
                <TextField
                  onChange={(e) => setInputInfor({ ...inputInfor, name: e.target.value })}
                  id="outlined-textarea"
                  label="Product Name"
                  placeholder="Product Name"
                  multiline
                  size="small"
                  style={{ width: "100%" }}
                  InputLabelProps={{ style: { fontSize: 13, paddingTop: 2 } }}
                  inputProps={{ style: { fontSize: 14, height: 23 } }}
                />

                <TextField
                  onChange={(e) => setInputInfor({ ...inputInfor, price: e.target.value })}
                  id="outlined-textarea"
                  label="Product Price"
                  placeholder="Product Price"
                  multiline
                  size="small"
                  style={{ width: "100%" }}
                  InputLabelProps={{ style: { fontSize: 13, paddingTop: 2 } }}
                  inputProps={{ style: { fontSize: 14, height: 23 } }}
                />
                <Button
                  variant="contained"
                  style={{ fontSize: 14, height: 35, paddingTop: "5px" }}
                  onClick={() => {
                    const name = inputInfor.name;
                    const price = window.web3.utils.toWei(inputInfor.price.toString(), "Ether");
                    createProduct(name, price);
                  }}
                >
                  Add Product
                </Button>
              </div>
            </Box>
          </div>
          <div className="w-[100%] flex justify-start mt-[2rem]">
            <div className="flex items-center gap-4 text-3xl text-color-blue font-semibold">
              <SlNote /> Note:
            </div>
          </div>
          <div className="flex w-[100%] justify-center mt-4 text-yellow-700 font-semibold text-3xl">
            <div className="flex gap-4">
              <div className="flex gap-2">
                1<FaEthereum />
              </div>
              <div>=</div>
              <div className="flex gap-2">
                50 <SlEnergy />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserInfor;
