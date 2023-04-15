import { Web3Button } from "@web3modal/react";
import { useEffect, useRef } from "react";
import { Gradient } from "./Gradient.js";
import { useAccount } from "wagmi";
import { App } from "../components/app";
const gradient = new Gradient() as any;

export default function Home() {
  const ref = useRef(null);
  const { isConnected } = useAccount();

  useEffect(() => {
    if (ref.current) {
      gradient.initGradient("#gradient-canvas");
    }
  }, [ref]);

  return (
    <div>
      <canvas id="gradient-canvas" data-transition-in></canvas>
      <div ref={ref} id="app" className="App">
        {!isConnected && <Web3Button />}
        {isConnected && <App />}
      </div>
    </div>
  );
}
