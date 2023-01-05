//@ts-check

import { useMoralis } from "react-moralis";
import React, { useEffect } from "react";

export default function Headers() {
  let {
    enableWeb3,
    account,
    isWeb3Enabled,
    Moralis,
    deactivateWeb3,
    isWeb3EnableLoading,
  } = useMoralis();

  useEffect(() => {
    if (!isWeb3Enabled && window.localStorage.getItem("connected")) {
      enableWeb3();
    }
  }, []);

  useEffect(() => {
    Moralis.onAccountChanged((account) => {
      console.log("Account changed to", account);
      if (!account) {
        window.localStorage.removeItem("connected");
        deactivateWeb3();
      }
    });
  }, []);

  useEffect(() => {
    if (isWeb3Enabled) {
      window.localStorage.setItem("connected", "metamask");
    }
  }, [isWeb3Enabled]);

  return (
    <div>
      {account ? (
        <div>
          Connected to {account.slice(0, 5)}...
          {account.slice(account.length - 3)}
        </div>
      ) : (
        <button
          onClick={async () => {
            await enableWeb3();
          }}
          disabled={isWeb3EnableLoading}
        >
          Connect
        </button>
      )}
    </div>
  );
}
