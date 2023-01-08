import React, { Component } from "react";

class Navbar extends Component {
  render() {
    return (
      <div className="w-[100%] flex justify-center pt-[2rem]">
        <div className="typed-animation">
          <h1 className="typed-out bg-text-color sm:text-5xl text-3xl uppercase">Energy trading platform</h1>
        </div>
      </div>
    );
  }
}

export default Navbar;
