import { ConnectButton } from "web3uikit";

export default function Header() {
  return (
    <div className="header-body">
      <div className="title">Decentralized Todo App</div>
      <div className="connect-button">
        <ConnectButton moralisAuth={false} />
      </div>
    </div>
  );
}
