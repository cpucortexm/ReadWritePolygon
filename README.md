# A full stack dApp Read Write Smart Contract on Polygon (Encode Hackathon)

## Prerequisites

- [Node.js](https://nodejs.org/en/download/)
- [MetaMask wallet browser extension](https://metamask.io/download.html).

## Getting Started

### Clone This Repo

Use `git clone https://github.com/cpucortexm/` to get the files within this repository onto your local machine.

## Environment Setup

Rename `.env.example` to `.env`

Run `npm install`.

### Adding Polygon Test Account To MetaMask

Create a network for Polygon Mumbai testnet with a name (say `alchemyMumbai`) and RPC URL of Alchemy. Open your MetaMask browser extension and change the network to `alchemyMumbai`.

Then, view the account details of your test account. Click `Export Private Key`. After entering your password, you'll be given a private key. Copy and paste your private key as the value of `POLYGON_TEST2_PRIVATE_KEY` in `.env`.

**Warning:** Never expose the private key of an account with real assets inside. Always add private keys as environment variables. Never commit private keys to code.

### Alchemy

[Alchemy](https://dashboard.alchemyapi.io/) is a service that allows developers to connect to Polygon/Ethereum infrastructure through their API.

Sign up for an account if you don't have one already, then create a new App with network as `Polygon Mumbai`.Copy and paste the URL starting with `https` and set it as the `POLYGON_ALCHEMY_API_URL` value in your `.env` file.

### Deploying Your Smart Contract To Polygon Mumbai

In your terminal enter, `npx hardhat run scripts/deploy.js --network polygon_mumbai`.

If you're successful, you'll get a confirmation message as follows:

```
ReadWrite deployed to: < deployed address >
```

You can use the already deployed contract at :0x731407D8B0Be8Ad603e3F15997013986eC034Bb4

### Connecting The Front-End

In `.env` set the `NEXT_PUBLIC_POLYGON_READWRITE_ADDRESS` environment variable to the address your smart contract was deployed to. For example, `0x731407D8B0Be8Ad603e3F15997013986eC034Bb4`.

## To start the demo

```
   npm run dev
```

OR use the app already hosted on vercel at
