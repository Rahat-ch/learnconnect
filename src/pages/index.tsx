import Head from 'next/head'
import {
  ParticleAuthModule,
  ParticleProvider,
  BiconomyAccountModule,
} from "@biconomy/particle-auth";
import styles from '@/styles/Home.module.css'
import { useState } from 'react';
import { IBundler, Bundler } from '@biconomy/bundler'
import { BiconomySmartAccount, BiconomySmartAccountConfig, DEFAULT_ENTRYPOINT_ADDRESS } from "@biconomy/account"
import { Wallet, providers, ethers  } from 'ethers'
import { ChainId } from "@biconomy/core-types"
import { 
  IPaymaster, 
  BiconomyPaymaster,  
  IHybridPaymaster,
  PaymasterMode,
  SponsorUserOperationDto, 
} from '@biconomy/paymaster'
import Minter from '@/components/minter';


export default function Home() {
  const [address, setAddress] = useState("")
  const [loading, setLoading] = useState(false);
  const [smartAccount, setSmartAccount] = useState({});
  const [provider, setProvider] = useState<any>(null)

  const particle = new ParticleAuthModule.ParticleNetwork({
    projectId: "bb8d58f8-0d3c-4306-a5f1-6cc7aa73b012",
    clientKey: "c9rwyb2a3pQhHapL1EphoNKYnFsVQkAEHgWP5TRm",
    appId: "bd23aa64-ef27-4054-a823-25aa32d903a4",
    wallet: {
      displayWalletEntry: true,
      defaultWalletEntryPosition: ParticleAuthModule.WalletEntryPosition.BR,
    },
  });

  const bundler: IBundler = new Bundler({
    bundlerUrl: 'https://paymaster.biconomy.io/api/v1/8453/rUpglMMDA.affd19a9-9f16-432c-bd64-a1d5407a865e',    
    chainId: ChainId.BASE_MAINNET,
    entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS,
  })
  
  const paymaster: IPaymaster = new BiconomyPaymaster({
    paymasterUrl: 'https://paymaster.biconomy.io/api/v1/8453/rUpglMMDA.affd19a9-9f16-432c-bd64-a1d5407a865e' 
  })
  

  const connect = async () => {
    try {
      setLoading(true)
      const userInfo = await particle.auth.login();
      console.log("Logged in user:", userInfo);
      const particleProvider = new ParticleProvider(particle.auth);
      console.log({particleProvider})
      const web3Provider = new ethers.providers.Web3Provider(
        particleProvider,
        "any"
      );
      setProvider(web3Provider)
      const biconomySmartAccountConfig: BiconomySmartAccountConfig = {
        signer: web3Provider.getSigner(),
        chainId: ChainId.BASE_MAINNET,
        bundler: bundler,
        paymaster: paymaster
      }
      let biconomySmartAccount = new BiconomySmartAccount(biconomySmartAccountConfig)
      biconomySmartAccount =  await biconomySmartAccount.init()
      setAddress( await biconomySmartAccount.getSmartAccountAddress())
      setSmartAccount(biconomySmartAccount)
      setLoading(false)
    } catch (error) {
      console.error(error);
    }
  };
  console.log({ address, smartAccount })
  return (
    <>
      <Head>
        <title>Learn Connect</title>
        <meta name="description" content="Share knowledge on this web3 enabled learning platform." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <h1>Learn Connect</h1>
        {!address && <button onClick={connect} className={styles.connect}>Connect</button>}
        {address && <Minter smartAccount={smartAccount} address={address} provider={provider} />}
        {loading && <p>Loading smart Account...</p>}
      </main>
    </>
  )
}
